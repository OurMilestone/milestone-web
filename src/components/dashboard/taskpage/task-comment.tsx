import { useAuthContext } from "@/components/providers/auth-context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import useMentions, {
	type MentionableUser,
} from "@/hooks/comments/useMentions";
import { useCreateComment } from "@/hooks/mutations/use-create-comment";
import { useDeleteComment } from "@/hooks/mutations/use-delete-comment";
import { useUpdateComment } from "@/hooks/mutations/use-update-comment";
import { getInitials } from "@/lib/utils";
import type { Comment } from "@/types/dashboard/task-details-types";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { MentionPopover } from "./mention-popover";
import MoodIcon from "./mood-icon";

const TaskComment: React.FC<{
	comment: Comment;
	taskId: number;
	taskUuid: string;
	reply?: boolean;
	replyingToId: number | null;
	setReplyingToId: (id: number | null) => void;
	mentionableUsers: MentionableUser[];
}> = ({
	comment,
	taskId,
	taskUuid,
	reply = false,
	replyingToId,
	setReplyingToId,
	mentionableUsers,
}) => {
	const { user } = useAuthContext();

	const {
		showMentionPopover,
		filteredUsers,
		selectedIndex,
		mentions,
		text: replyText,
		inputRef,
		handleInputChange: handleReplyInputChange,
		handleUserSelect,
		handleKeyDown: handleReplyKeyDown,
		setText: setReplyText,
		setMentions,
		closeMentionPopover,
	} = useMentions(mentionableUsers);

	const {
		showMentionPopover: showEditMentionPopover,
		filteredUsers: editFilteredUsers,
		selectedIndex: editSelectedIndex,
		mentions: editMentions,
		text: editMentionText,
		inputRef: editInputRef,
		handleInputChange: handleEditInputChange,
		handleUserSelect: handleEditUserSelect,
		handleKeyDown: handleEditKeyDown,
		setText: setEditMentionText,
		setMentions: setEditMentions,
	} = useMentions(mentionableUsers);

	const { mutateAsync: createComment, isPending } = useCreateComment();
	const [isEditing, setIsEditing] = useState(false);

	const { mutateAsync: updateComment, isPending: isUpdating } =
		useUpdateComment();
	const { mutateAsync: deleteComment } = useDeleteComment();

	useEffect(() => {
		if (isEditing) {
			setEditMentionText(comment.content);
			setEditMentions(comment.mentions || []);
		}
	}, [
		isEditing,
		comment.content,
		comment.mentions,
		setEditMentionText,
		setEditMentions,
	]);

	const handleReply = () => {
		if (!replyText.trim()) return;

		toast.promise(
			() =>
				createComment({
					task: taskId,
					content: replyText,
					parent: comment.id,
					mentions: mentions,
					taskUuid,
				}),
			{
				loading: "Sending reply...",
				success: "Reply sent!",
				error: "Failed to send reply.",
			},
		);

		setReplyText("");
		setMentions([]);
		setReplyingToId(null);
	};

	const handleEdit = () => {
		if (!editMentionText.trim()) return;
		toast.promise(
			() =>
				updateComment({
					commentUuid: comment.uuid,
					content: editMentionText,
					mentions: editMentions,
					taskUuid: taskUuid,
				}),
			{
				loading: "Updating comment...",
				success: "Comment updated!",
				error: "Failed to update comment.",
			},
		);
		setIsEditing(false);
	};

	const handleEditKeyDownWrapper = (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		handleEditKeyDown(e);
		if (e.key === "Enter" && !e.shiftKey && !showEditMentionPopover) {
			e.preventDefault();
			handleEdit();
		} else if (e.key === "Escape") {
			setIsEditing(false);
			setEditMentionText(comment.content);
		}
	};

	const handleDeleteComment = () => {
		toast.promise(
			() =>
				deleteComment({
					commentUuid: comment.uuid,
					taskUuid: taskUuid,
				}),
			{
				loading: "Deleting comment...",
				success: "Comment deleted successfully!",
				error: "Failed to delete comment.",
			},
		);
	};

	const highlightMentions = (content: string, mentions: string[]) => {
		if (!mentions || mentions.length === 0) {
			return content;
		}

		const sortedMentions = [...mentions].sort((a, b) => b.length - a.length);

		const mentionPatterns = sortedMentions.map((mention) => {
			const escapedMention = mention.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			return `@${escapedMention}`;
		});

		const pattern = `(${mentionPatterns.join("|")})`;
		const regex = new RegExp(pattern, "gi");

		const parts = content.split(regex);

		return parts.map((part) => {
			if (part.startsWith("@")) {
				const mentionName = part.slice(1);
				const isMention = mentions.some(
					(mention) => mention.toLowerCase() === mentionName.toLowerCase(),
				);

				if (isMention) {
					return (
						<span
							key={part}
							style={{
								color: "#2463EB",
								fontWeight: "500",
								backgroundColor: "#EBF4FF",
								padding: "1px 4px",
								borderRadius: "3px",
							}}
						>
							{part}
						</span>
					);
				}
			}
			return <span key={part}>{part}</span>;
		});
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

					<p className="text-base text-[#808AA3]">
						{highlightMentions(comment.content, comment.mentions)}
					</p>

					<div className="flex items-center gap-2.5">
						{user?.full_name === comment?.author_name ? (
							<>
								{!isEditing ? (
									<Button
										className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
										variant={"ghost"}
										onClick={() => {
											setIsEditing(true);
											setEditMentionText(comment.content);
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
											disabled={!editMentionText.trim() || isUpdating}
										>
											Save
										</Button>
										<Button
											className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
											variant={"ghost"}
											onClick={() => {
												setIsEditing(false);
												setEditMentionText(comment.content);
											}}
										>
											Cancel
										</Button>
									</>
								)}
								<Button
									className="p-0 text-[#808AA3] hover:text-[#808AA3] hover:scale-105 hover:bg-transparent text-base"
									variant={"ghost"}
									onClick={() => {
										handleDeleteComment();
									}}
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
							<div className="relative">
								<Input
									className="flex-1"
									placeholder={`Reply to ${comment.author_name}...`}
									value={replyText}
									onChange={handleReplyInputChange}
									onKeyDown={handleReplyKeyDown}
									autoFocus
									ref={inputRef}
								/>

								<MentionPopover
									show={showMentionPopover}
									users={filteredUsers}
									onClose={closeMentionPopover}
									selectedIndex={selectedIndex}
									onUserSelect={handleUserSelect}
									inputRef={inputRef}
								/>
							</div>
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
							<div className="relative">
								<Input
									className="flex-1"
									placeholder="Edit your comment..."
									value={editMentionText}
									onChange={handleEditInputChange}
									onKeyDown={handleEditKeyDownWrapper}
									autoFocus
									ref={editInputRef}
								/>
								<MentionPopover
									show={showEditMentionPopover}
									users={editFilteredUsers}
									onClose={closeMentionPopover}
									selectedIndex={editSelectedIndex}
									onUserSelect={handleEditUserSelect}
									inputRef={editInputRef}
								/>
							</div>
							<div className="flex justify-end gap-2">
								<Button
									onClick={handleEdit}
									disabled={!editMentionText.trim() || isUpdating}
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
										setEditMentionText(comment.content);
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
							taskUuid={taskUuid}
							reply={true}
							replyingToId={replyingToId}
							setReplyingToId={setReplyingToId}
							mentionableUsers={mentionableUsers}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskComment;
