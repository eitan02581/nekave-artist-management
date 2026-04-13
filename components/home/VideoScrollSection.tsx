"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

const SECTION_KEYS = [
  { titleKey: "scroll.1.title", subtitleKey: "scroll.1.subtitle" },
  { titleKey: "scroll.2.title", subtitleKey: "scroll.2.subtitle" },
  { titleKey: "scroll.3.title", subtitleKey: "scroll.3.subtitle" },
];

// Number of frames to extract from the video.
// More = smoother scrub but more memory. 120 is a good balance.
const FRAME_COUNT = 120;

export default function VideoScrollSection() {
  const { t } = useI18n();
  const sections = SECTION_KEYS.map((s) => ({
    title: t(s.titleKey),
    subtitle: t(s.subtitleKey),
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<ImageBitmap[]>([]);
  const lastFrameIndexRef = useRef(-1);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── Extract frames from video into ImageBitmap cache ──
  useEffect(() => {
    let cancelled = false;

    async function extractFrames() {
      const video = document.createElement("video");
      video.src = "/paint-scroll.mp4";
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";

      // Wait for metadata
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Video failed to load"));
      });

      const duration = video.duration;
      const frames: ImageBitmap[] = [];

      // Create offscreen canvas for frame capture
      const offscreen = document.createElement("canvas");
      offscreen.width = video.videoWidth;
      offscreen.height = video.videoHeight;
      const ctx = offscreen.getContext("2d");
      if (!ctx) return;

      for (let i = 0; i < FRAME_COUNT; i++) {
        if (cancelled) return;

        const time = (i / (FRAME_COUNT - 1)) * duration;
        video.currentTime = time;

        // Wait for the video to seek to the requested time
        await new Promise<void>((resolve) => {
          video.onseeked = () => resolve();
        });

        // Draw current frame to offscreen canvas
        ctx.drawImage(video, 0, 0);

        // Create an ImageBitmap for instant future drawing
        const bitmap = await createImageBitmap(offscreen);
        frames.push(bitmap);

        if (!cancelled) {
          setLoadProgress(Math.round(((i + 1) / FRAME_COUNT) * 100));
        }
      }

      if (!cancelled) {
        framesRef.current = frames;
        setLoaded(true);

        // Draw the first frame immediately
        drawFrame(0);
      }
    }

    extractFrames().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Draw a specific frame index to the canvas ──
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;

    const clamped = Math.max(0, Math.min(frames.length - 1, index));
    if (clamped === lastFrameIndexRef.current) return; // Skip redundant draws

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = frames[clamped];
    // Match canvas internal resolution to the video frame
    if (canvas.width !== frame.width || canvas.height !== frame.height) {
      canvas.width = frame.width;
      canvas.height = frame.height;
    }

    ctx.drawImage(frame, 0, 0);
    lastFrameIndexRef.current = clamped;
  }, []);

  // ── Scroll handler ──
  useEffect(() => {
    let rafId = 0;

    function onScroll() {
      if (rafId) return; // Coalesce to one rAF per frame
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollableHeight = container.offsetHeight - window.innerHeight;
        const raw = -rect.top / scrollableHeight;
        const clamped = Math.max(0, Math.min(1, raw));

        progressRef.current = clamped;
        setProgress(clamped);

        // Map progress to frame index and draw
        const frameIndex = Math.round(clamped * (FRAME_COUNT - 1));
        drawFrame(frameIndex);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [drawFrame]);

  // ── Text opacity and parallax calculations ──
  const getTextOpacity = (index: number) => {
    const sectionSize = 1 / sections.length;
    const sectionStart = index * sectionSize;
    const sectionEnd = sectionStart + sectionSize;
    const fadeRange = sectionSize * 0.2;
    const fadeInEnd = sectionStart + fadeRange;
    const fadeOutStart = sectionEnd - fadeRange;

    if (progress < sectionStart || progress > sectionEnd) return 0;
    if (progress < fadeInEnd) return (progress - sectionStart) / fadeRange;
    if (progress > fadeOutStart) return (sectionEnd - progress) / fadeRange;
    return 1;
  };

  const getTextY = (index: number) => {
    const sectionSize = 1 / sections.length;
    const sectionStart = index * sectionSize;
    const sectionMid = sectionStart + sectionSize / 2;
    return (progress - sectionMid) * 120;
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh]"
    >
      {/* Sticky viewport-filling wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Canvas for frame-by-frame video display */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            imageRendering: "auto",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold"
                style={{
                  width: `${loadProgress}%`,
                  transition: "width 0.15s linear",
                }}
              />
            </div>
            <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Loading experience
            </span>
          </div>
        )}

        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%)",
            opacity: loaded ? Math.min(1, progress * 3) : 0,
            willChange: "opacity",
          }}
        />

        {/* Text sections */}
        {loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-5xl mx-auto px-8 md:px-16">
              {sections.map((section, index) => {
                const opacity = getTextOpacity(index);
                const y = getTextY(index);

                return (
                  <div
                    key={index}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center"
                    style={{
                      opacity,
                      transform: `translate3d(0, ${y}px, 0)`,
                      pointerEvents: opacity > 0.1 ? "auto" : "none",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* Eyebrow counter */}
                    <span className="inline-block rounded-full border border-white/40 px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-white/90 mb-8">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(sections.length).padStart(2, "0")}
                    </span>

                    {/* Title */}
                    <h2
                      className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-[1.1] whitespace-pre-line mb-6 md:mb-8"
                      style={{
                        textShadow: "0 4px 40px rgba(0,0,0,0.4)",
                      }}
                    >
                      {section.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="font-body text-sm md:text-base font-bold text-white/85 max-w-xl leading-relaxed">
                      {section.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-gold"
            style={{
              transform: `scaleX(${progress})`,
              transformOrigin: "left",
              willChange: "transform",
            }}
          />
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{
            opacity: loaded ? Math.max(0, 1 - progress * 8) : 0,
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            Scroll to explore
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
