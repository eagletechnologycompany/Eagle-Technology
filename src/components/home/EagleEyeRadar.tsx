"use client";

import React, { useState, useRef } from "react";
import { EagleLogo } from "@/components/ui/EagleLogo";

export function EagleEyeRadar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 18, y: y * 18 });
  }

  function handleMouseLeave() {
    setMousePos({ x: 0, y: 0 });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Dynamic Concentric Radar Rings */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {/* Ring 1 - Outer */}
        <div
          className="absolute h-72 w-72 rounded-full border border-[var(--color-brown-gold)]/15 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
          }}
        />
        {/* Ring 2 - Middle */}
        <div
          className="absolute h-56 w-56 rounded-full border border-[var(--color-brown-gold)]/25 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
          }}
        />
        {/* Ring 3 - Inner */}
        <div
          className="absolute h-40 w-40 rounded-full border border-dashed border-[var(--color-brown-gold)]/35 transition-transform duration-300 ease-out animate-[spin_60s_linear_infinite]"
          style={{
            transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px)`,
          }}
        />

        {/* Ambient Focal Glow */}
        <div
          className="absolute h-48 w-48 rounded-full bg-[var(--color-brown-gold)]/10 blur-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)`,
          }}
        />
      </div>

      {/* Center Eagle Logo with Subtle Tilt */}
      <div
        className="relative z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        <EagleLogo
          size={210}
          color="var(--color-white)"
          accentColor="var(--color-brown-gold)"
        />
      </div>

      {/* Telemetry Status Line */}
      <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-[10px] font-mono tracking-wider text-[var(--color-brown-gold)] border border-white/5 backdrop-blur-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>RADAR_TELEMETRY: OPTIMAL</span>
        <span className="text-stone-500">|</span>
        <span>LAT: 9.03° N · LON: 38.74° E</span>
      </div>
    </div>
  );
}
