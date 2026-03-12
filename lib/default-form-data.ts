import type { AnalyzerInput } from "@/types/analyzer";

/**
 * Empty baseline for types/tests. The form keeps its own empty state in the UI.
 */
export const defaultAnalyzerInput: AnalyzerInput = {
	basicInfo: {
		videoTitle: "",
		platform: "tiktok",
		topic: "",
		niche: "",
		targetAudience: "",
		videoLengthSeconds: 0,
		postingTime: "",
		ctaUsed: "",
		formatType: "other",
	},
	metrics: {
		views: 0,
		likes: 0,
		comments: 0,
		shares: 0,
		saves: 0,
		watchTimeSeconds: 0,
		avgViewDurationSeconds: 0,
		retentionRatePercent: 0,
		completionRatePercent: 0,
		profileVisits: 0,
		followsGained: 0,
		clickThroughRatePercent: 0,
		conversionRatePercent: 0,
	},
	content: {
		firstThreeSecondHook: "",
		fullScriptOrSummary: "",
		editingStyle: "",
		pacing: "",
		subtitleUsage: "",
		visualChangesPatternInterrupts: "",
		emotionalAngle: "",
		valueType: "other",
	},
};
