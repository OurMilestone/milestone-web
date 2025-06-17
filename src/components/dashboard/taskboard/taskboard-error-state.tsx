"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface TaskBoardErrorStateProps {
	errorMessage: string;
	onRetry: () => void;
}

export function TaskBoardErrorState({
	errorMessage,
	onRetry,
}: TaskBoardErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-800/20 rounded-lg">
			<AlertTriangle className="w-12 h-12 text-destructive mb-4" />
			<h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
				Something went wrong
			</h3>
			<p className="text-sm text-muted-foreground mb-6 max-w-md">
				{errorMessage}
			</p>
			<Button onClick={onRetry}>
				<RefreshCw className="mr-2 h-4 w-4" />
				Try Again
			</Button>
		</div>
	);
}
