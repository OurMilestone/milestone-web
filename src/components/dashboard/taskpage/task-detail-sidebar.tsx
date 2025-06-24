"use client";

import { PriorityDots } from "@/components/dashboard/taskboard/task-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	assignableUsers,
	availableLabels,
	priorities,
	staticTaskBoardData, // For column/status options
	updateIntervals,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type {
	Subtask,
	TaskDetail,
	UserProfile as TaskUserProfile,
} from "@/types/dashboard/task-details-types";
import type {
	KanbanColumnId,
	TaskAssignee,
	TaskLabel,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import { CalendarClock, ListChecks, Tag, Users } from "lucide-react";
import EditableField, { type EditableFieldOption } from "./editable-field";
import PinnedFieldSection from "./pinned-field-section";

//* Mock API function for now.
// ! I must ensure it returns the updated value of the correct type
async function updateTaskFieldAPI<TFieldValue>(
	_taskId: string,
	_fieldName: string,
	newValue: TFieldValue,
): Promise<TFieldValue> {
	console.log(
		`API CALL: Updating task ${_taskId}, field ${_fieldName} to:`,
		newValue,
	);
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (Math.random() > 0.05) {
				resolve(newValue); // Return the new value as if from backend
			} else {
				reject(new Error(`Mock API error updating ${_fieldName}.`));
			}
		}, 1000);
	});
}

interface TaskDetailSidebarProps {
	task: TaskDetail;
	userRole: UserRole;
}

