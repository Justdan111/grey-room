"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useHeroTheme } from "./HeroTheme";

type CaseTile = {
  client: string;
  video: string;
};

const cases: CaseTile[] = [
  { client: "MERIDIAN", video: "/cases/meridian.mp4" },
  { client: "SOLENE", video: "/cases/solene.mp4" },
  { client: "HALCYON", video: "/cases/halcyon.mp4" },
  { client: "KINDRED", video: "/cases/kindred.mp4" },
  { client: "ATLAS", video: "/cases/atlas.mp4" },
];

const capabilities = [
  "brand identity",
  "retention design",
  "lifecycle marketing",
  "performance creative",
  "conversion audit",
  "ecommerce ux",
  "content systems",
  "creator ops",
  "landing systems",
  "product marketing",
  "retail media",
  "customer research",
];

export default function Hero() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { setBgDark } = useHeroTheme();
  const isDark = hoveredIndex !== null;

  const bgVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement | null>(null);
  const caseNameRef = useRef<HTMLDivElement | null>(null);
  const marqueeMaskLeftRef = useRef<HTMLDivElement | null>(null);
  const marqueeMaskRightRef = useRef<HTMLDivElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) return;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 45,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  useEffect(() => {
    setBgDark(isDark);
  }, [isDark, setBgDark]);

  useEffect(() => {
    bgVideoRefs.current.forEach((v, i) => {
      if (!v) return;
      gsap.to(v, {
        opacity: hoveredIndex === i ? 1 : 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }, [hoveredIndex]);

  useEffect(() => {
    if (quoteRef.current) {
      gsap.to(quoteRef.current, {
        opacity: isDark ? 0 : 1,
        y: isDark ? -8 : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (caseNameRef.current) {
      gsap.to(caseNameRef.current, {
        opacity: isDark ? 1 : 0,
        y: isDark ? 0 : 8,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    [marqueeMaskLeftRef.current, marqueeMaskRightRef.current].forEach((m) => {
      if (!m) return;
      gsap.to(m, {
        opacity: isDark ? 0 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, [isDark]);

  useEffect(() => {
    tileRefs.current.forEach((t, i) => {
      if (!t) return;
      const isVisible = hoveredIndex === null || hoveredIndex === i;
      gsap.to(t, {
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.88,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [hoveredIndex]);

  return (
    <section className="relative flex h-svh w-full flex-col overflow-hidden bg-[#f5f4ef] text-[#0a0a0a]">
      <div className="absolute inset-0">
        {cases.map((c, i) => (
          <video
            key={c.client}
            ref={(el) => {
              bgVideoRefs.current[i] = el;
            }}
            src={c.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-14 px-6 pt-24 pb-8">
        <div className="relative flex w-full items-center justify-center">
          <div ref={quoteRef}>
            <blockquote className="max-w-3xl text-center">
              <p className="font-serif text-3xl leading-[1.15] tracking-tight sm:text-4xl md:text-[42px]">
                &ldquo;A studio built for how modern brands actually grow &mdash;
                rigorous design paired with the iteration speed of a product
                team.&rdquo;
              </p>
              <footer className="mt-8 text-sm font-medium tracking-wide text-black/80">
                &mdash; Modern Retail
              </footer>
            </blockquote>
          </div>

          <div
            ref={caseNameRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
          >
            {hoveredIndex !== null && (
              <span className="font-serif text-6xl tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-7xl md:text-8xl">
                {cases[hoveredIndex].client}
              </span>
            )}
          </div>
        </div>

        <div
          className="relative w-full max-w-2xl overflow-hidden"
          aria-label="What we do"
        >
          <div
            ref={marqueeMaskLeftRef}
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-[#f5f4ef] to-transparent"
            aria-hidden
          />
          <div
            ref={marqueeMaskRightRef}
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-[#f5f4ef] to-transparent"
            aria-hidden
          />
          <div
            ref={marqueeTrackRef}
            className="flex w-max gap-2 whitespace-nowrap will-change-transform"
          >
            {[...capabilities, ...capabilities].map((cap, i) => (
              <span
                key={i}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300 ${
                  isDark
                    ? "border-white/35 bg-black/15 text-white/90 backdrop-blur-sm"
                    : "border-black/20 text-black/70"
                }`}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="relative z-10 grid w-full shrink-0 grid-cols-5"
        style={{ height: "clamp(150px, 22vh, 240px)" }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {cases.map((c, i) => (
          <div
            key={c.client}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            className="group relative cursor-pointer overflow-hidden"
          >
            <video
              src={c.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div
              className={`pointer-events-none absolute inset-0 border-2 transition-colors ${
                hoveredIndex === i ? "border-white/80" : "border-transparent"
              }`}
            />
            <div className="absolute inset-x-3 bottom-3 text-[10px] font-medium tracking-[0.28em] text-white uppercase">
              {c.client}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
