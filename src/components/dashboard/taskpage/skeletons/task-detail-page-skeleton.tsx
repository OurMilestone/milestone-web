import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetailPageSkeleton() {
	return (
		<div className="flex h-full min-h-screen dark:bg-slate-900">
			{/* Left Sidebar Skeleton */}
			<aside className="w-60 md:w-72 lg:w-[280px] flex-shrink-0 h-full p-4 hidden lg:block border-r border-border">
				<div className="space-y-4">
					<Skeleton className="h-6 w-40 rounded" />
					<Skeleton className="h-9 w-full rounded" />
					<Skeleton className="h-9 w-full rounded" />
					<Skeleton className="h-9 w-full rounded" />
					<Skeleton className="h-9 w-full rounded" />
					<Skeleton className="h-9 w-full rounded" />
				</div>
			</aside>

			{/* Main Content Skeleton */}
			<main className="flex-1 p-6 overflow-y-auto custom-scrollbar min-w-0">
				{/* Header Skeleton */}
				<div className="mb-6 space-y-3">
					<Skeleton className="h-10 w-3/4 rounded" />
					<Skeleton className="h-6 w-1/4 rounded" />
				</div>

				{/* Description Skeleton */}
				<div className="mb-6 space-y-2">
					<Skeleton className="h-5 w-32 rounded" />
					<Skeleton className="h-32 w-full rounded" />
				</div>

				{/* Subtasks Skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-5 w-24 rounded" />
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Skeleton key={i} className="h-12 w-full rounded" />
					))}
				</div>
			</main>

			{/* Right Sidebar Skeleton */}
			<aside className="w-72 md:w-80 lg:w-[300px] flex-shrink-0 p-4 hidden lg:block border-l border-border">
				<div className="space-y-6">
					<div className="space-y-4 rounded-md border p-4">
						<Skeleton className="h-4 w-20 rounded" />
						<Skeleton className="h-6 w-full rounded" />
						<Skeleton className="h-6 w-full rounded" />
						<Skeleton className="h-6 w-full rounded" />
					</div>
					<div className="space-y-4 rounded-md border p-4">
						<Skeleton className="h-4 w-24 rounded" />
						<Skeleton className="h-6 w-full rounded" />
					</div>
				</div>
			</aside>
		</div>
	);
}
