import { useAuthContext } from "@/components/providers/auth-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useCreateComment } from "@/hooks/mutations/use-create-comment";
import { useUpdateComment } from "@/hooks/mutations/use-update-comment";
import { getInitials } from "@/lib/utils";
import type { Comment } from "@/types/dashboard/task-details-types";
import type React from "react";
import { useState } from "react";
import MoodIcon from "./mood-icon";

const TaskComment: React.FC<{
	comment: Comment;
	taskId: number;
	reply?: boolean;
	replyingToId: number | null;
	setReplyingToId: (id: number | null) => void;
}> = ({ comment, taskId, reply = false, replyingToId, setReplyingToId }) => {
	const { user } = useAuthContext();

	const [replyText, setReplyText] = useState("");
	const { mutate: createComment, isPending } = useCreateComment();
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(comment.content);
	const { mutate: updateComment, isPending: isUpdating } = useUpdateComment();

	const handleReply = () => {
		if (!replyText.trim()) return;

		createComment({
			task: taskId,
			content: replyText,
			parent: comment.id,
			mentions: [],
		});

		setReplyText("");
		setReplyingToId(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleReply();
		} else if (e.key === "Escape") {
			setReplyingToId(null);
			setReplyText("");
		}
	};

	const handleEdit = () => {
		if (!editText.trim()) return;
		updateComment({
			commentUuid: comment.uuid,
			content: editText,
			taskId: taskId,
		});
		setIsEditing(false);
	};

	const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleEdit();
		} else if (e.key === "Escape") {
			setIsEditing(false);
			setEditText(comment.content);
		}
	};

	return (
		<div className="space-y-3">
			<div
				className={`bg-[#F9FAFB] p-4 flex items-start gap-2 rounded-lg ${comment.parent ? "border-l-4 border-l-[#2463EB]" : ""}`}
			>
				<Avatar className="size-10">
					<AvatarImage src={""} />
					<AvatarFallback>{comment?.author_name?.charAt(0)}</AvatarFallback>
				</Avatar>

				<div className="flex flex-col gap-2 flex-1">
					<div className="flex items-center gap-2">
						<h1 className="text-primary text-base font-semibold">
							{comment?.author_name}
						</h1>
						{comment.parent && (
							<span className="text-xs text-[#808AA3] bg-[#F1F5F9] px-2 py-1 rounded-full">
								Reply
							</span>
						)}
					</div>

					<p className="text-base text-[#808AA3]">{comment?.content}</p>

					<div className="flex items-center gap-2.5">
						{user?.full_name === comment?.author_name ? (
							<>
								{!isEditing ? (
									<Button
										className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
										variant={"ghost"}
										onClick={() => {
											setIsEditing(true);
											setEditText(comment.content);
										}}
									>
										Edit
									</Button>
								) : (
									<>
										<Button
											className="p-0 text-[#2463EB] hover:scale-105 hover:bg-transparent text-base"
											variant={"ghost"}
											onClick={handleEdit}
											disabled={!editText.trim() || isUpdating}
										>
											Save
										</Button>
										<Button
											className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
											variant={"ghost"}
											onClick={() => {
												setIsEditing(false);
												setEditText(comment.content);
											}}
										>
											Cancel
										</Button>
									</>
								)}
								<Button
									className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
									variant={"ghost"}
								>
									Delete
								</Button>
							</>
						) : null}

						{!reply && (
							<Button
								className="p-0 text-[#2463EB] hover:text-[#2463EB] hover:scale-105 hover:bg-transparent text-base"
								variant={"ghost"}
								onClick={() =>
									setReplyingToId(
										replyingToId === comment.id ? null : comment.id,
									)
								}
							>
								<img src="/assets/icons/message.svg" alt="message" />
								Reply
							</Button>
						)}

						<Button
							className="border hidden rounded-2xl hover:scale-105 py-1.5 px-3 border-[#2B3C66] hover:bg-transparent text-[#2B3C66] text-base"
							variant={"ghost"}
						>
							<MoodIcon />
						</Button>
					</div>
				</div>
			</div>

			{replyingToId === comment.id && !isEditing && (
				<div className="ml-12 space-y-3">
					<div className="flex items-start gap-2">
						<Avatar className="size-8">
							<AvatarFallback className="text-sm">
								{getInitials(user?.full_name)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 flex-col flex gap-2">
							<Input
								className="flex-1"
								placeholder={`Reply to ${comment.author_name}...`}
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
								onKeyDown={handleKeyDown}
								autoFocus
							/>
							<div className="flex justify-end gap-2">
								<LoadingButton
									onClick={handleReply}
									disabled={!replyText.trim() || isPending}
									size="sm"
									isLoading={isPending}
									loadingText="Sending..."
									spinnerClassName="size-4 mr-3"
								>
									Reply
								</LoadingButton>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setReplyingToId(null);
										setReplyText("");
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}

			{isEditing ? (
				<div className="ml-12 space-y-3">
					<div className="flex items-start gap-2">
						<Avatar className="size-8">
							<AvatarFallback className="text-sm">
								{getInitials(user?.full_name)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 flex-col flex gap-2">
							<Input
								className="flex-1"
								placeholder="Edit your comment..."
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								onKeyDown={handleEditKeyDown}
								autoFocus
							/>
							<div className="flex justify-end gap-2">
								<Button
									onClick={handleEdit}
									disabled={!editText.trim() || isUpdating}
									variant="default"
									size="sm"
								>
									Save
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setIsEditing(false);
										setEditText(comment.content);
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : null}

			{comment.replies && comment.replies.length > 0 && (
				<div className="ml-12 space-y-3">
					{comment.replies.map((reply) => (
						<TaskComment
							key={reply.id}
							comment={reply}
							taskId={taskId}
							reply={true}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskComment;
