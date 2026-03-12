"use client";

interface UserBadgeProps {
	username: string;
	className?: string;
}

/**
 * Displays the current Whop user's username in a premium pill style.
 */
export function UserBadge({ username, className = "" }: UserBadgeProps) {
	return (
		<div
			className={`
        flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06]
        px-4 py-2 backdrop-blur-sm
        ${className}
      `}
		>
			<div className="h-2 w-2 rounded-full bg-premium-purple shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
			<span className="text-sm font-medium text-zinc-200">
				{username.startsWith("@") ? username : `@${username}`}
			</span>
		</div>
	);
}
