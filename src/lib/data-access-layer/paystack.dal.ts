import "server-only";

import paystackInstance from "@/lib/api/server/paystack-client";
import { handleApiError } from "@/lib/utils";
import type { ActionResult } from "@/types";
import type { PaystackBankDTO, PaystackResolveDTO } from "./DTOs/wallet.dto";

export const listBanks = async (): Promise<
	ActionResult<PaystackBankDTO[] | null>
> => {
	try {
		const res = await paystackInstance.get<{
			status: boolean;
			data: PaystackBankDTO[];
		}>("/bank?country=nigeria&perPage=100");
		return {
			success: res.data.status,
			data: res.data.data,
			status: 200,
			message: "Banks retrieved",
		};
	} catch (e) {
		return handleApiError(e, "Unable to list banks");
	}
};

export const resolveAccountNumber = async (
	account_number: string,
	bank_code: string,
): Promise<ActionResult<PaystackResolveDTO | null>> => {
	try {
		const res = await paystackInstance.get<{
			status: boolean;
			data: PaystackResolveDTO;
		}>("/bank/resolve", {
			params: { account_number, bank_code },
		});
		return {
			success: res.data.status,
			data: res.data.data,
			status: 200,
			message: "Account resolved",
		};
	} catch (e) {
		return handleApiError(e, "Unable to resolve account");
	}
};
