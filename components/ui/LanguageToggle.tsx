"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { t, toggleLocale } = useI18n();

  return (
    <button
      onClick={toggleLocale}
      className="rounded-full ring-1 ring-black/10 bg-white/90 backdrop-blur-sm px-4 h-10 font-body text-xs font-medium uppercase tracking-wider text-charcoal hover:text-gold hover:ring-gold/30 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-sm flex items-center gap-2"
      aria-label="Toggle language"
    >
      <span className="text-sm">{t("lang.flag")}</span>
      {t("lang.switch")}
    </button>
  );
}
