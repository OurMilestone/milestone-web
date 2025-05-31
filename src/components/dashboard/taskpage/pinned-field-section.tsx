"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PinnedFieldSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

export default function PinnedFieldSection({
	title,
	children,
	defaultOpen = true,
}: PinnedFieldSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<Card className="bg-white pt-0 border rounded-md shadow-none">
			<CardHeader className=" px-3 py-3 rounded-t-md border-border bg-[#F8FAFC] [.border-b]:pb-0">
				<div
					className="flex justify-between items-center cursor-pointer"
					onClick={() => setIsOpen(!isOpen)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") setIsOpen(!isOpen);
					}}
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="button"
					tabIndex={0}
					aria-expanded={isOpen}
					aria-controls={`section-${title.replace(/\s+/g, "-")}`}
				>
					<CardTitle className="text-sm font-normal tracking-wider text-[#AAB1C2]">
						{title}
					</CardTitle>
					<Button variant="ghost" size="icon" className="h-6 w-6">
						{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
					</Button>
				</div>
			</CardHeader>
			{isOpen && (
				<CardContent
					id={`section-${title.replace(/\s+/g, "-")}`}
					className="p-1 px-4 space-y-3 bg-white"
				>
					{children}
				</CardContent>
			)}
		</Card>
	);
}
