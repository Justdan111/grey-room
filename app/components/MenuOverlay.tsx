"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PageTile = {
  label: string;
  href: string;
  image: string;
};

const pages: PageTile[] = [
  { label: "Home", href: "/", image: "/cases/meridian.jpg" },
  { label: "Services", href: "/services", image: "/cases/service.jpg" },
  { label: "Case Studies", href: "/case-studies", image: "/cases/halcyon.jpg" },
  { label: "Process", href: "/process", image: "/cases/solene.jpg" },
  { label: "About", href: "/about", image: "/cases/about.jpg" },
  { label: "Careers", href: "/careers", image: "/cases/kindred.jpg" },
  { label: "Observatory", href: "/observatory", image: "/cases/atlas.jpg" },
];

const TILE_WIDTH = 520;
const TILE_HEIGHT = 340;
const ARC_RADIUS = 1100;
const PERSPECTIVE = 1400;
const DRAG_SENSITIVITY = 1;
const CLICK_THRESHOLD = 6;

const angleStepDeg =
  (2 * Math.atan(TILE_WIDTH / (2 * ARC_RADIUS)) * 180) / Math.PI;
const angleStepRad = (angleStepDeg * Math.PI) / 180;

type TilePose = {
  x: number;
  depth: number;
  angleDeg: number;
  opacity: number;
  zIndex: number;
};

function computePose(index: number, cursor: number, n: number): TilePose {
  let d = index - cursor;
  d = ((d + n / 2) % n + n) % n - n / 2;

  let x: number;
  let depth: number;
  let angleDeg: number;
  let opacity: number;

  if (d <= 0) {
    const alpha = d * angleStepRad;
    x = ARC_RADIUS * Math.sin(alpha);
    depth = -ARC_RADIUS * Math.cos(alpha);
    angleDeg = -d * angleStepDeg;
    const absAlphaDeg = Math.abs(alpha) * (180 / Math.PI);
    opacity = absAlphaDeg > 80 ? Math.max(0, 1 - (absAlphaDeg - 80) / 30) : 1;
  } else {
    x = d * TILE_WIDTH;
    depth = -ARC_RADIUS;
    angleDeg = 0;
    opacity = d > 2.5 ? Math.max(0, 1 - (d - 2.5) / 1) : 1;
  }

  const zIndex = Math.round(1000 - Math.abs(d) * 5);
  return { x, depth, angleDeg, opacity, zIndex };
}

export default function MenuOverlay({
  open,
  onClose,
  activeHref = "/",
}: {
  open: boolean;
  onClose: () => void;
  activeHref?: string;
}) {
  const router = useRouter();
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    cursorRef.current = 0;
    velocityRef.current = 0;
  }, [open]);

  useEffect(() => {
    if (!open) return;

    pages.forEach((p) => {
      router.prefetch(p.href);
    });

    const apply = () => {
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const pose = computePose(i, cursorRef.current, pages.length);
        el.style.transform = `translate3d(${pose.x}px, 0, ${pose.depth}px) rotateY(${pose.angleDeg}deg)`;
        el.style.opacity = String(pose.opacity);
        el.style.zIndex = String(pose.zIndex);
      });
    };
    apply();

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.0005) {
        cursorRef.current += velocityRef.current * dt;
        velocityRef.current *= 0.92;
        apply();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, router]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const applyImmediate = () => {
    tileRefs.current.forEach((el, i) => {
      if (!el) return;
      const pose = computePose(i, cursorRef.current, pages.length);
      el.style.transform = `translate3d(${pose.x}px, 0, ${pose.depth}px) rotateY(${pose.angleDeg}deg)`;
      el.style.opacity = String(pose.opacity);
      el.style.zIndex = String(pose.zIndex);
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    stageRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    dragDistanceRef.current += Math.abs(dx);
    const cursorDelta = (-dx * DRAG_SENSITIVITY) / TILE_WIDTH;
    cursorRef.current += cursorDelta;
    velocityRef.current = cursorDelta;
    applyImmediate();
  };
  const endDrag = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleTileClick = (href: string) => {
    if (dragDistanceRef.current > CLICK_THRESHOLD) return;
    onClose();
    router.push(href);
  };

  return (
    <div
      className={`fixed inset-0 z-100 bg-[#f5f4ef] text-[#0a0a0a] transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
    >
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          onClick={onClose}
          className="text-base font-medium tracking-tight"
        >
          Grey Room
          <sup className="relative top-[-0.7em] ml-0.5 text-[0.55em]">°</sup>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0a0a0a] text-white transition-transform hover:scale-105"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path
              d="M1 1L11 11M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <a
          href="#contact"
          onClick={onClose}
          className="rounded-full border border-black/30 px-4 py-1.5 text-xs font-medium tracking-wide transition-colors hover:bg-black hover:text-white"
        >
          start a project
        </a>
      </header>

      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="absolute inset-x-0 top-[18vh] flex touch-none justify-center select-none"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <div
          className="relative cursor-grab active:cursor-grabbing"
          style={{
            width: `${TILE_WIDTH}px`,
            height: `${TILE_HEIGHT}px`,
            transformStyle: "preserve-3d",
          }}
        >
          {pages.map((p, i) => (
            <div
              key={p.href}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              onClick={() => handleTileClick(p.href)}
              className="group absolute inset-0 overflow-hidden bg-black"
              style={{
                backfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.label}
                draggable={false}
                className="pointer-events-none h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                <p className="font-serif text-3xl leading-none tracking-tight">
                  {p.label}
                </p>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors group-hover:bg-white/30">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                    <path
                      d="M2 5H8M8 5L5 2M8 5L5 8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-10 pb-8">
        <nav className="flex flex-wrap items-start justify-center gap-x-14 gap-y-4 text-sm">
          {pages.map((p) => {
            const isActive = p.href === activeHref;
            return (
              <Link
                key={p.href}
                href={p.href}
                onClick={onClose}
                className="relative text-black/80 transition-colors hover:text-black"
              >
                {p.label}
                {isActive && (
                  <span className="absolute top-full left-1/2 mt-1 block h-1 w-1 -translate-x-1/2 rounded-full bg-black" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 flex items-center justify-between text-xs text-black/50">
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">
              Terms of service
            </a>
            <a href="#" className="hover:text-black">
              Privacy Policy
            </a>
          </div>
          <div>Copyright Grey Room, Inc &mdash; 2026</div>
        </div>
      </footer>
    </div>
  );
}
