import { access } from "node:fs/promises";
import { delimiter, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BASE_URL = (process.env.MOBILE_AUDIT_BASE_URL ?? "http://127.0.0.1:3010").replace(/\/$/, "");
const NAVIGATION_TIMEOUT_MS = readInteger("MOBILE_AUDIT_TIMEOUT_MS", 15_000, 5_000, 60_000);
const CONCURRENCY = readInteger("MOBILE_AUDIT_CONCURRENCY", 2, 1, 4);
const MAX_REPORTED_GROUPS = 30;
const GEOMETRY_TOLERANCE_PX = 2;
const MIN_TOUCH_TARGET_PX = 44;

const ROUTE_FILTER = process.env.MOBILE_AUDIT_ROUTE;
const ROUTES = Object.freeze([
  { path: "/", marker: "engineer, researcher", minimumText: 80 },
  { path: "/about", marker: "My roots lie", minimumText: 500 },
  { path: "/work", marker: "R0 Systems", minimumText: 350 },
  { path: "/research", marker: "MTEB-Gym", minimumText: 500 },
  { path: "/investing", marker: "20-point rule", minimumText: 300 },
  { path: "/blog", marker: "Nespresso", minimumText: 180 },
  { path: "/blog/nespresso-jailbreak", marker: "It is never just coffee", minimumText: 1_500 },
  { path: "/blog/wifi-cantenna", marker: "Status of university infrastructure", minimumText: 1_500 },
  { path: "/cv", marker: "R0 Systems", minimumText: 350 },
].filter((route) => !ROUTE_FILTER || route.path === ROUTE_FILTER));

const IOS_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 15; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36";

const PHONE_PROFILES = Object.freeze([
  phoneProfile("iPhone SE", "portrait", 375, 667, 2, IOS_USER_AGENT),
  phoneProfile("iPhone SE", "landscape", 667, 375, 2, IOS_USER_AGENT),
  phoneProfile("iPhone 15", "portrait", 393, 852, 3, IOS_USER_AGENT),
  phoneProfile("iPhone 15", "landscape", 852, 393, 3, IOS_USER_AGENT),
  phoneProfile("iPhone 15 Pro Max", "portrait", 430, 932, 3, IOS_USER_AGENT),
  phoneProfile("iPhone 15 Pro Max", "landscape", 932, 430, 3, IOS_USER_AGENT),
  phoneProfile("Pixel 7", "portrait", 412, 915, 2.625, ANDROID_USER_AGENT),
  phoneProfile("Pixel 7", "landscape", 915, 412, 2.625, ANDROID_USER_AGENT),
  phoneProfile("Galaxy S23", "portrait", 360, 780, 3, ANDROID_USER_AGENT),
  phoneProfile("Galaxy S23", "landscape", 780, 360, 3, ANDROID_USER_AGENT),
]);

const failures = [];
const skips = [];
const notes = [];
const stats = {
  browsers: 0,
  fullRouteAudits: 0,
  hydrationAudits: 0,
  menuAudits: 0,
  noJavaScriptAudits: 0,
  reducedMotionAudits: 0,
};

function readInteger(name, fallback, minimum, maximum) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

function phoneProfile(device, orientation, width, height, deviceScaleFactor, userAgent) {
  return Object.freeze({
    id: `${device.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${orientation}`,
    label: `${device} ${orientation} ${width}x${height}`,
    viewport: { width, height },
    deviceScaleFactor,
    userAgent,
  });
}

function cleanMessage(value, maximumLength = 260) {
  const compact = String(value ?? "")
    .replaceAll(BASE_URL, "")
    .replaceAll(/\s+/g, " ")
    .trim();
  return compact.length > maximumLength ? `${compact.slice(0, maximumLength - 1)}…` : compact;
}

function fail(context, check, message) {
  failures.push({
    browser: context.browser ?? "setup",
    profile: context.profile ?? "global",
    route: context.route ?? "-",
    check,
    message: cleanMessage(message),
  });
}

function isMissingBrowserError(error) {
  return /executable doesn['’]t exist|browserType\.launch: Executable|please run .*playwright install|could not find browser|ENOENT/i.test(
    String(error?.message ?? error),
  );
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function loadPlaywright() {
  for (const specifier of ["playwright", "@playwright/test", "playwright-core"]) {
    try {
      const module = await import(specifier);
      if (module.chromium && module.webkit) return module;
    } catch {
      // The runner also supports packages exposed by `npm exec` through PATH.
    }
  }

  const candidates = [];
  const override = process.env.PLAYWRIGHT_MODULE_PATH;
  if (override) {
    candidates.push(override);
    candidates.push(resolve(override, "index.mjs"));
  }

  for (const pathEntry of (process.env.PATH ?? "").split(delimiter).filter(Boolean)) {
    candidates.push(resolve(pathEntry, "..", "playwright", "index.mjs"));
    candidates.push(resolve(pathEntry, "..", "@playwright", "test", "index.mjs"));
    candidates.push(resolve(pathEntry, "..", "playwright-core", "index.mjs"));
    candidates.push(resolve(pathEntry, "node_modules", "playwright", "index.mjs"));
    candidates.push(resolve(pathEntry, "node_modules", "@playwright", "test", "index.mjs"));
    candidates.push(resolve(pathEntry, "node_modules", "playwright-core", "index.mjs"));
  }

  for (const candidate of [...new Set(candidates)]) {
    if (!(await fileExists(candidate))) continue;
    try {
      const module = await import(pathToFileURL(candidate).href);
      if (module.chromium && module.webkit) return module;
    } catch {
      // Keep looking so a stale npm cache entry cannot block a usable package.
    }
  }

  throw new Error(
    "Playwright was not found. Run with `npx --yes --package=playwright node scripts/mobile-regression.mjs`, or set PLAYWRIGHT_MODULE_PATH to its package directory.",
  );
}

async function preflight() {
  try {
    const response = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(5_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(`The preview server is unavailable at ${BASE_URL} (${cleanMessage(error.message)}). Start it with \`npm start\`.`);
  }
}

async function launchEngine(name, browserType) {
  try {
    return { browser: await browserType.launch({ headless: true }), launchMode: "bundled" };
  } catch (error) {
    if (name === "chromium" && isMissingBrowserError(error)) {
      for (const channel of ["chrome", "msedge"]) {
        try {
          return { browser: await browserType.launch({ channel, headless: true }), launchMode: `${channel} channel` };
        } catch {
          // Try the next installed Chromium channel.
        }
      }
    }

    if (isMissingBrowserError(error)) {
      skips.push(`${name}: browser binary is not installed`);
      return null;
    }

    fail({ browser: name }, "launch", error.message);
    return null;
  }
}

function contextOptions(profile, overrides = {}) {
  return {
    viewport: profile.viewport,
    screen: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor,
    hasTouch: true,
    isMobile: true,
    locale: "en-US",
    colorScheme: "light",
    serviceWorkers: "block",
    userAgent: profile.userAgent,
    ...overrides,
  };
}

async function prepareContext(context) {
  await context.addInitScript(() => {
    window.sessionStorage.setItem("tejas-intro-seen", "1");
    window.sessionStorage.setItem("tejas-music-enabled", "off");
    window.sessionStorage.removeItem("tejas-music-unlocked");
  });
}

function observePage(page) {
  const events = {
    consoleErrors: [],
    pageErrors: [],
    resourceErrors: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") events.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => events.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    if (!["document", "stylesheet", "script", "image"].includes(request.resourceType())) return;
    const reason = request.failure()?.errorText ?? "request failed";
    if (/ERR_ABORTED|cancelled/i.test(reason)) return;
    events.resourceErrors.push(`${request.resourceType()} ${request.url()}: ${reason}`);
  });
  page.on("response", (response) => {
    const type = response.request().resourceType();
    if (["document", "stylesheet", "script", "image"].includes(type) && response.status() >= 400) {
      events.resourceErrors.push(`${type} ${response.url()}: HTTP ${response.status()}`);
    }
  });

  return events;
}

async function waitForReadablePage(page, route) {
  await page.waitForFunction(
    ({ marker, minimumText }) => {
      const text = document.body?.innerText?.replace(/\s+/g, " ").trim() ?? "";
      return text.length >= minimumText && text.toLowerCase().includes(marker.toLowerCase());
    },
    route,
    { timeout: NAVIGATION_TIMEOUT_MS },
  );
  await page.evaluate(() =>
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolveFonts) => window.setTimeout(resolveFonts, 1_000)),
    ]),
  );
}

