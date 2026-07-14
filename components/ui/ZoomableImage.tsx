"use client";

import { useRef } from "react";
import RetryImage from "@/components/ui/RetryImage";
import type { CollectionImage } from "@/lib/types";

const MAX_SCALE = 4;
const SWIPE_THRESHOLD = 60; // px to trigger next/prev
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SCALE = 2.5;

interface Props {
  image: CollectionImage;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * One Pointer-Events handler owns every touch gesture so they never fight:
 *   - 2 pointers      → pinch zoom (1×–4×)
 *   - 1 pointer, zoomed → pan within bounds
 *   - 1 pointer, not zoomed → horizontal swipe to navigate (with damped follow)
 *   - double-tap      → toggle zoom in/out
 * Zoom resets per image because the parent remounts this component by key.
 */
export default function ZoomableImage({ image, onPrev, onNext }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const tf = useRef({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const g = useRef({
    mode: "none" as "none" | "swipe" | "pan" | "pinch",
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    startDist: 1,
    startScale: 1,
    moved: false,
  });
  const lastTap = useRef(0);

  const apply = (animate = false) => {
    const el = targetRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 0.25s ease-out" : "none";
    el.style.transform = `translate3d(${tf.current.x}px, ${tf.current.y}px, 0) scale(${tf.current.scale})`;
  };

  const clampPan = () => {
    const cont = containerRef.current;
    const el = targetRef.current;
    if (!cont || !el) return;
    const maxX = Math.max(0, (el.offsetWidth * tf.current.scale - cont.clientWidth) / 2);
    const maxY = Math.max(0, (el.offsetHeight * tf.current.scale - cont.clientHeight) / 2);
    tf.current.x = Math.max(-maxX, Math.min(maxX, tf.current.x));
    tf.current.y = Math.max(-maxY, Math.min(maxY, tf.current.y));
  };

  const reset = (animate = true) => {
    tf.current = { scale: 1, x: 0, y: 0 };
    apply(animate);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // Capture so moves outside the element still register; ignore if the
    // browser refuses (keeps the gesture working regardless).
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];

    if (pts.length === 2) {
      g.current.mode = "pinch";
      g.current.startDist =
        Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      g.current.startScale = tf.current.scale;
    } else if (pts.length === 1) {
      g.current.mode = tf.current.scale > 1 ? "pan" : "swipe";
      g.current.startX = e.clientX;
      g.current.startY = e.clientY;
      g.current.startTx = tf.current.x;
      g.current.startTy = tf.current.y;
      g.current.moved = false;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const cur = g.current;

    if (cur.mode === "pinch" && pts.length >= 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      tf.current.scale = Math.max(
        1,
        Math.min(MAX_SCALE, cur.startScale * (d / cur.startDist))
      );
      clampPan();
      apply();
    } else if (cur.mode === "pan" && pts.length === 1) {
      tf.current.x = cur.startTx + (e.clientX - cur.startX);
      tf.current.y = cur.startTy + (e.clientY - cur.startY);
      cur.moved = true;
      clampPan();
      apply();
    } else if (cur.mode === "swipe" && pts.length === 1) {
      const dx = e.clientX - cur.startX;
      if (Math.abs(dx) > 4) cur.moved = true;
      tf.current.x = dx * 0.5; // damped follow for feedback
      apply();
    }
  };

  const handleTap = () => {
    // Double-tap toggles between fit and zoomed-in.
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      if (tf.current.scale > 1) reset(true);
      else {
        tf.current = { scale: DOUBLE_TAP_SCALE, x: 0, y: 0 };
        apply(true);
      }
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const cur = g.current;
    const wasMode = cur.mode;
    const upX = e.clientX;
    const upY = e.clientY;
    pointers.current.delete(e.pointerId);
    const remaining = pointers.current.size;

    if (wasMode === "pinch") {
      if (remaining < 2) {
        if (tf.current.scale <= 1.02) reset(true);
        if (remaining === 1) {
          // one finger still down → continue as a pan
          const p = [...pointers.current.values()][0];
          cur.mode = "pan";
          cur.startX = p.x;
          cur.startY = p.y;
          cur.startTx = tf.current.x;
          cur.startTy = tf.current.y;
        } else {
          cur.mode = "none";
        }
      }
      return;
    }

    // Single-finger gesture: wait until the last finger lifts.
    if (remaining > 0) return;

    if (!cur.moved) {
      // A tap (works whether zoomed/"pan" or not/"swipe").
      handleTap();
    } else if (wasMode === "swipe") {
      const dx = upX - cur.startX;
      const dy = upY - cur.startY;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        reset(false); // new image mounts fresh
        if (dx < 0) onNext();
        else onPrev();
      } else {
        reset(true); // snap back
      }
    } else if (wasMode === "pan") {
      if (tf.current.scale <= 1.02) reset(true);
    }
    cur.mode = "none";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={targetRef}
        className="relative will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <RetryImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="95vw"
          className="block h-auto max-h-[86vh] w-auto max-w-[92vw] select-none object-contain"
          draggable={false}
          priority
        />
      </div>
    </div>
  );
}
