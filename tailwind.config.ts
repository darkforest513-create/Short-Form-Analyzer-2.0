import { frostedThemePlugin } from "@whop/react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
	plugins: [frostedThemePlugin()],
	theme: {
		extend: {
			colors: {
				glass: {
					bg: "rgba(255,255,255,0.04)",
					border: "rgba(255,255,255,0.08)",
					highlight: "rgba(255,255,255,0.06)",
				},
				glow: {
					purple: "rgba(139,92,246,0.4)",
					blue: "rgba(59,130,246,0.35)",
				},
				premium: {
					purple: "#8b5cf6",
					blue: "#3b82f6",
					cyan: "#06b6d4",
				},
			},
			backdropBlur: {
				glass: "12px",
			},
			boxShadow: {
				glass: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.2)",
				glow: "0 0 20px rgba(139,92,246,0.4)",
				glowSubtle: "0 0 40px rgba(139,92,246,0.12)",
			},
		},
	},
};

export default config;
