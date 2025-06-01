"use client;";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentTransaction } from "@/types/dashboard/payments-types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import TransactionStatusBadge from "./transaction-status-badge";

export const paymentsTableColumn: ColumnDef<PaymentTransaction>[] = [
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
		accessorKey: "date",
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
			const date = new Date(row.getValue("date"));
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
			<div className="text-sm capitalize">
				{row.getValue("transactionType")}
			</div>
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
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
			const amount = Number.parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: row.original.currency || "USD",
			}).format(amount);

			return <div className="text-sm font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "status",
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
			<TransactionStatusBadge status={row.getValue("status")} />
		),
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	// {
	// 	id: "actions",
	// 	cell: ({ row }) => {
	// 		const payment = row.original;
	// 		return (
	// 			<DropdownMenu>
	// 				<DropdownMenuTrigger asChild>
	// 					<Button
	// 						variant="ghost"
	// 						className="h-8 w-8 p-0 data-[state=open]:bg-accent"
	// 					>
	// 						<span className="sr-only">Open menu</span>
	// 						<MoreHorizontal className="h-4 w-4" />
	// 					</Button>
	// 				</DropdownMenuTrigger>
	// 				<DropdownMenuContent align="end" className="w-[160px]">
	// 					<DropdownMenuItem
	// 						onClick={() => navigator.clipboard.writeText(payment.id)}
	// 					>
	// 						Copy Transaction ID
	// 					</DropdownMenuItem>
	// 					<DropdownMenuSeparator />
	// 					<DropdownMenuItem>View Details</DropdownMenuItem>
	// 					{payment.status === "Pending" && (
	// 						<DropdownMenuItem className="text-orange-600 focus:text-orange-700">
	// 							Retry Payment
	// 						</DropdownMenuItem>
	// 					)}
	// 					{payment.status !== "Successful" &&
	// 						payment.status !== "Cancelled" && (
	// 							<DropdownMenuItem className="text-red-600 focus:text-red-700">
	// 								Cancel Transaction
	// 							</DropdownMenuItem>
	// 						)}
	// 				</DropdownMenuContent>
	// 			</DropdownMenu>
	// 		);
	// 	},
	// },
];
