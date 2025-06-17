import { Skeleton } from "@/components/ui/skeleton";

export function KanbanBoardSkeleton() {
	return (
		<div className="flex-grow overflow-x-auto custom-scrollbar">
			<div className="h-full min-w-max flex gap-4 p-1 pb-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="flex flex-col w-60 md:w-[270px] lg:w-[290px] flex-shrink-0 bg-[#f9fafb] dark:bg-slate-800/50 rounded-lg h-full"
					>
						<div className="p-3 px-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
							<Skeleton className="h-5 w-24 rounded" />
							<Skeleton className="h-5 w-8 rounded-full" />
						</div>

						<div className="flex-grow p-2 space-y-3 overflow-y-auto">
							<Skeleton className="h-42 w-full rounded-lg" />
							<Skeleton className="h-28 w-full rounded-lg" />
							<Skeleton className="h-32 w-full rounded-lg" />
							<Skeleton className="h-32 w-full rounded-lg" />
						</div>

						<div className="p-2 border-t border-slate-200 dark:border-slate-700 mt-auto flex-shrink-0">
							<Skeleton className="h-8 w-full rounded" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
