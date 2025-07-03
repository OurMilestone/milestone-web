"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
	Transaction,
	TransactionStatus,
} from "@/types/dashboard/payments-types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Copy, Download, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import TransactionStatusBadge from "./transaction-status-badge";
import TransactionTypeBadge from "./transaction-type-badge";

const copyToClipboard = async (text: string, label: string) => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard`);
	} catch (error) {
		toast.error("Failed to copy to clipboard");
	}
};

export const transactionTableColumns: ColumnDef<Transaction>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && "indeterminate")
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label="Select all"
	// 			className="translate-y-[2px] cursor-pointer"
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label="Select row"
	// 			className="translate-y-[2px] cursor-pointer"
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: "transactionDate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="-ml-3 h-8 data-[state=open]:bg-accent group"
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4 invisible group-hover:visible" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.getValue("transactionDate"));
			return <div>{format(date, "MMM dd, yyyy")}</div>;
		},
	},
	{
		accessorKey: "transactionType",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="-ml-3 h-8 data-[state=open]:bg-accent cursor-default hover:bg-transparent"
				>
					Transaction Type
				</Button>
			);
		},
		cell: ({ row }) => (
			<TransactionTypeBadge type={row.getValue("transactionType")} />
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "transactionDescription",
		header: "Description",
		cell: ({ row }) => {
			const description = row.getValue("transactionDescription") as string;
			return (
				<div className="max-w-[200px]">
					<p className="truncate text-sm" title={description}>
						{description || "No description"}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="-ml-3 h-8 data-[state=open]:bg-accent group"
				>
					Amount
					<ArrowUpDown className="ml-2 h-4 w-4 invisible group-hover:visible" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const amount = row.getValue("amount") as number;
			const transactionType = row.getValue("transactionType") as string;
			const currency = row.original.currency;

			const formatted = new Intl.NumberFormat("en-NG", {
				style: "currency",
				currency: currency,
				minimumFractionDigits: 2,
			}).format(Math.abs(amount));

			const isDebit =
				transactionType === "debit" || transactionType === "withdrawal";

			return (
				<div
					className={`text-sm font-semibold ${
						isDebit ? "text-red-600" : "text-green-600"
					}`}
				>
					{isDebit ? "-" : "+"}
					{formatted}
				</div>
			);
		},
	},
	{
		accessorKey: "transactionStatus",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					className="-ml-3 h-8 data-[state=open]:bg-accent cursor-default hover:bg-transparent"
				>
					Status
				</Button>
			);
		},
		cell: ({ row }) => (
			<TransactionStatusBadge type={row.getValue("transactionStatus")} />
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "transactionReference",
		header: "Reference",
		cell: ({ row }) => {
			const reference = row.getValue("transactionReference") as string;
			return (
				<div className="font-mono text-xs">
					{reference ? `${reference.slice(0, 12)}...` : "N/A"}
				</div>
			);
		},
	},

	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const transaction = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 data-[state=open]:bg-accent"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[200px]">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								copyToClipboard(
									transaction.transactionReference,
									"Transaction reference",
								)
							}
							className="cursor-pointer"
						>
							<Copy className="mr-2 h-4 w-4" />
							Copy Reference
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{/* <DropdownMenuItem className="cursor-pointer">
							<Eye className="mr-2 h-4 w-4" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							<Download className="mr-2 h-4 w-4" />
							Download Receipt
						</DropdownMenuItem>
						{transaction.transactionStatus === "pending" && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-orange-600 focus:text-orange-700 cursor-pointer">
									Check Status
								</DropdownMenuItem>
							</>
						)} */}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
