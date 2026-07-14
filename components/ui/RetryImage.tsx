"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

/**
 * next/image that retries on load error.
 *
 * A full gallery load sends ~all Drive thumbnails through the image optimizer
 * at once, and under that burst a few upstream fetches fail transiently
 * (500/504) — the same file succeeds when re-requested. The retry appends a
 * `retry=N` param so the optimizer gets a fresh cache key and re-fetches
 * upstream (Drive ignores the unknown param) instead of replaying a failure.
 */
export default function RetryImage({
  src,
  alt,
  ...props
}: Omit<ImageProps, "src"> & { src: string }) {
  const [attempt, setAttempt] = useState(0);

  const url =
    attempt === 0
      ? src
      : `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;

  return (
    <Image
      {...props}
      alt={alt}
      src={url}
      onError={() => {
        if (attempt < MAX_RETRIES) {
          setTimeout(() => setAttempt(attempt + 1), RETRY_BASE_MS * (attempt + 1));
        }
      }}
    />
  );
}
