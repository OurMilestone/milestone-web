import { deleteSubtaskAction } from "@/actions/dashboard/tasks.action";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteSubtask(parentTaskId: number, parentTaskUuid: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (subtaskUuid: string) => {
			const response = await deleteSubtaskAction(subtaskUuid);
			if (!response.success) {
				throw new Error(response.message);
			}
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.taskDetail(parentTaskUuid),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.subtasks.byTaskId(parentTaskUuid),
			});
			toast.success("Subtask deleted successfully!");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete subtask.");
		},
	});
}
