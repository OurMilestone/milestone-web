import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetailSidebarSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-4 rounded-md border p-4">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-full" />
			</div>
			<div className="space-y-4 rounded-md border p-4">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-6 w-full" />
			</div>
		</div>
	);
}
