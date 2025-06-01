"use client";

import type { UserRole } from "@/types/auth/auth-types";
import type { PaymentTransaction } from "@/types/dashboard/payments-types";
import PaymentHistoryTable from "./payments-history-table/payments-history-table";

interface PaymentHistorySectionProps {
	initialData: PaymentTransaction[];
	totalItems: number; // *For server-side pagination info if used later
	userRole: UserRole;
}

export default function PaymentHistorySection({
	initialData,
	totalItems,
	userRole,
}: PaymentHistorySectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="text-xl lg:text-2xl font-semibold text-foreground">
				Payment History
			</h2>
			<PaymentHistoryTable data={initialData} totalItems={totalItems} />
		</section>
	);
}
