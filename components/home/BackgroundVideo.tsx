"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  src: string;
  playbackRate?: number;
}

export default function BackgroundVideo({
  src,
  playbackRate = 0.4,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
