import DashboardProjectsServer from "@/components/dashboard/overview/dashboard-project-server";
import { ProjectGridSkeleton } from "@/components/dashboard/overview/project-grid-skeleton";
import { StatsCardsServer } from "@/components/dashboard/overview/stats-card-server";
import { StatsCardsSkeleton } from "@/components/dashboard/overview/stats-card-skeleton";
import SectionHeader from "@/components/typography/section-header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { auth } from "../../../../../../../auth";

export default async function FreelancerDashboardOverviewPage() {
	const session = await auth();
	const userRole = session?.user?.role ?? "Freelancer";

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

			<Suspense fallback={<StatsCardsSkeleton />}>
				<StatsCardsServer userRole={userRole} />
			</Suspense>

			<Suspense fallback={<ProjectGridSkeleton />}>
				<DashboardProjectsServer userRole={userRole} />
			</Suspense>
		</div>
	);
}
