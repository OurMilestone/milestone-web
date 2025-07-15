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
			taskUuid,
		}: { commentUuid: string; content: string; taskUuid: string }) =>
			updateCommentAction(commentUuid, content),

		onSuccess: (res, variables) => {
			if (res.success) {
				toast.success(res.message || "Comment updated successfully!");
			} else {
				toast.error("Failed to update comment", { description: res.message });
			}
			if (variables?.taskUuid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.taskComments(variables.taskUuid),
				});
			}
		},

		onError: (error) => {
			toast.error("Comment update failed", {
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
