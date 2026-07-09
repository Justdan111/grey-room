"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { caseStudies } from "../case-studies/data";
import { useHeroTheme } from "./HeroTheme";

export default function CaseStudiesHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { setBgDark } = useHeroTheme();
  const router = useRouter();

  const stackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);
  const infoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBgDark(false);
  }, [setBgDark]);

  useEffect(() => {
    stackRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === activeIndex;
      el.style.zIndex = isActive ? "2" : "1";
      gsap.to(el, {
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.96,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    caseStudies.forEach((_, i) => {
      const front = frontRefs.current[i];
      const back = backRefs.current[i];
      const spread = isHovering && i === activeIndex;
      if (front) {
        gsap.to(front, {
          x: spread ? -18 : 0,
          y: spread ? 14 : 0,
          rotate: spread ? -4 : -2,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      if (back) {
        gsap.to(back, {
          x: spread ? 22 : 0,
          y: spread ? -16 : 0,
          rotate: spread ? 5 : 2.5,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    });
  }, [isHovering, activeIndex]);

  const active = caseStudies[activeIndex];

  return (
    <section className="min-h-svh w-full bg-[#f5f4ef] text-[#0a0a0a]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 pt-36 pb-20 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <nav aria-label="Case studies">
          <ul onMouseLeave={() => setIsHovering(false)}>
            {caseStudies.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`/case-studies/${c.slug}`}
                  onMouseEnter={() => {
                    setActiveIndex(i);
                    setIsHovering(true);
                  }}
                  onFocus={() => setActiveIndex(i)}
                  className={`block text-5xl leading-[1.22] font-medium tracking-tight transition-colors duration-300 sm:text-6xl lg:text-[64px] ${
                    i === activeIndex ? "text-[#0a0a0a]" : "text-[#0a0a0a]/25"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="cursor-pointer select-none"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => router.push(`/case-studies/${active.slug}`)}
          role="link"
          aria-label={`View the ${active.name} case study`}
        >
          <div className="relative aspect-16/11 w-full">
            {caseStudies.map((c, i) => (
              <div
                key={c.slug}
                ref={(el) => {
                  stackRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
                aria-hidden={i !== activeIndex}
              >
                <div
                  ref={(el) => {
                    backRefs.current[i] = el;
                  }}
                  className="absolute top-0 right-0 aspect-4/3 w-[58%] rotate-[2.5deg] overflow-hidden rounded-2xl shadow-lg will-change-transform"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div
                  ref={(el) => {
                    frontRefs.current[i] = el;
                  }}
                  className="absolute top-[12%] left-0 aspect-3/2 w-[64%] -rotate-2 overflow-hidden rounded-2xl shadow-2xl will-change-transform"
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
                </div>
              </div>
            ))}
          </div>

          <div ref={infoRef} className="mt-10 max-w-md">
            <p className="text-lg leading-snug">{active.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-black/25 px-3 py-1 text-xs font-medium text-black/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
