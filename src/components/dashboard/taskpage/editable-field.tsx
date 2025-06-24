"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	// CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, Loader2, Tag, Users, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useEffect, useState } from "react";

export interface EditableFieldOption<TValue = string> {
	value: TValue;
	label: string;
	icon?: React.ElementType;
	avatarUrl?: string;
	initials?: string;
	colorClasses?: string;
}

type EditableFieldType = "select" | "multi-select-command" | "text-input";

interface EditableFieldProps<V, CV extends string | string[]> {
	label: string;
	currentValue: V;
	options?: EditableFieldOption<CV extends string[] ? CV[number] : CV>[];
	fieldType: EditableFieldType;
	isEditable?: boolean;
	renderDisplayValue: (value: V) => React.ReactNode;
	onSave: (newValue: V) => void;
	isLoading: boolean;
	valueTransformer: {
		toComponent: (apiValue: V) => CV;
		fromComponent: (componentValue: CV) => V;
	};
	placeholder?: string;
}

export default function EditableField<V, CV extends string | string[]>({
	label,
	currentValue,
	options = [],
	fieldType,
	isEditable = true,
	renderDisplayValue,
	onSave,
	isLoading,
	valueTransformer,
	placeholder = `Select ${label}`,
}: EditableFieldProps<V, CV>) {
	const [isEditingPopoverOpen, setIsEditingPopoverOpen] = useState(false);

	// * This state holds the value during editing (e.g., selected ID for select, array of IDs for multi-select)
	const [editStateValue, setEditStateValue] = useState<CV>(() =>
		valueTransformer.toComponent(currentValue),
	);

	useEffect(() => {
		setEditStateValue(valueTransformer.toComponent(currentValue));
	}, [currentValue, valueTransformer]);

	const handleSave = () => {
		if (!isEditable || isLoading) return;
		const apiValueToSave = valueTransformer.fromComponent(editStateValue);
		onSave(apiValueToSave);
		setIsEditingPopoverOpen(false);
	};

	const renderEditingContent = () => {
		switch (fieldType) {
			case "select":
				return (
					<Select
						value={editStateValue as string}
						onValueChange={(val) => setEditStateValue(val as CV)}
						disabled={isLoading}
					>
						<SelectTrigger className="w-full h-9 text-xs">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									<div className="flex items-center gap-2">
										{option.avatarUrl && (
											<Avatar className="h-5 w-5">
												<AvatarImage src={option.avatarUrl} />
												<AvatarFallback className="text-xs">
													{option.initials}
												</AvatarFallback>
											</Avatar>
										)}
										{option.icon &&
											React.createElement(option.icon, {
												className: "h-4 w-4 mr-1 text-muted-foreground",
											})}
										<span>{option.label}</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			case "multi-select-command": {
				const selectedValuesSet = new Set(editStateValue as string[]);
				return (
					<Command className="w-full bg-white">
						<CommandInput
							placeholder={`Search ${label.toLowerCase()}...`}
							disabled={isLoading}
						/>
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={String(option.value)}
										value={String(option.value)}
										onSelect={() => {
											setEditStateValue((prevComponentValue) => {
												const currentSet = new Set(
													prevComponentValue as string[],
												);
												const optionValueStr = String(option.value);
												if (currentSet.has(optionValueStr)) {
													currentSet.delete(optionValueStr);
												} else {
													currentSet.add(optionValueStr);
												}
												return Array.from(currentSet) as CV;
											});
										}}
										className="text-xs"
										disabled={isLoading}
									>
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
												selectedValuesSet.has(option.value)
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<Check className={cn("h-4 w-4")} />
										</div>
										{option.avatarUrl && (
											<Avatar className="mr-2 h-5 w-5">
												<AvatarImage src={option.avatarUrl} />
												<AvatarFallback className="text-xs">
													{option.initials}
												</AvatarFallback>
											</Avatar>
										)}
										{option.colorClasses && (
											<span
												className={cn(
													"mr-2 h-2 w-2 rounded-full",
													option.colorClasses.split(" ")[0],
												)}
											/>
										)}
										<span>{option.label}</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				);
			}
			default:
				return <p>Unsupported field type for editing.</p>;
		}
	};

	const displayContent = renderDisplayValue(currentValue);

	if (!isEditable) {
		return (
			<div className="flex justify-between items-center group py-1.5">
				<span className="text-sm text-primary min-w-[100px] flex-shrink-0">
					{label}
				</span>
				<div className="flex-1 text-right min-w-0 ">{displayContent}</div>
			</div>
		);
	}

	return (
		<div className="flex justify-between items-center group py-1.5">
			<span className="text-sm text-primary min-w-[100px] flex-shrink-0">
				{label}
			</span>
			<Popover
				open={isEditingPopoverOpen}
				onOpenChange={(open) => {
					if (isLoading) return;
					if (open) {
						// This will ensure we reset editStateValue to current task value when opening
						setEditStateValue(valueTransformer.toComponent(currentValue));
					}
					setIsEditingPopoverOpen(open);
				}}
			>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						className="flex-1 justify-end text-right min-w-0 h-auto p-0 hover:scale-95 hover:bg-transparent font-normal group"
						disabled={isLoading}
					>
						<div className="truncate data-[placeholder]:text-muted-foreground">
							{displayContent}
						</div>
						{/* //? Should I add this as an indicator that this field is editable asides the cursor pointer in the parent component? */}
						{/* <Edit3
							size={14}
							className="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex-shrink-0"
						/> */}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-64 sm:w-72 p-0" align="end">
					<div className="p-3 space-y-3">
						<p className="text-xs font-medium text-muted-foreground px-1">
							Edit {label}
						</p>
						{renderEditingContent()}
						<div className="flex justify-end gap-2 pt-2 border-t border-border mt-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsEditingPopoverOpen(false)}
								disabled={isLoading}
							>
								<X size={16} className="mr-1" /> Cancel
							</Button>
							<Button size="sm" onClick={handleSave} disabled={isLoading}>
								{isLoading ? (
									<Loader2 size={16} className="mr-1 animate-spin" />
								) : (
									<Check size={16} className="mr-1" />
								)}
								Save
							</Button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
