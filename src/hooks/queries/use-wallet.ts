"use client";
import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useWallet() {
	return useQuery({
		queryKey: queryKeys.wallet,
		queryFn: async () => {
			const res = await clientApi.getWallet();
			if (!res.success || !res.data) throw new Error(res.message);
			return res.data;
		},
		staleTime: 5 * 60 * 1000,
	});
}
