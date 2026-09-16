import "server-only";

import { DashboardOverview } from "@/components/dashboard/overview/dashboard-overview";
import { getActiveProjectsWithMembers } from "@/lib/data-access-layer/projects.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

interface DashboardOverviewServerProps {
	userRole: UserRole;
	showCreateProject?: boolean;
}

export async function DashboardOverviewServer({
	userRole,
	showCreateProject = false,
}: DashboardOverviewServerProps) {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.projects.activeWithMembers,
		queryFn: getActiveProjectsWithMembers,
		staleTime: 60 * 1000,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<DashboardOverview
				userRole={userRole}
				showCreateProject={showCreateProject}
			/>
		</HydrationBoundary>
	);
}
