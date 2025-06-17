"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	DASHBOARD_STATS,
	type StatCardData,
	getStatCardsConfig,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";

interface StatsCardsProps {
	userRole: UserRole;
	activeProjectsCount?: number;
	completedProjectsCount?: number;
}

export function StatsCards({
	userRole,
	activeProjectsCount,
	completedProjectsCount,
}: StatsCardsProps) {
	const staticRoleStats = DASHBOARD_STATS[userRole];

	if (!staticRoleStats) {
		return (
			<div className="text-center text-muted-foreground p-8">
				Stats data not available for this role.
			</div>
		);
	}

	const mergedStats = {
		...staticRoleStats,
		activeProjects:
			activeProjectsCount !== undefined
				? activeProjectsCount
				: staticRoleStats.activeProjects,
		completedProjects:
			completedProjectsCount !== undefined
				? completedProjectsCount
				: staticRoleStats.completedProjects,
	};

	const cards: StatCardData[] = getStatCardsConfig(userRole, mergedStats);

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
										title={card.value}
									>
										{card.value}
									</p>
									{(card.change || card.changeText) && (
										<div className="flex items-center space-x-1 text-xs md:text-sm mt-2">
											{card.change && (
												<span
													className={cn(
														"font-medium",
														card.change.startsWith("+")
															? "text-green-600 dark:text-green-400"
															: "text-red-600 dark:text-red-400",
													)}
												>
													{card.change}
												</span>
											)}
											{card.changeText && (
												<span
													className="text-muted-foreground truncate"
													title={card.changeText}
												>
													{card.changeText}
												</span>
											)}
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
