import type { LucideIcon } from "lucide-react";

export interface PaymentInfoCardData {
	id: string;
	title: string;
	amount: number;
	icon: LucideIcon;
	iconBgColor: string;
	iconColor: string;
	footerText?: string;
	percentageChange?: number;
	changePeriod?: string;
}

export type TransactionType =
	| "Deposit"
	| "Withdrawal"
	| "Milestone Release"
	| "Refund";

export type TransactionStatus =
	| "Successful"
	| "Pending"
	| "Failed"
	| "Cancelled";

export interface PaymentTransaction {
	id: string;
	date: string;
	transactionType: TransactionType;
	description?: string;
	amount: number;
	currency: string;
	status: TransactionStatus;
}

// For API responses (if I were fetching paginated data)
export interface PaginatedPaymentTransactions {
	data: PaymentTransaction[];
	meta: {
		currentPage: number;
		perPage: number;
		totalPages: number;
		totalItems: number;
	};
}

export type AddFundsStep =
	| "NO_CARD_PROMPT"
	| "ADD_CARD_DETAILS"
	| "CONFIRM_ADD_FUNDS";

export interface SavedPaymentMethod {
	id: string;
	type: "Card" | "BankAccount";
	displayName: string;
	isDefault?: boolean;
	cardBrand?: string;
	last4?: string;
	expiryMonth?: string;
	expiryYear?: string;
}
