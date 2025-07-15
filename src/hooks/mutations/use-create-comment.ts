"use client";

import { createCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			task,
			content,
			parent,
			mentions,
		}: {
			task: number;
			content: string;
			parent?: number;
			mentions: string[];
			taskUuid: string;
		}) => createCommentAction({ task, content, parent, mentions }),

		onSuccess: (res, variables) => {
			if (res.success) {
				toast.success(res.message || "Comment added successfully!");
			} else {
				toast.error("Failed to add comment", { description: res.message });
			}
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComments(variables.taskUuid),
			});
		},

		onError: (error) => {
			toast.error("Comment creation failed", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},

		onSettled: (_, __, variables) => {
			if (variables?.taskUuid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.taskComments(variables.taskUuid),
				});
			}
		},
	});
}
