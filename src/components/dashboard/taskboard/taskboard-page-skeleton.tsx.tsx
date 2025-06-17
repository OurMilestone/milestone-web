import { Skeleton } from "@/components/ui/skeleton";

export function TaskBoardPageSkeleton() {
	return (
		<div className="flex flex-col h-full max-h-full overflow-hidden">
			<div className="p-4 flex-shrink-0">
				<div className="mb-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
						<div className="mb-4 space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-80" />
						</div>
						<div className="flex items-center gap-2 flex-shrink-0">
							<Skeleton className="h-9 w-28" />
							<Skeleton className="h-9 w-24" />
						</div>
					</div>
					<div className="flex items-center space-x-1.5">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-24" />
					</div>
				</div>

				<div className="py-3 px-1 mb-4 flex flex-wrap items-center gap-2 md:gap-3 border-b">
					<Skeleton className="h-9 w-72" />
					<div className="flex -space-x-2 items-center">
						<Skeleton className="h-7 w-7 rounded-full" />
						<Skeleton className="h-7 w-7 rounded-full" />
						<Skeleton className="h-7 w-7 rounded-full" />
					</div>
					<Skeleton className="h-9 w-20" />
					<Skeleton className="h-9 w-20" />
				</div>
			</div>

			<div className="flex-grow overflow-x-auto">
				<div className="h-full min-w-max flex gap-4 p-1 pb-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={`col-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								i
							}`}
							className="flex flex-col w-[270px] flex-shrink-0"
						>
							<div className="p-3 px-4 border-b sticky top-0">
								<Skeleton className="h-5 w-24" />
							</div>
							<div className="flex-grow p-2 space-y-3">
								<Skeleton className="h-24 w-full rounded-lg" />
								<Skeleton className="h-20 w-full rounded-lg" />
								<Skeleton className="h-28 w-full rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
