import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import MoodIcon from "./mood-icon";

const TaskComment = () => {
	return (
		<div className="bg-[#F9FAFB] p-4 flex items-start gap-2 rounded-lg">
			<Avatar className="size-10">
				<AvatarImage src="https://github.com/shadcn.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>

			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<h1 className="text-primary text-base font-semibold">
						Adewale Julius
					</h1>
					<p className="text-sm text-[#AAB1C2]">2024-11-18 | 10:35 AM</p>
				</div>

				<p className="text-base text-[#808AA3]">
					I’ll prepare a few alternative colour schemes for review by tomorrow.
				</p>

				<div className="flex items-center gap-2.5">
					<Button
						className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
						variant={"ghost"}
					>
						Edit
					</Button>

					<Button
						className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
						variant={"ghost"}
					>
						Delete
					</Button>

					<Button
						className="p-0 text-[#2463EB] hover:text-[#2463EB] hover:scale-105 hover:bg-transparent text-base"
						variant={"ghost"}
					>
						<img src="/assets/icons/message.svg" alt="message" />
						Reply
					</Button>

					<Button
						className="border rounded-2xl hover:scale-105 py-1.5 px-3 border-[#2B3C66] hover:bg-transparent text-[#2B3C66] text-base"
						variant={"ghost"}
					>
						<MoodIcon />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TaskComment;
