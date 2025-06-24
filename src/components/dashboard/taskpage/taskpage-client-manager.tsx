"use client";

import TaskDetailHeaderGlobal from "@/components/dashboard/taskpage/task-detail-header";
import TaskDetailLayout from "@/components/dashboard/taskpage/task-detail-layout";
import { useUpdateTaskStatus } from "@/hooks/mutations/use-update-task-status";
import { useTaskDetailData } from "@/hooks/queries/use-task-detail";
import { queryKeys } from "@/lib/query/query-keys";
import {
	transformApiTaskToUiProjectTaskListItem,
	transformApiTaskToUiTaskDetail,
} from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TaskBoardErrorState } from "../taskboard/taskboard-error-state";
import { TaskDetailPageSkeleton } from "./skeletons/task-detail-page-skeleton";

interface TaskPageClientManagerProps {
	userRole: UserRole;
	projectId: number;
	projectSlug: string;
	taskId: string;
}

export default function TaskPageClientManager({
	userRole,
	projectId,
	projectSlug,
	taskId,
}: TaskPageClientManagerProps) {
	const queryClient = useQueryClient();

	const [isProjectListDrawerOpen, setIsProjectListDrawerOpen] = useState(false);
	const [isPinnedFieldsDrawerOpen, setIsPinnedFieldsDrawerOpen] =
		useState(false);

	const { data, isLoading, error } = useTaskDetailData(projectId, taskId);
	const { mutate: updateTaskStatus, isPending: isUpdatingStatus } =
		useUpdateTaskStatus();

	const toggleProjectListDrawer = () => {
		setIsProjectListDrawerOpen((prev) => !prev);
	};

	const togglePinnedFieldsDrawer = () => {
		setIsPinnedFieldsDrawerOpen((prev) => !prev);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const taskDetailsData = useMemo(
		() => (data ? transformApiTaskToUiTaskDetail(data.mainTask) : null),
		[data?.mainTask],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const projectTasksData = useMemo(
		() =>
			data
				? data.projectTasks.map(transformApiTaskToUiProjectTaskListItem)
				: [],
		[data?.projectTasks],
	);

	const handleRetryFetch = () => {
		queryClient.invalidateQueries({ queryKey: queryKeys.taskDetail(taskId) });
	};

	if (isLoading) {
		return (
			<div className="flex h-full min-h-screen">
				<TaskDetailPageSkeleton />
			</div>
		);
	}

	if (error || !taskDetailsData) {
		return (
			<div className="p-4">
				<TaskBoardErrorState
					errorMessage={error?.message || "Task not found or failed to load."}
					onRetry={handleRetryFetch}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-screen">
			<div className="p-4 flex-shrink-0 bg-white  dark:bg-slate-900">
				<TaskDetailHeaderGlobal
					task={taskDetailsData}
					userRole={userRole}
					onToggleProjectList={toggleProjectListDrawer}
					onTogglePinnedFields={togglePinnedFieldsDrawer}
					updateTaskStatus={updateTaskStatus}
					isUpdatingTaskStatus={isUpdatingStatus}
				/>
			</div>
			<div className="flex-grow">
				<TaskDetailLayout
					task={taskDetailsData}
					projectTasks={projectTasksData}
					currentRole={userRole}
					currentProjectSlug={projectSlug}
					currentTaskId={taskId}
					isProjectListDrawerOpen={isProjectListDrawerOpen}
					onProjectListDrawerOpenChange={setIsProjectListDrawerOpen}
					isPinnedFieldsDrawerOpen={isPinnedFieldsDrawerOpen}
					onPinnedFieldsDrawerOpenChange={setIsPinnedFieldsDrawerOpen}
				/>
			</div>
		</div>
	);
}
