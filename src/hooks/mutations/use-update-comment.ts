import { updateCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			commentUuid,
			content,
			taskId,
		}: { commentUuid: string; content: string; taskId: number }) =>
			updateCommentAction(commentUuid, content),

		onSuccess: (res) => {
			if (res.success) {
				toast.success(res.message || "Comment updated successfully!");
			} else {
				toast.error("Failed to update comment", { description: res.message });
			}
		},

		onError: (error) => {
			toast.error("Comment update failed", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},

		onSettled: (_, __, { commentUuid, taskId }) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComment(commentUuid),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComments(taskId),
			});
		},
	});
}
