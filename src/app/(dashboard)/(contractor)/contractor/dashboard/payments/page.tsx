import PaymentInfoCard from "@/components/dashboard/payments-page/payment-info-card";
import PaymentHistorySection from "@/components/dashboard/payments-page/payments-history-section";
import PaymentsPageHeader from "@/components/dashboard/payments-page/payments-page-header";
import { AppRoutePaths } from "@/config/routes-config";
import {
	contractorPaymentInfoCards,
	freelancerPaymentInfoCards,
	staticPaymentHistory,
} from "@/lib/constants";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	PaymentInfoCardData,
	PaymentTransaction,
} from "@/types/dashboard/payments-types";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../../../../../auth";

async function getPaymentInfoCardsData(
	userRole: UserRole,
): Promise<PaymentInfoCardData[]> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	return userRole === "Freelancer"
		? freelancerPaymentInfoCards
		: contractorPaymentInfoCards;
}

async function getPaymentHistoryData(
	userRole: UserRole,
): Promise<{ data: PaymentTransaction[]; totalItems: number }> {
	console.log(`API: Fetching payment history for ${userRole}`);

	await new Promise((resolve) => setTimeout(resolve, 500));

	return {
		data: staticPaymentHistory,
		totalItems: staticPaymentHistory.length,
	};
}

const ContractorDashboardPaymentsPage = async () => {
	const session = await auth();
	const role = session?.user.role;

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	if (role !== "Contractor") {
		redirect(AppRoutePaths.FreelancerDashboard.Home);
	}

	const paymentCardsData = await getPaymentInfoCardsData(role);
	const initialPaymentHistory = await getPaymentHistoryData(role);

	return (
		<div className="flex flex-col h-full space-y-6 lg:space-y-8 p-4 md:p-6 lg:p-8">
			<PaymentsPageHeader userRole={role} />

			<div className="grid gap-4 md:grid-cols-2 lg:gap-6">
				{paymentCardsData.map((cardData) => (
					<PaymentInfoCard key={cardData.id} {...cardData} />
				))}
			</div>

			<PaymentHistorySection
				initialData={initialPaymentHistory.data}
				totalItems={initialPaymentHistory.totalItems}
				userRole={role}
			/>
		</div>
	);
};

export default ContractorDashboardPaymentsPage;
