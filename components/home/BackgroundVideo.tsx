"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  mobileSrc?: string;
  playbackRate?: number;
}

export default function BackgroundVideo({
  src,
  mobileSrc,
  playbackRate = 0.4,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS Safari requires the muted HTML *attribute*, not just the JS property.
    // React's `muted` prop sets the property but not the attribute.
    video.setAttribute("muted", "");
    video.muted = true;

    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // On mobile, swap to the compressed variant via DOM (no React re-render)
    if (isMobile && mobileSrc) {
      video.src = mobileSrc;
    }

    video.playbackRate = playbackRate;
    video.load();

    // Explicitly call play() — needed for iOS after setting src via DOM
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked — retry on first user interaction
        const retryPlay = () => {
          video.play().catch(() => {});
          document.removeEventListener("touchstart", retryPlay);
        };
        document.addEventListener("touchstart", retryPlay, { once: true });
      });
    }
  }, [src, mobileSrc, playbackRate]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
      style={{ pointerEvents: "none" }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
