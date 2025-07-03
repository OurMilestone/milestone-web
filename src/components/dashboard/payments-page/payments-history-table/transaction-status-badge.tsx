import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionTypeBadgeProps {
	type: string;
}

export default function TransactionTypeBadge({
	type,
}: TransactionTypeBadgeProps) {
	let variant: "default" | "secondary" | "destructive" | "outline" = "default";
	let className = "";

	switch (type.toLowerCase()) {
		case "credit":
		case "deposit":
			variant = "default";
			className =
				"bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-600";
			break;
		case "debit":
		case "withdrawal":
			variant = "destructive";
			className =
				"bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-600";
			break;
		case "transfer":
			variant = "secondary";
			className =
				"bg-blue-100 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border-blue-300 dark:border-blue-600";
			break;
		default:
			variant = "outline";
			className =
				"bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300 border-gray-300 dark:border-gray-600";
	}

	return (
		<Badge variant={variant} className={cn("text-xs capitalize", className)}>
			{type.toLowerCase()}
		</Badge>
	);
}
