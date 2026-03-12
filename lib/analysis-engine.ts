/**
 * Rule-based Short Form Content Analysis Engine
 * Produces actionable insights from video info + metrics. Can be swapped for a real AI backend later.
 */

import type {
	AnalyzerInput,
	AnalysisResult,
	ScoreCategory,
	VerdictType,
} from "@/types/analyzer";

function scoreHook(
	hook: string,
	retentionRate: number,
	completionRate: number,
): number {
	const hasHook = hook.trim().length >= 10;
	const retentionScore = Math.min(100, retentionRate * 1.2);
	const completionScore = Math.min(100, completionRate * 1.1);
	if (!hasHook) return Math.round((retentionScore + completionScore) / 2.5);
	return Math.round((retentionScore + completionScore + (hasHook ? 20 : 0)) / 2);
}

function scoreRetention(
	retentionRate: number,
	completionRate: number,
	avgViewDuration: number,
	videoLength: number,
): number {
	const retention = retentionRate;
	const completion = completionRate;
	const hold = videoLength > 0 ? (avgViewDuration / videoLength) * 100 : 0;
	return Math.round((retention + completion + hold) / 3);
}

function scoreShareability(shares: number, views: number, saves: number): number {
	if (views === 0) return 50;
	const shareRate = (shares / views) * 100;
	const saveRate = (saves / views) * 100;
	const combined = Math.min(100, shareRate * 20 + saveRate * 15);
	return Math.round(combined);
}

function scoreClarity(scriptLength: number, subtitleUsage: string): number {
	const hasSubtitles = subtitleUsage.toLowerCase().includes("yes") || subtitleUsage.length > 3;
	const scriptScore = Math.min(100, Math.floor(scriptLength / 5) + 30);
	return Math.round(scriptScore * 0.6 + (hasSubtitles ? 25 : 15));
}

function scoreNovelty(
	formatType: string,
	valueType: string,
	emotionalAngle: string,
): number {
	const novelFormats = ["cinematic", "storytelling", "educational"];
	const isNovel = novelFormats.some((f) => formatType.toLowerCase().includes(f));
	const hasAngle = emotionalAngle.trim().length > 5;
	const valueDiversity = valueType !== "other" ? 15 : 5;
	return Math.round(50 + (isNovel ? 20 : 10) + (hasAngle ? 15 : 0) + valueDiversity);
}

function scoreAudienceFit(
	targetAudience: string,
	niche: string,
	profileVisits: number,
	views: number,
): number {
	const hasAudience = targetAudience.trim().length > 3 && niche.trim().length > 3;
	const visitRate = views > 0 ? Math.min(100, (profileVisits / views) * 500) : 50;
	return Math.round(visitRate * 0.5 + (hasAudience ? 25 : 15));
}

function scoreScriptQuality(
	scriptLength: number,
	pacing: string,
	editingStyle: string,
): number {
	const pacingScore = pacing.length > 4 ? 70 : 50;
	const editingScore = editingStyle.length > 4 ? 70 : 50;
	const scriptScore = Math.min(100, 40 + Math.floor(scriptLength / 10));
	return Math.round((scriptScore + pacingScore + editingScore) / 3);
}

function scoreEngagement(
	likes: number,
	comments: number,
	views: number,
): number {
	if (views === 0) return 50;
	const likeRate = (likes / views) * 100;
	const commentRate = (comments / views) * 100;
	return Math.round(Math.min(100, likeRate * 50 + commentRate * 100));
}

function scoreConversion(
	followsGained: number,
	profileVisits: number,
	ctaUsed: string,
	conversionRate: number,
): number {
	const hasCta = ctaUsed.trim().length > 2;
	const followRate = profileVisits > 0 ? (followsGained / profileVisits) * 100 : 0;
	const combined = Math.min(100, followRate * 2 + conversionRate * 0.5 + (hasCta ? 20 : 0));
	return Math.round(combined);
}

