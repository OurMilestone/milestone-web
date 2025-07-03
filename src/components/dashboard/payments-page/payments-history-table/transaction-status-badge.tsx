import { Badge } from "@/components/ui/badge";
import type { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
interface TransactionTypeBadgeProps {
	type: string;
}

export default function TransactionTypeBadge({
	type,
}: TransactionTypeBadgeProps) {
	let variant: VariantProps<typeof badgeVariants>["variant"];
	let className = "";

	switch (type.toLowerCase()) {
		case "completed":
			variant = "default";
			className = "bg-green-100 text-green-700 border-green-300";
			break;
		case "pending":
			variant = "secondary";
			className = "bg-yellow-100 text-yellow-700 border-yellow-300";
			break;
		case "failed":
			variant = "destructive";
			className = "bg-red-100 text-red-700 border-red-300";
			break;
		default:
			variant = "default";
			className = "bg-gray-100 text-gray-700 border-gray-300";
	}

	return (
		<Badge variant={variant} className={cn("text-xs capitalize", className)}>
			{type.toLowerCase()}
		</Badge>
	);
}
