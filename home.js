const boot = document.querySelector("#boot");
const signatureAnimation = document.querySelector("#signatureAnimation");
const site = document.querySelector("#site");
const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const announcer = document.querySelector("#announcer");
const pageMain = document.querySelector("main");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileBreakpoint = window.matchMedia("(max-width: 700px)");

let bootFinished = false;
let bootFallback = 0;
let bootPlaybackEnd = 0;
let heroTypewriters = [];
let heroTypewriterStarted = false;

const nameGlyphs = Object.freeze({
  A: ["0001111000", "0011111100", "0110000110", "1100000011", "1100000011", "1100000011", "1111111111", "1111111111", "1100000011", "1100000011", "1100000011", "1100000011"],
  D: ["1111111000", "1111111100", "1100000110", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000110", "1111111100", "1111111000"],
  E: ["1111111111", "1111111111", "1100000000", "1100000000", "1100000000", "1111111100", "1111111100", "1100000000", "1100000000", "1100000000", "1111111111", "1111111111"],
  J: ["1111111111", "1111111111", "0000011000", "0000011000", "0000011000", "0000011000", "0000011000", "0000011000", "0000011000", "1100011000", "1100011000", "0111110000"],
  L: ["1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1111111111", "1111111111"],
  N: ["1100000011", "1110000011", "1110000011", "1101000011", "1101100011", "1100110011", "1100110011", "1100011011", "1100001111", "1100001111", "1100000111", "1100000011"],
  S: ["0111111111", "1111111111", "1100000000", "1100000000", "1111100000", "0111111100", "0000011110", "0000000011", "0000000011", "0000000011", "1111111111", "1111111110"],
  T: ["1111111111", "1111111111", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000"],
});

const nameGlyphAdvance = Object.freeze({ A: 11, D: 11, E: 11, J: 10, L: 10, N: 11, S: 11, T: 11 });
const nameMarkWidth = 101;
const nameMuralSeams = new Map([
  ["0:0:1:0", "tone-blue"],
  ["0:4:1:9", "tone-rose-dark"],
  ["1:0:6:0", "tone-green-dark"],
  ["1:2:10:6", "tone-gold"],
  ["1:4:10:3", "tone-blue"],
  ["1:4:10:6", "tone-blue"],
  ["1:7:0:5", "tone-green-dark"],
]);

const markDoodleTones = Object.freeze({
  b: "tone-blue",
  c: "tone-coral",
  g: "tone-green",
  h: "tone-blush",
  k: "tone-ink doodle-eye",
  l: "tone-green-light",
  p: "tone-pink",
  r: "tone-rose-dark",
  s: "tone-sky",
  v: "tone-green-dark",
  y: "tone-gold",
});

const nameMarkDoodles = Object.freeze([
  {
    attachments: [[4.32, 2.16, "b"]],
    className: "spark",
    delay: 120,
    pattern: ["...b...", "...s...", "..sbs..", "bbsgsbb", "..sbs..", "...s...", "...b..."],
    step: 0.72,
    x: 19.4,
    y: 0,
  },
  {
    attachments: [[-0.35, -1.75, "r"], [0.25, -1.15, "r"], [0.85, -0.55, "r"]],
    className: "brain",
    delay: 210,
    pattern: ["..rrrrrrr..", ".rpppppppr.", "rpphpphpppr", "rppprppprpp", "rpppppppppr", "rpprprprppr", ".rpppppppr.", "..rr.r.rr.."],
    step: 0.66,
    x: 76.5,
    y: 3.15,
  },
  {
    attachments: [[6.3, 3.6, "v"]],
    className: "bot",
    delay: 300,
    pattern: ["..g...g..", "...g.g...", "..vvvvv..", ".vgggggv.", ".vgkgkgv.", ".vggpggvl", "..vvvvv..", "..v...v..", ".vv...vv."],
    step: 0.72,
    x: 1.7,
    y: 17,
  },
  {
    attachments: [[1.44, 2.88, "v"], [1.44, 3.6, "v"]],
    className: "flower",
    delay: 390,
    pattern: [".c.c.", "..c..", "ccycc", "..c.."],
    step: 0.72,
    x: 86.2,
    y: 10,
  },
  {
    attachments: [[1.16, 2.9, "c"], [1.16, 3.48, "y"]],
    className: "rocket",
    delay: 470,
    pattern: ["..b..", ".bsb.", ".byb.", ".bbb.", "c.b.c"],
    step: 0.58,
    x: 34.6,
    y: 20.3,
  },
]);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAInlay(kind, glyphX, glyphY) {
  const petalClass = kind === "spark" ? "tone-sky" : "tone-coral";
  const pixels = [
    [1, 0, petalClass],
    [0, 1, petalClass],
    [1, 1, "tone-gold"],
    [2, 1, petalClass],
    [1, 2, petalClass],
  ];

  return `<g class="mark-inlay mark-inlay--${kind}">${pixels
    .map(([x, y, tone]) => `<rect class="mark-doodle-pixel ${tone}" x="${glyphX + 3.6 + x}" y="${glyphY + 3.05 + y}" width="0.82" height="0.82" />`)
    .join("")}</g>`;
}

function renderNameDoodle({ attachments = [], className, delay, pattern, step, x, y }) {
  const pixelSize = step - 0.06;
  const anchors = attachments
    .map(([offsetX, offsetY, tone]) => `<rect class="mark-doodle-pixel ${markDoodleTones[tone]}" x="${x + offsetX}" y="${y + offsetY}" width="${pixelSize}" height="${pixelSize}" />`)
    .join("");
  const pixels = [];

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((tone, columnIndex) => {
      const toneClass = markDoodleTones[tone];
      if (!toneClass) return;
      pixels.push(`<rect class="mark-doodle-pixel ${toneClass}" x="${x + columnIndex * step}" y="${y + rowIndex * step}" width="${pixelSize}" height="${pixelSize}" />`);
    });
  });

  return `<g class="mark-doodle-shell" style="--doodle-delay:${delay}ms"><g class="mark-doodle-anchor">${anchors}</g><g class="mark-doodle mark-doodle--${className}">${pixels.join("")}</g></g>`;
}