function computeVerdict(
	scores: Record<string, number>,
	metrics: AnalyzerInput["metrics"],
): VerdictType {
	const hook = scores["Hook Strength"] ?? 50;
	const retention = scores["Retention Potential"] ?? 50;
	const packaging = scores["Clarity"] ?? 50;
	const engagement = scores["Engagement Potential"] ?? 50;
	const fit = scores["Audience Fit"] ?? 50;
	const script = scores["Script Quality"] ?? 50;
	const conversion = scores["Conversion Potential"] ?? 50;
	const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

	const { views, likes, retentionRatePercent, completionRatePercent } = metrics;
	const highViews = views >= 10000;
	const lowEngagement = views > 0 && likes / views < 0.02;
	const highRetention = retentionRatePercent >= 50 && completionRatePercent >= 40;
	const weakHook = hook < 45;
	const strongScript = script >= 65;
	const weakPackaging = packaging < 50;
	const weakFit = fit < 45;

	if (avg >= 72 && highRetention && engagement >= 60) return "High Performer";
	if (retention < 55 && engagement >= 55) return "Strong but Needs Better Retention";
	if (packaging < 52 && script >= 58) return "Good Content, Weak Packaging";
	if (weakHook && strongScript) return "Weak Hook, Strong Core Idea";
	if (weakFit && avg < 55) return "Poor Audience-Market Fit";
	if (highViews && lowEngagement) return "Good Content, Weak Packaging";
	if (avg >= 55 && avg < 72) return "Solid Mid-Tier Performer";
	if (strongScript && (weakPackaging || weakHook)) return "High Potential, Execution Gaps";
	return "Underperformer - Needs Rework";
}