async function settleImages(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const image of images) image.loading = "eager";

    await Promise.race([
      Promise.allSettled(
        images.map(async (image) => {
          if (image.complete) return;
          await new Promise((resolveImage) => {
            image.addEventListener("load", resolveImage, { once: true });
            image.addEventListener("error", resolveImage, { once: true });
          });
        }),
      ),
      new Promise((resolveTimeout) => window.setTimeout(resolveTimeout, 3_000)),
    ]);

    window.scrollTo(0, 0);
    await new Promise((resolveFrame) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolveFrame)));
  });
}

async function inspectPage(page) {
  return page.evaluate(
    ({ geometryTolerance, minimumTouchTarget }) => {
      const viewportWidth = document.documentElement.clientWidth;
      const maximumScrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
      const geometryOffenders = [];
      const clippedOffenders = [];
      const touchTargetOffenders = [];
      const brokenImages = [];

      const selector = [
        "main",
        "header",
        "nav",
        "section",
        "article",
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "li",
        "dt",
        "dd",
        "button",
        "a",
        "img",
        "video",
        "iframe",
        "input",
        "select",
        "textarea",
        "[role='button']",
      ].join(",");

      function label(element) {
        if (element.id) return `${element.tagName.toLowerCase()}#${element.id}`;
        const classes = [...element.classList].slice(0, 2).join(".");
        const text = element.textContent?.replace(/\s+/g, " ").trim().slice(0, 34);
        return `${element.tagName.toLowerCase()}${classes ? `.${classes}` : ""}${text ? ` (${text})` : ""}`;
      }

      function isVisible(element) {
        if (element.closest("[hidden], [inert], [aria-hidden='true']")) return false;
        if (element.closest(".sr-only")) return false;

        let ancestor = element;
        while (ancestor instanceof Element) {
          const style = getComputedStyle(ancestor);
          if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false;
          if (Number.parseFloat(style.opacity) <= 0.01) return false;
          ancestor = ancestor.parentElement;
        }

        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }

      for (const element of document.querySelectorAll(selector)) {
        if (!isVisible(element)) continue;
        const rect = element.getBoundingClientRect();

        if (
          rect.left < -geometryTolerance ||
          rect.right > viewportWidth + geometryTolerance ||
          rect.width > viewportWidth + geometryTolerance
        ) {
          geometryOffenders.push(
            `${label(element)} [left=${rect.left.toFixed(1)}, right=${rect.right.toFixed(1)}, width=${rect.width.toFixed(1)}]`,
          );
        }

        const style = getComputedStyle(element);
        const clipsHorizontally = style.overflowX === "hidden" || style.overflowX === "clip";
        const hasReadableText = Boolean(element.textContent?.trim());
        if (
          clipsHorizontally &&
          hasReadableText &&
          element.clientWidth > 0 &&
          element.scrollWidth > element.clientWidth + geometryTolerance
        ) {
          clippedOffenders.push(`${label(element)} [client=${element.clientWidth}, scroll=${element.scrollWidth}]`);
        }
      }

      for (const image of document.images) {
        if (!image.currentSrc && !image.src) continue;
        if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
          brokenImages.push(`${label(image)} -> ${image.currentSrc || image.src}`);
        }
      }

      const controls = new Set(
        document.querySelectorAll(
          "button:not([disabled]), input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), [role='button']:not([aria-disabled='true'])",
        ),
      );

      for (const anchor of document.querySelectorAll("a[href]")) {
        const style = getComputedStyle(anchor);
        const isStandalone =
          anchor.hasAttribute("aria-label") ||
          anchor.closest("nav, .hero-socials") ||
          ["block", "flex", "grid", "inline-block", "inline-flex", "inline-grid"].includes(style.display) ||
          (!anchor.textContent?.trim() && anchor.querySelector("svg, img"));
        if (isStandalone) controls.add(anchor);
      }

      for (const control of controls) {
        if (!isVisible(control)) continue;
        if (control.matches(".skip-link") && document.activeElement !== control) continue;
        const rect = control.getBoundingClientRect();
        if (rect.width + 0.5 < minimumTouchTarget || rect.height + 0.5 < minimumTouchTarget) {
          touchTargetOffenders.push(`${label(control)} [${rect.width.toFixed(1)}x${rect.height.toFixed(1)}]`);
        }
      }

      const main = document.querySelector("main");
      const mainRect = main?.getBoundingClientRect();

      return {
        horizontalOverflow: Math.max(0, maximumScrollWidth - viewportWidth),
        geometryCount: geometryOffenders.length,
        geometryOffenders: geometryOffenders.slice(0, 8),
        clippedCount: clippedOffenders.length,
        clippedOffenders: clippedOffenders.slice(0, 8),
        touchTargetCount: touchTargetOffenders.length,
        touchTargetOffenders: touchTargetOffenders.slice(0, 8),
        brokenImageCount: brokenImages.length,
        brokenImages: brokenImages.slice(0, 8),
        mainHasGeometry: Boolean(mainRect && mainRect.width > 0 && mainRect.height > 0),
      };
    },
    { geometryTolerance: GEOMETRY_TOLERANCE_PX, minimumTouchTarget: MIN_TOUCH_TARGET_PX },
  );
}

