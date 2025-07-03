"use client";
import { useWallet } from "@/hooks/queries/use-wallet";
import type { WalletDTO } from "@/lib/data-access-layer/DTOs/wallet.dto";
import { CURRENCY } from "@/lib/utils";
import type { WalletAccount } from "@/types/dashboard/payments-types";
import { type ReactNode, createContext, useContext, useMemo } from "react";

interface WalletCtx {
	wallet: WalletAccount | null;
	isLoading: boolean;
	refetch: () => void;
	hasWallet: boolean;
}

const transformWalletDTOToWalletAccount = (dto: WalletDTO): WalletAccount => {
	return {
		id: dto.id,
		accountName: dto.account_name,
		accountNumber: dto.account_number,
		bankName: "Titan-Paystack",
		walletBalance: Number.parseFloat(dto.balance),
		currency: CURRENCY,
		isActive: dto.is_active,
		isLocked: dto.is_locked,
		userId: dto.user,
		createdAt: dto.created_at,
		updatedAt: dto.updated_at,
	};
};

const Ctx = createContext<WalletCtx | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
	const { data, isLoading, refetch } = useWallet();

	const value = useMemo(
		() => ({
			wallet: data ? transformWalletDTOToWalletAccount(data) : null,
			isLoading,
			refetch,
			hasWallet: data !== null,
		}),
		[data, isLoading, refetch],
	);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useWalletCtx = () => {
	const ctx = useContext(Ctx);
	if (!ctx) throw new Error("useWalletCtx outside provider");
	return ctx;
};
