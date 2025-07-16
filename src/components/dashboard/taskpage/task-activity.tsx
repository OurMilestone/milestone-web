import { useAuthContext } from "@/components/providers/auth-context-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useMentions, {
	type MentionableUser,
} from "@/hooks/comments/useMentions";
import { useCreateComment } from "@/hooks/mutations/use-create-comment";
import { useProjectMembers } from "@/hooks/queries/use-projects";
import { useTaskComments } from "@/hooks/queries/use-task-detail";
import { getInitials } from "@/lib/utils";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import { useState } from "react";
import { toast } from "sonner";
import TaskCommentSkeleton from "./skeletons/task-comment-skeleton";
import TaskComment from "./task-comment";

const TaskActivity = ({ task }: { task: TaskDetail }) => {
	const { user: authContextUser } = useAuthContext();

	const [replyingToId, setReplyingToId] = useState<number | null>(null);

	const { data: projectMembers } = useProjectMembers(Number(task.project.id));
	const { mutateAsync: createComment, isPending } = useCreateComment();
	const {
		data: comments,
		isLoading: isCommentsLoading,
		isFetching: isCommentsFetching,
	} = useTaskComments(task.uuid);

	const mentionableUsers: MentionableUser[] =
		projectMembers?.members?.map((member) => ({
			id: member.id,
			name: member.full_name,
			email: member.email,
			initials: getInitials(member.full_name),
		})) || [];

	const {
		showMentionPopover,
		filteredUsers,
		selectedIndex,
		mentions,
		text,
		inputRef,
		handleInputChange,
		handleUserSelect,
		handleKeyDown,
		setText,
		setMentions,
	} = useMentions(mentionableUsers);

	const handleSubmitComment = () => {
		if (!text.trim()) return;

		toast.promise(
			async () =>
				await createComment({
					task: task.id,
					content: text,
					mentions: mentions,
					taskUuid: task.uuid,
				}),
			{
				loading: "Adding comment...",
				success: "Comment added!",
				error: "Failed to add comment",
			},
		);

		setText("");
		setMentions([]);
	};

	const skeletonKeys = [
		"comment-skeleton-1",
		"comment-skeleton-2",
		"comment-skeleton-3",
	];

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
						className="gap-1.5 hidden bg-[#F8FAFC] border-[#EAEAEB]"
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
						className="gap-1.5 hidden bg-[#F8FAFC] border-[#EAEAEB]"
					>
						History
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 hidden bg-[#F8FAFC] border-[#EAEAEB]"
					>
						Work log
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Avatar className="size-10">
					<AvatarFallback>
						{getInitials(authContextUser?.full_name)}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1 relative">
					<Input
						ref={inputRef}
						className="py-3 px-4"
						placeholder="Add a comment..."
						value={text}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
					/>

					{showMentionPopover && filteredUsers.length > 0 && (
						<div className="absolute top-full left-0 right-0 z-50 mt-1">
							<div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
								{filteredUsers.map((user, index) => (
									<button
										key={user.id}
										type="button"
										onClick={() => handleUserSelect(user)}
										className={`flex items-center gap-3 px-4 py-3 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
											index === selectedIndex
												? "bg-blue-50 border-l-2 border-blue-500"
												: "hover:bg-gray-50 cursor-pointer"
										}`}
									>
										<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
											{user.initials}
										</div>
										<div className="flex flex-col">
											<span className="text-sm font-medium text-gray-900">
												{user.name}
											</span>
											<span className="text-xs text-gray-500">
												{user.email}
											</span>
										</div>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				<Button
					onClick={handleSubmitComment}
					disabled={!text.trim() || isPending}
					className="px-4"
				>
					Comment
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
				{isCommentsLoading || isCommentsFetching
					? skeletonKeys.map((key) => <TaskCommentSkeleton key={key} />)
					: comments?.map((comment) => (
							<TaskComment
								key={comment.id}
								taskUuid={task.uuid}
								mentionableUsers={mentionableUsers}
								comment={comment}
								taskId={task.id}
								replyingToId={replyingToId}
								setReplyingToId={setReplyingToId}
							/>
						))}
			</div>
		</div>
	);
};

export default TaskActivity;
