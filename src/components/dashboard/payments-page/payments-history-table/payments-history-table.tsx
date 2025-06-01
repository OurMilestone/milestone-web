"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/components/shared/table/data-table-pagination";
import type { DataTableFilterOption } from "@/components/shared/table/data-table-toolbar";
import DataTableToolbar from "@/components/shared/table/data-table-toolbar";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { transactionStatuses, transactionTypes } from "@/lib/constants";
import type { Expand } from "@/types";
import type { PaymentTransaction } from "@/types/dashboard/payments-types";
import { paymentsTableColumn } from "./payments-table-column";

interface PaymentColumnFilterConfig {
	columnId: Expand<keyof PaymentTransaction & string>;
	title: string;
	options: DataTableFilterOption[];
}
interface PaymentHistoryTableProps {
	data: PaymentTransaction[];
	totalItems: number;
}

export default function PaymentHistoryTable({
	data,
	totalItems,
}: PaymentHistoryTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns: paymentsTableColumn,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
	});

	const paymentColumnFilters: PaymentColumnFilterConfig[] = [
		{
			columnId: "transactionType",
			title: "Type",
			options: transactionTypes.map((type) => ({ value: type, label: type })),
		},
		{
			columnId: "status",
			title: "Status",
			options: transactionStatuses.map((status) => ({
				value: status,
				label: status,
			})),
		},
	];

	return (
		<div className="space-y-4">
			{/* Table Toolbar: Filters, Column Visibility */}
			<DataTableToolbar table={table} columnFilters={paymentColumnFilters} />

			{/* Table */}
			<div className="rounded-md border bg-white">
				<Table>
					<TableHeader className="h-14">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											// data-state={header.getResizeHandler && "selected"}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="h-12"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={paymentsTableColumn.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			<DataTablePagination table={table} />
		</div>
	);
}
