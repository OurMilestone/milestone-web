"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CardIcon } from "../../../../../public/assets/svgs/__index__";

interface NoCardPromptStepProps {
	onAddNewCard: () => void;
}

export default function NoCardPromptStep({
	onAddNewCard,
}: NoCardPromptStepProps) {
	return (
		<div className="flex flex-col items-center justify-center text-center p-4 space-y-6">
			<Image
				src={CardIcon}
				alt="Payment card illustration"
				width={180}
				height={120}
			/>
			<div className="space-y-2">
				<h3 className="text-xl font-semibold text-foreground">
					Add your first card for payment
				</h3>
				<p className="text-sm text-muted-foreground px-4">
					You haven't saved any cards yet, click on the button to add one.
				</p>
			</div>
			<Button
				onClick={onAddNewCard}
				className="w-full h-12 max-w-xs bg-primary text-primary-foreground hover:bg-primary/90"
			>
				Add new card
			</Button>
		</div>
	);
}
