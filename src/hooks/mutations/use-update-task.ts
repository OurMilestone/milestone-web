"use client";

import { updateTaskFieldAction } from "@/actions/dashboard/tasks.action";
import type { TaskDetailPageData } from "@/lib/data-access-layer/DTOs/task.dto";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateTaskField(taskUuid: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTaskFieldAction,

		onMutate: async (variables) => {
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

					const updatedFields = { ...variables.fields };

					if (updatedFields.status) {
						updatedFields.status = String(updatedFields.status).toUpperCase() as
							| "BACKLOG"
							| "IN_PROGRESS"
							| "IN_REVIEW"
							| "DONE"
							| "PENDING"
							| "CANCELLED";
					}

					if (updatedFields.priority) {
						updatedFields.priority = (
							typeof updatedFields.priority === "string"
								? updatedFields.priority.toUpperCase()
								: updatedFields.priority
						) as "LOW" | "MEDIUM" | "HIGH" | "URGENT";
					}

					return {
						...oldData,
						mainTask: {
							...oldData.mainTask,
							...updatedFields,
						},
					} as TaskDetailPageData;
				},
			);

			return { previousData };
		},

		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message);
			} else {
				toast.error("Update failed", { description: res.message });
			}
		},

		onError: (err, variables, context) => {
			toast.error("Update failed", { description: err.message });
			if (context?.previousData) {
				queryClient.setQueryData(
					queryKeys.taskDetail(taskUuid),
					context.previousData,
				);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskDetail(taskUuid),
			});
		},
		retry: 2,
	});
}
