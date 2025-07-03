"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { queryKeys } from "@/lib/query/query-keys";
import type { UserRole } from "@/types/auth/auth-types";
import type { Transaction } from "@/types/dashboard/payments-types";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import PaymentHistoryTable from "./payments-history-table/payments-history-table";
import PaymentHistoryTableSkeleton from "./payments-history-table/payments-history-table-skeleton";

interface PaymentHistorySectionProps {
	initialData?: Transaction[];
	userRole: UserRole;
}

export default function PaymentHistorySection({
	initialData,
}: PaymentHistorySectionProps) {
	const {
		data: initialTransactionsData,
		isLoading,
		error,
		isFetching,
	} = useTransactions();
	const queryClient = useQueryClient();

	const handleRefresh = () => {
		queryClient.invalidateQueries({
			queryKey: queryKeys.transactions.base,
		});
	};

	const shouldShowError =
		error && (!initialTransactionsData || initialTransactionsData.length === 0);
	const shouldNotifyOfStaleData =
		error && initialTransactionsData && initialTransactionsData.length > 0;

	const renderErrorMessage = (errorMessage: string) => (
		<div className="flex items-center justify-center">
			<div className="text-center py-12">
				<h3 className="text-xl font-medium text-destructive">
					Failed to fetch your wallet transactions.
				</h3>
				<p className="text-sm text-muted-foreground mt-1">
					{errorMessage ?? "Please check your connection and try again."}
				</p>
				<Button
					variant="outline"
					size="sm"
					className="mt-4"
					onClick={handleRefresh}
				>
					<RefreshCw className="h-4 w-4 mr-2" />
					Try Again
				</Button>
			</div>
		</div>
	);

	const renderStaleDataMessage = () => (
		<Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
			<AlertCircle className="h-4 w-4 text-orange-600" />
			<AlertDescription className="text-orange-800 dark:text-orange-200">
				<div className="flex items-center justify-between">
					<span>
						Unable to fetch latest transaction history. Showing stale data.
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						className="ml-2 h-7"
					>
						<RefreshCw className="h-3 w-3 mr-1" />
						Retry
					</Button>
				</div>
			</AlertDescription>
		</Alert>
	);

	if (isLoading && !initialTransactionsData) {
		return <PaymentHistoryTableSkeleton />;
	}
	return (
		<section className="space-y-4">
			<h2 className="text-xl lg:text-2xl font-semibold text-foreground">
				Payment History
			</h2>
			{shouldNotifyOfStaleData && renderStaleDataMessage()}
			{shouldShowError && renderErrorMessage(error.message)}
			<PaymentHistoryTable data={initialTransactionsData || []} />
			{isFetching && !isLoading && (
				<div className="absolute bottom-4 right-4 bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
					Updating...
				</div>
			)}
		</section>
	);
}
