"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/land-for-sale", label: "Land for Sale" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

const DARK_HERO_ROUTES = new Set<string>(["/"]);

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDarkHeroPage = DARK_HERO_ROUTES.has(pathname);
  const overlayDark = isDarkHeroPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const wrapperClass = overlayDark
    ? "bg-transparent"
    : "bg-white border-b border-paper-edge";

  const logoColor = overlayDark
    ? "text-paper hover:text-accent"
    : "text-accent hover:text-accent-deep";

  const navLinkColor = (active: boolean) => {
    if (overlayDark) {
      return active ? "text-accent" : "text-paper hover:text-accent";
    }
    return active ? "text-accent" : "text-ink hover:text-accent";
  };

  const navLinkSize = overlayDark ? "text-[15px]" : "text-sm";
  const navTextShadow = overlayDark ? "text-shadow-nav" : "";
  const menuButtonColor = overlayDark ? "text-paper" : "text-ink";

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${wrapperClass}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link
            href="/"
            className={`font-serif text-2xl font-normal tracking-[-0.01em] transition-colors ${logoColor} ${navTextShadow}`}
            aria-label="Lot Linkup home"
          >
            Lot Linkup
          </Link>
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`${navLinkSize} font-medium leading-[1.5] transition-colors ${navLinkColor(active)} ${navTextShadow}`}
                  aria-current={active ? "page" : undefined}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className={`md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-black/5 ${menuButtonColor}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-paper text-ink md:hidden"
        >
          <div className="flex h-16 items-center justify-between px-6 border-b border-paper-edge">
            <Link
              href="/"
              className="font-serif text-2xl font-normal tracking-[-0.01em] text-accent"
              onClick={() => setMenuOpen(false)}
            >
              Lot Linkup
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-black/5 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>
          <nav
            className="flex flex-col px-6 pt-12 gap-8"
            aria-label="Primary mobile"
          >
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`font-serif text-3xl font-normal ${
                    active ? "text-accent" : "text-ink"
                  }`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
