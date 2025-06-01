import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types/dashboard/payments-types";

interface TransactionStatusBadgeProps {
	status: TransactionStatus;
}

export default function TransactionStatusBadge({
	status,
}: TransactionStatusBadgeProps) {
	let variant: "default" | "secondary" | "destructive" | "outline" = "default";
	let className = "";

	switch (status) {
		case "Successful":
			variant = "default";
			className =
				"bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600";
			break;
		case "Pending":
			variant = "secondary";
			className =
				"bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600";
			break;
		case "Failed":
			variant = "destructive";
			className =
				"bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600";
			break;
		case "Cancelled":
			variant = "outline";
			className =
				"bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600";
			break;
		default:
			variant = "outline";
	}

	return (
		<Badge variant={variant} className={cn("text-xs capitalize", className)}>
			{status.toLowerCase()}
		</Badge>
	);
}
