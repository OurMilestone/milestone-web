"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useTaskBoardData(projectId: number) {
	return useQuery({
		queryKey: queryKeys.tasks.byProjectId(projectId),
		queryFn: () => clientApi.getTaskBoardData(projectId),
		staleTime: 60 * 1000,
		placeholderData: keepPreviousData,
	});
}
