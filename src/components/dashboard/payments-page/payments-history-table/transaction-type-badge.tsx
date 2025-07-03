"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionType } from "@/types/dashboard/payments-types";

interface TransactionTypeBadgeProps {
	type: TransactionType;
}

const TransactionTypeBadge = ({ type }: TransactionTypeBadgeProps) => {
	const getVariant = (transactionType: TransactionType) => {
		switch (transactionType) {
			case "Credit":
				return "default";
			case "Debit":
				return "destructive";
			default:
				return "default";
		}
	};

	return (
		<Badge
			variant={getVariant(type)}
			className={cn(
				"capitalize",
				getVariant(type) === "default" &&
					"bg-green-100 text-green-800 hover:bg-green-100/80",
				getVariant(type) === "destructive" &&
					"bg-red-100 text-red-800 hover:bg-red-100/80",
			)}
		>
			{type}
		</Badge>
	);
};

export default TransactionTypeBadge;
