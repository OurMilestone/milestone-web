import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetailViewSkeleton() {
	return (
		<div className="space-y-6 py-3">
			<div className="space-y-2">
				<Skeleton className="h-8 w-3/4" />
				<Skeleton className="h-4 w-1/4" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-32 w-full rounded-md" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-24" />
				<Skeleton className="h-12 w-full rounded-md" />
				<Skeleton className="h-12 w-full rounded-md" />
			</div>
		</div>
	);
}
