"use client";

import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export function DashboardHeader() {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
			<SidebarTrigger className="-ml-1" />
			<div className="flex-1 w-full">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search here..." className="pl-9 bg-transparent" />
				</div>
			</div>
		</header>
	);
}
