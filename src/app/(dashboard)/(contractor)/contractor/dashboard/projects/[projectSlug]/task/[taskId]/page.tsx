import TaskPageClientManager from "@/components/dashboard/taskpage/taskpage-client-manager";
import { AppRoutePaths } from "@/config/routes-config";
import { getTaskDetailPageData } from "@/lib/data-access-layer/tasks.dal";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../../../../../../../../../../auth";

interface FreelancerTaskDetailPageProps {
	params: Promise<{
		projectSlug: string;
		taskId: string;
	}>;
}

export default async function FreelancerTaskDetailPage({
	params,
}: FreelancerTaskDetailPageProps) {
	const session = await auth();
	const { projectSlug, taskId } = await params;
	const projectId = Number.parseInt(projectSlug, 10);

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	const userRole = session.user.role;

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.taskDetail(taskId),
		queryFn: () => getTaskDetailPageData(projectId, taskId),
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<div>Loading Task Details...</div>}>
				<TaskPageClientManager
					userRole={userRole}
					projectId={projectId}
					projectSlug={projectSlug}
					taskId={taskId}
				/>
			</Suspense>
		</HydrationBoundary>
	);
}
