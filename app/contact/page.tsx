import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <section className="px-8 md:px-16 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* ─── Left Column: Form ─── */}
          <div className="lg:col-span-3">
            <ScrollReveal variant="fade">
              <span className="inline-block rounded-full bg-charcoal/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal mb-6">
                Get in Touch
              </span>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl font-light text-black tracking-wide mb-12">
                Contact
              </h1>
            </ScrollReveal>

            <ContactForm />
          </div>

          {/* ─── Right Column: Contact Details ─── */}
          <div className="lg:col-span-2">
            <ScrollReveal variant="fade-up" delay={0.3}>
              <div>
                <h2 className="font-display text-lg mb-4">Visit Us</h2>
                <address className="font-body text-sm text-charcoal/70 leading-relaxed not-italic">
                  NEKAVE Artist Management
                  <br />
                  14 Rothschild Boulevard
                  <br />
                  Tel Aviv, Israel 6688112
                </address>

                <h2 className="font-display text-lg mb-4 mt-8">Contact</h2>
                <div className="space-y-1">
                  <a
                    href="mailto:nekaveart@gmail.com"
                    className="font-mono text-xs text-silver hover:text-gold transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] block"
                  >
                    nekaveart@gmail.com
                  </a>
                </div>

                <h2 className="font-display text-lg mb-4 mt-8">Hours</h2>
                <div className="space-y-1">
                  <span className="font-mono text-xs text-silver block">
                    Monday — Friday
                  </span>
                  <span className="font-mono text-xs text-silver block">
                    10:00 — 18:00
                  </span>
                  <span className="font-mono text-xs text-silver block">
                    Saturday by appointment
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
