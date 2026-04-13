"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const SCROLL_THRESHOLD = 50;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white h-20 flex items-center justify-center px-8 md:px-16 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        scrolled ? "border-b border-black/5" : "border-b border-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Nekave logo"
          width={56}
          height={56}
          className="h-14 w-14"
        />
        <div className="flex flex-col">
          <span className="font-display font-light text-2xl uppercase tracking-[0.3em] text-black leading-tight">
            NEKAVE
          </span>
          <span className="font-body text-[8px] uppercase tracking-[0.15em] text-charcoal">
            Artists Management
          </span>
        </div>
      </Link>
    </header>
  );
}
