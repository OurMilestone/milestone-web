"use client";

import {
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
import type {
	Transaction,
	TransactionDateFilter as TransactionDateFilterType,
} from "@/types/dashboard/payments-types";
import { useMemo, useState } from "react";
import TransactionDateFilter from "./transaction-date-filter";
import { transactionTableColumns } from "./transaction-table-columns";

interface PaymentHistoryTableProps {
	data: Transaction[];
}

const transactionTypes = [
	"credit",
	"debit",
	"transfer",
	"withdrawal",
	"deposit",
];
const transactionStatuses = ["completed", "pending", "failed", "cancelled"];

interface TransactionColumnFilterConfig {
	columnId: keyof Transaction & string;
	title: string;
	options: DataTableFilterOption[];
}

export default function PaymentHistoryTable({
	data,
}: PaymentHistoryTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "transactionDate", desc: true },
	]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [dateFilter, setDateFilter] =
		useState<TransactionDateFilterType>("all");

	const filteredByDate = useMemo(() => {
		if (dateFilter === "all") return data;

		const now = new Date();
		const filterDate = new Date();

		switch (dateFilter) {
			case "24h":
				filterDate.setHours(now.getHours() - 24);
				break;
			case "7d":
				filterDate.setDate(now.getDate() - 7);
				break;
			case "14d":
				filterDate.setDate(now.getDate() - 14);
				break;
			case "30d":
				filterDate.setDate(now.getDate() - 30);
				break;
			default:
				return data;
		}

		return data.filter(
			(transaction) => new Date(transaction.transactionDate) >= filterDate,
		);
	}, [data, dateFilter]);

	const table = useReactTable({
		data: filteredByDate,
		columns: transactionTableColumns,
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
		debugTable: false,
	});

	const transactionColumnFilters: TransactionColumnFilterConfig[] = [
		{
			columnId: "transactionType",
			title: "Type",
			options: transactionTypes.map((type) => ({
				value: type,
				label: type.charAt(0).toUpperCase() + type.slice(1),
			})),
		},
		{
			columnId: "transactionStatus",
			title: "Status",
			options: transactionStatuses.map((status) => ({
				value: status,
				label: status.charAt(0).toUpperCase() + status.slice(1),
			})),
		},
	];

	return (
		<div className="space-y-4">
			<TransactionDateFilter
				selectedFilter={dateFilter}
				onFilterChange={setDateFilter}
				totalTransactions={filteredByDate.length}
			/>

			<DataTableToolbar
				table={table}
				columnFilters={transactionColumnFilters}
				globalFilterColumnId="transactionDescription"
				globalFilterPlaceholder="Search transactions..."
			/>

			<div className="rounded-md border bg-white">
				<Table>
					<TableHeader className="h-14">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
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
									className="h-16"
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
									colSpan={transactionTableColumns.length}
									className="h-24 text-center"
								>
									No transactions found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<DataTablePagination table={table} />
		</div>
	);
}
