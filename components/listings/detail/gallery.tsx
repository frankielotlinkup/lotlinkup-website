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

function Slide({
  src,
  eager = false,
  fit = "cover",
}: {
  src: string;
  eager?: boolean;
  fit?: "cover" | "contain";
}) {
  if (isImageUrl(src)) {
    return (
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        className={fit === "contain" ? "object-contain" : "object-cover"}
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileSlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Desktop preview: hero + up to 4 thumbnails. If more photos exist
  // beyond those 5, the 4th thumb gets a "+N more" overlay that opens
  // the lightbox showing the rest.
  const heroSlide = slides[0] ?? "";
  const thumbSlides = slides.slice(1, 5);
  const extraCount = Math.max(0, slides.length - 5);

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
      {/* Desktop: hero + 4-thumb preview row */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          aria-label="Open gallery in fullscreen"
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-md bg-ink-charcoal shadow-[0_18px_40px_-22px_rgba(15,17,21,0.35)] ring-1 ring-paper-edge/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Slide src={heroSlide} eager />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge kind={badge} />
          </div>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink shadow-sm transition-transform group-hover:scale-[1.03]"
          >
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            View all {slides.length} photos
          </span>
        </button>

        {thumbSlides.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {thumbSlides.map((src, i) => {
              const slideIndex = i + 1;
              const isLast = i === thumbSlides.length - 1;
              const showMoreOverlay = isLast && extraCount > 0;
              return (
                <button
                  key={`${src}-${slideIndex}`}
                  type="button"
                  onClick={() => openLightbox(slideIndex)}
                  aria-label={
                    showMoreOverlay
                      ? `View all ${slides.length} photos`
                      : `Open gallery at photo ${slideIndex + 1}`
                  }
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-md ring-1 ring-paper-edge/60 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Slide src={src} />
                  {showMoreOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1 rounded-md bg-ink/40 px-4 py-2.5 backdrop-blur-md ring-1 ring-paper/15">
                        <span className="font-serif text-3xl font-semibold leading-none text-paper drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                          +{extraCount}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          more photos
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
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
          className="fixed inset-0 z-50"
        >
          {/* Backdrop — click to close */}
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setLightboxOpen(false)}
            tabIndex={-1}
            className="absolute inset-0 bg-ink/95 cursor-default"
          />

          {/* Image — pointer-events:none on wrapper so backdrop clicks pass through;
              auto on the image so clicks on the photo itself don't close. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-2 py-12 md:px-16 md:py-12">
            <div className="pointer-events-auto relative aspect-[16/9] w-full max-w-[1600px] overflow-hidden bg-ink-charcoal shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
              <Slide src={slides[lightboxIndex] ?? ""} fit="contain" />
            </div>
          </div>

          {/* Close X */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-md bg-black/30 text-paper transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
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

          {slides.length > 1 && (
            <>
              {/* Prev */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (i) => (i - 1 + slides.length) % slides.length,
                  )
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-black/30 text-paper transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
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

              {/* Next */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((i) => (i + 1) % slides.length)
                }
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-20 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-md bg-black/30 text-paper transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
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

              {/* Counter */}
              <p
                aria-live="polite"
                className="pointer-events-none absolute inset-x-0 bottom-6 z-20 text-center font-mono text-sm text-paper/80"
              >
                {lightboxIndex + 1} of {slides.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
