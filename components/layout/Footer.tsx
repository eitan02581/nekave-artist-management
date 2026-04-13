"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t, toggleLocale } = useI18n();

  return (
    <footer className="w-full border-t border-black/5">
      <div className="py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + tagline */}
          <div className="text-center md:text-start">
            <Link href="/">
              <span className="font-display font-light text-xl uppercase tracking-[0.3em] text-black">
                NEKAVE
              </span>
            </Link>
            <p className="mt-2 text-silver font-body text-xs uppercase tracking-wider">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Contact links */}
          <div className="flex items-center gap-6">
            <a
              dir="ltr"
              href="tel:+972549410057"
              className="font-mono text-xs text-silver transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-charcoal"
            >
              +972 54 941 0057
            </a>
            <div className="w-[1px] h-4 bg-charcoal/10" />
            <a
              href="https://www.instagram.com/nekaveart"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-silver transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-charcoal"
            >
              @nekaveart
            </a>
          </div>
        </div>

        {/* Copyright + language toggle */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <p className="text-center text-silver text-xs font-body">
            {t("footer.copyright")}
          </p>
          <button
            onClick={toggleLocale}
            className="font-body text-xs uppercase tracking-wider text-silver hover:text-gold transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            {t("lang.switch")}
          </button>
        </div>
      </div>
    </footer>
  );
}
