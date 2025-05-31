"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	BarChart2,
	ChevronDown,
	ListFilter,
	Search,
	Settings,
	SlidersHorizontal,
	Tags,
	Users,
} from "lucide-react";
import { useState } from "react";

const assignees = [
	{
		id: "u1",
		name: "User One",
		initials: "UO",
		avatarUrl: "https://i.pravatar.cc/32?u=user1",
	},
	{
		id: "u2",
		name: "User Two",
		initials: "UT",
		avatarUrl: "https://i.pravatar.cc/32?u=user2",
	},
	{
		id: "u3",
		name: "User Three",
		initials: "UH",
		avatarUrl: "https://i.pravatar.cc/32?u=user3",
	},
	{
		id: "u4",
		name: "User Four",
		initials: "UF",
		avatarUrl: "https://i.pravatar.cc/32?u=user4",
	},
];
const labels = ["Tech Debt", "Feature", "Bug", "Design", "Documentation"];
const types = ["Story", "Task", "Epic", "Sub-task"];
const quickFilters = ["My Tasks", "Due This Week", "High Priority"];
const groupOptions = ["Status", "Assignee", "Priority", "Label"];

export default function TaskBoardFilterBar() {
	const [searchTerm, setSearchTerm] = useState("");

	return (
		<div className="py-3 px-1 mb-4 flex flex-wrap items-center gap-2 md:gap-3 border-b border-slate-200 dark:border-slate-700">
			{/* Search */}
			<div className="relative flex-grow sm:flex-grow-0 sm:w-60 md:w-72">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
				<Input
					type="search"
					placeholder="Search Board..."
					className="pl-9 h-9 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Assignees */}
			<div className="flex -space-x-2 items-center">
				{assignees.slice(0, 4).map((assignee) => (
					<Avatar
						key={assignee.id}
						className="h-7 w-7 border-2 border-white dark:border-slate-900 cursor-pointer hover:z-10 transition-transform hover:scale-110"
					>
						<AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
						<AvatarFallback>{assignee.initials}</AvatarFallback>
					</Avatar>
				))}
				{assignees.length > 4 && (
					<Avatar className="h-7 w-7 border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs flex items-center justify-center cursor-pointer hover:z-10">
						+{assignees.length - 4}
					</Avatar>
				)}
			</div>

			{/* Label Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
					>
						Label <ChevronDown size={16} className="opacity-70" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>Filter by Label</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{labels.map((label) => (
						<DropdownMenuCheckboxItem key={label}>
							{label}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Type Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
					>
						Type <ChevronDown size={16} className="opacity-70" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{types.map((type) => (
						<DropdownMenuCheckboxItem key={type}>
							{type}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Quick Filters Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="h-9 gap-1.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
					>
						<ListFilter size={14} className="mr-1" /> Quick Filters{" "}
						<ChevronDown size={16} className="opacity-70" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuLabel>Apply Quick Filter</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{quickFilters.map((filter) => (
						<DropdownMenuItem key={filter}>{filter}</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<Button
				variant="ghost"
				size="sm"
				className="h-9 text-primary hover:text-primary/80"
			>
				Clear Filters
			</Button>

			<div className="hidden md:flex items-center gap-1 ml-auto">
				<span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
					GROUP BY:
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-9 gap-1.5 text-slate-600 dark:text-slate-300"
						>
							Queries <ChevronDown size={16} className="opacity-70" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{/* Group options */}
						{groupOptions.map((opt) => (
							<DropdownMenuItem key={opt}>Group by {opt}</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					variant="ghost"
					size="sm"
					className="h-9 gap-1.5 text-slate-600 dark:text-slate-300"
				>
					<BarChart2 size={14} /> Insights
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-9 w-9 text-slate-600 dark:text-slate-300"
				>
					<Settings size={16} /> <span className="sr-only">Settings</span>
				</Button>
			</div>
		</div>
	);
}
