import PaymentHistorySection from "@/components/dashboard/payments-page/payments-history-section";
import PaymentsHistoryTableSkeleton from "@/components/dashboard/payments-page/payments-history-table/payments-history-table-skeleton";
import PaymentsPageContent from "@/components/dashboard/payments-page/payments-page-content";
import { AppRoutePaths } from "@/config/routes-config";
import { getTransactionHistory } from "@/lib/data-access-layer/wallet.dal";
import { queryKeys } from "@/lib/query/query-keys";
import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { auth } from "../../../../../../../../auth";

const ContractorDashboardPaymentsPage = async () => {
	const session = await auth();
	const role = session?.user.role;

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	if (role !== "Contractor") {
		redirect(AppRoutePaths.FreelancerDashboard.Home);
	}

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: queryKeys.transactions.base,
		queryFn: async () => {
			const res = await getTransactionHistory();
			if (!res.success) throw new Error(res.message);
			return res.data;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex flex-col h-full space-y-6 lg:space-y-8 p-4">
				<PaymentsPageContent userRole={role} />

				<Suspense fallback={<PaymentsHistoryTableSkeleton />}>
					<PaymentHistorySection userRole={role} />
				</Suspense>
			</div>
		</HydrationBoundary>
	);
};

export default ContractorDashboardPaymentsPage;
