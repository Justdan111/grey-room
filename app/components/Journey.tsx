"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const marqueeImages = [
  "/cases/home.jpg",
  "/cases/services.jpg",
  "/cases/casestudy.jpg",
  "/cases/observatory.jpg",
  "/cases/kindred.jpg",
  "/cases/solene.jpg",
  "/cases/about.jpg",
];

type ServiceEntry = {
  title: string;
  tags: string[];
  quote: string;
  attribution: string;
  cta: string;
};

const services: ServiceEntry[] = [
  {
    title: "Retention Design",
    tags: ["email", "sms", "crm"],
    quote:
      "The Grey Room team gave us killer strategies that upped our game and turned retention into a revenue powerhouse.",
    attribution: "Maya Fielding, Co-founder, Meridian",
    cta: "grow customer retention",
  },
  {
    title: "Ecommerce UX",
    tags: ["shopify development", "design support", "digital experience"],
    quote:
      "Grey Room launched the Solene brand and website. Our brand stands out on shelves and our website stands out online. It's something everyone asks us about.",
    attribution: "Troy Bonde, Co-founder & CEO, Solene",
    cta: "explore websites",
  },
  {
    title: "Performance Creative",
    tags: ["paid social", "ugc", "motion"],
    quote:
      "Creative volume used to be our bottleneck. Now we test more angles in a month than we used to in a quarter — and the winners keep compounding.",
    attribution: "Amara Okafor, VP Growth, Halcyon",
    cta: "scale your creative",
  },
  {
    title: "Retail Media",
    tags: ["amazon", "tiktok shop", "marketplaces"],
    quote:
      "Grey Room took our marketplace business from an afterthought to a third of revenue, without cannibalizing DTC.",
    attribution: "Daniel Reyes, CEO, Atlas",
    cta: "win retail media",
  },
];

export default function Journey() {
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) return;
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 35,
      ease: "none",
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section className="bg-[#f5f4ef] text-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-6 py-32 sm:px-10">
        <div className="grid gap-20 lg:grid-cols-2">
          <div>
            <div className="lg:sticky lg:top-36">
              <h2 className="max-w-md font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl">
                We add impact across the entire customer journey.
              </h2>

              <div className="mt-10 flex items-center gap-1">
                <a
                  href="#contact"
                  className="rounded-md bg-[#0a0a0a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
                >
                  start a project
                </a>
                <a
                  href="#contact"
                  aria-label="start a project"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-black/5 ring-1 ring-black/15 transition-colors hover:bg-black/10"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path
                      d="M2 10L10 2M10 2H4M10 2V8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div className="relative mt-16 max-w-md overflow-hidden">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#f5f4ef] to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-[#f5f4ef] to-transparent"
                  aria-hidden
                />
                <div
                  ref={marqueeTrackRef}
                  className="flex w-max gap-3 will-change-transform"
                >
                  {[...marqueeImages, ...marqueeImages].map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt=""
                      draggable={false}
                      className="h-20 w-20 rounded-md object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-32">
            {services.map((s) => (
              <article key={s.title}>
                <h3 className="text-2xl font-medium tracking-tight">
                  {s.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/25 px-2.5 py-0.5 text-[11px] text-black/65"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-7 max-w-md text-sm leading-relaxed text-black/80">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm text-black/55">{s.attribution}</p>
                <a
                  href="#contact"
                  className="mt-7 inline-block rounded-md bg-black/5 px-4 py-2 text-xs font-medium text-black/80 ring-1 ring-black/10 transition-colors hover:bg-black/10"
                >
                  {s.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
