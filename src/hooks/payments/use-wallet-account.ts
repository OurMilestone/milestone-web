"use client";

import { createWalletAction } from "@/actions/dashboard/wallet.action";
import type { WalletDTO } from "@/lib/data-access-layer/DTOs/wallet.dto";
import type {
	WalletAccount,
	WalletGenerationStatus,
} from "@/types/dashboard/payments-types";
import { useCallback, useState } from "react";
import { useCreateWallet } from "../mutations/use-wallet-mutations";

interface UseWalletAccountReturn {
	walletAccount: WalletDTO | null;
	generationStatus: WalletGenerationStatus;
	generateWallet: () => Promise<void>;
	isGenerating: boolean;
	hasWallet: boolean;
}

export function useWalletAccount(): UseWalletAccountReturn {
	const [walletAccount, setWalletAccount] = useState<WalletDTO | null>(null);
	const [generationStatus, setGenerationStatus] =
		useState<WalletGenerationStatus>("idle");

	const { mutateAsync: createWallet, isPending: isCreatingWallet } =
		useCreateWallet();

	const generateWallet = useCallback(async () => {
		setGenerationStatus("generating");

		try {
			const res = await createWallet();
			if (res.success && res.data) {
				setWalletAccount(res.data);
				setGenerationStatus("success");
			} else {
				setGenerationStatus("error");
				console.error("Wallet generation failed:", res.message);
			}
		} catch (error) {
			setGenerationStatus("error");
			console.error("Wallet generation failed:", error);
		}
	}, [createWallet]);

	return {
		walletAccount,
		generationStatus,
		generateWallet,
		isGenerating: generationStatus === "generating",
		hasWallet: walletAccount !== null,
	};
}
