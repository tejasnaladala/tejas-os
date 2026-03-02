export const SOUND_SPRITES = {
  boot: { start: 0, duration: 150 },
  success: { start: 200, duration: 300 },
  windowOpen: { start: 600, duration: 80 },
  windowClose: { start: 750, duration: 60 },
  error: { start: 900, duration: 200 },
  click: { start: 1200, duration: 50 },
} as const;

export type SoundName = keyof typeof SOUND_SPRITES;
