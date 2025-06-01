"use client"; // Because of onClick handlers, though they could be links

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { UserRole } from "@/types/auth/auth-types";
import { ArrowRight, Plus } from "lucide-react";
import { useRouter } from "nextjs-toploader/app"; // Or nextjs-toploader/app

interface PaymentsPageHeaderProps {
	userRole: UserRole;
}

export default function PaymentsPageHeader({
	userRole,
}: PaymentsPageHeaderProps) {
	const router = useRouter();

	const handleAddFunds = () => {
		// TODO: Implement Add Funds modal or navigation
		alert(`Add Funds clicked for ${userRole}`);
		// Example: router.push(AppRoutePaths.SomeDashboard.AddFunds);
	};

	const handleWithdrawFunds = () => {
		// TODO: Implement Withdraw Funds modal or navigation
		alert(`Withdraw Funds clicked for ${userRole}`);
		// Example: router.push(AppRoutePaths.SomeDashboard.Withdraw);
	};

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
						onClick={handleAddFunds}
					>
						<Plus size={18} className="mr-2" />
						Add Funds
					</Button>
					<Button
						className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
						onClick={handleWithdrawFunds}
					>
						Withdraw Funds
						<ArrowRight size={18} className="ml-2" />
					</Button>
				</div>
			</div>
		</div>
	);
}
