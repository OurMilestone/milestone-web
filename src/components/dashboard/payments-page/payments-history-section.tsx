"use client";

import type { UserRole } from "@/types/auth/auth-types";
import type { Transaction } from "@/types/dashboard/payments-types";
import PaymentHistoryTable from "./payments-history-table/payments-history-table";

interface PaymentHistorySectionProps {
	initialData?: Transaction[];
	userRole: UserRole;
}

export default function PaymentHistorySection({
	initialData,
}: PaymentHistorySectionProps) {
	return (
		<section className="space-y-4">
			<h2 className="text-xl lg:text-2xl font-semibold text-foreground">
				Payment History
			</h2>
			<PaymentHistoryTable data={initialData || []} />
		</section>
	);
}
