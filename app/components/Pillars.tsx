"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeroTheme } from "./HeroTheme";

gsap.registerPlugin(ScrollTrigger);

type Pillar = {
  title: string;
  label: string;
  body: string[];
};

const pillars: Pillar[] = [
  {
    title: "Creative Systems",
    label: "creative systems",
    body: [
      "Creative is the engine, not the afterthought. We build modular brand and content systems that ship fast and compound — design, motion, and production under one roof.",
      "Every asset is built to be recombined: one shoot becomes a quarter of content across paid, owned, and retail.",
    ],
  },
  {
    title: "Retention & Lifecycle",
    label: "retention & lifecycle",
    body: [
      "Acquisition gets the headlines; retention pays the bills. We design lifecycle systems across email, SMS, and CRM that turn first orders into durable revenue.",
      "Flows, campaigns, and segmentation are treated as one system — measured on contribution, not opens.",
    ],
  },
  {
    title: "Performance & Measurement",
    label: "performance",
    body: [
      "We manage full-funnel media across DTC, Amazon, TikTok Shop, and retail — and measure it in the language of the P&L.",
      "Our frameworks connect spend to contribution profit and EBITDA, so growth decisions are finance decisions.",
    ],
  },
  {
    title: "AI Operations",
    label: "ai operations",
    body: [
      "We built the studio for a post-AI world. Human and AI teams working together — modern workflows that give lean teams maximum leverage.",
      "We've consistently pushed what the future of a marketing team looks like — and what it can deliver.",
    ],
  },
];

function CircledNumber({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-[11px]">
      {n}
    </span>
  );
}

export default function Pillars() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { setBgDark } = useHeroTheme();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const sphere = sphereRef.current;
    const svg = svgRef.current;
    if (!section || !track || !sphere || !svg) return;

    const ctx = gsap.context(() => {
      gsap.to(sphere, {
        y: () => track.offsetHeight - sphere.offsetHeight,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(svg, {
        rotation: 540,
        ease: "none",
        transformOrigin: "50% 50%",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top 72px",
        end: "bottom 72px",
        onEnter: () => setBgDark(true),
        onLeave: () => setBgDark(false),
        onEnterBack: () => setBgDark(true),
        onLeaveBack: () => setBgDark(false),
      });
    }, section);

    return () => ctx.revert();
  }, [setBgDark]);

  useEffect(() => {
    if (!labelRef.current) return;
    gsap.fromTo(
      labelRef.current,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [active]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] text-[#f5f4ef]"
    >
      <div className="mx-auto max-w-6xl px-6 py-40 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            {pillars.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="flex min-h-[65vh] max-w-md flex-col justify-center"
              >
                <CircledNumber n={i + 1} />
                <h3 className="mt-5 font-serif text-3xl tracking-tight sm:text-4xl">
                  {p.title}
                </h3>
                {p.body.map((para) => (
                  <p
                    key={para.slice(0, 24)}
                    className="mt-5 text-sm leading-relaxed text-white/65"
                  >
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div ref={trackRef} className="relative hidden lg:block">
            <div
              ref={sphereRef}
              className="absolute top-0 right-0 w-[420px]"
              style={{ willChange: "transform" }}
            >
              <svg
                ref={svgRef}
                viewBox="0 0 400 400"
                className="h-auto w-full text-white/35"
                style={{ willChange: "transform" }}
                aria-hidden
              >
                <g fill="none" stroke="currentColor" strokeWidth="0.7">
                  <circle cx="200" cy="200" r="198" />
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="198"
                    ry="72"
                    transform="rotate(22 200 200)"
                  />
                  <ellipse
                    cx="200"
                    cy="200"
                    rx="198"
                    ry="130"
                    transform="rotate(-26 200 200)"
                  />
                  <ellipse cx="200" cy="200" rx="95" ry="198" />
                </g>
              </svg>

              <div
                ref={labelRef}
                className="absolute top-1/2 right-0 flex -translate-y-1/2 translate-x-1/4 items-center gap-1.5 rounded-full border border-white/40 bg-[#0a0a0a] py-1 pr-3 pl-1.5 text-xs whitespace-nowrap"
              >
                <CircledNumber n={active + 1} />
                <span>{pillars[active].label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
