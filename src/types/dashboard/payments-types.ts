import type { LucideIcon } from "lucide-react";
import type { Expand } from "..";

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

export type TransactionType = "Credit" | "Debit";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

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

export interface WalletAccount {
	id: number;
	accountName: string;
	accountNumber: string;
	bankName: string;
	walletBalance: number;
	currency: string;
	isActive: boolean;
	isLocked: boolean;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface BankOption {
	id: string;
	name: string;
	code: string;
}

export type AccountNameResolution = Expand<
	Pick<WalletAccount, "accountName" | "accountNumber"> & { bankCode: string }
>;

export interface UserBankAccount {
	id?: string;
	accountNumber: string;
	bankCode: string;
	bankName: string;
	accountName?: string;
}

export interface Transaction {
	id: number;
	walletId: number;
	amount: number;
	recipient: string;
	sender: string;
	transactionType: Lowercase<TransactionType>;
	transactionStatus: Lowercase<TransactionStatus>;
	transactionDate: string;
	transactionReference: string;
	transactionDescription: string;
	currency: string;
}

export type WalletGenerationStatus =
	| "idle"
	| "generating"
	| "success"
	| "error";

export type AccountNameResolutionStatus =
	| "idle"
	| "resolving"
	| "success"
	| "error";

export type TransactionDateFilter = "all" | "24h" | "7d" | "14d" | "30d";

export interface WithdrawFundsFormData {
	bankId: string;
	accountNumber: string;
	accountName: string;
	amount: string;
}
