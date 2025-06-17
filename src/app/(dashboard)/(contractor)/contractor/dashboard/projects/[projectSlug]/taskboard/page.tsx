import { TaskBoardClient } from "@/components/dashboard/taskboard/taskboard-client";
import { AppRoutePaths } from "@/config/routes-config";
import { getTaskBoardPageData } from "@/lib/data-access-layer/tasks.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../../../../auth";

export default async function ContractorTaskBoardPage(props: {
	params: Promise<{ projectSlug: string; userRole: UserRole }>;
}) {
	const session = await auth();
	const { projectSlug, userRole } = await props.params;
	const projectId = Number.parseInt(projectSlug, 10);

	if (Number.isNaN(projectId)) {
		redirect(AppRoutePaths.ContractorDashboard.Projects.Home);
	}

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	const queryClient = getQueryClient();

	queryClient.prefetchQuery({
		queryKey: queryKeys.tasks.byProjectId(projectId),
		queryFn: () => getTaskBoardPageData(projectId),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TaskBoardClient
				userRole={userRole}
				projectId={projectId}
				projectSlug={projectSlug}
			/>
		</HydrationBoundary>
	);
}
