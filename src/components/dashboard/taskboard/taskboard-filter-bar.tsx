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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProjectMemberDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import { cn, getInitials, getUserColor } from "@/lib/utils";
import type {
	TaskFilters,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import { ChevronDown, ListFilter, Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface TaskBoardFilterBarProps {
	assignees: ProjectMemberDTO[];
	filters: TaskFilters;
	onFilterChange: (filters: TaskFilters) => void;
	isDisabled?: boolean;
}

const labelOptions = [
	{ value: "FEATURE", label: "Feature" },
	{ value: "BUG", label: "Bug" },
	{ value: "DOCUMENTATION", label: "Documentation" },
	{ value: "OTHER", label: "Other" },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
	{ value: "urgent", label: "Urgent" },
	{ value: "high", label: "High" },
	{ value: "medium", label: "Medium" },
	{ value: "low", label: "Low" },
];

export default function TaskBoardFilterBar({
	assignees,
	filters,
	onFilterChange,
	isDisabled,
}: TaskBoardFilterBarProps) {
	const handleSearchChange = useDebouncedCallback((searchTerm: string) => {
		onFilterChange({ ...filters, searchTerm });
	}, 300);

	const handleAssigneeToggle = (assigneeId: string) => {
		const newAssigneeIds = filters.assigneeIds.includes(assigneeId)
			? filters.assigneeIds.filter((id) => id !== assigneeId)
			: [...filters.assigneeIds, assigneeId];
		onFilterChange({ ...filters, assigneeIds: newAssigneeIds });
	};

	const handleLabelToggle = (labelValue: string) => {
		const newLabels = filters.labels.includes(labelValue)
			? filters.labels.filter((l) => l !== labelValue)
			: [...filters.labels, labelValue];
		onFilterChange({ ...filters, labels: newLabels });
	};

	const handlePrioritySelect = (priorityValue: TaskPriority | null) => {
		onFilterChange({ ...filters, priority: priorityValue });
	};

	const handleClearFilters = () => {
		onFilterChange({
			searchTerm: "",
			assigneeIds: [],
			labels: [],
			priority: null,
		});
	};

	const hasActiveFilters =
		filters.searchTerm !== "" ||
		filters.assigneeIds.length > 0 ||
		filters.labels.length > 0 ||
		filters.priority !== null;

	return (
		<TooltipProvider>
			<div
				className={cn(
					"py-3 px-1 mb-4 flex flex-wrap items-center gap-2 md:gap-3 border-b border-slate-200 dark:border-slate-700",
					isDisabled && "opacity-50 pointer-events-none",
				)}
			>
				{/* Search */}
				<div className="relative flex-grow sm:flex-grow-0 sm:w-60 md:w-72">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
					<Input
						type="search"
						placeholder="Search by title, code, or description..."
						className="pl-9 h-9 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
						defaultValue={filters.searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						disabled={isDisabled}
						key={filters.searchTerm}
					/>
				</div>

				{/* Assignees */}
				<div className="flex -space-x-2 items-center">
					{assignees.map((assignee) => {
						const isSelected = filters.assigneeIds.includes(assignee.id);
						if (isDisabled && !isSelected) return null;

						return (
							<Tooltip key={assignee.id}>
								<TooltipTrigger asChild>
									<button
										type="button"
										onClick={() => handleAssigneeToggle(assignee.id)}
										aria-label={`Filter by ${assignee.full_name}`}
									>
										<Avatar
											className={cn(
												"h-7 w-7 border-2 border-white dark:border-slate-900 cursor-pointer hover:z-10 transition-all",
												isSelected
													? "ring-2 ring-primary scale-110 z-10"
													: "hover:scale-110",
											)}
										>
											<AvatarFallback
												className={cn(
													getUserColor(assignee.id),
													"text-slate-700 dark:text-slate-200 text-xs font-medium",
												)}
											>
												{getInitials(
													assignee.preferred_name || assignee.full_name,
												)}
											</AvatarFallback>
										</Avatar>
									</button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{assignee.full_name}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
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
						{labelOptions.map((label) => (
							<DropdownMenuCheckboxItem
								key={label.value}
								checked={filters.labels.includes(label.value)}
								onCheckedChange={() => handleLabelToggle(label.value)}
							>
								{label.label}
							</DropdownMenuCheckboxItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Type Dropdown */}
				{/* <DropdownMenu>
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
				</DropdownMenu> */}

				{/* Quick Filters Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
						>
							<ListFilter size={14} className="mr-1" />
							{filters.priority
								? `Priority: ${
										priorityOptions.find((p) => p.value === filters.priority)
											?.label
									}`
								: "Priority"}
							<ChevronDown size={16} className="opacity-70" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={() => handlePrioritySelect(null)}>
							All Priorities
						</DropdownMenuItem>
						{priorityOptions.map((p) => (
							<DropdownMenuItem
								key={p.value}
								onSelect={() => handlePrioritySelect(p.value)}
							>
								{p.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						className="h-9 text-primary hover:text-primary/80"
						onClick={handleClearFilters}
					>
						<X size={14} className="mr-1" />
						Clear
					</Button>
				)}
			</div>
		</TooltipProvider>
	);
}
