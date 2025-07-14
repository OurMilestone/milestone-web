import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateComment } from "@/hooks/mutations/use-create-comment";
import { useProjectMembers } from "@/hooks/queries/use-projects";
import { getInitials } from "@/lib/utils";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import { useRef, useState } from "react";
import TaskComment from "./task-comment";

interface MentionUser {
	id: string;
	name: string;
	email: string;
	initials: string;
}

const TaskActivity = ({ task }: { task: TaskDetail }) => {
	const [commentText, setCommentText] = useState("");
	const [mentions, setMentions] = useState<string[]>([]);
	const [showMentionPopover, setShowMentionPopover] = useState(false);
	const [mentionSearch, setMentionSearch] = useState("");
	const [cursorPosition, setCursorPosition] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: projectMembers } = useProjectMembers(Number(task.project.id));
	const { mutate: createComment, isPending } = useCreateComment();

	const mentionableUsers: MentionUser[] =
		projectMembers?.members?.map((member) => ({
			id: member.id,
			name: member.preferred_name || member.full_name,
			email: member.email,
			initials: getInitials(member.preferred_name || member.full_name),
		})) || [];

	const filteredUsers = mentionableUsers.filter(
		(user) =>
			user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
			user.email.toLowerCase().includes(mentionSearch.toLowerCase()),
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setCommentText(value);

		const cursorPos = e.target.selectionStart || 0;
		setCursorPosition(cursorPos);

		const beforeCursor = value.slice(0, cursorPos);
		const atIndex = beforeCursor.lastIndexOf("@");

		if (atIndex !== -1 && atIndex < cursorPos) {
			const searchTerm = beforeCursor.slice(atIndex + 1);
			setMentionSearch(searchTerm);
			setShowMentionPopover(true);
		} else {
			setShowMentionPopover(false);
		}
	};

	const handleUserSelect = (user: MentionUser) => {
		const beforeAt = commentText.slice(0, commentText.lastIndexOf("@"));
		const afterCursor = commentText.slice(cursorPosition);
		const newText = `${beforeAt}@${user.name} ${afterCursor}`;

		setCommentText(newText);
		setMentions((prev) => [...prev, user.name]);
		setShowMentionPopover(false);
		setMentionSearch("");

		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	const handleSubmitComment = () => {
		if (!commentText.trim()) return;

		createComment({
			task: task.id,
			content: commentText,
			mentions: mentions,
		});

		setCommentText("");
		setMentions([]);
	};

	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium text-primary">Activity</h3>
			</div>

			<div className="flex items-center gap-2">
				<p className="text-sm text-muted-foreground">Show:</p>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 bg-[#F8FAFC] border-[#EAEAEB]"
					>
						All
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 bg-[#F8FAFC] border-[#EAEAEB]"
					>
						Comments
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 bg-[#F8FAFC] border-[#EAEAEB]"
					>
						History
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 bg-[#F8FAFC] border-[#EAEAEB]"
					>
						Work log
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Avatar className="size-10">
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>

				<div className="flex-1 relative">
					<Input
						ref={inputRef}
						className="py-3 px-4"
						placeholder="Add a comment... Use @ to mention someone"
						value={commentText}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmitComment();
							}
						}}
					/>

					{/* Mention Popover */}
					{showMentionPopover && (
						<Popover
							open={showMentionPopover}
							onOpenChange={setShowMentionPopover}
						>
							<PopoverContent className="p-0 w-80" align="start">
								<Command>
									<CommandInput
										placeholder="Search members..."
										value={mentionSearch}
										onValueChange={setMentionSearch}
									/>
									<CommandList>
										<CommandEmpty>No members found.</CommandEmpty>
										<CommandGroup>
											{filteredUsers.map((user) => (
												<CommandItem
													key={user.id}
													onSelect={() => handleUserSelect(user)}
													className="flex items-center gap-2 cursor-pointer"
												>
													<Avatar className="h-6 w-6">
														<AvatarFallback className="text-xs">
															{user.initials}
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span className="text-sm font-medium">
															{user.name}
														</span>
														<span className="text-xs text-muted-foreground">
															{user.email}
														</span>
													</div>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					)}
				</div>

				<Button
					onClick={handleSubmitComment}
					disabled={!commentText.trim() || isPending}
					className="px-4"
				>
					{isPending ? "Adding..." : "Comment"}
				</Button>
			</div>

			{/* Show selected mentions */}
			{mentions.length > 0 && (
				<div className="flex flex-wrap gap-1">
					<span className="text-xs text-muted-foreground">Mentioned:</span>
					{mentions.map((mention) => (
						<span
							key={`mention-${mention}`}
							className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
						>
							{mention}
						</span>
					))}
				</div>
			)}

			<div className="grid grid-cols-1 gap-4">
				<TaskComment />
			</div>
		</div>
	);
};

export default TaskActivity;
