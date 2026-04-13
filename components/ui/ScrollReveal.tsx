"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade-up" | "unveil" | "fade";
}

const EASE_GALLERY: [number, number, number, number] = [0.32, 0.72, 0, 1];

const variants = {
  "fade-up": {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: EASE_GALLERY,
      },
    },
  },
  unveil: {
    hidden: { clipPath: "inset(0 0 100% 0)" },
    visible: {
      clipPath: "inset(0 0 0% 0)",
      transition: {
        duration: 1.0,
        ease: EASE_GALLERY,
      },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: EASE_GALLERY,
      },
    },
  },
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
}: ScrollRevealProps) {
  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            ...selectedVariant.visible.transition,
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
