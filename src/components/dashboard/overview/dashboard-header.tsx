"use client";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppRoutePaths } from "@/config/routes-config";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

export function DashboardHeader() {
	const { data: sessionData } = useSession();
	const pathname = usePathname();
	const router = useRouter();

	if (!sessionData || !sessionData.user) {
		router.push(AppRoutePaths.SignIn);
	}

	const role = sessionData?.user.role;

	const userDashboardRoute =
		role === "Contractor"
			? AppRoutePaths.ContractorDashboard.Home
			: AppRoutePaths.FreelancerDashboard.Home;

	const userPaymentsRoute =
		role === "Contractor"
			? AppRoutePaths.ContractorDashboard.Payments.Home
			: AppRoutePaths.FreelancerDashboard.Payments.Home;

	// Overview has its own in-page header chrome.
	if (pathname === userDashboardRoute) {
		return null;
	}

	const showHeader = pathname === userPaymentsRoute;

	return (
		<>
			{showHeader ? (
				<header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#E8EAED] bg-[#F7F8FA] px-4">
					<SidebarTrigger className="-ml-1" />
					<div className="w-full flex-1">
						<div className="relative">
							<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search here..."
								className="bg-transparent pl-9"
							/>
						</div>
					</div>
				</header>
			) : null}
		</>
	);
}
