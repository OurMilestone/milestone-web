import { createCommentAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			taskUuid,
			...rest
		}: {
			task: number;
			content: string;
			parent?: number;
			mentions: string[];
			taskUuid: string;
		}) => createCommentAction(rest),

		onSuccess: (res, variables) => {
			console.log(res);
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskComments(variables.taskUuid),
			});
		},

		// onSettled: (_, __, variables) => {
		// 	if (variables?.taskUuid) {
		// 		queryClient.invalidateQueries({
		// 			queryKey: queryKeys.taskComments(variables.taskUuid),
		// 		});
		// 	}
		// },
	});
}
