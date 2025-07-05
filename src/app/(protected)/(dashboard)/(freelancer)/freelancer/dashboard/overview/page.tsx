import DashboardProjectsServer from "@/components/dashboard/overview/dashboard-project-server";
import { ProjectGridSkeleton } from "@/components/dashboard/overview/project-grid-skeleton";
import { StatsCardsServer } from "@/components/dashboard/overview/stats-card-server";
import { StatsCardsSkeleton } from "@/components/dashboard/overview/stats-card-skeleton";
import SectionHeader from "@/components/typography/section-header";
import { Suspense } from "react";
import { auth } from "../../../../../../../../auth";

export default async function FreelancerDashboardOverviewPage() {
	const session = await auth();
	const userRole = session?.user?.role ?? "Freelancer";

	return (
		<div className="space-y-8">
			<div className="flex items-start w-full">
				<SectionHeader
					title="Overview"
					caption="Track your active projects, milestones and payments"
					className="space-y-1 text-black"
				/>
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
