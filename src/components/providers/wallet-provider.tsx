"use client";
import { useWallet } from "@/hooks/queries/use-wallet";
import type { WalletDTO } from "@/lib/data-access-layer/DTOs/wallet.dto";
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
		bankName: "Milestone Bank",
		walletBalance: Number.parseFloat(dto.balance),
		currency: "NGN",
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

// "use client";
//
// import { getUserWallet } from "@/lib/data-access-layer/wallet.dal";
// import type { WalletAccount } from "@/types/dashboard/wallet-types";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import React, { createContext, useContext, type ReactNode } from "react";
// import type {WalletDTO} from "@/lib/data-access-layer/DTOs/wallet.dto";
// import {queryKeys} from "@/lib/query/query-keys";
//
// interface WalletContextType {
//   walletAccount: WalletAccount | null;
//   isLoading: boolean;
//   error: Error | null;
//   hasWallet: boolean;
//   refetchWallet: () => void;
// }
//
// const WalletContext = createContext<WalletContextType | undefined>(undefined);
//
// const transformWalletDTOToWalletAccount = (dto: WalletDTO): WalletAccount => {
//   return {
//     id: dto.id,
//     accountName: dto.account_name,
//     accountNumber: dto.account_number,
//     bankName: "Milestone Bank",
//     walletBalance: parseFloat(dto.balance),
//     currency: "NGN",
//     isActive: dto.is_active,
//     isLocked: dto.is_locked,
//     userId: dto.user,
//     createdAt: dto.created_at,
//     updatedAt: dto.updated_at,
//   };
// };
//
// export function WalletContextProvider({ children }: { children: ReactNode }) {
//   const queryClient = useQueryClient();
//
//   const {
//     data: walletResponse,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery({
//     queryKey: queryKeys.wallet,
//     queryFn: async () => {
//       const result = await getUserWallet();
//       if (!result.success || !result.data) {
//         return null;
//       }
//       return result.data;
//     },
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//   });
//
//   const walletAccount = walletResponse
//     ? transformWalletDTOToWalletAccount(walletResponse)
//     : null;
//
//   const refetchWallet = () => {
//     refetch();
//     queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
//   };
//
//   const value: WalletContextType = {
//     walletAccount,
//     isLoading,
//     error: error as Error | null,
//     hasWallet: walletAccount !== null,
//     refetchWallet,
//   };
//
//   return (
//     <WalletContext.Provider value={value}>
//       {children}
//     </WalletContext.Provider>
//   );
// }
//
// export function useWalletContext(): WalletContextType {
//   const context = useContext(WalletContext);
//   if (context === undefined) {
//     throw new Error('useWalletContext must be used within a WalletContextProvider');
//   }
//   return context;
// }
