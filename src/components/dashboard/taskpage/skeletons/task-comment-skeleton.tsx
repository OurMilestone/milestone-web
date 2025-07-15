import { Skeleton } from "@/components/ui/skeleton";

export function TaskCommentSkeleton() {
	return (
		<div className="space-y-3">
			<div className="bg-[#F9FAFB] p-4 flex items-start gap-2 rounded-lg">
				<Skeleton className="size-10 rounded-full" />
				<div className="flex flex-col gap-2 flex-1">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-24 rounded" />
						<Skeleton className="h-4 w-12 rounded" />
					</div>
					<Skeleton className="h-5 w-3/4 rounded" />
					<div className="flex items-center gap-2.5 mt-2">
						<Skeleton className="h-6 w-12 rounded" />
						<Skeleton className="h-6 w-12 rounded" />
						<Skeleton className="h-6 w-12 rounded" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default TaskCommentSkeleton;
