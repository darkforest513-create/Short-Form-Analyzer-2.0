"use client";

import { useState } from "react";
import type {
	AnalyzerInput,
	ContentBreakdown,
	FormatType,
	Platform,
	ValueType,
	VideoBasicInfo,
} from "@/types/analyzer";
import { GlassCard } from "@/components/ui/GlassCard";

const PLATFORMS: { value: Platform; label: string }[] = [
	{ value: "tiktok", label: "TikTok" },
	{ value: "reels", label: "Reels" },
	{ value: "youtube_shorts", label: "YouTube Shorts" },
];

const FORMAT_TYPES: { value: FormatType; label: string }[] = [
	{ value: "talking_head", label: "Talking head" },
	{ value: "cinematic", label: "Cinematic" },
	{ value: "screen_recording", label: "Screen recording" },
	{ value: "meme", label: "Meme" },
	{ value: "storytelling", label: "Storytelling" },
	{ value: "educational", label: "Educational" },
	{ value: "other", label: "Other" },
];

const VALUE_TYPES: { value: ValueType; label: string }[] = [
	{ value: "education", label: "Education" },
	{ value: "entertainment", label: "Entertainment" },
	{ value: "inspiration", label: "Inspiration" },
	{ value: "controversy", label: "Controversy" },
	{ value: "curiosity", label: "Curiosity" },
	{ value: "other", label: "Other" },
];

/** Grey placeholder text — clearly “hint”, not filled-in answers */
const ph = "placeholder:text-zinc-500 placeholder:italic";

const inputClass = `w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 ${ph} outline-none transition focus:border-premium-purple/50 focus:ring-1 focus:ring-premium-purple/30`;

function FormSection({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<div className="space-y-3">
			<h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
				{title}
			</h4>
			{children}
		</div>
	);
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
	return (
		<label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-zinc-400">
			{children}
		</label>
	);
}

const METRIC_KEYS = [
	["views", "Views", "Total views on this video"],
	["likes", "Likes", "How many likes"],
	["comments", "Comments", "Comment count"],
	["shares", "Shares", "How many times shared"],
	["saves", "Saves", "Saves / bookmarks"],
	["watchTimeSeconds", "Watch time (s)", "Total watch time in seconds (from analytics)"],
	["avgViewDurationSeconds", "Avg view (s)", "Average view duration in seconds"],
	["retentionRatePercent", "Retention %", "Audience retention rate (0–100)"],
	["completionRatePercent", "Completion %", "How many watched to the end (0–100)"],
	["profileVisits", "Profile visits", "Profile taps from this video"],
	["followsGained", "Follows gained", "New followers attributed to this post"],
	["clickThroughRatePercent", "CTR %", "Click-through rate if you used a link"],
	["conversionRatePercent", "Conversion %", "Conversion rate if selling / sign-ups"],
] as const;

function parseNum(s: string): number {
	const n = Number.parseFloat(s);
	return Number.isFinite(n) ? n : 0;
}

