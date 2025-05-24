import { ProjectsGrid } from "@/components/dashboard/project-grid";
import { StatsCards } from "@/components/dashboard/stats-card";
import SectionHeader from "@/components/typography/section-header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function FreelancerDashboardOverviewPage() {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<SectionHeader
					title="Overview"
					caption="Track your active projects, milestones and payments"
					className="space-y-1 text-black"
				/>
				<Button variant="ghost" className="gap-1">
					See Task
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<StatsCards userRole="Freelancer" />

			<ProjectsGrid />
		</div>
	);
}
