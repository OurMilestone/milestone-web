"use client";

import { useAuthContext } from "@/components/providers/auth-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { USER_PROFILE } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function UserProfile() {
	const { data: session, status } = useSession();
	const { logout, user: authContextUser } = useAuthContext();
	const { state: sidebarState } = useSidebar();
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const isSidebarCollapsed = sidebarState === "collapsed";

	const displayName =
		authContextUser?.full_name ||
		authContextUser?.preferred_name ||
		(status === "authenticated" && session?.user?.name) ||
		USER_PROFILE.name;

	const displayEmail =
		authContextUser?.email ||
		(status === "authenticated" && session?.user?.email) ||
		USER_PROFILE.email;

	const getInitials = (name: string) => {
		if (!name) return "??";
		return name
			.split(" ")
			.map((n) => n[0])
			.filter(Boolean)
			.slice(0, 2)
			.join("")
			.toUpperCase();
	};

	const handleSignOut = (
		event: React.MouseEvent<HTMLButtonElement | SVGSVGElement>,
	) => {
		event.stopPropagation();
		setIsPopoverOpen(false);
		toast.promise(logout(), {
			loading: "Signing out...",
			success: () => {
				return "Signed out successfully! Redirecting...";
			},
			error: () => {
				return "Failed to sign out. Please try again.";
			},
		});
	};

	if (status === "loading" && !authContextUser.id) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<div className="flex items-center justify-center p-3 animate-pulse cursor-default">
						{isSidebarCollapsed ? (
							<Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
						) : (
							<div className="flex items-center gap-3 w-full">
								<Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
								<div className="flex flex-col text-left space-y-1 min-w-0">
									<span className="text-sm font-medium h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
									<span className="text-xs h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
								</div>
								<div className="h-4 w-4 ml-auto bg-gray-300 dark:bg-gray-700 rounded" />
							</div>
						)}
					</div>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const expandedViewContent = (
		<div className="flex items-center gap-3 w-full p-2 cursor-pointer">
			<div className="relative flex-shrink-0">
				<Avatar className="h-8 w-8">
					<AvatarImage src={USER_PROFILE.avatar} alt={displayName} />
					<AvatarFallback>{getInitials(displayName)}</AvatarFallback>
				</Avatar>
				{USER_PROFILE.isOnline && (
					<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
				)}
			</div>
			<div className="flex flex-col text-left flex-grow min-w-0">
				<span className="text-sm font-medium truncate" title={displayName}>
					{displayName}
				</span>
				<span
					className="text-xs text-muted-foreground truncate"
					title={displayEmail}
				>
					{displayEmail}
				</span>
			</div>
			<button
				type="button"
				onClick={handleSignOut}
				className="ml-auto p-1.5 cursor-pointer rounded-md hover:bg-muted text-muted-foreground hover:text-destructive flex-shrink-0"
				aria-label="Sign out"
				title="Sign out"
			>
				<LogOut className="h-4 w-4" />
			</button>
		</div>
	);

	const collapsedViewTriggerContent = (
		<div className="flex items-center justify-center rounded-md cursor-pointer w-full h-full">
			<Avatar className="h-8 w-8">
				<AvatarImage src={USER_PROFILE.avatar} alt={displayName} />
				<AvatarFallback>{getInitials(displayName)}</AvatarFallback>
			</Avatar>
			{USER_PROFILE.isOnline && isSidebarCollapsed && (
				<div className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-green-500 border border-background" />
			)}
		</div>
	);

	const popoverContent = (
		<div className="p-4 space-y-3">
			<div className="flex items-center gap-3">
				<Avatar className="h-10 w-10">
					<AvatarImage src={USER_PROFILE.avatar} alt={displayName} />
					<AvatarFallback>{getInitials(displayName)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col text-left min-w-0">
					<span className="text-sm font-semibold truncate" title={displayName}>
						{displayName}
					</span>
					<span
						className="text-xs text-muted-foreground truncate"
						title={displayEmail}
					>
						{displayEmail}
					</span>
				</div>
			</div>
			<hr className="border-border" />
			<Button
				variant="ghost"
				className="w-full justify-start p-2 h-auto text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
				onClick={handleSignOut}
			>
				<LogOut className="h-4 w-4 mr-2" />
				Sign Out
			</Button>
		</div>
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem
				className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:!bg-white"
				title={displayName}
			>
				{isSidebarCollapsed ? (
					<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
						<PopoverTrigger asChild>
							<div
								// biome-ignore lint/a11y/useSemanticElements: <explanation>
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										setIsPopoverOpen(!isPopoverOpen);
								}}
								className="flex items-center justify-center h-[52px] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
								aria-label="User menu"
							>
								{collapsedViewTriggerContent}
							</div>
						</PopoverTrigger>
						<PopoverContent
							side="right"
							align="end"
							sideOffset={10}
							alignOffset={30}
							className="w-60 p-0"
						>
							{popoverContent}
						</PopoverContent>
					</Popover>
				) : (
					expandedViewContent
				)}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
