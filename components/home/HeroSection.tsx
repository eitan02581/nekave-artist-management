"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface HeroSectionProps {
  children: ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
      className="relative min-h-[100dvh] w-full overflow-hidden"
    >
      {children}
    </motion.section>
  );
}
