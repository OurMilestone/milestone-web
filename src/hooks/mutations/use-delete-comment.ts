import { deleteCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			commentUuid,
			taskUuid,
		}: { commentUuid: string; taskUuid: string }) => {
			return await deleteCommentAction(commentUuid);
		},

		onSuccess: (res, variables) => {
			if (res.success) {
				toast.success(res.message || "Comment deleted successfully!");
			} else {
				toast.error("Failed to delete comment", { description: res.message });
			}
			if (variables?.taskUuid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.taskComments(variables.taskUuid),
				});
			}
		},

		onError: (error) => {
			toast.error("Comment delete failed", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},

		onSettled: (_, __, { commentUuid, taskUuid }) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComment(commentUuid),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComments(taskUuid),
			});
		},
	});
}
