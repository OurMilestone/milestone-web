import "server-only";
import { getActiveProjectsWithMembers } from "@/lib/data-access-layer/projects.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProjectsGrid } from "./project-grid";

interface DashboardProjectsServerProps {
	userRole: UserRole;
}

export default async function DashboardProjectsServer({
	userRole,
}: DashboardProjectsServerProps) {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.projects.activeWithMembers,
		queryFn: getActiveProjectsWithMembers,
		staleTime: 60 * 1000,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ProjectsGrid userRole={userRole} />
		</HydrationBoundary>
	);
}
