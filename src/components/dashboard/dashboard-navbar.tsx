"use client";

import {
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import {
	Briefcase,
	DollarSign,
	LayoutDashboard,
	MessageSquare,
	Star,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMap = {
	LayoutDashboard,
	Briefcase,
	MessageSquare,
	User,
	Star,
	DollarSign,
	Users,
};

interface DashboardNavbarProps {
	userRole: UserRole;
}

export function DashboardNavbar({ userRole }: DashboardNavbarProps) {
	const pathname = usePathname();
	const navigation = SIDEBAR_NAVIGATION[userRole];

	return (
		<SidebarMenu className="bg-white">
			{navigation.map((item) => {
				const Icon = iconMap[item.icon as keyof typeof iconMap];
				const isActive = pathname === item.href;

				return (
					<SidebarMenuItem key={item.href} className="mb-2">
						<SidebarMenuButton asChild isActive={isActive} className="p-5">
							<Link href={item.href}>
								<Icon
									className={cn("h-4 w-4", !isActive && "text-[#808aa3]")}
								/>
								<span className={cn(!isActive && "text-[#808AA3]")}>
									{item.title}
								</span>
								{item.badge && (
									<SidebarMenuBadge className="p-2 rounded-full bg-[#aab1c2]">
										{item.badge}
									</SidebarMenuBadge>
								)}
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}