async function auditMenu(page, context) {
  const button = page.locator("#menuButton");
  if (!(await button.isVisible().catch(() => false))) {
    fail(context, "menu", "mobile menu button is not visible");
    return;
  }

  try {
    await button.click({ timeout: 5_000 });
    await page.waitForFunction(
      () =>
        document.body.classList.contains("nav-open") &&
        document.querySelector("#menuButton")?.getAttribute("aria-expanded") === "true" &&
        document.querySelector("#mobileNav")?.getAttribute("aria-hidden") === "false",
      null,
      { timeout: 3_000 },
    );
    await page.waitForTimeout(180);

    const openState = await page.evaluate((minimumTouchTarget) => {
      const links = [...document.querySelectorAll("#mobileNav a[href]")];
      const failures = [];
      for (const link of links) {
        const rect = link.getBoundingClientRect();
        const style = getComputedStyle(link);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          rect.width <= 0 ||
          rect.height <= 0 ||
          rect.left < -1 ||
          rect.right > document.documentElement.clientWidth + 1
        ) {
          failures.push(`${link.textContent.trim()}: outside the visible menu`);
        } else if (rect.width + 0.5 < minimumTouchTarget || rect.height + 0.5 < minimumTouchTarget) {
          failures.push(`${link.textContent.trim()}: ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}`);
        }
      }
      return {
        linkCount: links.length,
        failures,
        mainIsInert: document.querySelector("main")?.hasAttribute("inert") ?? false,
      };
    }, MIN_TOUCH_TARGET_PX);

    if (openState.linkCount < 5) fail(context, "menu", `expected at least 5 navigation links, found ${openState.linkCount}`);
    if (!openState.mainIsInert) fail(context, "menu", "main content is not inert while the menu is open");
    if (openState.failures.length) fail(context, "menu geometry", openState.failures.join("; "));

    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () =>
        !document.body.classList.contains("nav-open") &&
        document.querySelector("#menuButton")?.getAttribute("aria-expanded") === "false" &&
        document.activeElement === document.querySelector("#menuButton"),
      null,
      { timeout: 3_000 },
    );
    stats.menuAudits += 1;
  } catch (error) {
    fail(context, "menu", error.message);
  }
}

