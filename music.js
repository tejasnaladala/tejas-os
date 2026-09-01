const MOTION_KEY = "tejas-decorative-motion";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const faviconLink = document.querySelector('link[rel~="icon"]');
const faviconReactor = '<rect width="32" height="32" fill="#f4f1e8"/><path fill="#11110f" d="M13 3h6v2h2v3h-2v2h4v3h2v12h-3v4h-4v-4h-4v4h-4v-4H7V13h2v-3h4V8h-2V5h2zm-2 10v10h10V13z"/><rect x="13" y="6" width="6" height="2" fill="#78b8e7"/><rect x="11" y="14" width="2" height="2" fill="#ed93aa"/><rect x="19" y="20" width="2" height="2" fill="#61ad58"/>';
const faviconSparks = [
  '<rect x="15" y="20" width="2" height="2" fill="#2f6fc7"/><rect x="3" y="17" width="2" height="2" fill="#ed93aa"/><rect x="27" y="11" width="2" height="2" fill="#efb548"/>',
  '<rect x="15" y="17" width="2" height="2" fill="#78b8e7"/><rect x="12" y="20" width="2" height="2" fill="#efb548"/><rect x="4" y="14" width="2" height="2" fill="#ed93aa"/>',
  '<rect x="15" y="14" width="2" height="2" fill="#ed93aa"/><rect x="18" y="17" width="2" height="2" fill="#61ad58"/><rect x="26" y="8" width="2" height="2" fill="#2f6fc7"/>',
  '<rect x="15" y="11" width="2" height="2" fill="#efb548"/><rect x="14" y="1" width="2" height="2" fill="#efb548"/><rect x="11" y="3" width="2" height="2" fill="#e96470"/><rect x="18" y="2" width="2" height="2" fill="#78b8e7"/><rect x="27" y="14" width="2" height="2" fill="#61ad58"/>',
];
const faviconFrames = faviconSparks.map((sparks) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">${faviconReactor}${sparks}</svg>`)}`,
);

let motionPaused = reducedMotion.matches || window.sessionStorage.getItem(MOTION_KEY) === "paused";
let settlementTimer = 0;
let faviconTimer = 0;
let faviconFrame = 0;

function paintFavicon() {
  if (!faviconLink) return;
  faviconLink.href = faviconFrames[faviconFrame];
  faviconFrame = (faviconFrame + 1) % faviconFrames.length;
}

function syncFaviconMotion() {
  window.clearInterval(faviconTimer);
  faviconTimer = 0;
  faviconFrame = 0;
  paintFavicon();
  if (reducedMotion.matches || document.hidden || !faviconLink) return;
  faviconTimer = window.setInterval(paintFavicon, 360);
}

const motionButton = document.createElement("button");
motionButton.className = "decorative-motion-control";
motionButton.type = "button";
document.body.append(motionButton);

function updateMotionState({ persist = true } = {}) {
  document.documentElement.classList.toggle("decorative-motion-settled", motionPaused);
  motionButton.classList.toggle("is-muted", motionPaused);
  motionButton.setAttribute("aria-pressed", String(motionPaused));
  motionButton.setAttribute("aria-label", motionPaused ? "Play decorative motion" : "Pause decorative motion");
  motionButton.title = motionPaused ? "Play decorative motion" : "Pause decorative motion";
  motionButton.innerHTML = motionPaused
    ? '<span aria-hidden="true">&#9654;</span>'
    : '<span aria-hidden="true">&#10074;&#10074;</span>';

  if (persist) window.sessionStorage.setItem(MOTION_KEY, motionPaused ? "paused" : "playing");
}

function settleDecorativeMotion() {
  motionPaused = true;
  updateMotionState({ persist: false });
}

motionButton.addEventListener("click", () => {
  window.clearTimeout(settlementTimer);
  motionPaused = !motionPaused;
  updateMotionState();
});

reducedMotion.addEventListener("change", (event) => {
  syncFaviconMotion();
  if (!event.matches) return;
  window.clearTimeout(settlementTimer);
  motionPaused = true;
  updateMotionState({ persist: false });
});

document.addEventListener("visibilitychange", syncFaviconMotion);

updateMotionState({ persist: false });
syncFaviconMotion();
if (!motionPaused) settlementTimer = window.setTimeout(settleDecorativeMotion, 4500);
