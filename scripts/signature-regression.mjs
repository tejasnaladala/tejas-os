import { access } from "node:fs/promises";
import { delimiter, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const BASE_URL = (process.env.SIGNATURE_AUDIT_BASE_URL ?? "http://127.0.0.1:3010").replace(/\/$/, "");
const NAVIGATION_TIMEOUT_MS = readInteger("SIGNATURE_AUDIT_TIMEOUT_MS", 12_000, 5_000, 60_000);
const BOOT_EXIT_TIMEOUT_MS = 6_500;
const IDENTITY_TIMEOUT_MS = 8_000;
const SIGNATURE_PATH = "/assets/signature/tejas-signature-transparent-hq.webp";
const HOMEPAGE_IDENTITY = "hi, i'm tejas. i'm an engineer, researcher, entrepreneur, and angel investor.";

const IOS_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ANDROID_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 15; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36";

const ENGINE_PROFILES = Object.freeze([
  {
    engine: "chromium",
    device: "Pixel 7",
    userAgent: ANDROID_USER_AGENT,
    deviceScaleFactor: 2.625,
    orientations: Object.freeze([
      { name: "portrait", viewport: { width: 412, height: 915 } },
      { name: "landscape", viewport: { width: 915, height: 412 } },
    ]),
  },
  {
    engine: "webkit",
    device: "iPhone 15",
    userAgent: IOS_USER_AGENT,
    deviceScaleFactor: 3,
    orientations: Object.freeze([
      { name: "portrait", viewport: { width: 393, height: 852 } },
      { name: "landscape", viewport: { width: 852, height: 393 } },
    ]),
  },
]);

const failures = [];
const notes = [];
const stats = {
  animatedLoads: 0,
  reducedMotionLoads: 0,
};

function readInteger(name, fallback, minimum, maximum) {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum ? parsed : fallback;
}

function cleanMessage(value, maximumLength = 420) {
  const compact = String(value ?? "")
    .replaceAll(BASE_URL, "")
    .replaceAll(/\s+/g, " ")
    .trim();
  return compact.length > maximumLength ? `${compact.slice(0, maximumLength - 1)}...` : compact;
}

function normalizeText(value) {
  return String(value ?? "").replaceAll(/\s+/g, " ").trim().toLowerCase();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
    "Playwright was not found. Run with `npx --yes --package=playwright node scripts/signature-regression.mjs`, or set PLAYWRIGHT_MODULE_PATH to its package directory.",
  );
}

async function preflight() {
  try {
    const response = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(5_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    throw new Error(
      `The preview server is unavailable at ${BASE_URL} (${cleanMessage(error.message)}). Start it with \`npm start\`.`,
    );
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
      throw new Error(
        `${name} could not launch because its deterministic browser binary is missing. Run \`npx --yes --package=playwright playwright install ${name}\`.`,
      );
    }
    throw error;
  }
}

