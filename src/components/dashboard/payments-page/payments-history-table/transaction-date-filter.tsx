"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TransactionDateFilter as TransactionDateFilterTypes } from "@/types/dashboard/payments-types";

interface TransactionDateFilterProps {
	selectedFilter: TransactionDateFilterTypes;
	onFilterChange: (filter: TransactionDateFilterTypes) => void;
	totalTransactions: number;
}

const dateFilterOptions: {
	value: TransactionDateFilterTypes;
	label: string;
}[] = [
	{ value: "all", label: "All Time" },
	{ value: "24h", label: "Past 24 Hours" },
	{ value: "7d", label: "Past 7 Days" },
	{ value: "14d", label: "Past 14 Days" },
	{ value: "30d", label: "Past 30 Days" },
];

export default function TransactionDateFilter({
	selectedFilter,
	onFilterChange,
	totalTransactions,
}: TransactionDateFilterProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
			<div className="flex flex-wrap gap-2">
				{dateFilterOptions.map((option) => (
					<Button
						key={option.value}
						variant={selectedFilter === option.value ? "default" : "outline"}
						size="sm"
						onClick={() => onFilterChange(option.value)}
						className={cn(
							"text-xs",
							selectedFilter === option.value
								? "bg-primary text-primary-foreground"
								: "bg-white hover:bg-slate-100",
						)}
					>
						{option.label}
					</Button>
				))}
			</div>

			<div className="text-sm text-muted-foreground">
				{totalTransactions} transaction{totalTransactions !== 1 ? "s" : ""}{" "}
				found
			</div>
		</div>
	);
}
