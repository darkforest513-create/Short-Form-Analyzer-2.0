"use client";

import type { ReactNode } from "react";

interface GlassCardProps {
	children: ReactNode;
	className?: string;
	hover?: boolean;
	/** Optional title shown at top with subtle border below */
	title?: string;
}

/**
 * Premium glassmorphism card: translucent, rounded, soft border and shadow.
 */
export function GlassCard({
	children,
	className = "",
	hover = false,
	title,
}: GlassCardProps) {
	return (
		<div
			className={`
        rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl
        ${title ? "overflow-hidden" : ""}
        ${hover ? "transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]" : ""}
        ${className}
      `}
			style={{
				boxShadow:
					"0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.2)",
			}}
		>
			{title && (
				<div className="border-b border-white/10 bg-white/[0.02] px-5 py-3">
					<h3 className="text-sm font-semibold tracking-wide text-zinc-300">
						{title}
					</h3>
				</div>
			)}
			<div className={title ? "p-5" : "p-5"}>{children}</div>
		</div>
	);
}
