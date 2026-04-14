"use client";

import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import BackgroundVideo from "@/components/home/BackgroundVideo";
import VideoScrollSection from "@/components/home/VideoScrollSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/contact/ContactForm";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <>
      {/* ─── Hero ─── */}
      <HeroSection>
        {/* Video background with inward vignette mask */}
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 65% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 65% at 50% 50%, black 40%, transparent 100%)",
          }}
        >
          <BackgroundVideo
            src="/todoai-video-1776109340881.mp4"
            mobileSrc="/todoai-hero-mobile.mp4"
            playbackRate={1}
          />
        </div>

        {/* Subtle center darkening for text readability */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Hero text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative inline-block px-6 md:px-10">
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-white uppercase"
              style={{
                textShadow: "0 2px 30px rgba(0,0,0,0.5)",
                letterSpacing: "0.15em",
                marginRight: "-0.15em",
              }}
            >
              NEKAVE
            </h1>
            <p
              dir="ltr"
              className="font-body text-white/70 uppercase text-[10px] md:text-xs font-bold flex justify-between mt-2 pl-[0.25em]"
            >
              {"ARTISTS MANAGEMENT".split("").map((char, i) => (
                <span key={i}>{char === " " ? "\u00A0" : char}</span>
              ))}
            </p>
          </div>
        </div>
      </HeroSection>

      {/* ─── Video Scroll Experience ─── */}
      <VideoScrollSection />

      {/* ─── About ─── */}
      <section className="pt-24 md:pt-32">
        <div className="max-w-3xl mx-auto px-8 md:px-16 text-center">
          <ScrollReveal variant="fade-up">
            <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal mb-6">
              {t("about.eyebrow")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-light text-black tracking-wide mb-8">
              {t("about.heading")}
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed text-charcoal/70">
              {t("about.text")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Logo Divider ─── */}
      <section className="py-20 md:py-28">
        <div className="flex items-center justify-center">
          <ScrollReveal
            variant="fade-up"
            className="flex items-center justify-center w-full"
          >
            <Image
              src="/logo.png"
              alt="Nekave logo"
              width={320}
              height={320}
              className="w-52 h-52 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto block"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section className="py-24 md:py-32 bg-off-white">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <ScrollReveal variant="fade-up">
            <div className="text-center mb-12">
              <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal mb-6">
                {t("contact.eyebrow")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-light text-black tracking-wide">
                {t("contact.heading")}
              </h2>
            </div>
          </ScrollReveal>

          <ContactForm />

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              dir="ltr"
              href="tel:+972549410057"
              className="group flex items-center gap-3 font-body text-sm uppercase tracking-wider text-charcoal hover:text-gold transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              +972 54 941 0057
            </a>

            <div className="hidden sm:block w-[1px] h-6 bg-charcoal/10" />

            <a
              href="https://www.instagram.com/nekaveart"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 font-body text-sm uppercase tracking-wider text-charcoal hover:text-gold transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50 group-hover:opacity-100 transition-opacity"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              @nekaveart
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
