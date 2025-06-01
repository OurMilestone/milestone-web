"use client";

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
import type { Expand } from "@/types";
import type { Table } from "@tanstack/react-table";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import React from "react";

export interface DataTableFilterOption {
	value: string;
	label: string;
	icon?: React.ElementType;
}

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	globalFilterColumnId?: string;
	globalFilterPlaceholder?: string;
	columnFilters?: {
		columnId: keyof TData & string;
		title: string;
		options: Expand<DataTableFilterOption>[];
	}[];
}

export default function DataTableToolbar<TData>({
	table,
	globalFilterColumnId,
	globalFilterPlaceholder = "Filter all columns...",
	columnFilters = [],
}: DataTableToolbarProps<TData>) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2">
			{globalFilterColumnId && (
				<Input
					placeholder={globalFilterPlaceholder}
					value={
						(table
							.getColumn(globalFilterColumnId)
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn(globalFilterColumnId)
							?.setFilterValue(event.target.value)
					}
					className="h-9 w-full sm:max-w-xs md:max-w-sm"
				/>
			)}

			<div className="flex gap-2 w-full sm:flex-row max-sm:w-28 sm:ml-auto">
				{columnFilters.map((filter) => {
					const column = table.getColumn(filter.columnId);

					if (!column) return null;

					const selectedValues = (column.getFilterValue() || []) as string[];

					return (
						<DropdownMenu key={filter.columnId}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-9 w-full sm:w-auto"
								>
									{filter.title}
									{selectedValues.length > 0 && (
										<span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
											{selectedValues.length}
										</span>
									)}
									<ChevronDown className="ml-auto h-4 w-4 opacity-70 sm:ml-2" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[180px]">
								<DropdownMenuLabel>Filter by {filter.title}</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{filter.options.map((option) => (
									<DropdownMenuCheckboxItem
										key={option.value}
										className="cursor-pointer"
										checked={selectedValues.includes(option.value)}
										onCheckedChange={(checked) => {
											let newFilterValues: string[];

											if (checked) {
												newFilterValues = [...selectedValues, option.value];
											} else {
												newFilterValues = selectedValues.filter(
													(v) => v !== option.value,
												);
											}
											column.setFilterValue(
												newFilterValues.length ? newFilterValues : undefined,
											);
										}}
									>
										{option.icon &&
											React.createElement(option.icon, {
												className: "mr-2 h-4 w-4 text-muted-foreground",
											})}
										{option.label}
									</DropdownMenuCheckboxItem>
								))}
								{selectedValues.length > 0 && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => column.setFilterValue(undefined)}
											className="justify-center text-xs"
										>
											Clear filter
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				})}

				{/* Column Visibility */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 w-full sm:w-auto"
						>
							<SlidersHorizontal className="mr-2 h-4 w-4" /> Columns
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllColumns()
							.filter(
								(column) =>
									typeof column.accessorFn !== "undefined" &&
									column.getCanHide(),
							)
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id
											.replace(/([A-Z])/g, " $1")
											.replace(/^./, (str) => str.toUpperCase())}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
