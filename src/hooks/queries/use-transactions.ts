"use client";

import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useTransactions() {
	return useQuery({
		queryKey: queryKeys.transactions.base,
		queryFn: async () => {
			const res = await clientApi.getTransactions();
			if (!res.success) throw new Error(res.message);
			return res.data;
		},
		staleTime: 2 * 60 * 1000,
	});
}
