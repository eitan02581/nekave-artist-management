"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

const subjectKeys = [
  "form.subject.general",
  "form.subject.artist",
  "form.subject.exhibition",
  "form.subject.collector",
  "form.subject.press",
];

const inputClassName =
  "w-full bg-transparent border-b border-black/10 py-3 font-body text-sm text-charcoal placeholder:text-silver/60 focus:border-gold focus:outline-none transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]";

const labelClassName =
  "font-body text-xs uppercase tracking-wider text-silver mb-2 block";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gold"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-black mb-3">
          {t("form.success.title")}
        </h3>
        <p className="font-body text-sm text-charcoal/70 mb-8">
          {t("form.success.text")}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="font-body text-sm uppercase tracking-wider text-gold hover:text-gold-hover transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          {t("form.success.again")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="contact-name" className={labelClassName}>
            {t("form.name")} <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            placeholder={t("form.name.placeholder")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClassName}>
            {t("form.email")} <span className="text-gold">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            placeholder={t("form.email.placeholder")}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="contact-phone" className={labelClassName}>
            {t("form.phone")}
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            placeholder={t("form.phone.placeholder")}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelClassName}>
            {t("form.subject")} <span className="text-gold">*</span>
          </label>
          <select
            id="contact-subject"
            name="subject"
            required
            className={`${inputClassName} appearance-none`}
            defaultValue=""
          >
            <option value="" disabled>
              {t("form.subject.placeholder")}
            </option>
            {subjectKeys.map((key) => (
              <option key={key} value={t(key)}>
                {t(key)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClassName}>
          {t("form.message")} <span className="text-gold">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder={t("form.message.placeholder")}
          className={`${inputClassName} min-h-[160px] resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-exhibition-red">{errorMessage}</p>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-gold text-white font-body text-sm uppercase tracking-wider rounded-full px-8 py-4 hover:bg-gold-hover transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? t("form.submitting") : t("form.submit")}
        </button>
      </div>
    </form>
  );
}
