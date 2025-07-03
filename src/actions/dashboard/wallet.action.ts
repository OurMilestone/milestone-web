"use server";

import type {
	AddBankAccountDto,
	InitiateTransferDto,
	WalletDTO,
} from "@/lib/data-access-layer/DTOs/wallet.dto";
import {
	addBankAccount as addBankDAL,
	createWallet as createWalletDAL,
} from "@/lib/data-access-layer/wallet.dal";
import { initiateTransfer } from "@/lib/data-access-layer/wallet.dal";
import type { ActionResult } from "@/types";

export async function createWalletAction(): Promise<
	ActionResult<WalletDTO | null>
> {
	return createWalletDAL();
}

export async function addBankAccountAction(
	data: AddBankAccountDto,
): Promise<ActionResult<{ message: string } | null>> {
	return addBankDAL(data);
}

export async function initiateTransferAction(
	data: InitiateTransferDto,
): Promise<ActionResult<{ message: string } | null>> {
	return initiateTransfer(data);
}
