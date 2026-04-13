import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const aileron = localFont({
  src: [
    { path: "./fonts/Aileron-Light.woff", weight: "300", style: "normal" },
    { path: "./fonts/Aileron-Regular.woff", weight: "400", style: "normal" },
    { path: "./fonts/Aileron-SemiBold.woff", weight: "600", style: "normal" },
    { path: "./fonts/Aileron-Bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-aileron",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NEKAVE Artists Management",
    template: "%s | NEKAVE",
  },
  description:
    "Representing contemporary painters and sculptors. NEKAVE Artists Management connects exceptional artists with galleries, collectors, and institutions worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aileron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
