import { updateCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			taskUuid,
			...rest
		}: { commentUuid: string; content: string; taskUuid: string }) =>
			updateCommentAction(rest.commentUuid, rest.content),

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
