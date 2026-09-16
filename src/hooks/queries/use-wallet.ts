"use client";
import { clientApi } from "@/lib/api/client/client-api";
import { queryKeys } from "@/lib/query/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useWallet() {
	const { status } = useSession();

	return useQuery({
		queryKey: queryKeys.wallet,
		enabled: status === "authenticated",
		queryFn: async () => {
			const res = await clientApi.getWallet();

			// Missing wallet is a valid state — don't throw / retry
			if (res.status === 404 || (!res.data && res.success)) {
				return null;
			}

			if (!res.success) {
				const error = new Error(res.message || "Failed to fetch wallet");
				// biome-ignore lint/suspicious/noExplicitAny: attach status for retry logic
				(error as any).status = res.status;
				throw error;
			}

			return res.data;
		},
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error) => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const status = (error as any)?.status;
			if (status === 404 || status === 401 || status === 403) return false;
			return failureCount < 2;
		},
	});
}
