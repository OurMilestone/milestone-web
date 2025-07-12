"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSubtasks(taskId: number) {
	return useQuery({
		queryKey: queryKeys.subtasks.byTaskId(taskId),
		queryFn: () => clientApi.getSubtasksByTaskId(taskId.toString()),
		staleTime: 10 * 60 * 1000,
		placeholderData: keepPreviousData,
	});
}
