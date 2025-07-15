"use client";

import { updateTaskStatusAction } from "@/actions/dashboard/tasks.action";
import type { TaskDetailPageData } from "@/lib/data-access-layer/DTOs/task.dto";
import { queryKeys } from "@/lib/query/query-keys";
import type { KanbanColumnId } from "@/types/dashboard/taskboard-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateTaskStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTaskStatusAction,

		onMutate: async (variables) => {
			const { taskUuid, newStatus } = variables;

			await queryClient.cancelQueries({
				queryKey: queryKeys.taskDetail(taskUuid),
			});

			const previousData = queryClient.getQueryData<TaskDetailPageData>(
				queryKeys.taskDetail(taskUuid),
			);

			queryClient.setQueryData<TaskDetailPageData>(
				queryKeys.taskDetail(taskUuid),
				(oldData) => {
					if (!oldData) return undefined;

					return {
						...oldData,
						mainTask: {
							...oldData.mainTask,
							status: newStatus.toUpperCase() as typeof oldData.mainTask.status,
							columnId: newStatus as KanbanColumnId,
						},
					} as TaskDetailPageData;
				},
			);

			return { previousData };
		},

		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message || "Status updated!");
			} else {
				toast.error("Update failed", { description: res.message });
			}
		},

		onError: (err, variables, context) => {
			toast.error("Status update failed", { description: err.message });

			if (context?.previousData) {
				queryClient.setQueryData(
					queryKeys.taskDetail(variables.taskUuid),
					context.previousData,
				);
			}
		},

		onSettled: (data, error, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskDetail(variables.taskUuid),
			});
		},
	});
}
