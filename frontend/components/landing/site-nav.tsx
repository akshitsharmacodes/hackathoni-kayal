"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AppSwitcher } from "@/components/brand/app-switcher";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { cn } from "@/lib/utils";

export const SECTIONS = [
  { id: "place", label: "The place" },
  { id: "problem", label: "Problem" },
  { id: "today", label: "Today" },
  { id: "how", label: "How it works" },
  { id: "benefits", label: "Who benefits" },
] as const;

/** Sticky top bar: gold reading-progress line + section links that highlight as you scroll. */
export function SiteNav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ scaleX }} className="h-[3px] origin-left bg-[color:var(--gold)]" aria-hidden />
      <nav
        aria-label="Page sections"
        className={cn(
          "transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-b border-border bg-background/85 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6">
          <a href="#top" aria-label="Kayal home" className="shrink-0">
            <Logo markClassName="size-8" />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map(({ id, label }) => (
              <li key={id} className="relative">
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={cn(
                    "relative z-10 block rounded-full px-3 py-1.5 text-sm transition-colors",
                    active === id ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </a>
                {active === id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary/10" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AppSwitcher />
            <Link
              href="/report"
              className="group hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
            >
              Try Kayal <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
