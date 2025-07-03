import "server-only";

import type { ActionResult } from "@/types";
import type { Transaction } from "@/types/dashboard/payments-types";
import { cache } from "react";
import { getRequest, postRequest } from "../api/server/api-client";
import { handleApiError, mapApiTransactionsToUITransaction } from "../utils";
import type {
	AddBankAccountDto,
	InitiateTransferDto,
	TransactionDTO,
	WalletDTO,
} from "./DTOs/wallet.dto";
import { checkUserSession } from "./user-auth";

export const getUserWallet = cache(
	async (): Promise<ActionResult<WalletDTO | null>> => {
		await checkUserSession();

		try {
			const response = await getRequest<WalletDTO>(
				"/wallet/get-user-wallet/",
				true,
			);

			return {
				success: true,
				data: response.data.data,
				message: response.data.message ?? "Wallet retrieved successfully",
				status: response.status,
			};
		} catch (error) {
			return handleApiError(error, "Failed to fetch wallet details!");
		}
	},
);

export const createWallet = async (): Promise<
	ActionResult<WalletDTO | null>
> => {
	await checkUserSession();

	try {
		const response = await postRequest<WalletDTO, object>(
			"/wallet/create/",
			{},
			true,
		);

		return {
			success: true,
			data: response.data.data,
			message: response.data.message || "Wallet created successfully",
			status: response.status,
		};
	} catch (error) {
		return handleApiError(error, "Failed to create wallet!");
	}
};

export const addBankAccount = async (
	data: AddBankAccountDto,
): Promise<ActionResult<{ message: string } | null>> => {
	const verifiedUser = await checkUserSession();
	const userId = verifiedUser.id;

	try {
		const response = await postRequest<{ message: string }, AddBankAccountDto>(
			`/user/${userId}/add-bank-account/`,
			data,
			true,
		);

		return {
			success: true,
			data: response.data.data,
			message: response.data.message || "Bank account added successfully",
			status: response.status,
		};
	} catch (error) {
		return handleApiError(error, "Failed to add bank account!");
	}
};

export const getTransactionHistory = cache(
	async (): Promise<ActionResult<Transaction[] | null>> => {
		await checkUserSession();

		try {
			const response = await getRequest<TransactionDTO[]>(
				"/transaction/history/",
				true,
			);

			const transactions = response.data.data.map(
				mapApiTransactionsToUITransaction,
			);

			return {
				success: true,
				data: transactions,
				message: response.data.message || "Transaction history retrieved",
				status: response.status,
			};
		} catch (error) {
			return handleApiError(error, "Failed to fetch transaction history!");
		}
	},
);

export const initiateTransfer = async (
	data: InitiateTransferDto,
): Promise<ActionResult<{ message: string } | null>> => {
	await checkUserSession();

	try {
		const response = await postRequest<
			{ message: string },
			InitiateTransferDto
		>("/initiate-transfer/", data, true);

		return {
			success: true,
			data: response.data.data,
			message: response.data.message || "Transfer initiated successfully",
			status: response.status,
		};
	} catch (error) {
		return handleApiError(error, "Failed to initiate transfer!");
	}
};
