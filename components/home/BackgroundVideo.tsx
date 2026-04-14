"use client";

import { useRef, useEffect, useState } from "react";

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
  const [videoSrc, setVideoSrc] = useState(src);

  useEffect(() => {
    const isMobile =
      window.innerWidth < 768 ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && mobileSrc) {
      setVideoSrc(mobileSrc);
    }
  }, [mobileSrc]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

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
      src={videoSrc}
    />
  );
}
