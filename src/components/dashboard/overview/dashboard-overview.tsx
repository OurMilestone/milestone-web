"use client";

import { CreateProjectModal } from "@/components/dashboard/overview/create-project";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { UserRole } from "@/types/auth/auth-types";
import { Bell, Download, LayoutGrid, Share2, Upload } from "lucide-react";
import { KpiStatsCards } from "./kpi-stats-cards";
import { ProductivityHeatmap } from "./productivity-heatmap";
import { ScheduleWidget } from "./schedule-widget";
import { TeamPerformanceTracker } from "./team-performance-tracker";

interface DashboardOverviewProps {
	userRole: UserRole;
	showCreateProject?: boolean;
}

const TEAM_AVATARS = ["AM", "JK", "RL", "SN", "TW"];

export function DashboardOverview({
	userRole,
	showCreateProject = false,
}: DashboardOverviewProps) {
	return (
		<div className="space-y-5 pb-8">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="flex items-start gap-2">
					<SidebarTrigger className="-ml-1 mt-1 lg:hidden" />
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-[#101828] md:text-[28px]">
							Dashboard
						</h1>
						<p className="mt-1 text-sm text-[#667085]">
							Monitor team tasks, performance, and productivity.
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 rounded-lg text-[#667085]"
						aria-label="Notifications"
					>
						<Bell className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-9 w-9 rounded-lg text-[#667085]"
						aria-label="Apps"
					>
						<LayoutGrid className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 rounded-lg border-[#E8EAED] text-[#344054]"
					>
						<Share2 className="h-3.5 w-3.5" />
						Share
					</Button>
					{showCreateProject ? <CreateProjectModal /> : null}
				</div>
			</div>

			<div className="flex flex-col gap-3 rounded-xl border border-[#E8EAED] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-wrap items-center gap-3">
					<Select defaultValue="30d">
						<SelectTrigger className="h-9 w-[140px] rounded-lg border-[#E8EAED] bg-white text-sm">
							<SelectValue placeholder="Last 30 days" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">Last 7 days</SelectItem>
							<SelectItem value="30d">Last 30 days</SelectItem>
							<SelectItem value="90d">Last 90 days</SelectItem>
						</SelectContent>
					</Select>

					<div className="inline-flex items-center gap-2 text-sm text-[#667085]">
						<span className="h-2 w-2 rounded-full bg-emerald-500" />
						Last updated 15 minutes ago
					</div>

					<div className="flex -space-x-2">
						{TEAM_AVATARS.map((initials) => (
							<Avatar key={initials} className="h-8 w-8 border-2 border-white">
								<AvatarFallback className="bg-slate-100 text-[10px] font-medium text-slate-700">
									{initials}
								</AvatarFallback>
							</Avatar>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 rounded-lg border-[#E8EAED] text-[#344054]"
					>
						<Upload className="h-3.5 w-3.5" />
						Imports
					</Button>
					<Button
						size="sm"
						className="h-9 gap-1.5 rounded-lg bg-[#101828] text-white hover:bg-[#1D2939]"
					>
						<Download className="h-3.5 w-3.5" />
						Exports
					</Button>
				</div>
			</div>

			<KpiStatsCards />
			<ProductivityHeatmap />

			<div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
				<TeamPerformanceTracker userRole={userRole} />
				<ScheduleWidget />
			</div>
		</div>
	);
}
