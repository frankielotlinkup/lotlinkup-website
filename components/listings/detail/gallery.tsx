"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GalleryProps = {
  slides: string[];
  badge: "OWNER FINANCED" | "PREMIUM";
};

function isImageUrl(s: string): boolean {
  return s.startsWith("http") || s.startsWith("/");
}

function Slide({ src, eager = false }: { src: string; eager?: boolean }) {
  if (isImageUrl(src)) {
    return (
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        className="object-cover"
        priority={eager}
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-ink-charcoal to-accent-deep" />
  );
}

function Badge({ kind }: { kind: GalleryProps["badge"] }) {
  if (kind === "OWNER FINANCED") {
    return (
      <span className="inline-block rounded-sm bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
        Owner Financed
      </span>
    );
  }
  return (
    <span className="inline-block rounded-sm bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-paper">
      Premium
    </span>
  );
}

export function Gallery({ slides, badge }: GalleryProps) {
  const [hero, setHero] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileSlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile dot indicator via IntersectionObserver
  useEffect(() => {
    const root = mobileScrollRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            if (!Number.isNaN(idx)) setActiveMobileIndex(idx);
          }
        }
      },
      { root, threshold: [0.6] },
    );
    mobileSlideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  // Lightbox keyboard + body scroll lock
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + slides.length) % slides.length);
      else if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % slides.length);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, slides.length]);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      {/* Desktop: hero + filmstrip */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => openLightbox(hero)}
          aria-label="Open gallery in fullscreen"
          className="relative block aspect-[16/9] w-full overflow-hidden rounded-md bg-ink-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Slide src={slides[hero] ?? ""} eager />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
          {hero === 0 && (
            <div className="absolute left-4 top-4">
              <Badge kind={badge} />
            </div>
          )}
        </button>

        {slides.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {slides.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setHero(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === hero}
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-md transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  i === hero
                    ? "ring-2 ring-accent ring-offset-2 ring-offset-paper"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <Slide src={src} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: scroll-snap carousel */}
      <div className="md:hidden">
        <div
          ref={mobileScrollRef}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-md"
        >
          {slides.map((src, i) => (
            <div
              key={`${src}-${i}`}
              ref={(el) => {
                mobileSlideRefs.current[i] = el;
              }}
              data-idx={i}
              className="relative aspect-[4/3] w-full shrink-0 snap-start overflow-hidden bg-ink-charcoal"
            >
              <Slide src={src} eager={i === 0} />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
              {i === 0 && (
                <div className="absolute left-3 top-3">
                  <Badge kind={badge} />
                </div>
              )}
            </div>
          ))}
        </div>
        {slides.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === activeMobileIndex ? "bg-ink" : "bg-paper-edge"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-50 flex flex-col bg-ink/95"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
            className="absolute inset-0"
            tabIndex={-1}
          />
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md text-paper hover:bg-white/10 transition-colors"
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

          <div className="relative z-0 flex flex-1 items-center justify-center p-6">
            <div className="relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-md bg-ink-charcoal">
              <Slide src={slides[lightboxIndex] ?? ""} />
            </div>
          </div>

          {slides.length > 1 && (
            <div className="z-10 flex items-center justify-between gap-4 px-6 pb-6">
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (i) => (i - 1 + slides.length) % slides.length,
                  )
                }
                aria-label="Previous photo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-paper hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <p className="font-mono text-sm text-paper/80">
                {lightboxIndex + 1} of {slides.length}
              </p>
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((i) => (i + 1) % slides.length)
                }
                aria-label="Next photo"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-paper hover:bg-white/10 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
