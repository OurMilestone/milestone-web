"use client";

import AddBankAccountModal from "@/components/modals/add-bank-account-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { WalletAccount } from "@/types/dashboard/payments-types";
import { ArrowRight, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";

interface WalletBalanceCardProps {
	walletAccount: WalletAccount;
	userRole: UserRole;
	onAddFunds: () => void;
}

const TopRightCircles = () => (
	<svg
		width="143"
		height="186"
		viewBox="0 0 143 186"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="absolute -top-8 -right-2"
	>
		<circle
			cx="171.948"
			cy="13.6885"
			r="122.5"
			transform="rotate(35.7544 171.948 13.6885)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="171.948"
			cy="13.6893"
			r="110.604"
			transform="rotate(35.7544 171.948 13.6893)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="171.942"
			cy="13.6949"
			r="99.982"
			transform="rotate(35.7544 171.942 13.6949)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="171.958"
			cy="13.6944"
			r="92.334"
			transform="rotate(35.7544 171.958 13.6944)"
			stroke="#EAEAEB"
		/>
	</svg>
);

const BottomLeftCircles = () => (
	<svg
		width="174"
		height="183"
		viewBox="0 0 174 183"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="absolute -bottom-8 -left-8"
	>
		<circle
			cx="1.39145"
			cy="171.968"
			r="122.5"
			transform="rotate(35.7544 1.39145 171.968)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="1.39105"
			cy="171.969"
			r="110.604"
			transform="rotate(35.7544 1.39105 171.969)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="1.38631"
			cy="171.974"
			r="99.982"
			transform="rotate(35.7544 1.38631 171.974)"
			stroke="#EAEAEB"
		/>
		<circle
			cx="1.40199"
			cy="171.974"
			r="92.334"
			transform="rotate(35.7544 1.40199 171.974)"
			stroke="#EAEAEB"
		/>
	</svg>
);

export default function WalletBalanceCard({
	walletAccount,
	userRole,
	onAddFunds,
	className,
}: WalletBalanceCardProps & { className?: string }) {
	const [isBalanceVisible, setIsBalanceVisible] = useState(true);
	const [bankModalOpen, setBankModalOpen] = useState(false);

	const formattedBalance = new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: walletAccount.currency,
		minimumFractionDigits: 2,
	}).format(walletAccount.walletBalance);

	const shouldAddBankButton = userRole === "Freelancer";

	return (
		<>
			<Card
				className={cn(
					"bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 flex justify-center items-center relative overflow-hidden shadow-none bg-white",
					className,
				)}
			>
				<BottomLeftCircles />
				<TopRightCircles />

				<CardContent className="text-center relative z-10">
					<div className="mb-6">
						<div className="flex items-center justify-center gap-3 mb-3">
							<h2 className="text-lg text-primary">Wallet Balance</h2>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsBalanceVisible(!isBalanceVisible)}
								className="h-8 w-8 p-0 hover:bg-slate-200/50"
							>
								{isBalanceVisible ? (
									<EyeOff className="h-4 w-4 text-slate-500" />
								) : (
									<Eye className="h-4 w-4 text-slate-500" />
								)}
							</Button>
						</div>

						<p className="text-lg lg:text-xl font-semibold text-primary mb-2">
							{isBalanceVisible ? formattedBalance : "*******"}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
						<Button
							onClick={onAddFunds}
							variant="outline"
							className="flex-1 bg-white border-primary hover:bg-slate-50 text-slate-700 py-4 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
						>
							<Plus size={18} />
							Add Funds
						</Button>

						{shouldAddBankButton && (
							<Button
								onClick={() => setBankModalOpen(true)}
								className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
							>
								Add Bank Account
								<ArrowRight size={18} />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{shouldAddBankButton && (
				<AddBankAccountModal
					open={bankModalOpen}
					onOpenChange={setBankModalOpen}
				/>
			)}
		</>
	);
}