function reportObservedErrors(context, events) {
  for (const message of [...new Set(events.consoleErrors)]) fail(context, "console", message);
  for (const message of [...new Set(events.pageErrors)]) fail(context, "page error", message);
  for (const message of [...new Set(events.resourceErrors)]) fail(context, "resource", message);
}

async function auditRoute(context, browserName, profile, route) {
  const page = await context.newPage();
  const label = { browser: browserName, profile: profile.label, route: route.path };
  const observed = observePage(page);
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);

  try {
    const response = await page.goto(`${BASE_URL}${route.path}`, {
      waitUntil: "domcontentloaded",
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    if (!response || response.status() !== 200) {
      fail(label, "navigation", `expected HTTP 200, received ${response?.status() ?? "no response"}`);
      return;
    }

    await waitForReadablePage(page, route);
    await settleImages(page);
    const inspection = await inspectPage(page);

    if (inspection.horizontalOverflow > GEOMETRY_TOLERANCE_PX) {
      fail(label, "horizontal overflow", `${inspection.horizontalOverflow}px beyond the viewport`);
    }
    if (!inspection.mainHasGeometry) fail(label, "element geometry", "main content has no rendered box");
    if (inspection.geometryCount) {
      fail(
        label,
        "element geometry",
        `${inspection.geometryCount} element(s) cross the viewport: ${inspection.geometryOffenders.join("; ")}`,
      );
    }
    if (inspection.clippedCount) {
      fail(label, "text clipping", `${inspection.clippedCount} clipped element(s): ${inspection.clippedOffenders.join("; ")}`);
    }
    if (inspection.touchTargetCount) {
      fail(
        label,
        "touch targets",
        `${inspection.touchTargetCount} standalone control(s) below 44px: ${inspection.touchTargetOffenders.join("; ")}`,
      );
    }
    if (inspection.brokenImageCount) {
      fail(label, "images", `${inspection.brokenImageCount} image(s) failed: ${inspection.brokenImages.join("; ")}`);
    }

    if (route.path === "/") await auditMenu(page, label);
    stats.fullRouteAudits += 1;
  } catch (error) {
    fail(label, "route audit", error.message);
  } finally {
    await page.waitForTimeout(50).catch(() => {});
    reportObservedErrors(label, observed);
    await page.close();
  }
}

async function runProfile(browser, browserName, profile) {
  const context = await browser.newContext(contextOptions(profile));
  await prepareContext(context);
  try {
    for (const route of ROUTES) await auditRoute(context, browserName, profile, route);
  } finally {
    await context.close();
  }
}

async function auditReducedMotion(browser, browserName) {
  const profile = PHONE_PROFILES.find((item) => item.id === "iphone-15-portrait");
  const context = await browser.newContext(contextOptions(profile, { reducedMotion: "reduce" }));
  await prepareContext(context);

  try {
    for (const route of ROUTES) {
      const page = await context.newPage();
      const label = { browser: browserName, profile: "iPhone 15 reduced motion", route: route.path };
      const observed = observePage(page);
      try {
        const response = await page.goto(`${BASE_URL}${route.path}`, {
          waitUntil: "domcontentloaded",
          timeout: NAVIGATION_TIMEOUT_MS,
        });
        if (!response || response.status() !== 200) {
          fail(label, "reduced motion", `expected HTTP 200, received ${response?.status() ?? "no response"}`);
          continue;
        }
        await waitForReadablePage(page, route);
        await page.waitForTimeout(120);

        const motion = await page.evaluate(() => {
          const running = document
            .getAnimations({ subtree: true })
            .filter((animation) => {
              const timing = animation.effect?.getComputedTiming();
              return (
                animation.playState === "running" &&
                (timing?.iterations === Infinity || Number(timing?.duration ?? 0) > 100)
              );
            })
            .map((animation) => {
              const target = animation.effect?.target;
              return target?.id || target?.className || target?.tagName || "anonymous animation";
            });
          const playingVideos = [...document.querySelectorAll("video")]
            .filter((video) => !video.paused && !video.ended)
            .map((video) => video.id || video.className || "video");
          return {
            mediaMatches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            running,
            playingVideos,
          };
        });

        if (!motion.mediaMatches) fail(label, "reduced motion", "media query does not match");
        if (motion.running.length) fail(label, "reduced motion", `long-running animation(s): ${motion.running.join(", ")}`);
        if (motion.playingVideos.length) fail(label, "reduced motion", `autoplaying video(s): ${motion.playingVideos.join(", ")}`);
        stats.reducedMotionAudits += 1;
      } catch (error) {
        fail(label, "reduced motion", error.message);
      } finally {
        reportObservedErrors(label, observed);
        await page.close();
      }
    }
  } finally {
    await context.close();
  }
}

async function auditSectionHydration(browser, browserName) {
  const profile = PHONE_PROFILES.find((item) => item.id === "iphone-15-portrait");
  const context = await browser.newContext(contextOptions(profile));
  const page = await context.newPage();
  const label = { browser: browserName, profile: "delayed section render", route: "/work" };

  await context.route("**/section.js*", async (route) => {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 600));
    await route.continue();
  });

  try {
    const navigation = page.goto(`${BASE_URL}/work`, {
      waitUntil: "domcontentloaded",
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.waitForSelector(".page-intro h1", { state: "attached", timeout: NAVIGATION_TIMEOUT_MS });
    const pending = await page.locator(".page-intro h1").evaluate((heading) => ({
      hasPixelHeading: heading.classList.contains("is-pixel-heading"),
      pending: document.documentElement.classList.contains("section-render-pending"),
      visibility: getComputedStyle(heading).visibility,
    }));

    if (!pending.pending) fail(label, "section hydration", "pending state cleared before the section renderer loaded");
    if (pending.hasPixelHeading) fail(label, "section hydration", "pixel heading rendered before the delayed module loaded");
    if (pending.visibility !== "hidden") {
      fail(label, "section hydration", `plain heading visibility was ${pending.visibility} during hydration`);
    }

    const response = await navigation;
    if (!response || response.status() !== 200) {
      fail(label, "section hydration", `expected HTTP 200, received ${response?.status() ?? "no response"}`);
      return;
    }

    await page.waitForFunction(
      () =>
        document.querySelector(".page-intro h1")?.classList.contains("is-pixel-heading") &&
        !document.documentElement.classList.contains("section-render-pending"),
      null,
      { timeout: NAVIGATION_TIMEOUT_MS },
    );

    const rendered = await page.locator(".page-intro h1").evaluate((heading) => ({
      pixelCount: heading.querySelectorAll(".page-heading-pixel").length,
      visibility: getComputedStyle(heading).visibility,
    }));
    if (rendered.visibility !== "visible") {
      fail(label, "section hydration", `pixel heading visibility was ${rendered.visibility} after rendering`);
    }
    if (!rendered.pixelCount) fail(label, "section hydration", "rendered heading contains no pixel art");
    stats.hydrationAudits += 1;
  } catch (error) {
    fail(label, "section hydration", error.message);
  } finally {
    await context.close();
  }
}

async function auditWithoutJavaScript(browser, browserName) {
  const profile = PHONE_PROFILES.find((item) => item.id === "iphone-15-portrait");
  const context = await browser.newContext(contextOptions(profile, { javaScriptEnabled: false, reducedMotion: "reduce" }));

  try {
    for (const route of ROUTES) {
      const page = await context.newPage();
      const label = { browser: browserName, profile: "iPhone 15 no JavaScript", route: route.path };
      try {
        const response = await page.goto(`${BASE_URL}${route.path}`, {
          waitUntil: "domcontentloaded",
          timeout: NAVIGATION_TIMEOUT_MS,
        });
        if (!response || response.status() !== 200) {
          fail(label, "no-JS", `expected HTTP 200, received ${response?.status() ?? "no response"}`);
          continue;
        }

        const result = await page.evaluate(
          ({ marker, minimumText, tolerance }) => {
            const main = document.querySelector("main");
            const text = main?.innerText?.replace(/\s+/g, " ").trim() ?? "";
            const rect = main?.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
            const style = main ? getComputedStyle(main) : null;
            return {
              textLength: text.length,
              hasMarker: text.toLowerCase().includes(marker.toLowerCase()),
              hasSerializedObject: text.includes("[object Object]"),
              mainVisible: Boolean(
                main &&
                  rect &&
                  rect.width > 0 &&
                  rect.height > 0 &&
                  style?.display !== "none" &&
                  style?.visibility !== "hidden",
              ),
              horizontalOverflow: Math.max(0, scrollWidth - viewportWidth),
              overflowOffenders: Array.from(document.querySelectorAll("body *"))
                .map((element) => {
                  const rect = element.getBoundingClientRect();
                  return {
                    tag: element.tagName.toLowerCase(),
                    className: typeof element.className === "string" ? element.className : "",
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                  };
                })
                .filter(({ left, right }) => left < -tolerance || right > viewportWidth + tolerance)
                .slice(0, 12),
              minimumText,
              tolerance,
            };
          },
          { marker: route.marker, minimumText: route.minimumText, tolerance: GEOMETRY_TOLERANCE_PX },
        );

        if (!result.mainVisible) fail(label, "no-JS", "main content is not visible");
        if (!result.hasMarker || result.textLength < result.minimumText) {
          fail(label, "no-JS readability", `expected visible content is missing (text length ${result.textLength})`);
        }
        if (result.hasSerializedObject) fail(label, "no-JS readability", "serialized [object Object] text is visible");
        if (result.horizontalOverflow > result.tolerance) {
          fail(
            label,
            "no-JS horizontal overflow",
            `${result.horizontalOverflow}px beyond the viewport; offenders: ${JSON.stringify(result.overflowOffenders)}`,
          );
        }
        stats.noJavaScriptAudits += 1;
      } catch (error) {
        fail(label, "no-JS", error.message);
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
  }
}

async function mapWithConcurrency(items, concurrency, worker) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

function printReport() {
  const scenarioCount =
    stats.fullRouteAudits + stats.hydrationAudits + stats.reducedMotionAudits + stats.noJavaScriptAudits;

  if (!failures.length) {
    console.log(
      `Mobile regression passed: ${stats.browsers} browser engine(s), ${stats.fullRouteAudits} full route/profile audits, ${stats.hydrationAudits} delayed-hydration audits, ${stats.menuAudits} menu audits, ${stats.reducedMotionAudits} reduced-motion audits, and ${stats.noJavaScriptAudits} no-JS audits at ${BASE_URL}.`,
    );
  } else {
    const grouped = new Map();
    const sortedFailures = [...failures].sort((left, right) =>
      [left.check, left.message, left.browser, left.profile, left.route]
        .join("|")
        .localeCompare([right.check, right.message, right.browser, right.profile, right.route].join("|")),
    );

    for (const failure of sortedFailures) {
      const key = `${failure.check}|${failure.message}`;
      const group = grouped.get(key) ?? { check: failure.check, message: failure.message, contexts: [] };
      group.contexts.push(`${failure.browser}/${failure.profile}${failure.route === "-" ? "" : failure.route}`);
      grouped.set(key, group);
    }

    const groups = [...grouped.values()];
    console.error(
      `Mobile regression failed: ${failures.length} failure(s) in ${groups.length} group(s) across ${scenarioCount} completed audits.`,
    );
    for (const [index, group] of groups.slice(0, MAX_REPORTED_GROUPS).entries()) {
      const shownContexts = group.contexts.slice(0, 4).join(", ");
      const remaining = group.contexts.length - 4;
      console.error(
        `${index + 1}. ${group.check}: ${group.message} [${shownContexts}${remaining > 0 ? `, +${remaining} more` : ""}]`,
      );
    }
    if (groups.length > MAX_REPORTED_GROUPS) {
      console.error(`… ${groups.length - MAX_REPORTED_GROUPS} additional failure group(s) omitted.`);
    }
  }

  for (const note of [...notes].sort()) console.log(`NOTE: ${note}`);
  for (const skip of [...skips].sort()) console.log(`SKIP: ${skip}`);
}

async function main() {
  await preflight();
  const playwright = await loadPlaywright();
  const engines = [];

  for (const [name, browserType] of [
    ["chromium", playwright.chromium],
    ["webkit", playwright.webkit],
  ]) {
    const launched = await launchEngine(name, browserType);
    if (!launched) continue;
    stats.browsers += 1;
    engines.push({ name, ...launched });
    notes.push(`${name} ${launched.browser.version()} via ${launched.launchMode}`);
  }

  if (!engines.length) {
    throw new Error(
      "No supported browser could launch. Install the deterministic browser builds with `npx --yes --package=playwright playwright install chromium webkit`.",
    );
  }

  for (const engine of engines) {
    try {
      await mapWithConcurrency(PHONE_PROFILES, CONCURRENCY, (profile) =>
        runProfile(engine.browser, engine.name, profile),
      );
      await auditSectionHydration(engine.browser, engine.name);
      await auditReducedMotion(engine.browser, engine.name);
      await auditWithoutJavaScript(engine.browser, engine.name);
    } finally {
      await engine.browser.close();
    }
  }

  printReport();
  process.exitCode = failures.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`Mobile regression could not run: ${cleanMessage(error.message, 500)}`);
  process.exitCode = 2;
});
