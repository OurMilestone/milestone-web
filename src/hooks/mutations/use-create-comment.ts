"use client";

import { createCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCommentAction,

		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message || "Comment added successfully!");
			} else {
				toast.error("Failed to add comment", { description: res.message });
			}
		},

		onError: (error) => {
			toast.error("Comment creation failed", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},

		onSettled: (_, __, { task }) => {
			// Invalidate task detail queries to refresh comments
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskDetail(task.toString()),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComments(Number(task)),
			});
		},
	});
}
