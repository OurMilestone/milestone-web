"use client";

import RichTextEditor from "@/components/tiptap/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Edit3, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "@/components/tiptap/tiptap-styles.css";

interface TaskDescriptionProps {
	initialDescription?: string;
	taskId: string;
}

export default function TaskDescription({
	initialDescription = "",
	taskId,
}: TaskDescriptionProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(initialDescription);
	const [tempDescription, setTempDescription] = useState(initialDescription);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	useEffect(() => {
		setDescription(initialDescription);
		setTempDescription(initialDescription);
	}, [initialDescription]);

	const handleEdit = () => {
		setTempDescription(description);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setTempDescription(description);
		setIsEditing(false);
	};

	const handleSave = async () => {
		// TODO: I would call the API to save the description here
		setIsLoading(true);

		toast.promise(updateTaskDescriptionAPI(taskId, tempDescription), {
			loading: "Saving description...",
			success: (data) => {
				setDescription(data.description);
				setIsEditing(false);
				router.refresh();

				return "Description saved successfully!";
			},
			error: (err) => {
				return err.message || "Failed to save description.";
			},
			finally: () => {
				setIsLoading(false);
			},
		});
	};

	return (
		<div className="space-y-3 py-3">
			<div className="flex justify-between items-center">
				<p className="text-black text-lg">Description</p>
				{!isEditing && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleEdit}
						disabled={isLoading}
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
							disabled={isLoading}
							className="bg-white"
						>
							<X size={16} className="mr-2" />
							Cancel
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={isLoading}
							className="bg-primary"
						>
							{isLoading ? (
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
