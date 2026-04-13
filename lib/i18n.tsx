"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Locale = "en" | "he";

interface I18nContextType {
  locale: Locale;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Hero
    "hero.subtitle": "ARTISTS MANAGEMENT",

    // Scroll sections
    "scroll.1.title": "Art Chosen\nWith Intention",
    "scroll.1.subtitle":
      "Every work in the NEKAVE collection is hand-selected. Sourced for its craft, its story, and its lasting value.",
    "scroll.2.title": "From Emerging\nTo Established",
    "scroll.2.subtitle":
      "Curating across a spectrum of styles and price points, connecting collectors with pieces that resonate.",
    "scroll.3.title": "Your Art,\nYour Vision",
    "scroll.3.subtitle":
      "Whether you're starting a collection or expanding one, Ron works personally with every client to find the right piece.",

    // About
    "about.eyebrow": "About",
    "about.heading": "Curating the Exceptional",
    "about.text":
      "Ron Elnekave is an artist and art manager dedicated to sourcing, curating, and placing precious works across a spectrum of styles and value. From emerging voices to established masters, every piece is chosen with intention.",

    // Contact
    "contact.eyebrow": "Contact",
    "contact.heading": "Get in Touch",

    // Footer
    "footer.tagline": "Art Curation & Management",
    "footer.copyright": "© 2026 NEKAVE Artist Management",

    // Form
    "form.name": "Name",
    "form.name.placeholder": "Your name",
    "form.email": "Email",
    "form.email.placeholder": "your@email.com",
    "form.phone": "Phone",
    "form.phone.placeholder": "+1 (555) 000-0000",
    "form.subject": "Subject",
    "form.subject.placeholder": "Select a subject",
    "form.subject.general": "General Inquiry",
    "form.subject.artist": "Artist Inquiry",
    "form.subject.exhibition": "Exhibition Inquiry",
    "form.subject.collector": "Collector Inquiry",
    "form.subject.press": "Press",
    "form.message": "Message",
    "form.message.placeholder": "Tell us about your inquiry...",
    "form.submit": "Send Message",
    "form.submitting": "Sending...",
    "form.success.title": "Message Sent",
    "form.success.text":
      "Thank you for reaching out. We'll get back to you shortly.",
    "form.success.again": "Send another message",

    // Language toggle
    "lang.switch": "HE",
    "lang.flag": "🇮🇱",
  },
  he: {
    // Hero
    "hero.subtitle": "ניהול אמנים",

    // Scroll sections
    "scroll.1.title": "אמנות שנבחרה\nבקפידה",
    "scroll.1.subtitle":
      "כל עבודה באוסף NEKAVE נבחרת בקפידה. נאספת בזכות המלאכה, הסיפור והערך המתמשך שלה.",
    "scroll.2.title": "ממתחילים\nועד מבוססים",
    "scroll.2.subtitle":
      "אוצרות במגוון סגנונות וטווחי מחירים, מחברת אספנים עם יצירות שמדברות אליהם.",
    "scroll.3.title": "האמנות שלך,\nהחזון שלך",
    "scroll.3.subtitle":
      "בין אם אתם מתחילים אוסף או מרחיבים אותו, רון עובד אישית עם כל לקוח כדי למצוא את היצירה הנכונה.",

    // About
    "about.eyebrow": "אודות",
    "about.heading": "אוצרות את היוצא מן הכלל",
    "about.text":
      "רון אלנקווה הוא אמן ומנהל אמנות המקדיש את עבודתו לאיתור, אוצרות והצבת יצירות יקרות ערך במגוון סגנונות וערכים. מקולות מתחילים ועד אמנים מבוססים, כל יצירה נבחרת בכוונה.",

    // Contact
    "contact.eyebrow": "צור קשר",
    "contact.heading": "בואו נדבר",

    // Footer
    "footer.tagline": "אוצרות וניהול אמנות",
    "footer.copyright": "© 2026 NEKAVE ניהול אמנים",

    // Form
    "form.name": "שם",
    "form.name.placeholder": "השם שלך",
    "form.email": "אימייל",
    "form.email.placeholder": "your@email.com",
    "form.phone": "טלפון",
    "form.phone.placeholder": "+972 50 000 0000",
    "form.subject": "נושא",
    "form.subject.placeholder": "בחר נושא",
    "form.subject.general": "פנייה כללית",
    "form.subject.artist": "פנייה בנוגע לאמן",
    "form.subject.exhibition": "פנייה בנוגע לתערוכה",
    "form.subject.collector": "פנייה בנוגע לאספנות",
    "form.subject.press": "עיתונות",
    "form.message": "הודעה",
    "form.message.placeholder": "ספרו לנו על הפנייה שלכם...",
    "form.submit": "שלח הודעה",
    "form.submitting": "שולח...",
    "form.success.title": "ההודעה נשלחה",
    "form.success.text": "תודה שפניתם אלינו. נחזור אליכם בהקדם.",
    "form.success.again": "שלח הודעה נוספת",

    // Language toggle
    "lang.switch": "EN",
    "lang.flag": "🇬🇧",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("nekave-lang") as Locale | null;
    if (saved === "he" || saved === "en") {
      setLocale(saved);
    }
  }, []);

  // Update html dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = locale === "he" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "he" : "en";
      localStorage.setItem("nekave-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[locale][key] || key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
