import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { AnalyzerDashboard } from "@/components/analyzer/AnalyzerDashboard";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	const { experienceId } = await params;

	// Ensure the user is logged in on Whop and fetch their profile
	const { userId } = await whopsdk.verifyUserToken(await headers());
	const [user, access] = await Promise.all([
		whopsdk.users.retrieve(userId),
		whopsdk.users.checkAccess(experienceId, { id: userId }),
	]);

	const displayName = user.name || (user.username ? `@${user.username}` : "Creator");

	return (
		<AnalyzerDashboard username={displayName} />
	);
}
