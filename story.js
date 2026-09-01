import { archiveEntries } from "/content.js?v=20260901.10";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const storyPixelTones = Object.freeze({
  b: "page-tone-blue",
  c: "page-tone-coral",
  g: "page-tone-green",
  i: "page-tone-ink",
  p: "page-tone-pink",
  s: "page-tone-sky",
  y: "page-tone-gold",
});

function renderStoryPixels(pattern, x, y, className = "", step = 1) {
  const size = step - 0.08;
  const pixels = [];

  pattern.forEach((row, rowIndex) => {
    [...row].forEach((tone, columnIndex) => {
      const toneClass = storyPixelTones[tone];
      if (!toneClass) return;
      pixels.push(`<rect class="story-margin-doodle__pixel ${toneClass}" x="${x + columnIndex * step}" y="${y + rowIndex * step}" width="${size}" height="${size}" />`);
    });
  });

  return `<g class="${className}">${pixels.join("")}</g>`;
}

function renderStoryDoodle(kind) {
  let art = "";

  if (kind === "capsule-code") {
    art = renderStoryPixels(["..pppp..", ".piiiip.", "piiiiip.", "piiiiip.", ".ppppp..", "..iii..."], 4, 5, "", 1.08);
  } else if (kind === "unwrap") {
    art = renderStoryPixels(["..iiii..", ".ii..ii.", "ii.p..ii", "i......i", "i..p...i", "ii....ii", ".ii..ii.", "..iiii.."], 4.6, 4.7, "", 1.08);
  } else if (kind === "test-bench") {
    art = renderStoryPixels(["..pp....", ".piip...", "piiiip..", ".pppp...", "..ii....", "iiiiii.."], 4.2, 5, "", 1.08);
  } else if (kind === "wifi") {
    art = renderStoryPixels(["..........s", "........s.s", "......s.s.s", "....s.s.s.s", "..s.s.s.s.s", ".....bb....", "....bbbb..."], 3, 4.7, "", 0.96);
  } else if (kind === "cantenna") {
    art = renderStoryPixels(["..iiii....s", ".iyyyyi..s.s", "iyyyyyis.s.s", "iyyyyyi.s.s.", ".iiiiii..s..", "...ii......."], 3, 5, "", 0.96);
  } else if (kind === "chips") {
    art = renderStoryPixels(["..yy...y..", ".yyyy...y.", "..yy..yyy.", "y....yyyy.", ".y....yy..", "..yyy....."], 4, 5.2, "", 0.94);
  } else if (kind === "connector") {
    art = renderStoryPixels(["..iiii....", ".ibbbbi...", "iibbbbi...", "..iiii....", "...ii.....", "...iibbbb.", "...iibbbb."], 3.8, 4.7, "", 0.98);
  } else if (kind === "tripod") {
    art = renderStoryPixels([".iiiiii.", "iyyyyyyi", "iyyyyyyi", ".iiiiii.", "...ii...", "..i..i..", ".i....i.", "i......i"], 4.3, 4, "", 1.02);
  } else if (kind === "spectrum") {
    art = renderStoryPixels(["..........y", "........y.y", "......y.y.y", "....y.y.y.y", "..y.y.y.y.y", "yyyyyyyyyyy"], 3.2, 5, "", 1.02);
  } else if (kind === "brew") {
    art = renderStoryPixels([".p.p....", "p.p.....", "........", "..iiii..", ".iyyyyii.", "iyyyyyyi", "iyyyyyyi", ".iiiiii.", "..iiii.."], 4.3, 3.7, "", 1.05);
  } else if (kind === "elevator") {
    art = renderStoryPixels([".iiiiii.", "ibbbbbbi", "ib.ii.bi", "ib.ii.bi", "ib.ii.bi", "ib.ii.bi", "ibbbbbbi", ".iiiiii."], 4.4, 4.1, "", 0.96);
  } else if (kind === "badge") {
    art = renderStoryPixels(["..iiii..", ".ibbbbi.", "ibbyybbi", "ibbyybbi", "ibbggbbi", ".ibbbbi.", "..iiii..", "...ii..."], 4.3, 4.1, "", 0.94);
  } else if (kind === "packet") {
    art = renderStoryPixels(["b.......b", ".b.....b.", "..b...b..", "...b.b...", "....b....", "...b.b...", "..b...b..", ".b.....b."], 4.1, 4.1, "", 0.92);
  } else if (kind === "report") {
    art = renderStoryPixels([".iiiiii.", ".iyyyyii", ".iyiiyii", ".iyyyyii", ".iyiiyii", ".iyyyyii", ".iiiiii.", "...ii..."], 4.3, 4.1, "", 0.94);
  } else {
    art = renderStoryPixels(["p...s...g", "pp..ss.gg", "p...s...g", "....i....", "...iii...", "....i...."], 4.1, 5, "", 1.02);
  }

  return `<span class="story-margin-doodle story-margin-doodle--${escapeHtml(kind)}" aria-hidden="true"><svg viewBox="0 0 18 18" focusable="false">${art}</svg></span>`;
}

