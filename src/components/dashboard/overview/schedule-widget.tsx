"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Video } from "lucide-react";

const MEETINGS = [
	{
		id: "1",
		title: "Meeting with Mark",
		time: "12:00 – 12:45 AM (UTC)",
		platform: "Google Meet",
		attendees: ["MK", "JD", "AL"],
	},
	{
		id: "2",
		title: "Sprint planning",
		time: "02:00 – 02:45 PM (UTC)",
		platform: "Google Meet",
		attendees: ["SR", "TW"],
	},
];

const EVENTS = [
	{
		id: "1",
		title: "Product demo day",
		time: "10:00 – 11:30 AM (UTC)",
		platform: "Zoom",
		attendees: ["NK", "PR", "LM"],
	},
];

function ScheduleCard({
	title,
	time,
	platform,
	attendees,
}: {
	title: string;
	time: string;
	platform: string;
	attendees: string[];
}) {
	return (
		<div className="rounded-xl border border-[#E8EAED] bg-[#FAFBFC] p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-[#101828]">{title}</p>
					<p className="mt-1 text-xs text-[#667085]">{time}</p>
				</div>
				<div className="flex -space-x-2">
					{attendees.map((initials) => (
						<Avatar key={initials} className="h-7 w-7 border-2 border-white">
							<AvatarFallback className="bg-blue-100 text-[10px] font-medium text-blue-700">
								{initials}
							</AvatarFallback>
						</Avatar>
					))}
				</div>
			</div>
			<div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-xs font-medium text-[#344054] ring-1 ring-[#E8EAED]">
				<Video className="h-3.5 w-3.5 text-[#2F6FBF]" />
				{platform}
			</div>
		</div>
	);
}

export function ScheduleWidget() {
	return (
		<section className="flex h-full flex-col rounded-xl border border-[#E8EAED] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
			<h2 className="text-base font-semibold text-[#101828]">Schedule</h2>

			<Tabs defaultValue="meetings" className="mt-4 flex flex-1 flex-col">
				<TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-[#E8EAED] bg-transparent p-0">
					{(["meetings", "events"] as const).map((tab) => (
						<TabsTrigger
							key={tab}
							value={tab}
							className={cn(
								"rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-sm capitalize shadow-none",
								"data-[state=active]:border-[#2F6FBF] data-[state=active]:bg-transparent data-[state=active]:text-[#2F6FBF] data-[state=active]:shadow-none",
								"text-[#667085]",
							)}
						>
							{tab}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="meetings" className="mt-4 space-y-3">
					{MEETINGS.map((meeting) => (
						<ScheduleCard key={meeting.id} {...meeting} />
					))}
				</TabsContent>

				<TabsContent value="events" className="mt-4 space-y-3">
					{EVENTS.map((event) => (
						<ScheduleCard key={event.id} {...event} />
					))}
				</TabsContent>
			</Tabs>
		</section>
	);
}