function renderCenterMascot() {
  const x = 53;
  const y = 19.12;
  const step = 0.75;
  const pixelSize = 0.68;
  const pattern = [".bbbbb.", "bsssssb", "bskyskb", "bsscssb", ".bbbbb."];
  const pixels = [];

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((tone, columnIndex) => {
      const toneClass = markDoodleTones[tone];
      if (!toneClass) return;
      pixels.push(`<rect class="mark-doodle-pixel ${toneClass}" x="${x + columnIndex * step}" y="${y + rowIndex * step}" width="${pixelSize}" height="${pixelSize}" />`);
    });
  });

  const legs = [[1, 5], [5, 5], [1, 6], [5, 6]]
    .map(([column, row]) => `<rect class="mark-doodle-pixel tone-blue" x="${x + column * step}" y="${y + row * step}" width="${pixelSize}" height="${pixelSize}" />`)
    .join("");

  return `<g class="mark-doodle-shell mark-center-shell" style="--doodle-delay:550ms"><g class="mark-doodle-anchor mark-center-legs">${legs}</g><g class="mark-doodle mark-doodle--center">${pixels.join("")}</g></g>`;
}

function renderNameMark() {
  const mark = document.querySelector("#heroMark");
  const lines = [
    { inlays: new Map([[3, "spark"]]), text: "TEJAS", y: 0.4 },
    { inlays: new Map([[1, "flower"]]), text: "NALADALA", y: 14.3 },
  ];
  const parts = [];
  let pixelOrder = 0;

  lines.forEach(({ inlays, text, y }, lineIndex) => {
    const letters = [...text];
    const lineWidth = letters.reduce((width, letter, index) => width + (index === letters.length - 1 ? 10 : nameGlyphAdvance[letter]), 0);
    let glyphX = (nameMarkWidth - lineWidth) / 2;

    letters.forEach((letter, letterIndex) => {
      nameGlyphs[letter].forEach((row, rowIndex) => {
        [...row].forEach((cell, columnIndex) => {
          if (cell !== "1") return;
          const seamTone = nameMuralSeams.get(`${lineIndex}:${letterIndex}:${rowIndex}:${columnIndex}`);
          parts.push(`<rect class="mark-pixel${seamTone ? ` ${seamTone}` : ""}" x="${glyphX + columnIndex}" y="${y + rowIndex}" width="0.92" height="0.92" style="--pixel-order:${pixelOrder}" />`);
          pixelOrder += 1;
        });
      });

      if (letter === "A" && inlays.has(letterIndex)) parts.push(renderAInlay(inlays.get(letterIndex), glyphX, y));
      glyphX += nameGlyphAdvance[letter];
    });
  });

  mark.insertAdjacentHTML("beforeend", `<g class="mark-glyphs">${parts.join("")}</g><g class="mark-mural">${nameMarkDoodles.map(renderNameDoodle).join("")}${renderCenterMascot()}</g>`);
}

