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
	type AddFundsFormInputData,
	type AddFundsFormValidatedData,
	addFundsFormSchema,
} from "@/lib/schemas/payments-schema";
import type { SavedPaymentMethod } from "@/types/dashboard/payments-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ConfirmAddFundsStepProps {
	savedPaymentMethods: SavedPaymentMethod[];
	onConfirmAddFunds: (data: AddFundsFormValidatedData) => Promise<void>;
	isSubmitting: boolean;
	setIsSubmitting: (isSubmitting: boolean) => void;
}

export default function ConfirmAddFundsStep({
	savedPaymentMethods,
	onConfirmAddFunds,
	isSubmitting,
	setIsSubmitting,
}: ConfirmAddFundsStepProps) {
	const form = useForm<AddFundsFormInputData>({
		resolver: zodResolver(addFundsFormSchema, undefined, {
			raw: true,
		}),
		defaultValues: {
			amount: "",
			sourceOfFundsId:
				savedPaymentMethods.find((pm) => pm.isDefault)?.id ||
				(savedPaymentMethods.length > 0 ? savedPaymentMethods[0].id : ""),
			transactionPin: "",
		},
		mode: "onChange",
	});

	const onSubmit = async (data: AddFundsFormValidatedData) => {
		setIsSubmitting(true);
		await onConfirmAddFunds(data);
	};

	return (
		<Form {...form}>
			<form
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				onSubmit={form.handleSubmit(onSubmit as any)}
				className="space-y-4"
				id="confirm-add-funds-form"
			>
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Enter Amount</FormLabel>
							<FormControl>
								<Input
									type="text"
									inputMode="decimal"
									placeholder="2,000"
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
					name="sourceOfFundsId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Source of Funds</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
								disabled={isSubmitting || savedPaymentMethods.length === 0}
							>
								<FormControl className="w-full">
									<SelectTrigger>
										<SelectValue placeholder="Select payment method" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{savedPaymentMethods.length > 0 ? (
										savedPaymentMethods.map((method) => (
											<SelectItem key={method.id} value={method.id}>
												{method.displayName}
											</SelectItem>
										))
									) : (
										<SelectItem value="no-cards" disabled>
											No saved cards available
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="transactionPin"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Transaction Pin</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="••••"
									{...field}
									maxLength={6}
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
