import { ProjectsPageClient } from "@/components/dashboard/projects/projects-page-client";
import { useAuthContext } from "@/components/providers/auth-context-provider";
import { AppRoutePaths } from "@/config/routes-config";
import { getAllProjectsWithMembers } from "@/lib/data-access-layer/projects.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import Intercom from "@intercom/messenger-js-sdk";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../../../auth";

export default async function ContractorDashboardProjectsPage() {
	const session = await auth();

	const { user } = useAuthContext();

	if (!session || !session.user || session?.user?.role !== "Contractor") {
		redirect(AppRoutePaths.SignIn);
	}

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.projects.allWithMembers,
		queryFn: getAllProjectsWithMembers,
	});

	Intercom({
		app_id: "ns7mbq19",
		user_id: user.id,
		name: user.full_name,
		email: user.email,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectsPageClient userRole={session.user.role} />
		</HydrationBoundary>
	);
}
