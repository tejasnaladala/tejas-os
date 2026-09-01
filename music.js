const MOTION_KEY = "tejas-decorative-motion";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let motionPaused = reducedMotion.matches || window.sessionStorage.getItem(MOTION_KEY) === "paused";
let settlementTimer = 0;

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
  if (!event.matches) return;
  window.clearTimeout(settlementTimer);
  motionPaused = true;
  updateMotionState({ persist: false });
});

updateMotionState({ persist: false });
if (!motionPaused) settlementTimer = window.setTimeout(settleDecorativeMotion, 4500);
