import { deleteCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			taskUuid,
			...rest
		}: { commentUuid: string; taskUuid: string }) => {
			return await deleteCommentAction(rest.commentUuid);
		},

		onSuccess: (_res, variables) => {
			if (variables?.taskUuid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.taskComments(variables.taskUuid),
				});
			}
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
