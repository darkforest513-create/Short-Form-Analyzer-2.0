"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types/analyzer";
import type { AnalyzerInput } from "@/types/analyzer";
import { runAnalysis } from "@/lib/analysis-engine";
import { UserBadge } from "@/components/ui/UserBadge";
import { AnalyzerForm } from "./AnalyzerForm";
import { ResultsDashboard } from "./ResultsDashboard";

interface AnalyzerDashboardProps {
	username: string;
}

/**
 * Main client dashboard: navbar, form, and results.
 * Results appear only after the user runs analysis (no pre-filled “done” state).
 */
export function AnalyzerDashboard({ username }: AnalyzerDashboardProps) {
	const [lastResult, setLastResult] = useState<AnalysisResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (data: AnalyzerInput) => {
		setIsLoading(true);
		setTimeout(() => {
			const analysis = runAnalysis(data);
			setLastResult(analysis);
			setIsLoading(false);
		}, 800);
	};

	return (
		<div className="min-h-screen premium-bg">
			<header className="sticky top-0 z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<h1 className="text-lg font-semibold tracking-tight text-white">
						Short Form Analyzer
					</h1>
					<UserBadge username={username} />
				</div>
			</header>

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-10 text-center">
					<h2 className="text-2xl font-bold text-white sm:text-3xl">
						Understand why your short-form content wins or falls flat
					</h2>
					<p className="mt-2 max-w-2xl mx-auto text-sm text-zinc-400">
						Fill in your video details and analytics below, then run the analysis.
						Fields start empty so it&apos;s clear what you need to add.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
					<div className="lg:sticky lg:top-24 lg:self-start">
						<AnalyzerForm onSubmit={handleSubmit} isLoading={isLoading} />
					</div>

					<div className="min-w-0">
						{isLoading ? (
							<div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-20 backdrop-blur-xl">
								<div className="h-10 w-10 animate-spin rounded-full border-2 border-premium-purple border-t-transparent" />
								<p className="mt-4 text-sm text-zinc-500">Analyzing your video…</p>
							</div>
						) : lastResult ? (
							<ResultsDashboard result={lastResult} />
						) : (
							<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center backdrop-blur-xl">
								<p className="max-w-md text-sm font-medium text-zinc-300">
									Your analysis will appear here
								</p>
								<p className="mt-2 max-w-md text-sm text-zinc-500">
									Complete the form on the left with your own video data, then click{" "}
									<span className="text-zinc-400">Run analysis</span>. Nothing is
									pre-filled—add your numbers and context so the report matches your
									post.
								</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