export function runAnalysis(input: AnalyzerInput): AnalysisResult {
	const { basicInfo, metrics, content } = input;
	const {
		videoTitle,
		platform,
		topic,
		niche,
		targetAudience,
		videoLengthSeconds,
		ctaUsed,
		formatType,
	} = basicInfo;
	const {
		views,
		likes,
		comments,
		shares,
		saves,
		avgViewDurationSeconds,
		retentionRatePercent,
		completionRatePercent,
		profileVisits,
		followsGained,
		conversionRatePercent,
	} = metrics;
	const {
		firstThreeSecondHook,
		fullScriptOrSummary,
		editingStyle,
		pacing,
		subtitleUsage,
		visualChangesPatternInterrupts,
		emotionalAngle,
		valueType,
	} = content;

	// Score categories
	const hookStrength = scoreHook(
		firstThreeSecondHook,
		retentionRatePercent,
		completionRatePercent,
	);
	const retentionPotential = scoreRetention(
		retentionRatePercent,
		completionRatePercent,
		avgViewDurationSeconds,
		videoLengthSeconds,
	);
	const shareability = scoreShareability(shares, views, saves);
	const clarity = scoreClarity(fullScriptOrSummary.length, subtitleUsage);
	const novelty = scoreNovelty(formatType, valueType, emotionalAngle);
	const audienceFit = scoreAudienceFit(
		targetAudience,
		niche,
		profileVisits,
		views,
	);
	const scriptQuality = scoreScriptQuality(
		fullScriptOrSummary.length,
		pacing,
		editingStyle,
	);
	const engagementPotential = scoreEngagement(likes, comments, views);
	const conversionPotential = scoreConversion(
		followsGained,
		profileVisits,
		ctaUsed,
		conversionRatePercent,
	);

	const scoreMap: Record<string, number> = {
		"Hook Strength": hookStrength,
		"Retention Potential": retentionPotential,
		Shareability: shareability,
		Clarity: clarity,
		Novelty: novelty,
		"Audience Fit": audienceFit,
		"Script Quality": scriptQuality,
		"Engagement Potential": engagementPotential,
		"Conversion Potential": conversionPotential,
	};

	const scoreCategories: ScoreCategory[] = Object.entries(scoreMap).map(
		([name, score]) => ({
			name,
			score,
			label: score >= 70 ? "Strong" : score >= 50 ? "Average" : "Needs work",
		}),
	);

	const overallScore = Math.round(
		Object.values(scoreMap).reduce((a, b) => a + b, 0) / scoreCategories.length,
	);
	const verdict = computeVerdict(scoreMap, metrics);

	// Text analyses (rule-based)
	const strengths: string[] = [];
	const weaknesses: string[] = [];
	const whyPerformedWell: string[] = [];
	const whyUnderperformed: string[] = [];

	if (hookStrength >= 60)
		strengths.push("Strong hook in the first 3 seconds—good chance of stopping the scroll.");
	else weaknesses.push("Hook could be sharper; first 3 seconds are critical for retention.");

	if (retentionPotential >= 55)
		whyPerformedWell.push(
			`Retention (${retentionRatePercent}%) and completion (${completionRatePercent}%) suggest viewers stayed for the content.`,
		);
	else
		whyUnderperformed.push(
			`Low retention/completion indicates viewers dropped early—review hook and pacing.`,
		);

	if (engagementPotential >= 55 && views > 0)
		whyPerformedWell.push(
			`Engagement rate (likes/comments relative to views) shows the audience responded.`,
		);
	else if (views > 100 && engagementPotential < 45)
		whyUnderperformed.push(
			"Views didn’t convert to engagement; content may not be prompting interaction.",
		);

	if (shareability >= 50 && (shares > 0 || saves > 0))
		strengths.push("Saves/shares indicate the video offered repeat or shareable value.");
	if (shareability < 45 && views > 500)
		weaknesses.push("Low saves/shares—consider clearer value or a stronger “save this” moment.");

	if (scriptQuality >= 60) strengths.push("Script and pacing show clear structure and intent.");
	if (scriptQuality < 50)
		weaknesses.push("Script or pacing could be tighter; clarity drives retention.");

	if (audienceFit >= 55)
		whyPerformedWell.push(
			`Targeting "${targetAudience}" in "${niche}" appears aligned with who watched.`,
		);
	if (audienceFit < 50)
		whyUnderperformed.push(
			"Audience or niche may be misaligned with who’s actually viewing.",
		);

	if (conversionPotential >= 50 && ctaUsed.trim().length > 2)
		strengths.push("CTA is present and conversion metrics show some follow-through.");
	if (conversionPotential < 45 && profileVisits > 0)
		weaknesses.push("Profile visits didn’t convert well; strengthen end CTA or offer.");

	if (fullScriptOrSummary.length < 50 && retentionPotential < 50)
		whyUnderperformed.push("Short or vague script may have led to a weak payoff.");
	if (visualChangesPatternInterrupts.length > 5)
		strengths.push("Visual changes/pattern interrupts help maintain attention.");

	// Ensure we have at least some content in each array
	if (strengths.length === 0) strengths.push("Clear topic and defined format provide a base to build on.");
	if (weaknesses.length === 0) weaknesses.push("There’s room to sharpen hook and retention tactics.");
	if (whyPerformedWell.length === 0)
		whyPerformedWell.push("Baseline metrics suggest there’s interest in the topic.");
	if (whyUnderperformed.length === 0)
		whyUnderperformed.push("Small tweaks to hook and structure could lift performance.");

	const overallSummary =
		`This ${platform.replace("_", " ")} video in "${topic}" scored ${overallScore}/100 (${verdict}). ` +
		(retentionPotential >= 55
			? "Retention and completion are strengths; focus on engagement and conversion."
			: "Improving the opening and retention should be the top priority.");

	const hookAnalysis =
		firstThreeSecondHook.trim().length >= 10
			? `Your hook ("${firstThreeSecondHook.slice(0, 80)}${firstThreeSecondHook.length > 80 ? "…" : ""}") sets the stage. ` +
				(retentionRatePercent >= 45
					? "Combined with solid retention, it’s likely working to hold viewers."
					: "Consider making the first second more visually or verbally arresting.")
			: "A specific, punchy hook in the first 3 seconds is missing or too short. Lead with a clear promise, question, or pattern interrupt.";

	const retentionAnalysis =
		`Retention rate: ${retentionRatePercent}%; completion: ${completionRatePercent}%. ` +
		(videoLengthSeconds > 0
			? `Avg view duration ${avgViewDurationSeconds}s of ${videoLengthSeconds}s. `
			: "") +
		(retentionRatePercent >= 50
			? "Viewers are staying—keep the same structure and test variations."
			: "Focus on a stronger hook and removing any slow or redundant beats in the first 5 seconds.");

	const engagementAnalysis =
		views > 0
			? `Likes: ${likes}, comments: ${comments}, shares: ${shares} (relative to ${views} views). ` +
				(likes / views >= 0.03
					? "Engagement rate is healthy; double down on what prompted responses."
					: "Try a clearer ask (e.g. 'comment your take') or more relatable/controversial angle.")
			: "No view data yet—run the video and re-run the analyzer for engagement insights.";

	const topicMarketFitAnalysis =
		`Topic: "${topic}"; Niche: "${niche}"; Target: "${targetAudience}". ` +
		(profileVisits > 0 && views > 0
			? `Profile visits (${profileVisits}) vs views suggest ${profileVisits / views >= 0.02 ? "good" : "moderate"} intent. `
			: "") +
		"Ensure your title and thumbnail match this positioning so the right audience clicks.";

	const scriptQualityAnalysis =
		fullScriptOrSummary.length > 100
			? "You have a developed script or summary—structure and pacing are likely contributing. " +
				(pacing.toLowerCase().includes("fast") || pacing.length > 4
					? "Pacing is noted; keep edits tight to match."
					: "Consider tightening pacing to match short-form expectations.")
			: "Script/summary is brief. For educational or story-driven content, a clearer beat-by-beat structure can improve retention and shareability.";

	const packagingAnalysis =
		`Format: ${formatType}; editing: ${editingStyle}; subtitles: ${subtitleUsage}. ` +
		(visualChangesPatternInterrupts.trim().length > 3
			? "Visual changes/pattern interrupts are noted—they help retention."
			: "Consider adding more visual cuts or pattern interrupts every 3–5 seconds.");

	const ctaEffectiveness =
		ctaUsed.trim().length > 2
			? `CTA: "${ctaUsed.slice(0, 60)}${ctaUsed.length > 60 ? "…" : ""}". ` +
				(followsGained > 0 || conversionRatePercent > 0
					? `Follows gained: ${followsGained}; conversion signals are present. Keep testing different CTAs.`
					: "Try a more specific or low-friction CTA to improve follows/conversions.")
			: "No clear CTA was noted. Adding a direct ask (follow, comment, link, or next step) can improve conversion.";

	const improvementSuggestions: string[] = [];
	if (hookStrength < 55)
		improvementSuggestions.push("Open with a single clear hook (question, bold claim, or visual) in the first 1–2 seconds.");
	if (retentionPotential < 50)
		improvementSuggestions.push("Trim or restructure the first 5 seconds; remove any slow setup.");
	if (engagementPotential < 50 && views > 0)
		improvementSuggestions.push("Add a direct engagement ask (e.g. 'Comment below', 'Save this') and place it where value peaks.");
	if (conversionPotential < 50)
		improvementSuggestions.push("End with one clear CTA and a reason to follow or take action.");
	if (clarity < 55)
		improvementSuggestions.push("Use on-screen text or subtitles to reinforce key points and hold attention.");
	if (scriptQuality < 55)
		improvementSuggestions.push("Outline your script in 3–5 beats and cut anything that doesn’t serve the main point.");

	if (improvementSuggestions.length === 0)
		improvementSuggestions.push("A/B test hooks and CTAs; refine based on retention and conversion data.");

	const nextVideoRecommendations: string[] = [
		"Replicate the strongest element (hook, structure, or CTA) in your next video and change one variable to test.",
		retentionRatePercent >= 50
			? "Try the same format with a different topic or angle to see if retention holds."
			: "Test a shorter video (e.g. 50% of this length) with the same hook to isolate length vs. content.",
		"Track the same metrics (retention, completion, engagement, follows) and compare run-over-run.",
	];

	return {
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
	};
}