function contextOptions(profile, orientation, overrides = {}) {
  return {
    viewport: orientation.viewport,
    screen: orientation.viewport,
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

async function instrumentContext(context) {
  await context.addInitScript(() => {
    window.__signatureRegression = {
      playCalls: 0,
      pauseCalls: 0,
      playStartedAt: [],
    };

    const nativePlay = HTMLMediaElement.prototype.play;
    const nativePause = HTMLMediaElement.prototype.pause;

    HTMLMediaElement.prototype.play = function signaturePlay(...args) {
      if (this.id === "signatureVideo") {
        window.__signatureRegression.playCalls += 1;
        window.__signatureRegression.playStartedAt.push(performance.now());
      }
      return nativePlay.apply(this, args);
    };

    HTMLMediaElement.prototype.pause = function signaturePause(...args) {
      if (this.id === "signatureVideo") window.__signatureRegression.pauseCalls += 1;
      return nativePause.apply(this, args);
    };
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
    const reason = request.failure()?.errorText ?? "request failed";
    if (/ERR_ABORTED|cancelled/i.test(reason)) return;
    events.resourceErrors.push(`${request.resourceType()} ${request.url()}: ${reason}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      events.resourceErrors.push(`${response.request().resourceType()} ${response.url()}: HTTP ${response.status()}`);
    }
  });

  return events;
}

function assertNoPageErrors(events) {
  const messages = [
    ...events.consoleErrors.map((message) => `console: ${message}`),
    ...events.pageErrors.map((message) => `page: ${message}`),
    ...events.resourceErrors.map((message) => `resource: ${message}`),
  ];
  assert(messages.length === 0, `page emitted error(s): ${messages.map(cleanMessage).join("; ")}`);
}

async function waitForSignatureFrame(page) {
  await page.waitForSelector("#signatureAnimation", { state: "attached", timeout: 2_000 });
  await page.waitForFunction(
    (signaturePath) => {
      const image = document.querySelector("#signatureAnimation");
      if (!(image instanceof HTMLImageElement)) return false;
      const sourcePath = new URL(image.currentSrc || image.src || "", location.href).pathname;
      return sourcePath === signaturePath && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    },
    SIGNATURE_PATH,
    { timeout: 4_000 },
  );
  await page.waitForFunction(
    () => {
      const boot = document.querySelector("#boot");
      const image = document.querySelector("#signatureAnimation");
      if (!boot || !(image instanceof HTMLImageElement)) return false;
      const bootStyle = getComputedStyle(boot);
      const imageStyle = getComputedStyle(image);
      return (
        bootStyle.display !== "none" &&
        bootStyle.visibility === "visible" &&
        Number.parseFloat(bootStyle.opacity) > 0.5 &&
        imageStyle.display !== "none" &&
        imageStyle.visibility === "visible" &&
        Number.parseFloat(imageStyle.opacity) > 0.5
      );
    },
    null,
    { timeout: 1_000 },
  );

  const geometry = await page.locator("#signatureAnimation").evaluate((image) => {
    const rect = image.getBoundingClientRect();
    return {
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
      viewport: { width: window.innerWidth, height: window.innerHeight },
    };
  });
  assert(geometry.rect.width > 0 && geometry.rect.height > 0, "signature animation has no rendered area");
  assert(
    geometry.rect.left >= -1 &&
      geometry.rect.top >= -1 &&
      geometry.rect.right <= geometry.viewport.width + 1 &&
      geometry.rect.bottom <= geometry.viewport.height + 1,
    `signature animation crosses the viewport: rect=${JSON.stringify(geometry.rect)}, viewport=${JSON.stringify(geometry.viewport)}`,
  );
}

async function waitForBootExit(page, navigationStartedAt) {
  await page.waitForFunction(
    () => {
      const site = document.querySelector(".site");
      const boot = document.querySelector("#boot");
      const siteStyle = site ? getComputedStyle(site) : null;
      const bootStyle = boot ? getComputedStyle(boot) : null;
      return (
        !document.body.classList.contains("is-booting") &&
        site?.classList.contains("is-ready") &&
        site.getAttribute("aria-hidden") === "false" &&
        siteStyle?.display !== "none" &&
        siteStyle?.visibility === "visible" &&
        Number.parseFloat(siteStyle?.opacity ?? "0") > 0.95 &&
        (!boot || bootStyle?.visibility === "hidden" || Number.parseFloat(bootStyle?.opacity ?? "1") < 0.02)
      );
    },
    null,
    { timeout: BOOT_EXIT_TIMEOUT_MS },
  );

  const elapsed = Date.now() - navigationStartedAt;
  assert(elapsed <= BOOT_EXIT_TIMEOUT_MS, `boot exited after ${elapsed}ms; bound is ${BOOT_EXIT_TIMEOUT_MS}ms`);
  await page.waitForSelector("#boot", { state: "detached", timeout: 1_000 });
}

async function assertFinalIdentity(page) {
  await page.waitForFunction(
    (expected) => {
      const element = document.querySelector(".hero-disciplines");
      const output = element?.querySelector(".typewriter-output > span");
      if (!element || !output || !element.classList.contains("is-typed")) return false;

      const style = getComputedStyle(element);
      const outputStyle = getComputedStyle(output);
      const rect = element.getBoundingClientRect();
      const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();

      return (
        normalize(output.textContent) === expected &&
        style.display !== "none" &&
        style.visibility === "visible" &&
        Number.parseFloat(style.opacity) > 0.95 &&
        outputStyle.display !== "none" &&
        outputStyle.visibility === "visible" &&
        Number.parseFloat(outputStyle.opacity) > 0.95 &&
        rect.width > 0 &&
        rect.height > 0
      );
    },
    normalizeText(HOMEPAGE_IDENTITY),
    { timeout: IDENTITY_TIMEOUT_MS },
  );

  const state = await page.evaluate(() => ({
    identity: document.querySelector(".typewriter-output > span")?.textContent ?? "",
    siteHidden: document.querySelector(".site")?.getAttribute("aria-hidden"),
    bodyBooting: document.body.classList.contains("is-booting"),
  }));
  assert(normalizeText(state.identity) === normalizeText(HOMEPAGE_IDENTITY), `homepage identity was "${state.identity}"`);
  assert(state.siteHidden === "false", "final site remained aria-hidden");
  assert(!state.bodyBooting, "body retained is-booting after the signature finished");
}

async function auditAnimatedLoad(page, phase) {
  const events = observePage(page);
  const navigationStartedAt = Date.now();
  const response =
    phase === "first load"
      ? await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT_MS })
      : await page.reload({ waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT_MS });

  assert(response?.status() === 200, `${phase} returned HTTP ${response?.status() ?? "no response"}`);
  await waitForSignatureFrame(page);

  const asset = await page.locator("#signatureAnimation").evaluate((image) => ({
    currentSrc: image.currentSrc,
    complete: image.complete,
    dimensions: [image.naturalWidth, image.naturalHeight],
  }));
  assert(new URL(asset.currentSrc).pathname === SIGNATURE_PATH, `${phase} used ${asset.currentSrc || "no signature asset"}`);
  assert(asset.complete, `${phase} signature image did not finish loading`);
  assert(asset.dimensions[0] > 0 && asset.dimensions[1] > 0, `${phase} signature image has no decoded dimensions`);

  await waitForBootExit(page, navigationStartedAt);
  await assertFinalIdentity(page);
  assertNoPageErrors(events);
  stats.animatedLoads += 1;
}

async function auditAnimatedProfile(browser, profile, orientation) {
  const context = await browser.newContext(contextOptions(profile, orientation));
  await instrumentContext(context);
  const page = await context.newPage();
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);

  try {
    await auditAnimatedLoad(page, "first load");
    await auditAnimatedLoad(page, "repeat reload");
  } finally {
    await context.close();
  }
}

async function auditReducedMotion(browser, profile, orientation) {
  const context = await browser.newContext(
    contextOptions(profile, orientation, { reducedMotion: "reduce" }),
  );
  await instrumentContext(context);
  const page = await context.newPage();
  page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);
  const events = observePage(page);
  const navigationStartedAt = Date.now();

  try {
    const response = await page.goto(`${BASE_URL}/`, {
      waitUntil: "domcontentloaded",
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    assert(response?.status() === 200, `reduced-motion load returned HTTP ${response?.status() ?? "no response"}`);

    await page.waitForFunction(
      (expected) => {
        const site = document.querySelector(".site");
        const output = document.querySelector(".typewriter-output > span");
        const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
        return (
          window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
          !document.body.classList.contains("is-booting") &&
          site?.classList.contains("is-ready") &&
          site.getAttribute("aria-hidden") === "false" &&
          normalize(output?.textContent) === expected
        );
      },
      normalizeText(HOMEPAGE_IDENTITY),
      { timeout: 1_000 },
    );
    await page.waitForSelector("#boot", { state: "detached", timeout: 1_000 });

    const state = await page.evaluate(() => ({
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      playCalls: window.__signatureRegression?.playCalls ?? -1,
      playingVideos: [...document.querySelectorAll("video")].filter((video) => !video.paused && !video.ended).length,
      bootPresent: Boolean(document.querySelector("#boot")),
    }));
    assert(state.reducedMotion, "prefers-reduced-motion did not match");
    assert(state.playCalls === 0, `signature play() was called ${state.playCalls} time(s) with reduced motion`);
    assert(state.playingVideos === 0, `${state.playingVideos} video(s) were playing with reduced motion`);
    assert(!state.bootPresent, "signature boot remained in the DOM with reduced motion");
    assert(
      Date.now() - navigationStartedAt <= BOOT_EXIT_TIMEOUT_MS,
      `reduced-motion boot exceeded ${BOOT_EXIT_TIMEOUT_MS}ms`,
    );
    assertNoPageErrors(events);
    stats.reducedMotionLoads += 1;
  } finally {
    await context.close();
  }
}

async function runProfile(browser, engineProfile, orientation) {
  const label = `${engineProfile.engine}/${engineProfile.device} ${orientation.name} ${orientation.viewport.width}x${orientation.viewport.height}`;
  try {
    await auditAnimatedProfile(browser, engineProfile, orientation);
    await auditReducedMotion(browser, engineProfile, orientation);
    notes.push(`${label}: passed`);
  } catch (error) {
    failures.push(`${label}: ${cleanMessage(error.message)}`);
  }
}

function printReport() {
  if (failures.length) {
    console.error(`Signature regression failed: ${failures.length} profile(s).`);
    for (const [index, failure] of failures.entries()) console.error(`${index + 1}. ${failure}`);
  } else {
    console.log(
      `Signature regression passed: ${stats.animatedLoads} animated loads (first load plus repeat reload) and ${stats.reducedMotionLoads} reduced-motion loads at ${BASE_URL}.`,
    );
  }
  for (const note of notes.sort()) console.log(`PASS: ${note}`);
}

async function main() {
  await preflight();
  const playwright = await loadPlaywright();

  for (const engineProfile of ENGINE_PROFILES) {
    const browserType = playwright[engineProfile.engine];
    const launched = await launchEngine(engineProfile.engine, browserType);
    notes.push(`${engineProfile.engine} ${launched.browser.version()} via ${launched.launchMode}`);

    try {
      for (const orientation of engineProfile.orientations) {
        await runProfile(launched.browser, engineProfile, orientation);
      }
    } finally {
      await launched.browser.close();
    }
  }

  printReport();
  process.exitCode = failures.length ? 1 : 0;
}

main().catch((error) => {
  console.error(`Signature regression could not run: ${cleanMessage(error.message, 600)}`);
  process.exitCode = 2;
});