export function AnalyzerForm({
	onSubmit,
	isLoading,
}: {
	onSubmit: (data: AnalyzerInput) => void;
	isLoading: boolean;
}) {
	const [basic, setBasic] = useState({
		videoTitle: "",
		platform: "" as "" | Platform,
		topic: "",
		niche: "",
		targetAudience: "",
		videoLengthSeconds: "",
		postingTime: "",
		ctaUsed: "",
		formatType: "" as "" | FormatType,
	});
	const [metricsStr, setMetricsStr] = useState<Record<string, string>>(() => {
		const o: Record<string, string> = {};
		for (const [key] of METRIC_KEYS) o[key] = "";
		return o;
	});
	const [content, setContent] = useState({
		firstThreeSecondHook: "",
		fullScriptOrSummary: "",
		editingStyle: "",
		pacing: "",
		subtitleUsage: "",
		visualChangesPatternInterrupts: "",
		emotionalAngle: "",
		valueType: "" as "" | ValueType,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const basicInfo: VideoBasicInfo = {
			videoTitle: basic.videoTitle,
			platform: basic.platform || "tiktok",
			topic: basic.topic,
			niche: basic.niche,
			targetAudience: basic.targetAudience,
			videoLengthSeconds: parseNum(basic.videoLengthSeconds) || 1,
			postingTime: basic.postingTime,
			ctaUsed: basic.ctaUsed,
			formatType: basic.formatType || "other",
		};
		const metrics = {
			views: parseNum(metricsStr.views),
			likes: parseNum(metricsStr.likes),
			comments: parseNum(metricsStr.comments),
			shares: parseNum(metricsStr.shares),
			saves: parseNum(metricsStr.saves),
			watchTimeSeconds: parseNum(metricsStr.watchTimeSeconds),
			avgViewDurationSeconds: parseNum(metricsStr.avgViewDurationSeconds),
			retentionRatePercent: parseNum(metricsStr.retentionRatePercent),
			completionRatePercent: parseNum(metricsStr.completionRatePercent),
			profileVisits: parseNum(metricsStr.profileVisits),
			followsGained: parseNum(metricsStr.followsGained),
			clickThroughRatePercent: parseNum(metricsStr.clickThroughRatePercent),
			conversionRatePercent: parseNum(metricsStr.conversionRatePercent),
		};
		const contentBreakdown: ContentBreakdown = {
			firstThreeSecondHook: content.firstThreeSecondHook,
			fullScriptOrSummary: content.fullScriptOrSummary,
			editingStyle: content.editingStyle,
			pacing: content.pacing,
			subtitleUsage: content.subtitleUsage,
			visualChangesPatternInterrupts: content.visualChangesPatternInterrupts,
			emotionalAngle: content.emotionalAngle,
			valueType: content.valueType || "other",
		};
		onSubmit({ basicInfo, metrics, content: contentBreakdown });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<GlassCard title="Video basic info" hover>
				<div className="space-y-4">
					<FormSection title="Identity">
						<div className="space-y-2">
							<Label htmlFor="videoTitle">Video title / hook</Label>
							<input
								id="videoTitle"
								type="text"
								className={inputClass}
								value={basic.videoTitle}
								onChange={(e) => setBasic((b) => ({ ...b, videoTitle: e.target.value }))}
								placeholder="Type your on-screen title or main hook line"
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<Label>Platform</Label>
								<select
									className={`${inputClass} text-zinc-200`}
									value={basic.platform}
									onChange={(e) =>
										setBasic((b) => ({ ...b, platform: e.target.value as Platform | "" }))
									}
								>
									<option value="" disabled className="bg-zinc-900 text-zinc-500">
										Choose platform…
									</option>
									{PLATFORMS.map((p) => (
										<option key={p.value} value={p.value} className="bg-zinc-900">
											{p.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<Label>Format type</Label>
								<select
									className={inputClass}
									value={basic.formatType}
									onChange={(e) =>
										setBasic((b) => ({ ...b, formatType: e.target.value as FormatType | "" }))
									}
								>
									<option value="" disabled className="bg-zinc-900 text-zinc-500">
										Choose format…
									</option>
									{FORMAT_TYPES.map((f) => (
										<option key={f.value} value={f.value} className="bg-zinc-900">
											{f.label}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<Label>Topic</Label>
								<input
									type="text"
									className={inputClass}
									value={basic.topic}
									onChange={(e) => setBasic((b) => ({ ...b, topic: e.target.value }))}
									placeholder="e.g. Productivity, fitness, comedy"
								/>
							</div>
							<div>
								<Label>Niche</Label>
								<input
									type="text"
									className={inputClass}
									value={basic.niche}
									onChange={(e) => setBasic((b) => ({ ...b, niche: e.target.value }))}
									placeholder="Your niche or sub-audience"
								/>
							</div>
						</div>
						<div>
							<Label>Target audience</Label>
							<input
								type="text"
								className={inputClass}
								value={basic.targetAudience}
								onChange={(e) =>
									setBasic((b) => ({ ...b, targetAudience: e.target.value }))
								}
								placeholder="Who this video is for (age, interest, role)"
							/>
						</div>
					</FormSection>
					<FormSection title="Timing & CTA">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<Label>Video length (seconds)</Label>
								<input
									type="text"
									inputMode="numeric"
									className={inputClass}
									value={basic.videoLengthSeconds}
									onChange={(e) =>
										setBasic((b) => ({ ...b, videoLengthSeconds: e.target.value }))
									}
									placeholder="Length of the video in seconds"
								/>
							</div>
							<div>
								<Label>Posting time</Label>
								<input
									type="text"
									className={inputClass}
									value={basic.postingTime}
									onChange={(e) => setBasic((b) => ({ ...b, postingTime: e.target.value }))}
									placeholder="When you posted (e.g. 7:00 PM EST)"
								/>
							</div>
						</div>
						<div>
							<Label>CTA used</Label>
							<input
								type="text"
								className={inputClass}
								value={basic.ctaUsed}
								onChange={(e) => setBasic((b) => ({ ...b, ctaUsed: e.target.value }))}
								placeholder="What you asked viewers to do (follow, comment, link, etc.)"
							/>
						</div>
					</FormSection>
				</div>
			</GlassCard>

			<GlassCard title="Performance metrics" hover>
				<p className="mb-4 text-xs text-zinc-500">
					Pull these from your platform analytics — leave blank if unknown (counts as 0).
				</p>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{METRIC_KEYS.map(([key, label, hint]) => (
						<div key={key}>
							<Label>{label}</Label>
							<input
								type="text"
								inputMode="decimal"
								className={inputClass}
								value={metricsStr[key]}
								onChange={(e) =>
									setMetricsStr((m) => ({ ...m, [key]: e.target.value }))
								}
								placeholder={hint}
							/>
						</div>
					))}
				</div>
			</GlassCard>

			<GlassCard title="Content breakdown" hover>
				<div className="space-y-4">
					<div>
						<Label>First 3-second hook</Label>
						<textarea
							className={`${inputClass} min-h-[80px] resize-y`}
							value={content.firstThreeSecondHook}
							onChange={(e) =>
								setContent((c) => ({ ...c, firstThreeSecondHook: e.target.value }))
							}
							placeholder="What you say or show in the first 3 seconds (word for word if you can)"
							rows={2}
						/>
					</div>
					<div>
						<Label>Full script or summary</Label>
						<textarea
							className={`${inputClass} min-h-[100px] resize-y`}
							value={content.fullScriptOrSummary}
							onChange={(e) =>
								setContent((c) => ({ ...c, fullScriptOrSummary: e.target.value }))
							}
							placeholder="Paste script or a short beat-by-beat summary of what happens"
							rows={4}
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<Label>Editing style</Label>
							<input
								type="text"
								className={inputClass}
								value={content.editingStyle}
								onChange={(e) => setContent((c) => ({ ...c, editingStyle: e.target.value }))}
								placeholder="e.g. Jump cuts, captions, B-roll, greenscreen"
							/>
						</div>
						<div>
							<Label>Pacing</Label>
							<input
								type="text"
								className={inputClass}
								value={content.pacing}
								onChange={(e) => setContent((c) => ({ ...c, pacing: e.target.value }))}
								placeholder="e.g. Fast cuts every 2s, one long take, etc."
							/>
						</div>
					</div>
					<div>
						<Label>Subtitle usage</Label>
						<input
							type="text"
							className={inputClass}
							value={content.subtitleUsage}
							onChange={(e) => setContent((c) => ({ ...c, subtitleUsage: e.target.value }))}
							placeholder="None, full captions, keywords only, etc."
						/>
					</div>
					<div>
						<Label>Visual changes / pattern interrupts</Label>
						<input
							type="text"
							className={inputClass}
							value={content.visualChangesPatternInterrupts}
							onChange={(e) =>
								setContent((c) => ({
									...c,
									visualChangesPatternInterrupts: e.target.value,
								}))
							}
							placeholder="Text pops, zooms, scene changes, meme inserts…"
						/>
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<Label>Emotional angle</Label>
							<input
								type="text"
								className={inputClass}
								value={content.emotionalAngle}
								onChange={(e) =>
									setContent((c) => ({ ...c, emotionalAngle: e.target.value }))
								}
								placeholder="e.g. Humor, outrage, hope, curiosity"
							/>
						</div>
						<div>
							<Label>Value type</Label>
							<select
								className={inputClass}
								value={content.valueType}
								onChange={(e) =>
									setContent((c) => ({
										...c,
										valueType: e.target.value as ValueType | "",
									}))
								}
							>
								<option value="" disabled className="bg-zinc-900 text-zinc-500">
									Choose value type…
								</option>
								{VALUE_TYPES.map((v) => (
									<option key={v.value} value={v.value} className="bg-zinc-900">
										{v.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</GlassCard>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full rounded-xl bg-gradient-to-r from-premium-purple to-premium-blue px-6 py-4 text-sm font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.3)] transition hover:opacity-95 disabled:opacity-60"
			>
				{isLoading ? "Analyzing…" : "Run analysis"}
			</button>
		</form>
	);
}
