import { DashboardOverviewServer } from "@/components/dashboard/overview/dashboard-overview-server";
import { auth } from "../../../../../../../../auth";

const ContractorDashboardOverviewPage = async () => {
	const session = await auth();
	const userRole = session?.user?.role ?? "Contractor";

	return <DashboardOverviewServer userRole={userRole} showCreateProject />;
};

export default ContractorDashboardOverviewPage;
