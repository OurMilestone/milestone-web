import { ProjectsGrid } from "@/components/dashboard/project-grid";
import { StatsCards } from "@/components/dashboard/stats-card";
import SectionHeader from "@/components/typography/section-header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const ContractorDashboardOverviewPage = () => {
	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<SectionHeader
					title="Overview"
					caption="Track your active projects, milestones and payments"
					className="space-y-1"
				/>
				<Button variant="ghost" className="gap-1">
					See Task
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<StatsCards userRole="Contractor" />

			<ProjectsGrid />
		</div>
	);
};

export default ContractorDashboardOverviewPage;
