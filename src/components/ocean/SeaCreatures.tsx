"use client";

interface CreatureConfig {
  id: number;
  art: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  scale: number;
}

const CREATURES: CreatureConfig[] = [
  { id: 0, art: "><>", x: 300, y: 600, duration: 25, delay: 0, opacity: 0.12, scale: 1.2 },
  { id: 1, art: "><((\u00B0>", x: 1800, y: 1400, duration: 30, delay: 5, opacity: 0.1, scale: 1 },
  { id: 2, art: "<\u00B0)))><", x: 3200, y: 900, duration: 28, delay: 3, opacity: 0.08, scale: 1.1 },
  { id: 3, art: "~\u2248><>\u2248~", x: 4200, y: 2000, duration: 35, delay: 8, opacity: 0.06, scale: 0.9 },
  { id: 4, art: "><(((\u00BA>", x: 700, y: 2800, duration: 32, delay: 12, opacity: 0.05, scale: 0.8 },
];

export default function SeaCreatures() {
  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {CREATURES.map((c) => (
        <div
          key={c.id}
          className="absolute font-mono select-none"
          style={{
            left: c.x,
            top: c.y,
            fontSize: `${14 * c.scale}px`,
            color: `rgba(200, 214, 229, ${c.opacity})`,
            animation: `drift ${c.duration}s ease-in-out infinite`,
            animationDelay: `${c.delay}s`,
            letterSpacing: "1px",
          }}
        >
          {c.art}
        </div>
      ))}
    </div>
  );
}
