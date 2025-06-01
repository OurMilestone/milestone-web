import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PaymentInfoCardData } from "@/types/dashboard/payments-types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function PaymentInfoCard({
	title,
	amount,
	icon: Icon,
	iconBgColor,
	iconColor,
	footerText,
	percentageChange,
	changePeriod,
}: PaymentInfoCardData) {
	const formattedAmount = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD", // Todo: We should make this dynamic by passing the user currency preference here
	}).format(amount);

	return (
		<Card className="bg-white shadow-none gap-3">
			<CardHeader className="flex flex-row items-center justify-start space-y-0 pb-0">
				<div
					className={cn(
						"p-4 rounded-lg flex items-center justify-center",
						iconBgColor,
					)}
				>
					<Icon className={cn("h-5 w-5", iconColor)} />
				</div>
				<div>
					<CardTitle className="text-sm font-medium text-muted-foreground">
						{title}
					</CardTitle>
					<div className="text-2xl font-normal text-foreground">
						{formattedAmount}
					</div>
				</div>
			</CardHeader>

			{percentageChange !== undefined && changePeriod && (
				<CardContent className="pb-0 pt-0">
					<p className="text-xs text-muted-foreground flex items-center mt-1">
						<span
							className={cn(
								"flex items-center gap-1",
								percentageChange >= 0
									? "text-green-600 dark:text-green-400"
									: "text-red-600 dark:text-red-400",
							)}
						>
							{percentageChange >= 0 ? (
								<ArrowUpRight className="h-3 w-3" />
							) : (
								<ArrowDownLeft className="h-3 w-3" />
							)}
							{Math.abs(percentageChange)}%
						</span>
						<span className="ml-1">{changePeriod}</span>
					</p>
				</CardContent>
			)}

			{footerText && (
				<CardFooter className="p-0 px-6">
					<p className="text-xs text-muted-foreground">{footerText}</p>
				</CardFooter>
			)}
		</Card>
	);
}
