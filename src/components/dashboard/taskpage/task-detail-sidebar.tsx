"use client";

import { PriorityDots } from "@/components/dashboard/taskboard/task-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	assignableUsers,
	availableLabels,
	priorities,
	updateIntervals,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import type { TaskDetail } from "@/types/dashboard/task-details-types";
import type {
	TaskAssignee,
	TaskLabel,
	TaskPriority,
} from "@/types/dashboard/taskboard-types";
import { CalendarClock, Tag, Users } from "lucide-react";
import EditableField, { type EditableFieldOption } from "./editable-field";
import PinnedFieldSection from "./pinned-field-section";

export type UpdateTaskFieldFn = (variables: {
	taskId: string;
	fields: Partial<
		Omit<TaskDetail, "id" | "project"> & {
			priority?: Uppercase<TaskDetail["priority"]>;
		}
	>;
}) => void;

interface TaskDetailSidebarProps {
	task: TaskDetail;
	userRole: UserRole;
	updateTaskField: UpdateTaskFieldFn;
	isUpdatingTask: boolean;
}

export default function TaskDetailSidebar({
	task,
	userRole,
	updateTaskField,
	isUpdatingTask,
}: TaskDetailSidebarProps) {
	const optionsForPriority: EditableFieldOption<TaskPriority>[] =
		priorities.map((p) => ({
			value: p.value,
			label: p.label,
			icon: p.icon,
		}));

	const optionsForAssignee: EditableFieldOption<string>[] =
		task.assignees?.map((a) => ({
			value: a.id,
			label: a.name,
			avatarUrl: a.avatarUrl,
			initials: a.initials,
			icon: Users,
		})) || [];

	const optionsForLabels: EditableFieldOption<string>[] =
		task.labels?.map((l) => ({
			value: l.id,
			label: l.name,
			colorClasses: l.colorClasses,
			icon: Tag,
		})) || [];

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
				<EditableField<TaskDetail["assignees"], string[]>
					label="Assignee"
					currentValue={task.assignees || []}
					options={optionsForAssignee}
					fieldType="select"
					isEditable={false}
					isLoading={isUpdatingTask}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiValue) =>
							apiValue ? apiValue.map((a) => a.id) : [],
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
										<Avatar className="h-6 w-6">
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
									<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card dark:border-background bg-gray-200 dark:bg-gray-700 text-slate-700 dark:text-slate-200 text-xs font-medium">
										+{currentAssignees.length - 3}
									</div>
								)}
							</div>
						) : (
							<span className="text-sm text-muted-foreground">Unassigned</span>
						)
					}
				/>

				{/* Reporter Field */}
				<EditableField<TaskDetail["reporter"], string>
					label="Reporter"
					currentValue={task.reporter}
					options={optionsForAssignee}
					fieldType="select"
					isEditable={false}
					isLoading={isUpdatingTask}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiValue) => (apiValue ? apiValue.id : ""),
						fromComponent: (componentValue) =>
							componentValue
								? assignableUsers.find((u) => u.id === componentValue) ||
									undefined
								: undefined,
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
				<EditableField<TaskLabel[], string[]>
					label="Labels"
					currentValue={task.labels || []}
					options={optionsForLabels}
					fieldType="multi-select-command"
					isEditable={false}
					isLoading={isUpdatingTask}
					onSave={() => {}}
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
					label="Priority"
					currentValue={task.priority}
					options={optionsForPriority}
					fieldType="select"
					isEditable={false}
					isLoading={isUpdatingTask}
					onSave={() => {}}
					valueTransformer={{
						toComponent: (apiValue) => apiValue.toLowerCase() as TaskPriority,
						fromComponent: (componentValue) =>
							componentValue.toUpperCase() as TaskPriority,
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
