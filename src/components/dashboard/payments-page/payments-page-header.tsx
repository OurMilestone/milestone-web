"use client";

import AddFundsModal from "@/components/modals/add-funds-modal";
import WithdrawFundsModal from "@/components/modals/withdraw-funds-modal";
import { Button } from "@/components/ui/button";
import type { Currency } from "@/lib/constants";
import type { UserRole } from "@/types/auth/auth-types";
import type { SavedPaymentMethod } from "@/types/dashboard/payments-types";
import { ArrowRight, Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

interface PaymentsPageHeaderProps {
	userRole: UserRole;
}

const MOCK_WALLET_BALANCE = 33000;
const MOCK_DEFAULT_CURRENCY: Currency = "USD";
const MOCK_USER_HAS_SAVED_CARDS = false;
const MOCK_SAVED_PAYMENT_METHODS: SavedPaymentMethod[] =
	MOCK_USER_HAS_SAVED_CARDS
		? [
				{
					id: "card-initial-123",
					type: "Card",
					displayName: "Visa .... 4242",
					isDefault: true,
					cardBrand: "Visa",
					last4: "4242",
					expiryMonth: "12",
					expiryYear: "2025",
				},
			]
		: [];

export default function PaymentsPageHeader({
	userRole,
}: PaymentsPageHeaderProps) {
	const router = useRouter();

	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

	return (
		<div>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center">
					<div>
						<h1 className="text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-100">
							Payments Dashboard
						</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
							Track your active projects, milestones and payments
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
					<Button
						variant="outline"
						className="flex-1 sm:flex-none bg-white py-2 px-3"
						onClick={() => setIsAddFundsModalOpen(true)}
					>
						<Plus size={18} className="mr-2" />
						Add Funds
					</Button>
					<Button
						className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
						onClick={() => setIsWithdrawModalOpen(true)}
					>
						Withdraw Funds
						<ArrowRight size={18} className="ml-2" />
					</Button>
				</div>
			</div>

			<WithdrawFundsModal
				isOpen={isWithdrawModalOpen}
				onOpenChange={setIsWithdrawModalOpen}
				walletBalance={MOCK_WALLET_BALANCE}
				defaultCurrency={MOCK_DEFAULT_CURRENCY}
			/>

			<AddFundsModal
				isOpen={isAddFundsModalOpen}
				onOpenChange={setIsAddFundsModalOpen}
				initialHasSavedCards={MOCK_USER_HAS_SAVED_CARDS}
				initialSavedPaymentMethods={MOCK_SAVED_PAYMENT_METHODS}
			/>
		</div>
	);
}
