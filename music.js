const MUSIC_VIDEO_ID = "ryqLCuUf_Pk";
const MUSIC_ORIGIN = "https://www.youtube-nocookie.com";
const MUSIC_VOLUME = 4;
const MODE_KEY = "tejas-music-enabled";
const UNLOCK_KEY = "tejas-music-unlocked";

let musicEnabled = window.sessionStorage.getItem(MODE_KEY) !== "off";
let musicUnlocked = window.sessionStorage.getItem(UNLOCK_KEY) === "1";
let playerReady = false;
let musicFrame = null;
let playerLoadHandle = null;

const musicButton = document.createElement("button");
musicButton.className = "ambient-audio-control";
musicButton.type = "button";
musicButton.innerHTML = '<span aria-hidden="true">&#9834;</span>';
document.body.append(musicButton);

function ensurePlayer() {
  if (musicFrame) return musicFrame;

  musicFrame = document.createElement("iframe");
  musicFrame.className = "ambient-audio-frame";
  musicFrame.id = "ambientMusicPlayer";
  musicFrame.title = "Pokemon FireRed and LeafGreen opening theme audio player";
  musicFrame.tabIndex = -1;
  musicFrame.allow = "autoplay; encrypted-media";
  musicFrame.loading = "lazy";
  musicFrame.referrerPolicy = "strict-origin-when-cross-origin";
  musicFrame.setAttribute("aria-hidden", "true");
  musicFrame.src = `${MUSIC_ORIGIN}/embed/${MUSIC_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${MUSIC_VIDEO_ID}&controls=0&disablekb=1&enablejsapi=1&playsinline=1&rel=0`;
  musicFrame.addEventListener("load", () => {
    musicFrame?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: musicFrame.id }), MUSIC_ORIGIN);
    window.setTimeout(() => {
      playerReady = true;
      syncPlayer();
    }, 450);
  });
  document.body.append(musicFrame);
  return musicFrame;
}

function cancelScheduledPlayer() {
  if (playerLoadHandle === null) return;

  if ("cancelIdleCallback" in window) {
    window.cancelIdleCallback(playerLoadHandle);
  } else {
    window.clearTimeout(playerLoadHandle);
  }
  playerLoadHandle = null;
}

function schedulePlayer() {
  if (musicFrame || playerLoadHandle !== null || !musicEnabled) return;

  const loadPlayer = () => {
    playerLoadHandle = null;
    if (!musicEnabled || document.hidden) return;
    ensurePlayer();
    syncPlayer();
    window.setTimeout(syncPlayer, 180);
  };

  playerLoadHandle = "requestIdleCallback" in window
    ? window.requestIdleCallback(loadPlayer, { timeout: 420 })
    : window.setTimeout(loadPlayer, 80);
}

function destroyPlayer() {
  cancelScheduledPlayer();
  if (!musicFrame) return;

  sendPlayerCommand("mute");
  sendPlayerCommand("pauseVideo");
  musicFrame.removeAttribute("src");
  musicFrame.remove();
  musicFrame = null;
  playerReady = false;
}

function sendPlayerCommand(command, args = []) {
  musicFrame?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: command, args }),
    MUSIC_ORIGIN,
  );
}

function updateButton() {
  musicButton.classList.toggle("is-muted", !musicEnabled);
  musicButton.setAttribute("aria-pressed", String(musicEnabled));
  musicButton.setAttribute("aria-label", musicEnabled ? "Mute background music" : "Play background music");
  musicButton.title = musicEnabled ? "Mute background music" : "Play background music";
}

function syncPlayer() {
  if (!playerReady) return;
  sendPlayerCommand("setVolume", [MUSIC_VOLUME]);

  if (musicEnabled) {
    sendPlayerCommand("playVideo");
    if (musicUnlocked) sendPlayerCommand("unMute");
  } else {
    sendPlayerCommand("mute");
    sendPlayerCommand("pauseVideo");
  }
}

function unlockMusic(event) {
  if (!musicEnabled || event.target?.closest?.("a, button, input, select, textarea, [role='button']")) return;
  musicUnlocked = true;
  window.sessionStorage.setItem(UNLOCK_KEY, "1");
  removeUnlockListeners();
  schedulePlayer();
}

function removeUnlockListeners() {
  for (const eventName of ["pointerdown", "keydown", "touchstart"]) {
    window.removeEventListener(eventName, unlockMusic, { capture: true });
  }
}

musicButton.addEventListener("click", (event) => {
  event.stopPropagation();
  musicEnabled = !musicEnabled;
  window.sessionStorage.setItem(MODE_KEY, musicEnabled ? "on" : "off");
  if (musicEnabled) musicUnlocked = true;
  if (musicEnabled) window.sessionStorage.setItem(UNLOCK_KEY, "1");
  if (musicEnabled) ensurePlayer();
  else destroyPlayer();
  updateButton();
  syncPlayer();
  window.setTimeout(syncPlayer, 180);
});

window.addEventListener("message", (event) => {
  if (!musicFrame || event.origin !== MUSIC_ORIGIN || event.source !== musicFrame.contentWindow) return;

  let message = event.data;
  if (typeof message === "string") {
    try {
      message = JSON.parse(message);
    } catch {
      return;
    }
  }

  if (message?.event !== "onReady" && message?.event !== "infoDelivery") return;
  playerReady = true;
  syncPlayer();
});

for (const eventName of ["pointerdown", "keydown", "touchstart"]) {
  window.addEventListener(eventName, unlockMusic, { capture: true, passive: true });
}

function prepareNavigation(event) {
  const link = event.target?.closest?.("a[href]");
  if (!link || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin === window.location.origin) destroyPlayer();
}

window.addEventListener("pointerdown", prepareNavigation, { capture: true, passive: true });
window.addEventListener("click", prepareNavigation, { capture: true, passive: true });

window.addEventListener("pagehide", destroyPlayer);

updateButton();
