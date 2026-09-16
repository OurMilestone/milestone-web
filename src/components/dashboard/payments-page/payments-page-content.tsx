"use client";

import WalletBalanceCard from "@/components/dashboard/payments-page/wallet-balance-card";
import {
	WalletProvider,
	useWalletCtx,
} from "@/components/providers/wallet-provider";
import { useWalletAccount } from "@/hooks/payments/use-wallet-account";
import type { UserRole } from "@/types/auth/auth-types";
import { useState } from "react";
import { toast } from "sonner";
import PaymentsPageHeader from "./payments-page-header";
import WalletAccountDetails from "./wallet-account-details";
import WalletGenerationPrompt from "./wallet-generation-prompt";

interface PaymentsPageContentProps {
	userRole: UserRole;
}

function PaymentsPageBody({ userRole }: PaymentsPageContentProps) {
	const {
		wallet: walletAccount,
		hasWallet,
		isLoading,
		refetch: refetchWallet,
	} = useWalletCtx();
	const {
		generateWallet: createWallet,
		generationStatus: isCreatingWallet,
		isGenerating,
	} = useWalletAccount();

	const [shouldShimmerAccount, setShouldShimmerAccount] = useState(false);

	const handleGenerateWallet = async () => {
		await createWallet();

		if (isCreatingWallet === "success") refetchWallet();
	};

	const handleAddFunds = () => {
		if (!walletAccount) return;

		setShouldShimmerAccount(true);

		toast.info(
			"Use your bank app to transfer funds to the account details highlighted below",
			{
				duration: 5000,
			},
		);

		setTimeout(() => {
			setShouldShimmerAccount(false);
		}, 3000);
	};

	return (
		<>
			<PaymentsPageHeader />

			{isLoading ? (
				<div className="flex h-40 items-center justify-center">
					<p className="text-sm text-muted-foreground">Loading wallet…</p>
				</div>
			) : !hasWallet ? (
				<WalletGenerationPrompt
					userRole={userRole}
					onGenerateWallet={handleGenerateWallet}
					isGenerating={isGenerating}
				/>
			) : (
				walletAccount && (
					<div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
						<div className="h-full lg:col-span-7">
							<WalletBalanceCard
								className="h-full"
								walletAccount={walletAccount}
								userRole={userRole}
								onAddFunds={handleAddFunds}
							/>
						</div>

						<div className="h-full lg:col-span-5">
							<WalletAccountDetails
								className="h-full"
								walletAccount={walletAccount}
								shouldShimmer={shouldShimmerAccount}
							/>
						</div>
					</div>
				)
			)}
		</>
	);
}

export default function PaymentsPageContent({
	userRole,
}: PaymentsPageContentProps) {
	return (
		<WalletProvider>
			<PaymentsPageBody userRole={userRole} />
		</WalletProvider>
	);
}
