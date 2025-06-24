"use client";

import RichTextEditor from "@/components/tiptap/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Edit3, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import "@/components/tiptap/tiptap-styles.css";

interface TaskDescriptionProps {
	initialDescription?: string;
	taskId: string;
	updateTaskField: (variables: {
		taskId: string;
		fields: { description: string };
	}) => void;
	isUpdatingTask: boolean;
}

export default function TaskDescription({
	initialDescription = "",
	taskId,
	updateTaskField,
	isUpdatingTask,
}: TaskDescriptionProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [tempDescription, setTempDescription] = useState(initialDescription);

	useEffect(() => {
		if (!isEditing) {
			setTempDescription(initialDescription);
		}
	}, [initialDescription, isEditing]);

	const handleEdit = () => {
		setTempDescription(initialDescription);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		updateTaskField({
			taskId,
			fields: { description: tempDescription },
		});
		setIsEditing(false);
	};

	const description = initialDescription;

	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<p className="text-black text-lg">Description</p>
				{!isEditing && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleEdit}
						disabled={isUpdatingTask}
					>
						<Edit3 size={16} className="mr-2" />
						Edit
					</Button>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-3">
					<RichTextEditor
						content={tempDescription}
						onChange={setTempDescription}
						placeholder="Add a detailed description for this task..."
					/>
					<div className="flex items-center gap-2 justify-start">
						<Button
							variant="outline"
							size="sm"
							onClick={handleCancel}
							disabled={isUpdatingTask}
							className="bg-white"
						>
							<X size={16} className="mr-2" />
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={isUpdatingTask}
							className="bg-primary"
						>
							{isUpdatingTask ? (
								<Loader2 size={16} className="mr-2 animate-spin" />
							) : (
								<Save size={16} className="mr-2" />
							)}
							Save
						</Button>
					</div>
				</div>
			) : description ? (
				<div
					className="prose dark:prose-invert max-w-none "
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{ __html: description }}
				/>
			) : (
				<div
					className="text-center py-6 px-4 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary transition-colors"
					onClick={handleEdit}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") handleEdit();
					}}
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="button"
					tabIndex={0}
					aria-label="Add description"
				>
					<p className="text-muted-foreground text-sm">
						No description yet. Click to add one.
					</p>
				</div>
			)}
		</div>
	);
}
