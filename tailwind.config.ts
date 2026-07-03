import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0B0F",
        panel: "rgba(255,255,255,0.06)",
        cyanGlow: "#00FF88",
        violetGlow: "#8B5CF6",
      },
      boxShadow: {
        glow: "0 0 45px rgba(0,255,136,0.18)",
        violet: "0 0 55px rgba(139,92,246,0.16)",
      },
      backgroundImage: {
        "noise": "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
} satisfies Config;
