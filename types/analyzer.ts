/**
 * Types for the Short Form Content Analyzer
 */

export type Platform = "tiktok" | "reels" | "youtube_shorts";

export type FormatType =
	| "talking_head"
	| "cinematic"
	| "screen_recording"
	| "meme"
	| "storytelling"
	| "educational"
	| "other";

export type ValueType =
	| "education"
	| "entertainment"
	| "inspiration"
	| "controversy"
	| "curiosity"
	| "other";

export interface VideoBasicInfo {
	videoTitle: string;
	platform: Platform;
	topic: string;
	niche: string;
	targetAudience: string;
	videoLengthSeconds: number;
	postingTime: string;
	ctaUsed: string;
	formatType: FormatType;
}

export interface PerformanceMetrics {
	views: number;
	likes: number;
	comments: number;
	shares: number;
	saves: number;
	watchTimeSeconds: number;
	avgViewDurationSeconds: number;
	retentionRatePercent: number;
	completionRatePercent: number;
	profileVisits: number;
	followsGained: number;
	clickThroughRatePercent: number;
	conversionRatePercent: number;
}

export interface ContentBreakdown {
	firstThreeSecondHook: string;
	fullScriptOrSummary: string;
	editingStyle: string;
	pacing: string;
	subtitleUsage: string;
	visualChangesPatternInterrupts: string;
	emotionalAngle: string;
	valueType: ValueType;
}

export interface AnalyzerInput {
	basicInfo: VideoBasicInfo;
	metrics: PerformanceMetrics;
	content: ContentBreakdown;
}

export interface ScoreCategory {
	name: string;
	score: number;
	label: string;
}

export type VerdictType =
	| "High Performer"
	| "Strong but Needs Better Retention"
	| "Good Content, Weak Packaging"
	| "Weak Hook, Strong Core Idea"
	| "Poor Audience-Market Fit"
	| "Solid Mid-Tier Performer"
	| "High Potential, Execution Gaps"
	| "Underperformer - Needs Rework";

export interface AnalysisResult {
	overallScore: number;
	verdict: VerdictType;
	scoreCategories: ScoreCategory[];
	overallSummary: string;
	strengths: string[];
	weaknesses: string[];
	whyPerformedWell: string[];
	whyUnderperformed: string[];
	hookAnalysis: string;
	retentionAnalysis: string;
	engagementAnalysis: string;
	topicMarketFitAnalysis: string;
	scriptQualityAnalysis: string;
	packagingAnalysis: string;
	ctaEffectiveness: string;
	improvementSuggestions: string[];
	nextVideoRecommendations: string[];
}
