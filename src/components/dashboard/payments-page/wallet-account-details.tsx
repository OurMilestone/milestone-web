"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WalletAccount } from "@/types/dashboard/payments-types";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WalletAccountDetailsProps {
	walletAccount: WalletAccount;
	shouldShimmer?: boolean;
}

interface CopyState {
	accountName: boolean;
	accountNumber: boolean;
}

export default function WalletAccountDetails({
	walletAccount,
	shouldShimmer = false,
	className,
}: WalletAccountDetailsProps & { className?: string }) {
	const [copyStates, setCopyStates] = useState<CopyState>({
		accountName: false,
		accountNumber: false,
	});

	const copyToClipboard = async (
		text: string,
		label: string,
		field: keyof CopyState,
	) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${label} copied to clipboard`);

			setCopyStates((prev) => ({ ...prev, [field]: true }));

			setTimeout(() => {
				setCopyStates((prev) => ({ ...prev, [field]: false }));
			}, 2000);
		} catch (error) {
			toast.error("Failed to copy to clipboard");
		}
	};

	return (
		<Card
			className={cn(
				"!py-2 bg-white shadow-none text-primary transition-all duration-300 h-full",
				shouldShimmer && "ring-4 ring-primary/30 shadow-2xl animate-pulse",
				className,
			)}
		>
			<CardHeader className="">
				<CardTitle className="text-xl font-semibold text-primary">
					Your Milestone Bank Information
				</CardTitle>
			</CardHeader>

			<div className="p-4 rounded-lg">
				<CardContent className="space-y-4 p-2 bg-[#FAFAFA]">
					{/* Account Name */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-[#97989C]">Account Name</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									copyToClipboard(
										walletAccount.accountName,
										"Account name",
										"accountName",
									)
								}
								className="h-6 w-6 p-0 hover:bg-slate-200/50 text-black hover:text-primary"
							>
								{copyStates.accountName ? (
									<Check className="h-4 w-4 text-green-400" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						<p className="font-medium text-primary">
							{walletAccount.accountName}
						</p>
					</div>

					{/* Account Number */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-[#97989C]">Account Number</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() =>
									copyToClipboard(
										walletAccount.accountNumber,
										"Account number",
										"accountNumber",
									)
								}
								className="h-6 w-6 p-0 hover:bg-slate-200/50 text-black hover:text-primary"
							>
								{copyStates.accountNumber ? (
									<Check className="h-4 w-4 text-green-400" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						<p className="font-mono text-xl font-bold text-primary tracking-wider">
							{walletAccount.accountNumber}
						</p>
					</div>

					{/* Bank Name */}
					<div className="space-y-2">
						<span className="text-xs text-[#97989C]">Bank Name</span>
						<p className="font-medium text-primary">{walletAccount.bankName}</p>
					</div>

					{shouldShimmer && (
						<div className="mt-3 p-2 bg-primary/20 rounded-lg border border-primary/30">
							<p className="text-xs text-primary-foreground font-medium text-center">
								Use these details to add funds from your bank app
							</p>
						</div>
					)}
				</CardContent>
			</div>
		</Card>
	);
}