function setupHeroTypewriter() {
  heroTypewriters = [...document.querySelectorAll(".hero-greeting, .hero-disciplines")].map((element) => {
    const text = element.innerText.trim();
    element.innerHTML = `<span class="sr-only">${escapeHtml(text)}</span><span class="typewriter-frame" aria-hidden="true"><span class="typewriter-reserve">${escapeHtml(text)}</span><span class="typewriter-output"><span></span><i class="typewriter-caret"></i></span></span>`;
    return { element, output: element.querySelector(".typewriter-output span"), text };
  });
}

function showTypedIntro() {
  heroTypewriterStarted = true;
  heroTypewriters.forEach(({ element, output, text }) => {
    output.textContent = text;
    element.classList.add("is-typed");
  });
}

function startHeroTypewriter() {
  if (!heroTypewriters.length || heroTypewriterStarted) return;
  heroTypewriterStarted = true;

  if (prefersReducedMotion.matches) {
    showTypedIntro();
    return;
  }

  const typeLine = (lineIndex) => {
    const line = heroTypewriters[lineIndex];
    if (!line) return;

    line.element.classList.add("is-typing");
    let characterIndex = 0;
    const typeNextCharacter = () => {
      const character = line.text[characterIndex];
      characterIndex += 1;

      if (character === " " || character === "\n") {
        line.output.append(document.createTextNode(character));
      } else {
        const glyph = document.createElement("span");
        glyph.className = "typewriter-character";
        glyph.textContent = character;
        line.output.append(glyph);
      }

      if (characterIndex >= line.text.length) {
        line.element.classList.remove("is-typing");
        line.element.classList.add("is-typed");
        if (lineIndex + 1 < heroTypewriters.length) window.setTimeout(() => typeLine(lineIndex + 1), 110);
        return;
      }

      const cadence = character === "\n" ? 170 : character === " " ? 18 : 42 + (characterIndex % 3) * 5;
      window.setTimeout(typeNextCharacter, cadence + (/[,.]/.test(character) ? 130 : 0));
    };

    typeNextCharacter();
  };

  typeLine(0);
}

function announce(message) {
  announcer.textContent = "";
  window.requestAnimationFrame(() => {
    announcer.textContent = message;
  });
}

function setMenu(open) {
  document.body.classList.toggle("nav-open", open);
  pageMain.toggleAttribute("inert", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation`);
  menuButton.title = `${open ? "Close" : "Open"} navigation`;
  mobileNav.setAttribute("aria-hidden", String(!open));
}

function wireNavigation() {
  menuButton.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      setMenu(false);
      menuButton.focus();
    }

    if (event.key === "Tab" && document.body.classList.contains("nav-open")) {
      const links = [...mobileNav.querySelectorAll("a")];
      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        links.at(-1)?.focus();
      } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });
  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) setMenu(false);
  });
}

function revealHome() {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
  site.classList.add("is-ready");
  site.setAttribute("aria-hidden", "false");
  document.body.classList.remove("is-booting");
}

function finishBoot() {
  if (bootFinished) return;
  bootFinished = true;
  window.clearTimeout(bootFallback);
  window.clearTimeout(bootPlaybackEnd);
  boot.classList.add("is-signature-leaving");

  window.setTimeout(() => {
    revealHome();
    boot.classList.add("is-leaving");
    announce("Tejas Naladala portfolio ready.");
    window.setTimeout(startHeroTypewriter, prefersReducedMotion.matches ? 0 : 150);
  }, prefersReducedMotion.matches ? 0 : 105);

  window.setTimeout(() => boot.remove(), prefersReducedMotion.matches ? 20 : 500);
}

function startBoot() {
  if (prefersReducedMotion.matches) {
    finishBoot();
    return;
  }

  const startDelay = 40;

  window.setTimeout(() => {
    if (bootFinished) return;

    let signatureLoaded = false;
    const showSignature = () => {
      if (bootFinished || signatureLoaded) return;
      signatureLoaded = true;
      signatureAnimation.classList.add("is-loaded");
      bootPlaybackEnd = window.setTimeout(finishBoot, 4_300);
    };

    bootFallback = window.setTimeout(finishBoot, 6_300);
    signatureAnimation.addEventListener("load", showSignature, { once: true });
    signatureAnimation.addEventListener("error", finishBoot, { once: true });
    signatureAnimation.src = signatureAnimation.dataset.src;
    if (signatureAnimation.complete && signatureAnimation.naturalWidth > 0) queueMicrotask(showSignature);
  }, startDelay);
}

renderNameMark();
setupHeroTypewriter();
wireNavigation();
startBoot();
