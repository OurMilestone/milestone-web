import { Skeleton } from "@/components/ui/skeleton";

export default function TaskSubtaskSkeleton() {
	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-10 w-10" />
			</div>
			<div className="space-y-2">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}
