"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function PaymentsHistoryTableSkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg">
				<div className="flex flex-wrap gap-2">
					{Array.from({ length: 5 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={i} className="h-8 w-24 rounded-md" />
					))}
				</div>
				<Skeleton className="h-6 w-40 rounded-md" />
			</div>

			<div className="rounded-md border bg-white">
				<Table>
					<TableHeader className="h-14">
						<TableRow>
							{Array.from({ length: 6 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<TableHead key={i}>
									<Skeleton className="h-6 w-full rounded-md" />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<TableRow key={i} className="h-16">
								{Array.from({ length: 6 }).map((_, j) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<TableCell key={j}>
										<Skeleton className="h-6 w-full rounded-md" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-32 rounded-md" />
				<div className="flex items-center space-x-2">
					<Skeleton className="h-8 w-20 rounded-md" />
					<Skeleton className="h-8 w-16 rounded-md" />
					<Skeleton className="h-8 w-16 rounded-md" />
				</div>
			</div>
		</div>
	);
}
