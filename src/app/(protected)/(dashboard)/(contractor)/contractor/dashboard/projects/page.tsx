import { ProjectsPageClient } from "@/components/dashboard/projects/projects-page-client";
import { AppRoutePaths } from "@/config/routes-config";
import { getAllProjectsWithMembers } from "@/lib/data-access-layer/projects.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../../../auth";

export default async function ContractorDashboardProjectsPage() {
	const session = await auth();

	if (!session || !session.user || session?.user?.role !== "Contractor") {
		redirect(AppRoutePaths.SignIn);
	}

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.projects.allWithMembers,
		queryFn: getAllProjectsWithMembers,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectsPageClient userRole={session.user.role} />
		</HydrationBoundary>
	);
}
