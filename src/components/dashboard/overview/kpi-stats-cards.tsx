"use client";

import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export interface KpiStat {
	label: string;
	value: number;
	change: number;
	caption: string;
}

const DEFAULT_KPI_STATS: KpiStat[] = [
	{
		label: "To Do",
		value: 18,
		change: -6,
		caption: "Currently being worked on",
	},
	{
		label: "Tasks In Progress",
		value: 12,
		change: 20,
		caption: "Currently being worked on",
	},
	{
		label: "In Review",
		value: 22,
		change: 20,
		caption: "Currently being worked on",
	},
	{
		label: "Done",
		value: 50,
		change: 30,
		caption: "Tasks finished last month",
	},
	{
		label: "Overdue",
		value: 12,
		change: -10,
		caption: "Tasks finished last month",
	},
];

interface KpiStatsCardsProps {
	stats?: KpiStat[];
}

export function KpiStatsCards({
	stats = DEFAULT_KPI_STATS,
}: KpiStatsCardsProps) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{stats.map((stat) => {
				const isPositive = stat.change >= 0;

				return (
					<div
						key={stat.label}
						className="rounded-xl border border-[#E8EAED] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
					>
						<p className="text-sm font-medium text-[#667085]">{stat.label}</p>
						<div className="mt-2 flex items-end gap-2">
							<span className="text-3xl font-semibold tracking-tight text-[#101828]">
								{stat.value}
							</span>
							<span
								className={cn(
									"mb-1 inline-flex items-center gap-0.5 text-xs font-medium",
									isPositive ? "text-emerald-600" : "text-rose-500",
								)}
							>
								{isPositive ? (
									<ArrowUpRight className="h-3.5 w-3.5" />
								) : (
									<ArrowDownRight className="h-3.5 w-3.5" />
								)}
								{Math.abs(stat.change)}%
							</span>
						</div>
						<p className="mt-2 text-xs text-[#98A2B3]">{stat.caption}</p>
					</div>
				);
			})}
		</div>
	);
}
