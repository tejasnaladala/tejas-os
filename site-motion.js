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

function scheduleDecorativeSettlement() {
  window.clearTimeout(settlementTimer);
  document.documentElement.classList.toggle("decorative-motion-settled", reducedMotion.matches);
  if (!reducedMotion.matches) {
    settlementTimer = window.setTimeout(() => {
      document.documentElement.classList.add("decorative-motion-settled");
    }, 4_500);
  }
}

reducedMotion.addEventListener("change", () => {
  syncFaviconMotion();
  scheduleDecorativeSettlement();
});
document.addEventListener("visibilitychange", syncFaviconMotion);

syncFaviconMotion();
scheduleDecorativeSettlement();
