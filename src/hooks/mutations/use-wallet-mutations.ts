"use client";

import {
	addBankAccountAction,
	createWalletAction,
} from "@/actions/dashboard/wallet.action";
import type { AddBankAccountDto } from "@/lib/data-access-layer/DTOs/wallet.dto";
import { queryKeys } from "@/lib/query/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateWallet() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createWalletAction,
		onSuccess: (result) => {
			if (result.success) {
				toast.success(result.message || "Wallet created successfully!");
				queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
			} else {
				toast.error(result.message || "Failed to create wallet");
			}
		},
		onError: (error: Error) => {
			toast.error(`Failed to create wallet: ${error.message}`);
		},
		retry: 2,
	});
}

export function useAddBankAccount() {
	return useMutation({
		mutationFn: (data: AddBankAccountDto) => addBankAccountAction(data),
		onSuccess: (result) => {
			if (result.success) {
				toast.success(result.message || "Bank account added successfully!");
			} else {
				toast.error(result.message || "Failed to add bank account");
			}
		},
		onError: (error: Error) => {
			toast.error(`Failed to add bank account: ${error.message}`);
		},
		retry: 2,
	});
}
