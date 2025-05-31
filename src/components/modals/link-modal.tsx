"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const linkSchema = z.object({
	url: z.string().url({ message: "Please enter a valid URL." }),
});
type LinkFormData = z.infer<typeof linkSchema>;

interface LinkModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	currentUrl?: string;
	onSetLink: (url: string) => void;
	onUnsetLink: () => void;
}

export default function LinkModal({
	isOpen,
	onOpenChange,
	currentUrl = "",
	onSetLink,
	onUnsetLink,
}: LinkModalProps) {
	const form = useForm<LinkFormData>({
		resolver: zodResolver(linkSchema),
		defaultValues: {
			url: currentUrl,
		},
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({ url: currentUrl });
		}
	}, [isOpen, currentUrl, form]);

	const onSubmit = (data: LinkFormData) => {
		onSetLink(data.url);
		onOpenChange(false);
	};

	const handleRemoveLink = () => {
		onUnsetLink();
		onOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md bg-white">
				<DialogHeader>
					<DialogTitle>{currentUrl ? "Edit Link" : "Insert Link"}</DialogTitle>
					<DialogDescription>
						Enter the URL you want to link to.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="url-input">URL</FormLabel>
									<FormControl>
										<Input
											id="url-input"
											placeholder="https://example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="sm:justify-between gap-2">
							{currentUrl && (
								<Button
									type="button"
									variant="destructive"
									onClick={handleRemoveLink}
									className="sm:mr-auto"
								>
									Remove Link
								</Button>
							)}
							<div className="flex gap-2 ml-auto">
								<DialogClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</DialogClose>
								<Button type="submit">
									{currentUrl ? "Update Link" : "Insert Link"}
								</Button>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
