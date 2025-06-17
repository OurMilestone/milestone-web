import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Card key={index} className="bg-white !shadow-none !p-2">
					<CardContent className="p-2">
						<div className="flex items-start space-x-3 md:space-x-4">
							<Skeleton className="h-11 w-11 rounded-lg" />
							<div className="flex-1 min-w-0 space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-7 w-32" />
								<Skeleton className="h-4 w-28" />
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