export default function TaskDetailSidebar({
	task,
	userRole,
}: TaskDetailSidebarProps) {
	const currentStatusInfo = staticTaskBoardData.columns.find(
		(col) => col.id === task.columnId,
	);

	const statusOptions: EditableFieldOption<KanbanColumnId>[] =
		staticTaskBoardData.columns.map((col) => ({
			value: col.id,
			label: col.title,
			icon: ListChecks,
		}));

	const assigneeOptions: EditableFieldOption<string>[] = assignableUsers.map(
		(u) => ({
			value: u.id,
			label: u.name,
			avatarUrl: u.avatarUrl,
			initials: u.initials,
			icon: Users,
		}),
	);

	const labelOptions: EditableFieldOption<string>[] = availableLabels.map(
		(l) => ({
			value: l.id,
			label: l.name,
			colorClasses: l.colorClasses,
			icon: Tag,
		}),
	);

	const priorityOptions: EditableFieldOption<TaskPriority>[] = priorities.map(
		(p) => ({
			value: p.value,
			label: p.label,
			// icon: p.icon, // You can add icons to your priority data
		}),
	);

	const updateIntervalOptions: EditableFieldOption<string>[] =
		updateIntervals.map((interval) => ({
			value: interval,
			label: interval,
			icon: CalendarClock,
		}));

	return (
		<div className="space-y-6">
			<PinnedFieldSection title="Details">
				{/* Assignees Field */}
				<EditableField<TaskAssignee[], string[]>
					taskId={task.id}
					fieldName="assignees"
					label="Assignee"
					currentValue={task.assignees || []}
					options={assigneeOptions}
					fieldType="multi-select-command"
					updateTaskFieldAPI={updateTaskFieldAPI}
					valueTransformer={{
						toComponent: (apiValue) => apiValue.map((a) => a.id),
						fromComponent: (componentValue) =>
							componentValue
								.map((id) => assignableUsers.find((u) => u.id === id))
								.filter(Boolean) as TaskAssignee[],
					}}
					renderDisplayValue={(currentAssignees) =>
						currentAssignees && currentAssignees.length > 0 ? (
							<div className="flex items-center gap-1 -space-x-2 justify-end">
								{currentAssignees.slice(0, 3).map((assignee) => (
									<div
										key={assignee.id}
										className="flex items-center gap-2 justify-end"
									>
										<Avatar key={assignee.id} className="h-6 w-6">
											<AvatarImage src={assignee.avatarUrl} />
											<AvatarFallback className="text-xs">
												{assignee.initials}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm text-primary">
											{assignee.name}
										</span>
									</div>
								))}

								{currentAssignees.length > 3 && (
									<Badge
										variant="secondary"
										className="rounded-full h-6 px-1.5 text-xs"
									>
										+{currentAssignees.length - 3}
									</Badge>
								)}
							</div>
						) : (
							<span className="text-sm text-muted-foreground">Unassigned</span>
						)
					}
				/>

				{/* Reporter Field */}
				<EditableField<TaskUserProfile | undefined, string>
					taskId={task.id}
					fieldName="reporter"
					label="Reporter"
					currentValue={task.reporter}
					options={assigneeOptions} //* I am assuming reporters are also users
					fieldType="select"
					updateTaskFieldAPI={updateTaskFieldAPI}
					valueTransformer={{
						toComponent: (apiValue) => (apiValue ? apiValue.id : ""),
						fromComponent: (componentValue) =>
							assignableUsers.find((u) => u.id === componentValue) || undefined,
					}}
					renderDisplayValue={(currentReporter) =>
						currentReporter ? (
							<div className="flex items-center gap-2 justify-end">
								<Avatar className="h-6 w-6">
									<AvatarImage src={currentReporter.avatarUrl} />
									<AvatarFallback className="text-xs">
										{currentReporter.initials}
									</AvatarFallback>
								</Avatar>
								<span className="text-sm text-primary">
									{currentReporter.name}
								</span>
							</div>
						) : (
							<span className="text-sm text-muted-foreground">N/A</span>
						)
					}
				/>

				{/* Parent Task */}
				<EditableField<TaskDetail["parentTask"], string>
					taskId={task.id}
					fieldName="parentTask"
					label="Parent Task"
					currentValue={task.parentTask}
					fieldType="select"
					isEditable={false}
					updateTaskFieldAPI={updateTaskFieldAPI}
					valueTransformer={{
						toComponent: (apiVal) => (apiVal ? apiVal.id : ""),
						fromComponent: (compVal) =>
							compVal ? { id: compVal, title: "", code: "" } : undefined,
					}}
					renderDisplayValue={(currentParentTask) => (
						<span className="text-xs text-primary ">
							{currentParentTask
								? `${currentParentTask.code} - ${currentParentTask.title}`
								: "---"}
						</span>
					)}
				/>

				{/* Labels Field */}
				<EditableField<TaskLabel[], string[]>
					taskId={task.id}
					fieldName="labels"
					label="Labels"
					currentValue={task.labels || []}
					options={labelOptions}
					fieldType="multi-select-command"
					updateTaskFieldAPI={updateTaskFieldAPI}
					valueTransformer={{
						toComponent: (apiValue) => apiValue.map((l) => l.id),
						fromComponent: (componentValue) =>
							componentValue
								.map((id) => availableLabels.find((l) => l.id === id))
								.filter(Boolean) as TaskLabel[],
					}}
					renderDisplayValue={(currentLabels) =>
						currentLabels && currentLabels.length > 0 ? (
							<div className="flex flex-wrap gap-1 justify-end">
								{currentLabels.map((label) => (
									<Badge
										key={label.id}
										variant="outline"
										className={cn(
											"text-sm px-1.5 py-0.5 font-normal border",
											label.colorClasses,
										)}
									>
										{label.name}
									</Badge>
								))}
							</div>
						) : (
							<span className="text-sm text-muted-foreground">None</span>
						)
					}
				/>

				{/* Priority Field */}
				<EditableField<TaskPriority, TaskPriority>
					taskId={task.id}
					fieldName="priority"
					label="Priority"
					currentValue={task.priority}
					options={priorityOptions}
					fieldType="select"
					updateTaskFieldAPI={updateTaskFieldAPI}
					valueTransformer={{
						toComponent: (apiValue) => apiValue,
						fromComponent: (componentValue) => componentValue,
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
			</PinnedFieldSection>

			<PinnedFieldSection title="Other Fields">
				{/* Update Interval Field */}
				<EditableField<string | undefined, string>
					taskId={task.id}
					fieldName="updateInterval"
					label="Update Interval"
					currentValue={task.updateInterval}
					options={updateIntervalOptions}
					fieldType="select"
					updateTaskFieldAPI={updateTaskFieldAPI}
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
					taskId={task.id}
					fieldName="client"
					label="Client"
					currentValue={task.client}
					fieldType="select"
					isEditable={false}
					updateTaskFieldAPI={updateTaskFieldAPI}
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
