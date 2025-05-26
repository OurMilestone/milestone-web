"use client";

import { useAuthContext } from "@/components/providers/auth-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { USER_PROFILE } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export function UserProfile() {
	const { data: session, status } = useSession();
	const { logout, user: authContextUser } = useAuthContext();

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
					<SidebarMenuButton size="lg" className="animate-pulse cursor-default">
						<div className="flex items-center gap-3 w-full">
							<div className="relative">
								<Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
							</div>
							<div className="flex flex-col text-left space-y-1 min-w-0">
								{" "}
								<span className="text-sm font-medium h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
								<span className="text-xs h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded" />{" "}
							</div>
							<div className="h-4 w-4 ml-auto bg-gray-300 dark:bg-gray-700 rounded" />
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:!bg-white"
					title={displayName}
				>
					<div className="flex items-center gap-3 w-full">
						<div className="relative flex-shrink-0">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={USER_PROFILE.avatar}
									alt={USER_PROFILE.name}
								/>
								<AvatarFallback>{getInitials(displayName)}</AvatarFallback>
							</Avatar>
							{USER_PROFILE.isOnline && (
								<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
							)}
						</div>
						<div className="flex flex-col text-left flex-grow min-w-0">
							<span
								className="text-sm font-medium truncate"
								title={displayName}
							>
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
							className="ml-auto p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer"
							aria-label="Sign out"
							title="Sign out"
						>
							<LogOut className="h-4 w-4" />
						</button>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
