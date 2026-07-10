"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useHeroTheme } from "./HeroTheme";
import MenuOverlay from "./MenuOverlay";

type Menu = "services" | "about" | null;

type MenuItemData = { title: string; desc: string };

const services: { left: MenuItemData[]; right: MenuItemData[] } = {
  left: [
    { title: "All services", desc: "Every discipline under one roof" },
    {
      title: "Retention design",
      desc: "Lifecycle systems for compounding revenue",
    },
    {
      title: "Performance creative",
      desc: "Static, motion, and UGC built for scale",
    },
    { title: "Retail media", desc: "Amazon, TikTok Shop, and marketplaces" },
  ],
  right: [
    { title: "Brand identity", desc: "Systems that outlast the campaign" },
    { title: "Ecommerce UX", desc: "Store systems tuned to convert" },
    { title: "Content systems", desc: "Modular content at production speed" },
    { title: "AI operations", desc: "Modern workflows for lean teams" },
  ],
};

const about: MenuItemData[] = [
  { title: "Studio", desc: "Who we are and how we think" },
  { title: "Thesis", desc: "Our take on modern brand building" },
  { title: "Process", desc: "How we work with founders" },
  { title: "Careers", desc: "Open roles at the studio" },
];

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      className={`ml-1.5 inline-block transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <path
        d="M1.5 3L4 5.5L6.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuItem({ title, desc }: MenuItemData) {
  return (
    <a href="#" className="group block">
      <h3 className="text-sm font-medium text-white/95 transition-colors group-hover:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-white/50">{desc}</p>
    </a>
  );
}

function SidePanel({
  label,
  video,
  cta,
}: {
  label: string;
  video: string;
  cta: string;
}) {
  return (
    <div className="w-75 shrink-0 rounded-lg bg-white/4 p-3">
      <p className="text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
        {label}
      </p>
      <div className="mt-2 overflow-hidden rounded-md">
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-44 w-full object-cover"
        />
      </div>
      <a
        href="#"
        className="mt-3 flex items-center gap-2 text-xs text-white/90 hover:text-white"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <svg width="7" height="7" viewBox="0 0 8 8" className="fill-white">
            <path d="M1 0 L1 8 L7 4 Z" />
          </svg>
        </span>
        <span>{cta}</span>
      </a>
    </div>
  );
}

export default function Nav() {
  const [openMenu, setOpenMenu] = useState<Menu>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bgIsDark } = useHeroTheme();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showMenuButton = scrolled || overlayOpen;

  const open = (menu: Exclude<Menu, null>) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };

  const textCls = bgIsDark ? "text-white/95" : "text-black/85";
  const hoverCls = bgIsDark ? "hover:text-white" : "hover:text-black";
  const ctaCls = bgIsDark
    ? "border-white/30 hover:bg-white hover:text-black"
    : "border-black/30 hover:bg-black hover:text-white";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-sm transition-colors duration-300 sm:px-10 ${textCls}`}
      >
        <Link href="/" className="text-base font-medium tracking-tight">
          Grey Room
          <sup className="relative top-[-0.7em] ml-0.5 text-[0.55em]">°</sup>
        </Link>

        <nav
          className={`hidden items-center gap-10 transition-opacity duration-300 md:flex ${
            showMenuButton ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          aria-hidden={showMenuButton}
        >
          <button
            type="button"
            onMouseEnter={() => open("services")}
            onMouseLeave={close}
            className={`flex items-center transition-colors ${hoverCls}`}
          >
            services
            <Caret open={openMenu === "services"} />
          </button>
          <Link href="/case-studies" className={`transition-colors ${hoverCls}`}>
            case studies
          </Link>
          <button
            type="button"
            onMouseEnter={() => open("about")}
            onMouseLeave={close}
            className={`flex items-center transition-colors ${hoverCls}`}
          >
            about
            <Caret open={openMenu === "about"} />
          </button>
          <a href="#notes" className={`transition-colors ${hoverCls}`}>
            field notes
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOverlayOpen((v) => !v)}
          aria-label={overlayOpen ? "Close menu" : "Open menu"}
          className={`absolute left-1/2 hidden h-9 -translate-x-1/2 items-center justify-center rounded-md px-4 text-xs font-medium tracking-wide transition-all duration-300 md:flex ${
            bgIsDark ? "bg-white text-black" : "bg-[#0a0a0a] text-white"
          } ${
            showMenuButton
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-90 opacity-0"
          }`}
        >
          {overlayOpen ? "close" : "menu"}
        </button>

        <a
          href="#contact"
          className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${ctaCls}`}
        >
          start a project
        </a>
      </header>

      <div
        onMouseEnter={() => open("services")}
        onMouseLeave={close}
        className={`fixed top-16 left-1/2 z-40 -translate-x-1/2 transition-all duration-200 ${
          openMenu === "services"
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="w-230 rounded-2xl bg-neutral-900/95 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
          <p className="text-xs font-medium tracking-wide text-white/50">
            Grey Room services
          </p>
          <div className="mt-6 flex gap-10">
            <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-5">
              {services.left.map((item) => (
                <MenuItem key={item.title} {...item} />
              ))}
              {services.right.map((item) => (
                <MenuItem key={item.title} {...item} />
              ))}
            </div>
            <SidePanel
              label="What we do"
              video="/cases/service.mp4"
              cta="Explore every service"
            />
          </div>
        </div>
      </div>

      <div
        onMouseEnter={() => open("about")}
        onMouseLeave={close}
        className={`fixed top-16 left-1/2 z-40 -translate-x-1/2 transition-all duration-200 ${
          openMenu === "about"
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="w-175 rounded-2xl bg-neutral-900/95 p-8 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
          <p className="text-xs font-medium tracking-wide text-white/50">
            About Grey Room
          </p>
          <div className="mt-6 flex gap-10">
            <div className="flex-1 space-y-5">
              {about.map((item) => (
                <MenuItem key={item.title} {...item} />
              ))}
            </div>
            <SidePanel
              label="Working here"
              video="/cases/about.mp4"
              cta="Come build with us"
            />
          </div>
        </div>
      </div>

      <MenuOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        activeHref={pathname}
      />
    </>
  );
}