function renderStoryBlock(block) {
  if (block.type === "doodle") return renderStoryDoodle(block.art);
  if (block.type === "section-heading") return `<h2 class="story-entry__section-heading">${escapeHtml(block.text)}</h2>`;
  if (block.type === "list") return `<ul class="story-entry__list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  if (block.type === "beats") return `<div class="story-entry__beats">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  if (block.type === "dialogue") return `<blockquote class="story-entry__dialogue">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</blockquote>`;
  if (block.type === "status") return `<div class="story-entry__status">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  if (block.type === "pullquote") return `<blockquote class="story-entry__pullquote${block.accent ? " story-entry__pullquote--accent" : ""}"><p>${escapeHtml(block.text)}</p></blockquote>`;
  if (block.type === "question") return `<blockquote class="story-entry__question"><p>${escapeHtml(block.text)}</p></blockquote>`;
  if (block.type === "sequence") return `<div class="story-entry__sequence">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  if (block.type === "stack") return `<div class="story-entry__stack">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  if (block.type === "closing") return `<div class="story-entry__closing">${block.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
  return `<p>${escapeHtml(block.text)}</p>`;
}

function renderStoryBody(entry) {
  if (entry.blocks?.length) return entry.blocks.map(renderStoryBlock).join("");
  return entry.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

const slug = window.location.pathname.split("/").filter(Boolean).at(-1);
const storyIndex = archiveEntries.findIndex((entry) => entry.id === slug);
const story = archiveEntries[storyIndex];
const root = document.querySelector("#storyEntry");

if (!story) {
  root.innerHTML = `<section class="story-entry-missing"><p class="minor-heading">Unsupervised</p><h1>That story wandered off.</h1><a class="button-link" href="/blog">Back to the blog<span aria-hidden="true">&#8592;</span></a></section>`;
} else {
  document.title = `${story.title} | Unsupervised`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", story.teaser);

  root.innerHTML = `<article class="story-entry${story.blocks?.length ? " story-entry--longform" : ""}">
    <header class="story-entry__header">
      <p class="story-entry__brand" aria-label="Unsupervised"><span class="story-entry__brand-un" aria-hidden="true">"Un"</span><span class="story-entry__brand-supervised" aria-hidden="true">Supervised</span></p>
      <h1>${escapeHtml(story.title)}</h1>
      <p class="story-entry__teaser">${escapeHtml(story.teaser)}</p>
      ${story.readingTime ? `<p class="story-entry__reading-time">${escapeHtml(story.readingTime)}</p>` : ""}
    </header>
    <div class="story-entry__layout">
      <div class="story-entry__copy">${renderStoryBody(story)}</div>
    </div>
  </article>`;
}
