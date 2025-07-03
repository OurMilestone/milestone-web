"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useBanks() {
	return useQuery({
		queryKey: queryKeys.banks.list,
		queryFn: async () => {
			const res = await clientApi.getBanks();
			if (!res.success) throw new Error(res.message);
			return res.data;
		},
		staleTime: 24 * 60 * 60 * 1000,
	});
}
