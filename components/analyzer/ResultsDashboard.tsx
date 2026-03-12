"use client";

import type { AnalysisResult } from "@/types/analyzer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ResultsDashboardProps {
	result: AnalysisResult;
}

/** Verdict badge color */
function verdictColor(verdict: string): string {
	if (verdict.includes("High Performer")) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
	if (verdict.includes("Underperformer") || verdict.includes("Needs Rework"))
		return "border-red-500/30 bg-red-500/10 text-red-400";
	if (verdict.includes("Strong") || verdict.includes("Solid"))
		return "border-premium-purple/40 bg-premium-purple/10 text-premium-purple";
	return "border-white/20 bg-white/10 text-zinc-300";
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
	const {
		overallScore,
		verdict,
		scoreCategories,
		overallSummary,
		strengths,
		weaknesses,
		whyPerformedWell,
		whyUnderperformed,
		hookAnalysis,
		retentionAnalysis,
		engagementAnalysis,
		topicMarketFitAnalysis,
		scriptQualityAnalysis,
		packagingAnalysis,
		ctaEffectiveness,
		improvementSuggestions,
		nextVideoRecommendations,
	} = result;

	return (
		<div className="space-y-6">
			{/* Overall score & verdict */}
			<GlassCard className="text-center" hover>
				<div className="flex flex-col items-center gap-4">
					<div
						className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl font-bold tabular-nums text-white"
						style={{
							boxShadow: "0 0 40px rgba(139,92,246,0.2)",
						}}
					>
						{overallScore}
					</div>
					<div>
						<p className="text-sm text-zinc-400">Overall score</p>
						<span
							className={`mt-1 inline-block rounded-lg border px-3 py-1 text-sm font-semibold ${verdictColor(verdict)}`}
						>
							{verdict}
						</span>
					</div>
					<p className="max-w-xl text-sm leading-relaxed text-zinc-400">
						{overallSummary}
					</p>
				</div>
			</GlassCard>

			{/* Score breakdown — progress bars */}
			<GlassCard title="Score breakdown" hover>
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
					{scoreCategories.map((cat, i) => (
						<ProgressBar
							key={cat.name}
							label={cat.name}
							score={cat.score}
							variant={
								cat.score >= 70
									? "success"
									: cat.score >= 50
										? "purple"
										: "warning"
							}
						/>
					))}
				</div>
			</GlassCard>

			{/* Strengths & Weaknesses */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<GlassCard title="Strengths" hover>
					<ul className="space-y-2">
						{strengths.map((s, i) => (
							<li
								key={i}
								className="flex gap-2 text-sm text-zinc-300 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-emerald-500/60"
							>
								{s}
							</li>
						))}
					</ul>
				</GlassCard>
				<GlassCard title="Weaknesses" hover>
					<ul className="space-y-2">
						{weaknesses.map((w, i) => (
							<li
								key={i}
								className="flex gap-2 text-sm text-zinc-300 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-amber-500/60"
							>
								{w}
							</li>
						))}
					</ul>
				</GlassCard>
			</div>

			{/* Why it performed well / underperformed */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<GlassCard title="Why it likely performed well" hover>
					<ul className="space-y-2 text-sm text-zinc-400">
						{whyPerformedWell.map((w, i) => (
							<li key={i} className="flex gap-2 before:shrink-0 before:content-['→'] before:text-premium-purple">
								{w}
							</li>
						))}
					</ul>
				</GlassCard>
				<GlassCard title="Why it likely underperformed" hover>
					<ul className="space-y-2 text-sm text-zinc-400">
						{whyUnderperformed.map((w, i) => (
							<li key={i} className="flex gap-2 before:shrink-0 before:content-['→'] before:text-amber-400">
								{w}
							</li>
						))}
					</ul>
				</GlassCard>
			</div>

			{/* Detailed analyses — single column for readability */}
			<GlassCard title="Hook analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">{hookAnalysis}</p>
			</GlassCard>
			<GlassCard title="Retention analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{retentionAnalysis}
				</p>
			</GlassCard>
			<GlassCard title="Engagement analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{engagementAnalysis}
				</p>
			</GlassCard>
			<GlassCard title="Topic / market fit analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{topicMarketFitAnalysis}
				</p>
			</GlassCard>
			<GlassCard title="Script quality analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{scriptQualityAnalysis}
				</p>
			</GlassCard>
			<GlassCard title="Packaging analysis" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{packagingAnalysis}
				</p>
			</GlassCard>
			<GlassCard title="CTA effectiveness" hover>
				<p className="text-sm leading-relaxed text-zinc-400">
					{ctaEffectiveness}
				</p>
			</GlassCard>

			{/* Improvement suggestions */}
			<GlassCard title="Improvement suggestions" hover>
				<ol className="list-decimal space-y-2 pl-4 text-sm text-zinc-400">
					{improvementSuggestions.map((s, i) => (
						<li key={i} className="leading-relaxed">{s}</li>
					))}
				</ol>
			</GlassCard>

			{/* Next video recommendations */}
			<GlassCard title="Next video recommendations" hover>
				<ul className="space-y-2">
					{nextVideoRecommendations.map((r, i) => (
						<li
							key={i}
							className="flex gap-2 text-sm text-zinc-400 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-premium-blue/60"
						>
							{r}
						</li>
					))}
				</ul>
			</GlassCard>
		</div>
	);
}
