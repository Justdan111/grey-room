"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PageTile = {
  label: string;
  href: string;
  image: string;
};

const pages: PageTile[] = [
  { label: "Home", href: "/", image: "/cases/home.jpg" },
  { label: "Services", href: "/services", image: "/cases/services.jpg" },
  { label: "Case Studies", href: "/case-studies", image: "/cases/casestudy.jpg" },
  { label: "Process", href: "/process", image: "/cases/solene.jpg" },
  { label: "About", href: "/about", image: "/cases/about.jpg" },
  { label: "Careers", href: "/careers", image: "/cases/kindred.jpg" },
  { label: "Observatory", href: "/observatory", image: "/cases/observatory.jpg" },
];

const TILE_WIDTH = 900;
const TILE_HEIGHT = 520;
const ARC_RADIUS = 900;
const PERSPECTIVE = 2000;
const DRAG_SENSITIVITY = 1.6;
const WHEEL_SENSITIVITY = 2;
const VELOCITY_DECAY = 0.96;
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
  const targetCursorRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeTileRef = useRef(0);
  const [activeTileIndex, setActiveTileIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    const startIdx = Math.max(
      0,
      pages.findIndex((p) => p.href === activeHref)
    );
    cursorRef.current = startIdx;
    velocityRef.current = 0;
    targetCursorRef.current = null;
    activeTileRef.current = startIdx;
    queueMicrotask(() => setActiveTileIndex(startIdx));
  }, [open, activeHref]);

  useEffect(() => {
    if (!open) return;

    pages.forEach((p) => {
      router.prefetch(p.href);
    });

    const N = pages.length;
    const apply = () => {
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const pose = computePose(i, cursorRef.current, N);
        el.style.transform = `translate3d(${pose.x}px, 0, ${pose.depth}px) rotateY(${pose.angleDeg}deg)`;
        el.style.opacity = String(pose.opacity);
        el.style.zIndex = String(pose.zIndex);
      });
      const idx = ((Math.round(cursorRef.current) % N) + N) % N;
      if (idx !== activeTileRef.current) {
        activeTileRef.current = idx;
        setActiveTileIndex(idx);
      }
    };
    apply();

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      if (!isDraggingRef.current) {
        if (targetCursorRef.current !== null) {
          const target = targetCursorRef.current;
          const diff = target - cursorRef.current;
          if (Math.abs(diff) < 0.005) {
            cursorRef.current = target;
            targetCursorRef.current = null;
          } else {
            cursorRef.current += diff * 0.15 * dt;
          }
          apply();
        } else if (Math.abs(velocityRef.current) > 0.0003) {
          cursorRef.current += velocityRef.current * dt;
          velocityRef.current *= VELOCITY_DECAY;
          apply();
        }
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

  useEffect(() => {
    if (!open) return;
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const cursorDelta = (delta * WHEEL_SENSITIVITY) / TILE_WIDTH;
      cursorRef.current += cursorDelta;
      velocityRef.current = cursorDelta;
      targetCursorRef.current = null;
      const N = pages.length;
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const pose = computePose(i, cursorRef.current, N);
        el.style.transform = `translate3d(${pose.x}px, 0, ${pose.depth}px) rotateY(${pose.angleDeg}deg)`;
        el.style.opacity = String(pose.opacity);
        el.style.zIndex = String(pose.zIndex);
      });
      const idx = ((Math.round(cursorRef.current) % N) + N) % N;
      if (idx !== activeTileRef.current) {
        activeTileRef.current = idx;
        setActiveTileIndex(idx);
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [open]);

  const syncActiveTile = () => {
    const N = pages.length;
    const idx = ((Math.round(cursorRef.current) % N) + N) % N;
    if (idx !== activeTileRef.current) {
      activeTileRef.current = idx;
      setActiveTileIndex(idx);
    }
  };

  const applyImmediate = () => {
    tileRefs.current.forEach((el, i) => {
      if (!el) return;
      const pose = computePose(i, cursorRef.current, pages.length);
      el.style.transform = `translate3d(${pose.x}px, 0, ${pose.depth}px) rotateY(${pose.angleDeg}deg)`;
      el.style.opacity = String(pose.opacity);
      el.style.zIndex = String(pose.zIndex);
    });
    syncActiveTile();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    dragDistanceRef.current = 0;
    velocityRef.current = 0;
    targetCursorRef.current = null;
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const setTarget = (index: number) => {
    const N = pages.length;
    const mod = ((cursorRef.current % N) + N) % N;
    let diff = index - mod;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    targetCursorRef.current = cursorRef.current + diff;
    velocityRef.current = 0;
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
        className="absolute inset-x-0 top-20 flex touch-none justify-center select-none"
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
              className="group absolute inset-0 overflow-hidden bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5),0_10px_30px_-10px_rgba(0,0,0,0.35)]"
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

      <footer className="absolute inset-x-0 bottom-0 px-10 pb-10 sm:pr-20 sm:pb-14">
        <div className="ml-auto w-full max-w-xl">
          <nav className="grid grid-cols-4 gap-x-8 gap-y-3 text-[17px]">
            {pages.map((p, i) => {
              const isActive = i === activeTileIndex;
              return (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={onClose}
                  onMouseEnter={() => setTarget(i)}
                  className={`relative w-fit transition-colors ${
                    isActive
                      ? "font-medium text-black"
                      : "text-black/55 hover:text-black"
                  }`}
                >
                  {p.label}
                  {isActive && (
                    <span className="absolute top-full left-1/2 mt-1.5 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-20 grid grid-cols-4 gap-x-8 text-[13px] text-black/50">
            <a href="#" className="w-fit hover:text-black">
              Terms of service
            </a>
            <a href="#" className="col-start-3 w-fit hover:text-black">
              Privacy Policy
            </a>
            <span className="col-start-4 whitespace-nowrap">
              &copy; Grey Room, Inc &mdash; 2026
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
