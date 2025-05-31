"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types/auth/auth-types";
import { Search } from "lucide-react";
import Image from "next/image";
import { MilestoneLogo } from "../../../../public/assets/images/__index__";
import { DashboardNavbar } from "./dashboard-navbar";
import { UserProfile } from "./user-profile";

interface DashboardSidebarProps {
	userRole: UserRole;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
	const { state } = useSidebar();
	return (
		<Sidebar collapsible="icon" className="bg-white">
			<SidebarHeader className="p-4 bg-white">
				{state === "expanded" && (
					<>
						<div className="flex items-center justify-start mb-4">
							<Image
								src={MilestoneLogo}
								alt="Milestone Logo"
								width={220}
								height={24}
								className="h-5 w-auto"
								priority
							/>
						</div>
						<div className="relative">
							<Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
							<SidebarInput
								placeholder="Search..."
								className="pl-9 w-full bg-transparent"
								aria-label="Search navigation"
							/>
						</div>
					</>
				)}
			</SidebarHeader>

			<SidebarContent className="flex-grow bg-white">
				<SidebarGroup>
					<SidebarGroupContent>
						<DashboardNavbar userRole={userRole} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-2 border-t border-border">
				<UserProfile />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
