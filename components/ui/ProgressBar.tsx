"use client";

interface ProgressBarProps {
	label: string;
	score: number;
	max?: number;
	showValue?: boolean;
	/** Kept for API compatibility; all bars use premium purple fill for visibility */
	variant?: "purple" | "blue" | "cyan" | "success" | "warning";
	className?: string;
}

/**
 * Premium purple fill via inline styles so every bar is visible (Tailwind can miss
 * dynamically chosen utility classes like bg-emerald-500 when used from a map).
 */
const FILL_STYLE = {
	background: "linear-gradient(90deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)",
	boxShadow: "0 0 14px rgba(139, 92, 246, 0.55)",
} as const;

/**
 * Elegant score/progress bar with label and optional numeric value.
 */
export function ProgressBar({
	label,
	score,
	max = 100,
	showValue = true,
	className = "",
}: ProgressBarProps) {
	const percent = Math.min(100, Math.max(0, (score / max) * 100));
	return (
		<div className={`space-y-1.5 ${className}`}>
			<div className="flex items-center justify-between text-xs">
				<span className="text-zinc-400">{label}</span>
				{showValue && (
					<span className="font-medium tabular-nums text-zinc-300">
						{score}/{max}
					</span>
				)}
			</div>
			<div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-zinc-900/80">
				<div
					className="h-full rounded-full transition-[width] duration-700 ease-out"
					style={{
						width: `${percent}%`,
						minWidth: percent > 0 ? 4 : 0,
						...FILL_STYLE,
					}}
				/>
			</div>
		</div>
	);
}
