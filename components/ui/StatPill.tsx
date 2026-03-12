"use client";

interface StatPillProps {
	label: string;
	value: string | number;
	variant?: "default" | "success" | "warning" | "muted";
	className?: string;
}

const variantStyles = {
	default:
		"border-white/10 bg-white/[0.06] text-zinc-200",
	success:
		"border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
	warning:
		"border-amber-500/30 bg-amber-500/10 text-amber-400",
	muted:
		"border-white/5 bg-white/[0.02] text-zinc-500",
};

/**
 * Small pill/badge for displaying a stat (e.g. "Views: 12.5k").
 */
export function StatPill({
	label,
	value,
	variant = "default",
	className = "",
}: StatPillProps) {
	return (
		<span
			className={`
        inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
		>
			<span className="text-zinc-500">{label}:</span>
			<span>{value}</span>
		</span>
	);
}
