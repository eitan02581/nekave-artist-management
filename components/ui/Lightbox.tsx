"use client";

import { useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CollectionImage } from "@/lib/types";

interface LightboxProps {
  images: CollectionImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const EASE_GALLERY: [number, number, number, number] = [0.32, 0.72, 0, 1];

export default function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const open = index !== null;
  const stripRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  // Keyboard navigation + body scroll lock while open.
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, goPrev, goNext]);

  // Keep the active thumbnail in view as the image changes.
  useEffect(() => {
    if (index === null) return;
    const active = stripRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const current = index !== null ? images[index] : null;
  const hasMany = images.length > 1;

  // Render through a portal to <body> so the fixed overlay escapes any
  // transformed/filtered ancestor (e.g. framer-motion ScrollReveal), which
  // would otherwise become its containing block and break `position: fixed`.
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_GALLERY }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-300 hover:text-white"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          {/* Main image area */}
          <div className="relative flex-1 flex items-center justify-center min-h-0">
            {/* Prev */}
            {hasMany && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 md:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/60 transition-colors duration-300 hover:text-white"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Image — drag/swipe horizontally to navigate (touch & mouse) */}
            <motion.div
              key={current.id}
              className="relative h-full w-[92vw] md:w-[80vw]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASE_GALLERY }}
              onClick={(e) => e.stopPropagation()}
              drag={hasMany ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                // Trigger on a deliberate distance OR a quick flick.
                if (info.offset.x < -60 || info.velocity.x < -400) goNext();
                else if (info.offset.x > 60 || info.velocity.x > 400) goPrev();
              }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Next */}
            {hasMany && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-3 md:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full text-white/60 transition-colors duration-300 hover:text-white"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom: counter + thumbnail filmstrip */}
          {hasMany && (
            <div
              className="shrink-0 pb-4 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                {String(index! + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </div>
              <div
                ref={stripRef}
                className="no-scrollbar flex gap-2 overflow-x-auto px-4 md:justify-center md:px-0"
              >
                {images.map((image, i) => (
                  <button
                    key={image.id}
                    type="button"
                    data-active={i === index}
                    onClick={() => onIndexChange(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative shrink-0 h-14 w-14 overflow-hidden rounded-sm transition-all duration-300 ${
                      i === index
                        ? "opacity-100 ring-2 ring-white"
                        : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
