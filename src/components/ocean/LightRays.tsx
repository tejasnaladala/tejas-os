"use client";

export default function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: -100,
            left: 400 + i * 800,
            width: 200,
            height: 1200,
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)`,
            transform: `rotate(${12 + i * 5}deg)`,
            animation: `light-ray ${20 + i * 5}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}
