"use client";

import { updateSubtaskAction } from "@/actions/dashboard/tasks.action";
import {
	type SubtaskDTO,
	type TaskDetailPageData,
	TaskStatus,
} from "@/lib/data-access-layer/DTOs/task.dto";
import { queryKeys } from "@/lib/query/query-keys";
import type { CreateSubtaskInput } from "@/lib/schemas/task-schema";
import type { Subtask } from "@/types/dashboard/task-details-types";
import type { TaskPriority } from "@/types/dashboard/taskboard-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateSubtaskMutationProps {
	subtaskUuid: string;
	data: Partial<CreateSubtaskInput>;
}

export function useUpdateSubtask(taskId: number, taskUuid: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ subtaskUuid, data }: UpdateSubtaskMutationProps) =>
			updateSubtaskAction(subtaskUuid, data),

		onMutate: async ({ subtaskUuid, data }) => {
			await queryClient.cancelQueries({
				queryKey: queryKeys.taskDetail(taskUuid),
			});

			await queryClient.cancelQueries({
				queryKey: queryKeys.subtasks.byTaskId(taskUuid),
			});

			const previousTaskDetail = queryClient.getQueryData<TaskDetailPageData>(
				queryKeys.taskDetail(taskUuid),
			);

			const previousSubtasks = queryClient.getQueryData<SubtaskDTO[]>(
				queryKeys.subtasks.byTaskId(taskUuid),
			);

			const getUIUpdates = (apiData: Partial<CreateSubtaskInput>) => {
				const updates: Partial<Subtask & SubtaskDTO> = {};

				if (apiData.status) {
					const statusToColumnMap = {
						BACKLOG: "backlog",
						IN_PROGRESS: "in_progress",
						IN_REVIEW: "in_review",
						DONE: "done",
						PENDING: "backlog",
						CANCELLED: "backlog",
					} as const;

					updates.columnId = statusToColumnMap[apiData.status] || "backlog";
					updates.isCompleted = apiData.status === "DONE";

					const validStatuses: TaskStatus[] = [
						TaskStatus.IN_PROGRESS,
						TaskStatus.IN_REVIEW,
						TaskStatus.DONE,
						TaskStatus.PENDING,
						TaskStatus.BACKLOG,
					];
					if (validStatuses.includes(apiData.status as TaskStatus)) {
						updates.status = apiData.status as TaskStatus;
					}
				}

				if (apiData.priority) {
					updates.priority = apiData.priority.toLowerCase() as TaskPriority;
				}

				const { status, priority, ...restOfApiData } = apiData;
				return { ...restOfApiData, ...updates };
			};

			const uiUpdates = getUIUpdates(data);

			queryClient.setQueryData<TaskDetailPageData>(
				queryKeys.taskDetail(taskUuid),
				(oldData) => {
					if (!oldData) return undefined;

					const updatedSubtasks = oldData.mainTask.sub_tasks.map((subtask) =>
						subtask.uuid === subtaskUuid
							? { ...subtask, ...uiUpdates }
							: subtask,
					);

					return {
						...oldData,
						mainTask: {
							...oldData.mainTask,
							sub_tasks: updatedSubtasks,
						},
					};
				},
			);

			queryClient.setQueryData<SubtaskDTO[]>(
				queryKeys.subtasks.byTaskId(taskUuid),
				(oldData) => {
					if (!oldData) return undefined;

					return oldData.map((subtask) =>
						subtask.uuid === subtaskUuid
							? { ...subtask, ...uiUpdates }
							: subtask,
					);
				},
			);

			return { previousTaskDetail, previousSubtasks };
		},

		onSuccess: (result) => {
			if (result.success) {
				toast.success(result.message || "Subtask updated successfully!");
			} else {
				toast.error("Update failed", { description: result.message });
			}
		},

		onError: (error, variables, context) => {
			toast.error("Update failed", { description: error.message });

			if (context?.previousTaskDetail) {
				queryClient.setQueryData(
					queryKeys.taskDetail(taskUuid),
					context.previousTaskDetail,
				);
			}

			if (context?.previousSubtasks) {
				queryClient.setQueryData(
					queryKeys.subtasks.byTaskId(taskUuid),
					context.previousSubtasks,
				);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskDetail(taskUuid),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.subtasks.byTaskId(taskUuid),
			});
		},

		retry: 1,
	});
}
