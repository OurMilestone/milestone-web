import { DashboardHeader } from "@/components/dashboard/overview/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/overview/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
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
		<div className="flex h-screen">
			<TooltipProvider delayDuration={200}>
				<SidebarProvider className="bg-white">
					<DashboardSidebar userRole={userRole} />
					<div className="flex-1 overflow-y-auto mb-2">
						<SidebarInset>
							<DashboardHeader />
							<div className="flex flex-1 flex-col gap-4 px-4 bg-white">
								{children}
							</div>
						</SidebarInset>
					</div>
				</SidebarProvider>
			</TooltipProvider>
		</div>
	);
}
