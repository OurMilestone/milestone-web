"use client";

import {
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
	const { state: sidebarState } = useSidebar();

	const isSidebarCollapsed = sidebarState === "collapsed";

	return (
		<SidebarMenu className="bg-white">
			{navigation.map((item) => {
				const IconComponent = iconMap[item.icon as keyof typeof iconMap];
				const isActive =
					pathname === item.href ||
					(item.href !== "/" && pathname.startsWith(item.href));

				const menuItemContent = (
					<>
						{IconComponent && (
							<IconComponent
								className={cn(
									"h-5 w-5 flex-shrink-0",
									isActive ? "text-primary" : "text-[#808AA3]",
								)}
							/>
						)}
						<span
							className={cn(
								"truncate",
								isActive ? "font-semibold text-primary" : "text-[#808AA3]",
							)}
						>
							{item.title}
						</span>
						{item.badge && (
							<SidebarMenuBadge className="ml-auto bg-[#aab1c2] rounded-full">
								{item.badge}
							</SidebarMenuBadge>
						)}
					</>
				);

				return (
					<SidebarMenuItem key={item.href} className="mb-1 last:mb-0">
						{isSidebarCollapsed ? (
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarMenuButton
										asChild
										isActive={isActive}
										className={cn(
											"p-3 justify-center",
											isActive
												? "bg-primary/10 dark:bg-primary/20"
												: "hover:bg-muted/50 dark:hover:bg-muted/30",
										)}
										aria-label={item.title}
									>
										<Link href={item.href}>
											{IconComponent && (
												<IconComponent
													className={cn(
														"h-5 w-5",
														isActive
															? "text-primary"
															: "text-slate-500 group-hover:text-primary dark:text-slate-400 dark:group-hover:text-primary",
													)}
												/>
											)}
										</Link>
									</SidebarMenuButton>
								</TooltipTrigger>
								<TooltipContent
									side="right"
									align="start"
									sideOffset={10}
									className="text-sm font-medium bg-background text-foreground border shadow-md p-1 px-3"
								>
									<p>{item.title}</p>
								</TooltipContent>
							</Tooltip>
						) : (
							<SidebarMenuButton
								asChild
								isActive={isActive}
								className={cn(
									"group p-3",
									isActive
										? "bg-primary/10 text-primary dark:bg-primary/20"
										: "hover:bg-muted/50 dark:hover:bg-muted/30",
								)}
							>
								<Link href={item.href} className="flex items-center gap-3">
									{menuItemContent}
								</Link>
							</SidebarMenuButton>
						)}
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}
