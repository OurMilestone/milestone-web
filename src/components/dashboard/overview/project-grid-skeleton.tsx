import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectGridSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
				<Skeleton className="h-8 w-48" />
				<div className="flex flex-wrap items-center gap-2">
					<Skeleton className="h-9 w-32" />
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-20" />
					<Skeleton className="h-9 w-24" />
				</div>
			</div>

			<div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
				{Array.from({ length: 6 }, (_, i) => (
					<Card
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={i}
						className="overflow-hidden !shadow-none h-full flex flex-col bg-white"
					>
						<CardContent className="p-1.5 flex flex-col flex-grow">
							<Skeleton className="h-40 w-full rounded-lg" />
							<div className="p-4 flex flex-col flex-grow">
								<div className="flex items-start justify-between mb-2">
									<Skeleton className="h-5 w-20" />
									<Skeleton className="h-7 w-7 rounded" />
								</div>
								<div className="space-y-1 mb-3 flex-grow">
									<Skeleton className="h-6 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
								<div className="flex items-center justify-between mb-3">
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-4 w-16" />
								</div>
								<hr className="my-3 border-border" />
								<div className="flex items-center justify-between mt-auto">
									<div className="flex -space-x-2">
										{Array.from({ length: 3 }, (_, j) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											<Skeleton key={j} className="h-8 w-8 rounded-full" />
										))}
									</div>
									<Skeleton className="h-4 w-8" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
