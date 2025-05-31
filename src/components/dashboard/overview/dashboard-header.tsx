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

	const showHeader =
		pathname === userDashboardRoute || pathname === userPaymentsRoute;

	return (
		<>
			{showHeader ? (
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
					<SidebarTrigger className="-ml-1" />
					<div className="flex-1 w-full">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search here..."
								className="pl-9 bg-transparent"
							/>
						</div>
					</div>
				</header>
			) : null}
		</>
	);
}
