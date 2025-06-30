"use client";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateProjectInput } from "@/lib/schemas/project-schema";
import { projectStatusSchema } from "@/lib/schemas/project-schema";
import { formatProjectStatus } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";

interface EditProjectFormProps {
	form: UseFormReturn<UpdateProjectInput>;
	isSubmitting: boolean;
}

export function EditProjectForm({ form, isSubmitting }: EditProjectFormProps) {
	return (
		<>
			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Title</FormLabel>
						<FormControl>
							<Input placeholder="e.g., New Marketing Website" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea
								{...field}
								placeholder="Provide a detailed description of the project..."
								className="resize-none"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="duration"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Duration</FormLabel>
							<FormControl>
								<Input type="number" placeholder="e.g., 6" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="duration_type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Duration Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select unit" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="days">Days</SelectItem>
									<SelectItem value="weeks">Weeks</SelectItem>
									<SelectItem value="months">Months</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={form.control}
				name="budget"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Budget ($)</FormLabel>
						<FormControl>
							<Input type="number" placeholder="e.g., 50000" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="status"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Status</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{projectStatusSchema.options.map((status) => (
									<SelectItem key={status} value={status}>
										{formatProjectStatus(status)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Saving Changes..." : "Save Changes"}
			</Button>
		</>
	);
}
