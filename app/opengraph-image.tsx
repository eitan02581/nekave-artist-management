import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "NEKAVE Artists Management";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(50, 120, 110, 0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Gold accent line above */}
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: "#b8924a",
            marginBottom: 40,
            display: "flex",
          }}
        />

        {/* NEKAVE */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "0.2em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          NEKAVE
        </div>

        {/* ARTISTS MANAGEMENT */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.5)",
            letterSpacing: "0.35em",
            marginTop: 20,
            display: "flex",
          }}
        >
          ARTISTS MANAGEMENT
        </div>

        {/* Gold accent line below */}
        <div
          style={{
            width: 60,
            height: 2,
            backgroundColor: "#b8924a",
            marginTop: 40,
            display: "flex",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(255, 255, 255, 0.35)",
            letterSpacing: "0.15em",
            marginTop: 30,
            display: "flex",
          }}
        >
          ART CURATION & MANAGEMENT
        </div>
      </div>
    ),
    { ...size }
  );
}
