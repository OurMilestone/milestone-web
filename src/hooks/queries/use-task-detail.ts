"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTaskDetailData(projectId: number, taskId: string) {
	return useQuery({
		queryKey: queryKeys.taskDetail(taskId),
		queryFn: () => clientApi.getTaskDetailPageData(projectId, taskId),
		staleTime: 10 * 60 * 1000,
		placeholderData: keepPreviousData,
	});
}
