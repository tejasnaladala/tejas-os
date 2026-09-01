import {
  aboutNarrative,
  angelProfile,
  archiveEntries,
} from "/content.js?v=20260901.101";
import {
  aboutHello,
  contactLinks,
  cvProfile,
  researchJournal,
  workJournal,
} from "/data/profile.js?v=20260901.101";

const aboutTabs = { hello: aboutHello };

const page = document.body.dataset.page;
const content = document.querySelector("#pageContent");

const pageHeadingGlyphs = Object.freeze({
  A: ["0001111000", "0011111100", "0110000110", "1100000011", "1100000011", "1100000011", "1111111111", "1111111111", "1100000011", "1100000011", "1100000011", "1100000011"],
  B: ["1111111000", "1111111100", "1100000110", "1100000011", "1100000011", "1111111100", "1111111100", "1100000011", "1100000011", "1100000110", "1111111100", "1111111000"],
  C: ["0011111110", "0111111111", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "0111111111", "0011111110"],
  D: ["1111111000", "1111111100", "1100000110", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000110", "1111111100", "1111111000"],
  E: ["1111111111", "1111111111", "1100000000", "1100000000", "1100000000", "1111111100", "1111111100", "1100000000", "1100000000", "1100000000", "1111111111", "1111111111"],
  G: ["0011111110", "0111111111", "1100000000", "1100000000", "1100000000", "1100111111", "1100111111", "1100000011", "1100000011", "1100000011", "0111111111", "0011111110"],
  H: ["1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1111111111", "1111111111", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011"],
  I: ["1111111111", "1111111111", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "1111111111", "1111111111"],
  K: ["1100000011", "1100000110", "1100001100", "1100011000", "1100110000", "1111000000", "1111000000", "1100110000", "1100011000", "1100001100", "1100000110", "1100000011"],
  L: ["1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000", "1111111111", "1111111111"],
  N: ["1100000011", "1110000011", "1110000011", "1101000011", "1101100011", "1100110011", "1100110011", "1100011011", "1100001111", "1100001111", "1100000111", "1100000011"],
  O: ["0011111100", "0111111110", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "0111111110", "0011111100"],
  P: ["1111111000", "1111111100", "1100000110", "1100000011", "1100000011", "1111111100", "1111111000", "1100000000", "1100000000", "1100000000", "1100000000", "1100000000"],
  R: ["1111111000", "1111111100", "1100000110", "1100000011", "1100000011", "1111111100", "1111111000", "1100110000", "1100011000", "1100001100", "1100000110", "1100000011"],
  S: ["0111111111", "1111111111", "1100000000", "1100000000", "1111100000", "0111111100", "0000011110", "0000000011", "0000000011", "0000000011", "1111111111", "1111111110"],
  T: ["1111111111", "1111111111", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000", "0000110000"],
  U: ["1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "0111111110", "0011111100"],
  V: ["1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "0110000110", "0110000110", "0011001100", "0001111000"],
  W: ["1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100000011", "1100110011", "1100110011", "1111001111", "0110000110"],
});

const pageHeadingTones = Object.freeze({
  b: "page-tone-blue",
  c: "page-tone-coral",
  g: "page-tone-green",
  i: "page-tone-ink",
  l: "page-tone-green-light",
  p: "page-tone-pink",
  r: "page-tone-rose",
  s: "page-tone-sky",
  v: "page-tone-green-dark",
  y: "page-tone-gold",
});

const pageHeadingArt = Object.freeze({
  about: {
    right: 18,
    word: "ABOUT",
  },
  work: {
    right: 18,
    word: "WORK",
  },
  research: {
    right: 16,
    word: "RESEARCH",
  },
  investing: {
    right: 16,
    word: "INVESTING",
  },
  stories: {
    right: 18,
    word: "BLOG",
  },
  cv: {
    right: 22,
    word: "CV",
  },
});

function renderPagePattern(pattern, x, y, className, step = 0.78) {
  const size = step - 0.07;
  const pixels = [];

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((tone, columnIndex) => {
      const toneClass = pageHeadingTones[tone];
      if (!toneClass) return;
      pixels.push(`<rect class="page-doodle-pixel ${toneClass}" x="${x + columnIndex * step}" y="${y + rowIndex * step}" width="${size}" height="${size}" />`);
    });
  });

  return `<g class="${className}">${pixels.join("")}</g>`;
}

function renderPageDoodle(pageName, wordX, wordY, wordWidth) {
  const wordEnd = wordX + wordWidth;

  if (pageName === "about") {
    const x = wordEnd - 1.4;
    return `<g class="page-mural-doodle page-mural-doodle--about">
      ${renderPagePattern(["bb...bb", "bbb.bbb", "bbbbbbb", ".bbbbb.", "..bbb..", "..b.b.."], wordX + 12.4, wordY - 4.1, "page-doodle__motion page-doodle__bow", 0.56)}
      ${renderPagePattern(["..pp..", "..pppp", "..pp..", "..pp..", "pppp..", "pppp.."], wordX + 29.4, wordY + 11.9, "page-doodle__motion page-doodle__note", 0.52)}
      ${renderPagePattern([".yyyyy.", "byyyyyyb", "byyiyiyb", "byyyyyyb", ".yiyyiy.", ".yyiiiyy", "..yyyyy."], x, wordY + 1.65, "page-doodle__body", 0.78)}
    </g>`;
  }

  if (pageName === "work") {
    const x = wordEnd - 2.2;
    return `<g class="page-mural-doodle page-mural-doodle--work">
      ${renderPagePattern([".gggg.", "ggiigg", "gi..ig", "gi..ig", "ggiigg", ".gggg."], wordX + 9.8, wordY + 10.65, "page-doodle__motion page-doodle__gear", 0.58)}
      ${renderPagePattern(["..bb.bb..", "...bb....", ".iiiiiii.", "ibbbbbbi", "ibbiyibbi", "ibbbbbbi", "i.iiiii.i", "..ii.ii.."], x, wordY + 1.15, "page-doodle__body", 0.72)}
      ${renderPagePattern(["..yy", "..yy", "iiyy", "iiyy", "..ii", "..ii"], x + 5.75, wordY + 2.9, "page-doodle__motion page-doodle__wave", 0.48)}
    </g>`;
  }

  if (pageName === "research") {
    const x = wordEnd;
    return `<g class="page-mural-doodle page-mural-doodle--research">
      ${renderPagePattern(["...bb..", "..bbbb.", ".bbbb..", "..bb...", "..bii..", "..iiii.", ".ii.gg.", "iiiiiii"], wordX + 3.2, wordY + 12.15, "page-doodle__motion page-doodle__microscope", 0.5)}
      ${renderPagePattern(["bb..bb", "bbbbbb", ".bbbb.", "..bb..", ".b..b."], wordX + 48.6, wordY - 4, "page-doodle__motion page-doodle__molecule", 0.5)}
      ${renderPagePattern(["..ss...", "..ss...", ".s..s..", ".s..s..", "sbbbbbs", "sbbgbbs", "sbgggbs", ".sssss."], x, wordY + 1.4, "page-doodle__body", 0.86)}
      ${renderPagePattern(["ss..bb..", "ss..bb..", "..ss..gg", "..ss..gg"], x + 0.65, wordY - 0.8, "page-doodle__motion page-doodle__bubbles", 0.48)}
    </g>`;
  }

  if (pageName === "investing") {
    const x = wordEnd - 3.4;
    return `<g class="page-mural-doodle page-mural-doodle--investing">
      ${renderPagePattern(["..iiii..", ".iiiiii.", ".iyyyyi.", ".iyiyyi.", ".iyyyyi.", "..iiii..", "..bbgggg", ".bbbgggg", ".bb.bb.."], wordX + 27.2, wordY + 12.15, "page-doodle__motion page-doodle__founder", 0.45)}
      ${renderPagePattern(["bb...yyy...bb", "bbb.yyyyy.bbb", ".bb.yyyyy.bb.", "..b.yyiyy.b..", "..b.yyyyy.b..", "...yyiiiyy...", "....yyyyy...."], x, wordY - 3.05, "page-doodle__body", 0.62)}
      ${renderPagePattern([".gggg.", "gggg..", "..gg..", "..gg.."], x + 4.25, wordY - 4.9, "page-doodle__motion page-doodle__sprout", 0.52)}
    </g>`;
  }

  if (pageName === "stories") {
    const x = wordEnd - 2.4;
    return `<g class="page-mural-doodle page-mural-doodle--stories">
      ${renderPagePattern(["cccccc..", "cc..ccii", "cc..ccii", "cc..ccii", "cccccc..", ".iiii..."], wordX + 24.2, wordY + 12.05, "page-doodle__motion page-doodle__coffee", 0.52)}
      ${renderPagePattern(["ccyyyyii", ".ccyyyyi"], wordX + 36.2, wordY - 1.35, "page-doodle__motion page-doodle__pencil", 0.46)}
      ${renderPagePattern([".ppppppp..", "ppppppppp.", "ppippippp.", "ppppppppp.", "pppiiippp.", ".ppppppp..", "...pp....."], x, wordY + 1.9, "page-doodle__body", 0.68)}
    </g>`;
  }

  const x = wordEnd - 0.8;
  return `<g class="page-mural-doodle page-mural-doodle--cv">
    ${renderPagePattern(["iiiiii", "i....i", "i.g..i", "i..g.i", "i...gi", "i....i", "iiiiii"], x, wordY + 2, "page-doodle__body", 0.72)}
    ${renderPagePattern([".c.", "cyc", ".c."], x + 4.2, wordY + 7.2, "page-doodle__motion page-doodle__stamp", 0.62)}
  </g>`;
}

function renderPageHeading() {
  const art = pageHeadingArt[page];
  const heading = document.querySelector(".page-intro h1");
  if (!art || !heading) return;

  const wordX = 2;
  const wordY = 5;
  const wordWidth = art.word.length * 11 - 1;
  const viewWidth = wordX + wordWidth + art.right;
  const viewHeight = 22;
  const pixels = [];

  [...art.word].forEach((letter, letterIndex) => {
    pageHeadingGlyphs[letter].forEach((row, rowIndex) => {
      [...row].forEach((cell, columnIndex) => {
        if (cell !== "1") return;
        pixels.push(`<rect class="page-heading-pixel" x="${wordX + letterIndex * 11 + columnIndex}" y="${wordY + rowIndex}" width="0.92" height="0.92" />`);
      });
    });
  });

  const label = heading.textContent;
  heading.classList.add("is-pixel-heading");
  heading.innerHTML = `<span class="page-heading__text">${escapeHtml(label)}</span><svg class="page-heading-mural" viewBox="0 0 ${viewWidth} ${viewHeight}" aria-hidden="true" focusable="false" style="--page-heading-max:${Math.round(viewWidth * 8)}px"><g class="page-heading__letters">${pixels.join("")}</g>${renderPageDoodle(page, wordX, wordY, wordWidth)}</svg>`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeHref(href = "") {
  return href.startsWith("./") ? `/${href.slice(2)}` : href;
}

function renderLinks(links = []) {
  if (!links.length) return "";

  return `<div class="text-links">${links
    .map((link) => {
      const href = normalizeHref(link.href);
      const external = /^https?:/i.test(href);
      return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)}<span aria-hidden="true">&#8599;</span></a>`;
    })
    .join("")}</div>`;
}

function renderFacts(facts = []) {
  if (!facts.length) return "";
  return `<ul class="fact-list">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>`;
}

function wireTabs(tablist, panels, onActivate) {
  if (!tablist || !panels.length) return;

  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const orientation = tablist.getAttribute("aria-orientation") || "horizontal";

  const activate = (index, moveFocus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });

    onActivate?.(panels[index], index);
    if (moveFocus) tabs[index]?.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(index));
    tab.addEventListener("keydown", (event) => {
      const previousKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      let nextIndex = null;

      if (event.key === previousKey) nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === nextKey) nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      activate(nextIndex, true);
    });
  });

  const selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
  activate(selectedIndex);
}

function renderAboutRichText(parts) {
  const values = Array.isArray(parts) ? parts : [parts];
  const allowedTones = new Set(["blue", "coral", "gold", "green", "pink", "rose", "sky"]);

  return values
    .map((part) => {
      if (typeof part === "string") return escapeHtml(part);
      if (part.break) return "<br />";
      if (part.strong) return `<strong class="about-story__emphasis">${escapeHtml(part.text)}</strong>`;

      if (part.mark) {
        const tone = allowedTones.has(part.tone) ? part.tone : "rose";
        const colorClass = part.color ? " about-story__accent--color" : "";
        return `<span class="about-story__accent about-story__accent--${tone}${colorClass}">${escapeHtml(part.text)}</span>`;
      }

      const href = normalizeHref(part.href);
      const external = /^https?:/i.test(href);
      const tone = allowedTones.has(part.tone) ? part.tone : "rose";
      const note = part.note ? String(part.note) : "";
      const preview = part.preview?.src
        ? {
            src: normalizeHref(part.preview.src),
            alt: String(part.preview.alt ?? ""),
            caption: String(part.preview.caption ?? ""),
          }
        : null;
      const description = note || preview?.caption || "";
      const ariaLabel = description ? ` aria-label="${escapeHtml(`${part.text}. ${description}`)}"` : "";
      const popover = preview
        ? `<span class="about-story__reference-note about-story__reference-note--image" aria-hidden="true"><img src="${escapeHtml(preview.src)}" alt="${escapeHtml(preview.alt)}" width="720" height="420" loading="eager" decoding="async" /><span class="about-story__reference-caption">${escapeHtml(preview.caption)}</span></span>`
        : note
          ? `<span class="about-story__reference-note" aria-hidden="true">${escapeHtml(note)}</span>`
          : "";
      return `<a class="about-story__reference about-story__reference--${tone}" href="${escapeHtml(href)}"${ariaLabel}${external ? ' target="_blank" rel="noopener noreferrer"' : ""}><span>${escapeHtml(part.text)}</span>${popover}</a>`;
    })
    .join("");
}

function renderAboutParagraphs(paragraphs, className = "") {
  return `<div class="about-story__prose${className ? ` ${className}` : ""}">${paragraphs.map((paragraph) => `<p>${renderAboutRichText(paragraph)}</p>`).join("")}</div>`;
}

// Selected MIT-licensed paths from pixelarticons 2.4.1, vendored in assets/vendor/pixelarticons.
const aboutPixelIcons = Object.freeze({
  anchor: '<path d="M10 2h4v2h-4zm0 6h4v2h-4zM8 4h2v4H8zm6 0h2v4h-2z"/><path d="M11 9h2v12h-2z"/><path d="M5 20h14v2H5zm-2-8h2v8H3zm16 0h2v8h-2zM5 12h2v2H5zm12 0h2v2h-2z"/>',
  book: '<path d="M2 3h9v2H2zM0 19h11v2H0zM13 3h9v2h-9zm0 16h11v2H13zM11 5h2v18h-2zM0 5h2v14H0zm22 0h2v14h-2zm-7 2h5v2h-5zm0 4h5v2h-5zm0 4h2v2h-2z"/>',
  circuit: '<path d="M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM8 6h2v2H8zm8 12h-2v-2h2zM6 8h2v2H6zm12 8h-2v-2h2zM8 10h2v2H8zm8 4h-2v-2h2zm-6-6h6v2h-6zm4 8H8v-2h6zm2-12h2v4h-2zM8 20H6v-4h2z"/>',
  eye: '<path d="M16 20H8v-2h8v2Zm-8-2H4v-2h4v2Zm12 0h-4v-2h4v2ZM4 16H2v-2h2v2Zm10-6h-2v2h2v-2h2v4h-2v2h-4v-2H8v-4h2V8h4v2Zm8 6h-2v-2h2v2ZM2 14H0v-4h2v4Zm22 0h-2v-4h2v4ZM4 10H2V8h2v2Zm18 0h-2V8h2v2ZM8 8H4V6h4v2Zm12 0h-4V6h4v2Zm-4-2H8V4h8v2Z"/>',
  heart: '<path d="M13 22h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 16H5v-2h2v2Zm12 0h-2v-2h2v2ZM5 14H3v-2h2v2Zm16 0h-2v-2h2v2ZM3 12H1V6h2v6Zm20 0h-2V6h2v6ZM13 8h-2V6h2v2ZM5 6H3V4h2v2Zm6 0H9V4h2v2Zm4 0h-2V4h2v2Zm6 0h-2V4h2v2ZM9 4H5V2h4v2Zm10 0h-4V2h4v2Z"/>',
  key: '<path d="M11 18H3V16H11V18ZM23 15H21V18H17V16H19V13H21V11H11V8H13V9H23V15ZM3 16H1V8H3V16ZM17 16H15V15H13V16H11V13H17V16ZM9 14H5V10H9V14ZM11 8H3V6H11V8Z"/>',
  leaf: '<path d="M1 18h2v4H1zm2-2h2v2H3zm2-2h6v2H5zm6-2h2v2h-2zm-6 6h4v2H5zm4 2h4v2H9zm4-2h4v2h-4zm4-2h2v2h-2zm2-8h2v8h-2zm0-4h2v4h-2zm-2-2h2v2h-2zm-4 2h4v2h-4zM7 6h6v2H7zM5 8h2v2H5zm-2 2h2v4H3z"/>',
  mic: '<path d="M10 2h4v2h-4zM8 4h2v10H8zm2 10h4v2h-4zm4-10h2v10h-2zM4 10h2v6H4zm2 6h2v2H6zm2 2h8v2H8zm8-2h2v2h-2zm2-6h2v6h-2zm-7 10h2v2h-2z"/>',
  sparkles: '<path d="M11 1h2v4h-2zm0 22h2v-4h-2zM9 5h2v4H9zm0 14h2v-4H9zm4-14h2v4h-2zm0 14h2v-4h-2zM5 9h4v2H5zm14 0h-4v2h4zM1 11h4v2H1zm22 0h-4v2h4zM5 13h4v2H5zm14 0h-4v2h4zm0-12h2v6h-2z"/><path d="M17 3h6v2h-6zM3 17h2v2H3zm-2 2h2v2H1zm2 2h2v2H3zm2-2h2v2H5z"/>',
  star: '<path d="M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z"/>',
  unlock: '<path d="M5 8h14v2H5zm0 12h14v2H5zM3 10h2v10H3zm16 0h2v10h-2zM7 4h2v4H7zm2-2h6v2H9zm6 2h2v2h-2z"/>',
  waves: '<path d="M2 18h4v-2H2zm0-6h4v-2H2zm0-6h4V4H2zm4 14h4v-2H6zm0-6h4v-2H6zm0-6h4V6H6zm4 10h4v-2h-4zm0-6h4v-2h-4zm0-6h4V4h-4zm4 14h4v-2h-4zm0-6h4v-2h-4zm0-6h4V6h-4zm4 10h4v-2h-4zm0-6h4v-2h-4zm0-6h4V4h-4z"/>',
  zap: '<path d="M4 13h8v6h2v2h-2v2h-2v-8H2v-4h2v2Zm12 6h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2v-2h2v2Zm-6-6h8v4h-2v-2h-8V5h-2V3h2V1h2v8Zm-8 2H4V9h2v2Zm2-2H6V7h2v2Zm2-2H8V5h2v2Z"/>',
});

const aboutDoodlePairs = Object.freeze({
  roots: ["leaf", "sparkles"],
  education: ["book", "sparkles"],
  stage: ["mic", "star"],
  freedom: ["unlock", "key"],
  circuit: ["circuit", "zap"],
  ocean: ["anchor", "waves"],
  heart: ["heart", "sparkles"],
  questions: ["eye", "sparkles"],
  ending: ["star", "sparkles"],
});

function renderAboutStoryDoodle(kind) {
  const safeKind = Object.hasOwn(aboutDoodlePairs, kind) ? kind : "questions";
  const [primary, companion] = aboutDoodlePairs[safeKind];

  return `<span class="about-story-doodle about-story-doodle--${safeKind}" aria-hidden="true"><svg class="about-story-doodle__icon about-story-doodle__icon--primary" viewBox="0 0 24 24" focusable="false">${aboutPixelIcons[primary]}</svg><svg class="about-story-doodle__icon about-story-doodle__icon--companion" viewBox="0 0 24 24" focusable="false">${aboutPixelIcons[companion]}</svg></span>`;
}

function renderAboutRootsPhoto() {
  return `<figure class="about-story__roots-photo">
    <img src="/assets/about/village-gathering.webp" alt="Family and community gathered around rows of oil lamps in South India" width="720" height="512" loading="lazy" decoding="async" />
  </figure>`;
}

function renderAboutMethodClippings() {
  return `<aside class="about-story__method-clippings" aria-label="Visual notes on finding things out">
    <figure class="about-story__method-clipping about-story__method-clipping--curve">
      <img src="/assets/about/find-out-curve.webp" alt="A lecturer plotting find out against fuck around on a whiteboard" width="400" height="400" loading="lazy" decoding="async" />
    </figure>
    <figure class="about-story__method-clipping about-story__method-clipping--loop">
      <img src="/assets/about/scientific-method-loop.webp" alt="A circular scientific-method diagram labelled fuck around and find out" width="520" height="520" loading="lazy" decoding="async" />
    </figure>
  </aside>`;
}

function renderAboutHappyClipping() {
  return `<div class="about-story__happy-clippings" aria-label="Images from things that made me happy">
    <figure class="about-story__happy-clipping about-story__happy-clipping--smile">
      <img src="/assets/about/happy-beach.webp" alt="A yellow smiling figure standing on a beach" width="512" height="384" loading="lazy" decoding="async" />
    </figure>
    <figure class="about-story__happy-clipping about-story__happy-clipping--stage">
      <img src="/assets/about/happy-stage.webp" alt="Tejas standing on stage after a performance" width="400" height="574" loading="lazy" decoding="async" />
    </figure>
  </div>`;
}

function renderAboutPsychedelicPhoto() {
  return `<figure class="about-story__psychedelic-photo">
    <img src="/assets/about/psychedelic-portrait.webp" alt="Intricate surreal portrait artwork with faces, eyes, and organic forms" width="480" height="596" loading="lazy" decoding="async" />
  </figure>`;
}

function renderAboutFreedomPhoto() {
  return `<figure class="about-story__freedom-photo">
    <img src="/assets/about/freedom-portrait.webp" alt="Vibrant painted portrait of Tejas against a black background" width="680" height="906" loading="lazy" decoding="async" />
  </figure>`;
}

function renderAboutBuildPhotos() {
  return `<aside class="about-story__build-photos" aria-label="Machines from Tejas's engineering work">
    <figure class="about-story__build-photo about-story__build-photo--reactor">
      <img src="/assets/about/achievement-plasma-reactor.webp" alt="Engineering drawing of a plasma-activated water reactor system" width="1040" height="750" loading="lazy" decoding="async" />
    </figure>
    <figure class="about-story__build-photo about-story__build-photo--jason">
      <img src="/assets/about/achievement-jason.webp" alt="Woods Hole Oceanographic Institution's ROV Jason on deck" width="480" height="590" loading="lazy" decoding="async" />
    </figure>
  </aside>`;
}

function renderAboutImpulsePhoto() {
  return `<figure class="about-story__impulse-photo">
    <img src="/assets/about/achievement-roger-revelle.webp" alt="Research vessel Roger Revelle at sea" width="800" height="414" loading="lazy" decoding="async" />
  </figure>`;
}

function renderAboutSignature() {
  return `<p class="about-story__signature">- Tejas Naladala</p>`;
}

function renderAbout() {
  const hello = aboutTabs.hello;

  content.innerHTML = `
    <article class="about-story">
      <header class="about-story__identity">
        <h2>${escapeHtml(hello.intro)}<br />${escapeHtml(hello.buildLine)}</h2>
      </header>

      <section class="about-story__chapter about-story__chapter--roots">
        <p class="about-story__opening">${renderAboutRichText(aboutNarrative.roots[0])}</p>
        ${renderAboutParagraphs(aboutNarrative.roots.slice(1))}
        ${renderAboutRootsPhoto()}
      </section>

      <section class="about-story__chapter about-story__chapter--education">
        ${renderAboutParagraphs(aboutNarrative.education, "about-story__prose--wide")}
        ${renderAboutStoryDoodle("education")}
      </section>

      <section class="about-story__chapter about-story__chapter--stage">
        ${renderAboutParagraphs(aboutNarrative.stage, "about-story__prose--stage")}
        ${renderAboutMethodClippings()}
        ${renderAboutHappyClipping()}
      </section>

      <section class="about-story__chapter about-story__chapter--freedom">
        <h3>${renderAboutRichText(aboutNarrative.freedomIntro)}</h3>
        <ol class="about-story__freedom">
          ${aboutNarrative.freedom.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
        </ol>
        <p class="about-story__freedom-close">${escapeHtml(aboutNarrative.freedomClose)}</p>
        ${renderAboutFreedomPhoto()}
      </section>

      <section class="about-story__chapter about-story__chapter--builds">
        <div class="about-story__build-layout">
          <ol class="about-story__ledger">
            ${aboutNarrative.builds
              .map(
                (item) => `<li><p>${renderAboutRichText(item.content)}</p></li>`,
              )
              .join("")}
          </ol>
          ${renderAboutBuildPhotos()}
        </div>
        <div class="about-story__impulse-row">
          ${renderAboutImpulsePhoto()}
          <div class="about-story__impulse-copy">
            <p class="about-story__impulse">And I'm ${renderAboutRichText([{ text: "only getting started", mark: true, tone: "blue" }])}.</p>
            ${renderAboutStoryDoodle("ocean")}
          </div>
        </div>
        ${renderAboutStoryDoodle("circuit")}
      </section>

      <section class="about-story__chapter about-story__chapter--quiet">
        <p>${renderAboutRichText(["More recently, I heard my dad say he was ", { text: "proud of me", mark: true, tone: "rose", color: true }, "."])}</p>
        <strong>That meant more than most things I have done.</strong>
        ${renderAboutStoryDoodle("heart")}
      </section>

      <section class="about-story__chapter about-story__chapter--questions">
        ${renderAboutParagraphs(aboutNarrative.questions, "about-story__prose--questions")}
        ${renderAboutPsychedelicPhoto()}
      </section>

      <footer class="about-story__ending">
        ${aboutNarrative.ending.map((line, index) => `<p class="about-story__ending-line about-story__ending-line--${index + 1}">${escapeHtml(line)}</p>`).join("")}
        ${renderAboutSignature()}
      </footer>
    </article>`;
}

function renderEditorialLinks(links = [], modifier = "") {
  if (!links.length) return "";

  return `<div class="editorial-links${modifier ? ` editorial-links--${escapeHtml(modifier)}` : ""}">${links
    .map((link) => {
      const href = normalizeHref(link.href);
      const external = /^https?:/i.test(href);
      return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(link.label)}<span aria-hidden="true">&#8599;</span></a>`;
    })
    .join("")}</div>`;
}

const technicalNoteDocuments = {
  "Evolutionary optimization of VLM inference": {
    href: "/assets/research/alphaevolve-charxiv-note.pdf",
    preview: "/assets/research/alphaevolve-charxiv-first-page.webp",
    alt: "First page of the AlphaEvolve-style CharXiv technical note",
    pages: 8,
    orientation: "portrait",
    width: 700,
    height: 906,
  },
  "Dense Qwen vs MoE GLM serving": {
    href: "/assets/research/qwen-glm-serving-benchmark.pdf",
    preview: "/assets/research/qwen-glm-serving-first-page.webp",
    alt: "First page of the Qwen3.5-9B and GLM-4.7-Flash serving benchmark",
    pages: 15,
    orientation: "landscape",
    width: 700,
    height: 394,
  },
};

function renderTechnicalNoteDocument(document) {
  if (!document) return "";

  return `<a class="technical-note__document technical-note__document--${escapeHtml(document.orientation)}" href="${escapeHtml(document.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open the ${escapeHtml(String(document.pages))}-page PDF">
    <span class="technical-note__document-meta"><strong>PDF</strong><span>${escapeHtml(String(document.pages))} pages</span></span>
    <figure class="technical-note__sheet">
      <img src="${escapeHtml(document.preview)}" alt="${escapeHtml(document.alt)}" width="${escapeHtml(String(document.width))}" height="${escapeHtml(String(document.height))}" loading="lazy" decoding="async" />
    </figure>
    <span class="technical-note__document-link">Open full note <span aria-hidden="true">&#8599;</span></span>
  </a>`;
}

function renderRecordRows(records, variant = "", headingLevel = 2) {
  const variantClass = variant ? ` work-resume__records--${escapeHtml(variant)}` : "";
  const headingTag = headingLevel === 3 ? "h3" : "h2";
  return `<div class="work-resume__records${variantClass}">
    ${records
      .map(
        ({ tone, title, context, organization, website, dates, dateStart, dateEnd, dateStartLabel, dateEndLabel, description, document }) => `
          <section class="work-record work-record--${escapeHtml(tone)}">
            <header class="work-record__header">
              <${headingTag}>${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">${escapeHtml(organization)}</a>` : escapeHtml(organization)}</${headingTag}>
              <p class="work-record__role">${escapeHtml(title)}</p>
              ${context ? `<p class="work-record__context">${escapeHtml(context)}</p>` : ""}
              <p class="work-record__dates">
                ${dateStart ? `<time datetime="${escapeHtml(dateStart)}">${escapeHtml(dateStartLabel)}</time><span aria-hidden="true"> - </span><time${dateEnd ? ` datetime="${escapeHtml(dateEnd)}"` : ""}>${escapeHtml(dateEndLabel)}</time>` : `<time>${escapeHtml(dates)}</time>`}
              </p>
            </header>
            ${
              variant === "projects"
                ? `<div class="work-record__description work-record__description--prose work-record__description--projects">
                    ${description.map((detail) => `<p>${escapeHtml(detail)}</p>`).join("")}
                  </div>`
                : variant === "notes" && document
                  ? `<div class="technical-note__body">
                      <ul class="work-record__description">
                        ${description.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
                      </ul>
                      ${renderTechnicalNoteDocument(document)}
                    </div>`
                : `<ul class="work-record__description">
                    ${description.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
                  </ul>`
            }
          </section>`,
      )
      .join("")}
  </div>`;
}

function renderWork() {
  content.innerHTML = `<article class="work-resume">${renderRecordRows(workJournal)}</article>`;
}

function renderResearch() {
  const studies = researchJournal.studies ?? [];
  const reports = researchJournal.reports ?? [];
  const publications = researchJournal.publications ?? [];
  const systems = researchJournal.systems ?? [];
  const tones = ["blue", "red", "green", "yellow", "purple", "black"];
  const makeStudyRecord = ({ entryTitle, field, question, dates, dateStart, dateEnd, dateStartLabel, dateEndLabel, website, description }, index) => {
    const organization = field === "Ocean field science" ? "Ocean CV for methane-bubble flux estimation" : entryTitle;
    return {
      tone: tones[index % tones.length],
      organization,
      title: question,
      dates,
      dateStart,
      dateEnd,
      dateStartLabel,
      dateEndLabel,
      website: website ? normalizeHref(website) : "",
      description,
    };
  };
  const makeReportRecord = ({ entryTitle, displayTitle, attribution, dates, dateStart, dateEnd, dateStartLabel, dateEndLabel, website, description }, index) => {
    const document = technicalNoteDocuments[entryTitle];
    return {
      tone: tones[index % tones.length],
      organization: displayTitle,
      title: attribution,
      context: "",
      dates,
      dateStart,
      dateEnd,
      dateStartLabel,
      dateEndLabel,
      website: document?.href ?? (website ? normalizeHref(website) : ""),
      description,
      document,
    };
  };

  const researchProjects = studies
    .filter(({ kind }) => kind !== "project")
    .map((study, index) => makeStudyRecord(study, index));
  const studyProjects = studies.filter(({ kind }) => kind === "project");
  const systemProjects = [
    ...studyProjects.map((study, index) => makeStudyRecord(study, index + researchProjects.length)),
    ...reports
      .filter(({ kind }) => kind === "project")
      .map((report, index) => makeReportRecord(report, index + researchProjects.length + studyProjects.length)),
  ];
  const technicalNoteOrder = new Map([
    ["Dense Qwen vs MoE GLM serving", 0],
    ["Evolutionary optimization of VLM inference", 1],
  ]);
  const technicalNotes = reports
    .filter(({ kind }) => kind !== "project")
    .sort((a, b) => (technicalNoteOrder.get(a.entryTitle) ?? 99) - (technicalNoteOrder.get(b.entryTitle) ?? 99))
    .map((report, index) => makeReportRecord(report, index + researchProjects.length + systemProjects.length));

  content.innerHTML = `
    <article class="work-resume research-resume">
      <section class="research-resume__group research-resume__group--research research-resume__group--first" aria-labelledby="researchStudies">
        <header class="research-resume__section-heading">
          <h2 id="researchStudies">Research</h2>
        </header>
        ${renderRecordRows(researchProjects, "", 3)}
      </section>

      <section class="research-resume__group research-resume__group--projects" aria-labelledby="researchProjects">
        <header class="research-resume__section-heading">
          <h2 id="researchProjects">Projects</h2>
        </header>
        ${renderRecordRows(systemProjects, "projects", 3)}
      </section>

      <section class="research-resume__group research-resume__group--notes" aria-labelledby="technicalNotes">
        <header class="research-resume__section-heading">
          <h2 id="technicalNotes">Technical notes</h2>
        </header>
        ${renderRecordRows(technicalNotes, "notes", 3)}
      </section>

      <section class="research-record research-resume__group research-resume__group--published" aria-labelledby="publishedRecord">
        <header>
          <h2 id="publishedRecord">Published record</h2>
          <p>Three peer-reviewed plasma-engineering papers, 57 citations, and an h-index of 3 as of Sep 2026.</p>
        </header>
        <div class="research-record__papers">
          ${publications
            .map(
              (publication) => `
                <article>
                  <p>${escapeHtml(publication.meta)}</p>
                  <h3>${escapeHtml(publication.title)}</h3>
                  ${renderEditorialLinks(
                    [
                      {
                        label: "Google Scholar",
                        href: `https://scholar.google.com/scholar?q=${encodeURIComponent(publication.title)}`,
                      },
                    ],
                    "paper",
                  )}
                </article>`,
            )
            .join("")}
        </div>
      </section>

      <section class="research-systems research-resume__group research-resume__group--systems" aria-labelledby="otherSystems">
        <header>
          <h2 id="otherSystems">Other systems</h2>
        </header>
        <div class="research-systems__list">
          ${systems
            .map((entry) => {
              const name = entry.website
                ? `<a class="research-system__name" href="${escapeHtml(normalizeHref(entry.website))}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.title)}</a>`
                : `<span class="research-system__name">${escapeHtml(entry.title)}</span>`;
              return `<div class="research-system">${name}<span class="research-system__summary">${escapeHtml(entry.description)}</span></div>`;
            })
            .join("")}
        </div>
      </section>
    </article>`;
}

function renderInvestmentThesis() {
  const thesis = document.querySelector("#investmentThesis");
  if (!thesis || !angelProfile.thesis?.length) return;

  const terms = angelProfile.thesis;
  thesis.innerHTML = `
    <p class="investing-thesis__statement">I write checks of $5K-$30K into very early, exceptional teams building in ${terms
        .map(
          (item, index) => `<span class="investing-thesis__term-group" data-thesis-group="${escapeHtml(item.id)}"><button class="investing-thesis__term" type="button" data-thesis-term="${escapeHtml(item.id)}" aria-describedby="thesisDefinition-${escapeHtml(item.id)}" aria-pressed="false">${escapeHtml(item.label)}</button><span class="investing-thesis__definition" id="thesisDefinition-${escapeHtml(item.id)}" data-thesis-definition="${escapeHtml(item.id)}" role="tooltip" aria-hidden="true">${escapeHtml(item.definition)}</span></span>${index === terms.length - 1 ? "." : index === terms.length - 2 ? ", and " : ", "}`,
        )
        .join("")}</p>`;

  const buttons = [...thesis.querySelectorAll("[data-thesis-term]")];
  const definitions = [...thesis.querySelectorAll("[data-thesis-definition]")];
  let selected = null;

  const activate = (id) => {
    buttons.forEach((button) => {
      const active = button.dataset.thesisTerm === id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    definitions.forEach((definition) => {
      const active = definition.dataset.thesisDefinition === id;
      definition.classList.toggle("is-active", active);
      definition.setAttribute("aria-hidden", String(!active));
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("pointerenter", () => activate(button.dataset.thesisTerm));
    button.addEventListener("focus", () => activate(button.dataset.thesisTerm));
    button.addEventListener("click", () => {
      selected = button.dataset.thesisTerm;
      activate(selected);
    });
  });

  thesis.addEventListener("pointerleave", () => activate(selected));
  thesis.addEventListener("focusout", (event) => {
    if (!thesis.contains(event.relatedTarget)) activate(selected);
  });
}

function renderInvesting() {
  renderInvestmentThesis();
  content.innerHTML = `
    <div class="investing-compact">
      <section class="investing-criteria">
        <p class="investing-scorecard__intro">${escapeHtml(angelProfile.scorecardIntro)}</p>
        <ul class="investing-criteria__list">
          ${angelProfile.signals.map((signal) => `<li><span>${escapeHtml(signal.label)}</span><strong>${escapeHtml(signal.score)}</strong></li>`).join("")}
        </ul>
      </section>
      <aside class="investing-brief">
        <div class="investing-note">
          ${angelProfile.paragraphs.map((paragraph, index) => `<p class="investing-note__${index === 0 ? "lead" : index === 2 ? "aside" : "body"}">${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="investing-brief__footer">
          <div class="investing-referral">
            <p>${escapeHtml(angelProfile.referral)}</p>
          </div>
          <div class="investing-referral__logos" aria-label="Referral programs">
            <a class="investing-partner" href="${escapeHtml(contactLinks.foundersInc)}" target="_blank" rel="noopener noreferrer"><span class="investing-partner__mark"><img src="/assets/partners/founders-inc.png" alt="" width="180" height="180" decoding="async" /></span><span>Founders, Inc.</span></a>
            <a class="investing-partner" href="${escapeHtml(contactLinks.speedrun)}" target="_blank" rel="noopener noreferrer"><span class="investing-partner__mark investing-partner__mark--speedrun"><img src="/assets/partners/a16z-speedrun.png" alt="" width="180" height="180" decoding="async" /></span><span>a16z speedrun</span></a>
          </div>
          <a class="button-link" href="${escapeHtml(contactLinks.pitch)}">Send the company<span aria-hidden="true">&#8599;</span></a>
        </div>
      </aside>
    </div>`;
}

function renderStoryTileArt(storyId) {
  if (storyId === "nespresso-jailbreak") {
    return `<svg class="story-tile__art" viewBox="0 0 42 24" aria-hidden="true" focusable="false">
      ${renderPagePattern(["..c.c...", ".c.c....", "c.c....."], 6, 1, "story-tile__motion story-tile__steam", 1.18)}
      ${renderPagePattern(["iiiiiiii..", "icccccciii", "iccyycci.i", "icccccci.i", "icccccciii", ".iiiiii..."], 3, 7, "story-tile__object", 1.55)}
      ${renderPagePattern(["i.i.ii.i", "i.i.ii.i", "i.i.ii.i", "i.i.ii.i", "i.i.ii.i", "i.i.ii.i", "iiiiiiii"], 29, 5, "story-tile__barcode", 1.08)}
    </svg>`;
  }

  if (storyId === "wifi-cantenna") {
    return `<svg class="story-tile__art" viewBox="0 0 42 24" aria-hidden="true" focusable="false">
      ${renderPagePattern([".cccccc.", "ciiiiiic", "cyyyyyyc", "cyiiiyyc", "cyyyyyyc", "ciiiiiic", ".cccccc.", "...ii...", "..iiii.."], 4, 4, "story-tile__object", 1.42)}
      ${renderPagePattern(["b......", ".b.....", "..b....", "...b...", "..b....", ".b.....", "b......"], 21, 3, "story-tile__motion story-tile__signal story-tile__signal--one", 1.12)}
      ${renderPagePattern(["s....", ".s...", "..s..", ".s...", "s...."], 32, 6, "story-tile__motion story-tile__signal story-tile__signal--two", 1.08)}
    </svg>`;
  }

  if (storyId === "pavlov-fish") {
    return `<svg class="story-tile__art" viewBox="0 0 42 24" aria-hidden="true" focusable="false">
      ${renderPagePattern(["..y..", ".yyy.", "yyyyy", ".yyy.", "..i..", "..i.."], 4, 2, "story-tile__motion story-tile__bell", 1.12)}
      ${renderPagePattern(["...p....", "..pp....", ".ppp....", "pppp....", ".ppp....", "..pp....", "...p...."], 15, 8, "story-tile__motion story-tile__fish", 1.08)}
      ${renderPagePattern(["..ssssss..", ".sbbbbbbss", "sbbbibbbbbs", "sbbbbbbbbbss", ".sbbbbbbss", "..ssssss.."], 18, 8.5, "story-tile__motion story-tile__fish", 1.08)}
      ${renderPagePattern(["s.s", ".s.", "s.s"], 36, 3, "story-tile__motion story-tile__bubbles", 1.02)}
    </svg>`;
  }

  return `<svg class="story-tile__art" viewBox="0 0 42 24" aria-hidden="true" focusable="false">
    ${renderPagePattern(["iiiiiiiiiiii", "iyyyyyyyyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iyiiiiiiyyyi", "iiiiiiiiiiii"], 3, 3, "story-tile__object", 1.25)}
    ${renderPagePattern([".ccc.", "ccicc", ".ccc."], 10.4, 5.45, "story-tile__motion story-tile__indicator", 0.92)}
    ${renderPagePattern([".ppp.", "ppipp", ".ppp."], 31, 7, "story-tile__motion story-tile__phantom", 1.16)}
  </svg>`;
}

function renderStories() {
  const tileTitles = {
    "nespresso-jailbreak": "The Nespresso Jailbreak",
    "wifi-cantenna": "The Cantenna Incident",
  };

  content.innerHTML = `<section class="story-tiles story-tiles--four" aria-label="Unsupervised stories">
    ${archiveEntries
      .map(
        (story) => `<a class="story-tile" href="/blog/${escapeHtml(story.id)}">
          <div class="story-tile__visual">${renderStoryTileArt(story.id)}</div>
          <div class="story-tile__copy">
            <h2>${escapeHtml(tileTitles[story.id] || story.title)}</h2>
            <p class="story-tile__teaser">${escapeHtml(story.teaser)}</p>
            ${story.readingTime ? `<p class="story-tile__reading-time">${escapeHtml(story.readingTime)}</p>` : ""}
          </div>
          <span class="story-tile__arrow" aria-hidden="true">&#8599;</span>
        </a>`,
      )
      .join("")}
    <article class="story-tile story-tile--wip" aria-label="The Pavlov'd Fish, work in progress">
      <div class="story-tile__visual">${renderStoryTileArt("pavlov-fish")}</div>
      <div class="story-tile__copy">
        <h2>The Pavlov'd Fish</h2>
        <p class="story-tile__teaser">Work in progress.</p>
      </div>
    </article>
  </section>`;
}

function renderCv() {
  content.innerHTML = `
    <div class="cv-grid">
      <section class="cv-copy">
        <p class="minor-heading">the full record</p>
        <p class="cv-lead">${escapeHtml(cvProfile.summary)}</p>
        <ul class="cv-highlights">${cvProfile.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>
      </section>
      <aside class="cv-actions">
        <a class="button-link" href="${escapeHtml(normalizeHref(contactLinks.resume))}" target="_blank" rel="noopener noreferrer">View complete CV<span aria-hidden="true">&#8599;</span></a>
        <a class="button-link button-link--quiet" href="${escapeHtml(normalizeHref(contactLinks.resume))}" download="Tejas-Naladala-CV.pdf">Download PDF<span aria-hidden="true">&#8595;</span></a>
        <p>${escapeHtml(cvProfile.updated)}</p>
      </aside>
    </div>`;
}

const renderers = { about: renderAbout, cv: renderCv, investing: renderInvesting, research: renderResearch, stories: renderStories, work: renderWork };
renderPageHeading();
renderers[page]?.();

try {
  window.sessionStorage.setItem("tejas-intro-seen", "1");
} catch {
  // Session storage is an enhancement; the pages work without it.
}
