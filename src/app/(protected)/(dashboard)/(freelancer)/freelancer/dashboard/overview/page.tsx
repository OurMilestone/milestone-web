import { DashboardOverviewServer } from "@/components/dashboard/overview/dashboard-overview-server";
import { auth } from "../../../../../../../../auth";

export default async function FreelancerDashboardOverviewPage() {
	const session = await auth();
	const userRole = session?.user?.role ?? "Freelancer";

	return <DashboardOverviewServer userRole={userRole} />;
}
