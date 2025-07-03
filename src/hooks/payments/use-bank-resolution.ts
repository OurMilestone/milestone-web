"use client";

import { clientApi } from "@/lib/api/client/client-api";
import type {
	PaystackBankDTO,
	PaystackResolveDTO,
} from "@/lib/data-access-layer/DTOs/wallet.dto";
import { queryKeys } from "@/lib/query/query-keys";
import type { AccountNameResolutionStatus } from "@/types/dashboard/payments-types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useBanks } from "../queries/use-banks";

interface UseBankResolutionReturn {
	banks: PaystackBankDTO[] | null;
	accountResolution: PaystackResolveDTO | null;
	resolutionStatus: AccountNameResolutionStatus;
	resolveAccountName: (accountNumber: string, bankCode: string) => void;
	isResolving: boolean;
}

export function useBankResolution(): UseBankResolutionReturn {
	const { data: banks = [] } = useBanks();

	const [accountResolution, setAccountResolution] =
		useState<PaystackResolveDTO | null>(null);
	const [resolutionStatus, setResolutionStatus] =
		useState<AccountNameResolutionStatus>("idle");

	const debouncedResolveAccountName = useDebouncedCallback(
		async (accountNumber: string, bankCode: string) => {
			if (!accountNumber || !bankCode || accountNumber.length !== 10) {
				setAccountResolution(null);
				setResolutionStatus("idle");
				return;
			}

			setResolutionStatus("resolving");

			try {
				const res = await clientApi.resolveAccountNumber(
					accountNumber,
					bankCode,
				);

				if (res.success && res.data) {
					setAccountResolution(res.data);
					setResolutionStatus("success");
				} else {
					setAccountResolution(null);
					setResolutionStatus("error");
					console.error("Account name resolution failed:", res.message);
				}
			} catch (error) {
				setAccountResolution(null);
				setResolutionStatus("error");
				console.error("Account name resolution failed:", error);
			}
		},
		800,
	);

	const resolveAccountName = useCallback(
		(accountNumber: string, bankCode: string) => {
			debouncedResolveAccountName(accountNumber, bankCode);
		},
		[debouncedResolveAccountName],
	);

	return {
		banks,
		accountResolution,
		resolutionStatus,
		resolveAccountName,
		isResolving: resolutionStatus === "resolving",
	};
}
