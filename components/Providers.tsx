"use client";

import { I18nProvider } from "@/lib/i18n";
import LanguageToggle from "@/components/ui/LanguageToggle";
import ThemeToggle from "@/components/ui/ThemeToggle";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {/* Floating top-right controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <ThemeToggle />
        <LanguageToggle />
      </div>
      {children}
      <WhatsAppButton />
    </I18nProvider>
  );
}
