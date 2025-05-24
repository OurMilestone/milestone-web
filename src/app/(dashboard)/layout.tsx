import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppRoutePaths } from "@/config/routes-config";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session?.user) {
		redirect(AppRoutePaths.SignIn);
	}

	const userRole = session.user.role;

	return (
		<SidebarProvider className="bg-white">
			<DashboardSidebar userRole={userRole} />
			<SidebarInset>
				<DashboardHeader />
				<div className="flex flex-1 flex-col gap-4 p-4 bg-white">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
