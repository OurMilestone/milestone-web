"use client";

import {
	Form,
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
import {
	type AddCardFormData,
	addCardSchema,
} from "@/lib/schemas/payments-schema";
import { generateMonthOptions, generateYearOptions } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AddCardDetailsStepProps {
	onCardAdded: (cardDetails: AddCardFormData) => Promise<void>;
	isSubmitting: boolean;
	setIsSubmitting: (isSubmitting: boolean) => void;
}

export default function AddCardDetailsStep({
	onCardAdded,
	isSubmitting,
	setIsSubmitting,
}: AddCardDetailsStepProps) {
	const form = useForm<AddCardFormData>({
		resolver: zodResolver(addCardSchema),
		defaultValues: {
			nameOnCard: "",
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			cardPin: "",
		},
		mode: "onChange",
	});

	const [selectedExpMonth, setSelectedExpMonth] = useState<string>("");
	const [selectedExpYear, setSelectedExpYear] = useState<string>("");

	const monthOptions = generateMonthOptions();
	const yearOptions = generateYearOptions(0, 15);

	useEffect(() => {
		if (selectedExpMonth && selectedExpYear) {
			form.setValue("expiryDate", `${selectedExpMonth}/${selectedExpYear}`, {
				shouldValidate: true,
				shouldDirty: true,
			});
		} else if (form.getValues("expiryDate")) {
			form.setValue("expiryDate", "", {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	}, [selectedExpMonth, selectedExpYear, form]);

	const handleExpiryChange = () => {
		if (selectedExpMonth && selectedExpYear) {
			form.setValue("expiryDate", `${selectedExpMonth}/${selectedExpYear}`, {
				shouldValidate: true,
			});
		} else {
			form.setValue("expiryDate", "", { shouldValidate: true });
		}
	};

	const onSubmit = async (data: AddCardFormData) => {
		setIsSubmitting(true);
		await onCardAdded(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
				id="add-card-details-form"
			>
				<p className="text-sm text-muted-foreground mb-4">
					The card would be used by default for billing.
				</p>
				<FormField
					control={form.control}
					name="nameOnCard"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name on Card</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., John Doe"
									{...field}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="cardNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Card Number</FormLabel>
							<FormControl>
								<Input
									placeholder="0000 0000 0000 0000"
									{...field}
									maxLength={19}
									onChange={(e) => {
										const value = e.target.value
											.replace(/\s/g, "")
											.replace(/(\d{4})/g, "$1 ")
											.trim();
										field.onChange(value);
									}}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="expiryDate"
					render={({ field }) => <input type="hidden" {...field} />}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormItem>
						<FormLabel>Exp Date</FormLabel>
						<div className="flex gap-2">
							<Select
								value={selectedExpMonth}
								onValueChange={(value) => {
									setSelectedExpMonth(value);
								}}
								disabled={isSubmitting}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="MM" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{monthOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={selectedExpYear}
								onValueChange={(value) => {
									setSelectedExpYear(value);
									setTimeout(handleExpiryChange, 0);
								}}
								disabled={isSubmitting}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="YYYY" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{yearOptions.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{form.formState.errors.expiryDate && (
							<p className="text-sm font-medium text-destructive pt-1">
								{form.formState.errors.expiryDate.message}
							</p>
						)}
					</FormItem>
					<FormField
						control={form.control}
						name="cvv"
						render={({ field }) => (
							<FormItem>
								<FormLabel>CVV</FormLabel>
								<FormControl>
									<Input
										placeholder="•••"
										{...field}
										maxLength={4}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="cardPin"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Card PIN</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="••••"
									{...field}
									maxLength={4}
									disabled={isSubmitting}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
