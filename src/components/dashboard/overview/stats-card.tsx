"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Briefcase, CheckCircle } from "lucide-react";

interface StatsCardsProps {
	activeProjectsCount?: number;
	completedProjectsCount?: number;
}

export function StatsCards({
	activeProjectsCount,
	completedProjectsCount,
}: StatsCardsProps) {
	const cards = [
		{
			title: "Active Projects",
			value: activeProjectsCount,
			icon: Briefcase,
			iconBg: "bg-blue-100",
			iconColor: "text-blue-500",
		},
		{
			title: "Completed Projects",
			value: completedProjectsCount,
			icon: CheckCircle,
			iconBg: "bg-green-100",
			iconColor: "text-green-500",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
			{cards.map((card, index) => {
				const IconComponent = card.icon;
				return (
					<Card
						key={`${card.title}-${index}`}
						className="bg-white !shadow-none !p-2"
					>
						<CardContent className="p-2">
							<div className="flex items-start space-x-3 md:space-x-4">
								<div
									className={cn(
										"p-2.5 rounded-lg flex items-center justify-center",
										card.iconBg,
									)}
								>
									<IconComponent
										className={cn("h-5 w-5 md:h-6 md:w-6", card.iconColor)}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p
										className="text-xs md:text-sm font-medium text-muted-foreground truncate"
										title={card.title}
									>
										{card.title}
									</p>
									<p
										className="text-xl md:text-2xl font-semibold text-foreground truncate mt-1"
										title={String(card.value)}
									>
										{card.value}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
