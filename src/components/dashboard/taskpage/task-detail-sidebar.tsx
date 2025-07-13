"use client";

import { PriorityDots } from "@/components/dashboard/taskboard/task-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { useUpdateTaskField } from "@/hooks/mutations/use-update-task";
import { updateIntervals } from "@/lib/constants";
import type { ProjectMemberDTO } from "@/lib/data-access-layer/DTOs/project.dto";
import { getInitials, getStatusBadgeVariant } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { ProjectStatus } from "@/types/dashboard/projects-types";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import type {
	KanbanColumnId,
	TaskAssignee,
	TaskLabel,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import { CalendarClock } from "lucide-react";
import EditableField, { type EditableFieldOption } from "./editable-field";
import PinnedFieldSection from "./pinned-field-section";

interface TaskDetailSidebarProps {
	task: TaskDetail;
	updateTaskField: ReturnType<typeof useUpdateTaskField>["mutate"];
	isUpdatingTask: boolean;
	assignableUsers: ProjectMemberDTO[];
}

export default function TaskDetailSidebar({
	task,
	updateTaskField,
	isUpdatingTask,
	assignableUsers,
}: TaskDetailSidebarProps) {
	const statusOptions: EditableFieldOption<KanbanColumnId>[] = [
		{ value: "backlog", label: "Backlog" },
		{ value: "in_progress", label: "In Progress" },
		{ value: "in_review", label: "In Review" },
		{ value: "done", label: "Done" },
	];
	const assigneeOptions: EditableFieldOption<string>[] = [
		{ value: "Unassigned", label: "Unassigned" },
		...assignableUsers.map((user) => ({
			value: user.id,
			label: user.full_name || user.preferred_name,
			initials: getInitials(user.full_name || user.preferred_name),
		})),
	];

	const labelOptions: EditableFieldOption<string>[] = [
		{ value: "FEATURE", label: "Feature" },
		{ value: "BUG", label: "Bug" },
		{ value: "DOCUMENTATION", label: "Documentation" },
		{ value: "OTHER", label: "Other" },
	];

	const priorityOptions: EditableFieldOption<TaskPriority>[] = [
		{ value: "low", label: "Low" },
		{ value: "medium", label: "Medium" },
		{ value: "high", label: "High" },
		{ value: "urgent", label: "Urgent" },
	];

	const optionsForUpdateInterval: EditableFieldOption<string>[] =
		updateIntervals.map((interval) => ({
			value: interval,
			label: interval,
			icon: CalendarClock,
		}));

	return (
		<div className="space-y-6">
			<PinnedFieldSection title="Details">
				{/* Assignees Field */}
				<EditableField<TaskAssignee | null, string>
					label="Assignee"
					currentValue={task.assignee}
					options={assigneeOptions}
					fieldType="select"
					isEditable={true}
					isLoading={isUpdatingTask}
					onSave={(newAssignee) => {
						updateTaskField({
							taskId: task.id,
							taskUuid: task.uuid,
							fields: { assignee: newAssignee ? newAssignee.id : undefined },
						});
					}}
					valueTransformer={{
						toComponent: (apiValue) => apiValue?.id || "",
						fromComponent: (componentValue) => {
							const user =
								assignableUsers.find((u) => u.id === componentValue) || null;
							if (!user) return null;
							return {
								id: user.id,
								name: user.full_name || user.preferred_name,
								initials: getInitials(user.full_name || user.preferred_name),
							};
						},
					}}
					renderDisplayValue={(currentAssignee) =>
						currentAssignee ? (
							<div className="flex items-center gap-2 justify-end">
								<Avatar className="h-6 w-6">
									<AvatarFallback className="text-xs">
										{currentAssignee.initials}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm text-primary">
									{currentAssignee.name}
								</span>
							</div>
						) : (
							<span className="text-sm text-muted-foreground">Unassigned</span>
						)
					}
				/>

				{/* Parent Task */}
				<EditableField<TaskDetail["parentTask"], string>
					label="Parent Task"
					currentValue={task.parentTask}
					fieldType="select"
					isEditable={false}
					isLoading={isUpdatingTask}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiVal) => (apiVal ? apiVal.id : ""),
						fromComponent: (compVal) =>
							compVal ? { id: compVal, title: "", code: "" } : undefined,
					}}
					renderDisplayValue={(currentParentTask) => (
						<span className="text-sm text-primary">
							{currentParentTask
								? `${currentParentTask.code} - ${currentParentTask.title}`
								: "---"}
						</span>
					)}
				/>

				{/* Labels Field */}
				<EditableField<TaskLabel | null, string>
					label="Labels"
					currentValue={task.labels?.[0] ?? null}
					options={labelOptions}
					fieldType="select"
					isEditable={true}
					isLoading={isUpdatingTask}
					onSave={(newLabel) => {
						updateTaskField({
							taskId: task.id,
							taskUuid: task.uuid,
							fields: {
								label: newLabel?.id as
									| "FEATURE"
									| "BUG"
									| "DOCUMENTATION"
									| "OTHER"
									| undefined,
							},
						});
					}}
					valueTransformer={{
						toComponent: (apiValue) => apiValue?.id || "",
						fromComponent: (componentValue) => {
							const found = labelOptions.find(
								(l) => l.value === componentValue,
							);
							return found
								? {
										id: found.value,
										name: found.label,
										colorClasses: found.colorClasses ?? "",
									}
								: null;
						},
					}}
					renderDisplayValue={(currentLabel) =>
						currentLabel ? (
							<Badge variant="outline" className={currentLabel.colorClasses}>
								{currentLabel.name}
							</Badge>
						) : (
							<span className="text-sm text-muted-foreground">None</span>
						)
					}
				/>

				{/* Priority Field */}
				<EditableField<TaskPriority, TaskPriority>
					label="Priority"
					currentValue={task.priority}
					options={priorityOptions}
					fieldType="select"
					isEditable={true}
					isLoading={isUpdatingTask}
					onSave={(newPriority) => {
						updateTaskField({
							taskId: task.id,
							taskUuid: task.uuid,
							fields: {
								priority: newPriority.toUpperCase() as
									| "LOW"
									| "MEDIUM"
									| "HIGH"
									| "URGENT"
									| undefined,
							},
						});
					}}
					valueTransformer={{
						toComponent: (v) => v,
						fromComponent: (v) => v,
					}}
					renderDisplayValue={(currentPriority) => (
						<div className="flex items-center gap-1.5 justify-end">
							<PriorityDots priority={currentPriority} />
							<span className="text-sm text-primary capitalize">
								{currentPriority}
							</span>
						</div>
					)}
				/>

				{/* Status Field */}
				<EditableField<KanbanColumnId, KanbanColumnId>
					label="Status"
					currentValue={task.columnId}
					options={statusOptions}
					fieldType="select"
					isEditable={true}
					isLoading={isUpdatingTask}
					onSave={(newStatus) => {
						updateTaskField({
							taskId: task.id,
							taskUuid: task.uuid,
							fields: {
								status: newStatus.toUpperCase() as
									| "BACKLOG"
									| "IN_PROGRESS"
									| "IN_REVIEW"
									| "DONE"
									| "PENDING"
									| "CANCELLED"
									| undefined,
							},
						});
					}}
					valueTransformer={{
						toComponent: (v) => v,
						fromComponent: (v) => v,
					}}
					renderDisplayValue={(currentStatus) => {
						const { variant, className } = getStatusBadgeVariant(
							currentStatus as unknown as ProjectStatus,
						);
						return (
							<Badge variant={variant} className={className}>
								{statusOptions.find((s) => s.value === currentStatus)?.label}
							</Badge>
						);
					}}
				/>
			</PinnedFieldSection>

			<PinnedFieldSection title="Other Fields">
				{/* Update Interval Field */}
				<EditableField<string | undefined, string>
					label="Update Interval"
					currentValue={task.updateInterval}
					options={optionsForUpdateInterval}
					fieldType="select"
					isLoading={isUpdatingTask}
					isEditable={false}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiValue) => apiValue || "None",
						fromComponent: (componentValue) =>
							componentValue === "None" ? undefined : componentValue,
					}}
					renderDisplayValue={(currentInterval) => (
						<span className="text-sm text-primary">
							{currentInterval || "None"}
						</span>
					)}
				/>
				{/* Client */}
				<EditableField<TaskDetail["client"], string>
					label="Client"
					currentValue={task.client}
					fieldType="select"
					isLoading={isUpdatingTask}
					isEditable={false}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiVal) => (apiVal ? apiVal.id : ""),
						fromComponent: (compVal) =>
							compVal ? { id: compVal, name: "" } : undefined,
					}}
					renderDisplayValue={(currentClient) => (
						<span className="text-sm text-primary">
							{currentClient?.name || "N/A"}
						</span>
					)}
				/>
			</PinnedFieldSection>
		</div>
	);
}
