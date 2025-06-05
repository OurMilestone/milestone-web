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
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
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
	CURRENCIES,
	type Currency,
	WITHDRAWAL_DESTINATIONS,
} from "@/lib/constants";
import {
	type WithdrawFundsFormInput,
	type WithdrawFundsValidatedData,
	withdrawFundsSchema,
} from "@/lib/schemas/payments-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

interface WithdrawFundsModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	walletBalance: number;
	defaultCurrency?: Currency;
}

async function submitWithdrawalRequest(
	data: WithdrawFundsValidatedData,
): Promise<{ success: boolean; message: string; transactionId?: string }> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (data.password === "error") {
				reject(new Error("Incorrect password. Please try again."));
			} else if (data.amount > 20000 && data.currency === "USD") {
				reject(new Error("Withdrawal limit of $20,000 exceeded for USD."));
			} else if (Math.random() > 0.15) {
				resolve({
					success: true,
					message: "Withdrawal request submitted successfully!",
					transactionId: `WD-${Date.now()}`,
				});
			} else {
				reject(new Error("Withdrawal failed. Please try again later."));
			}
		}, 2000);
	});
}

export default function WithdrawFundsModal({
	isOpen,
	onOpenChange,
	walletBalance,
	defaultCurrency = "USD",
}: WithdrawFundsModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<WithdrawFundsFormInput>({
		resolver: zodResolver(withdrawFundsSchema, undefined, {
			raw: true,
		}),
		defaultValues: {
			currency: defaultCurrency,
			amount: "",
			destinationId: "",
			password: "",
		},
		mode: "onChange",
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				currency: defaultCurrency,
				amount: "",
				destinationId: "",
				password: "",
			});
		}
	}, [isOpen, defaultCurrency, form]);

	const onSubmit = async (data: WithdrawFundsValidatedData) => {
		setIsSubmitting(true);

		if (data.amount > walletBalance) {
			form.setError("amount", {
				type: "manual",
				message: "Withdrawal amount cannot exceed wallet balance.",
			});
			setIsSubmitting(false);
			return;
		}

		toast.promise(submitWithdrawalRequest(data), {
			loading: "Processing withdrawal...",
			success: (response) => {
				form.reset();
				onOpenChange(false);
				router.refresh();
				return `${response.message} (ID: ${response.transactionId})`;
			},
			error: (err) => {
				return (err as Error).message || "An unexpected error occurred.";
			},
			finally: () => {
				setIsSubmitting(false);
			},
		});
	};

	const watchedCurrency = form.watch("currency") ?? defaultCurrency;

	const formattedWalletBalance = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: watchedCurrency,
	}).format(walletBalance);

	const HeaderContent = () => (
		<>
			<DialogTitle className="text-2xl ">Withdraw Funds</DialogTitle>
			<p className="text-sm text-muted-foreground pt-1">
				Wallet Balance:{" "}
				<span className="font-semibold text-[#624D0E]">
					{formattedWalletBalance}
				</span>
			</p>
		</>
	);

	const formContent = (
		<>
			<FormField
				control={form.control}
				name="currency"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Currency</FormLabel>
						<Select
							onValueChange={(value) => {
								field.onChange(value);
								form.trigger("amount");
							}}
							defaultValue={field.value}
							disabled={isSubmitting}
						>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{CURRENCIES.map((currency) => (
									<SelectItem key={currency} value={currency}>
										{currency}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
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
								placeholder="e.g., 2000"
								{...field}
								onChange={(e) => field.onChange(e.target.value)}
								disabled={isSubmitting}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="destinationId"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Withdrawal Destination</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							disabled={isSubmitting}
						>
							<FormControl className="w-full">
								<SelectTrigger>
									<SelectValue placeholder="Select destination" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{WITHDRAWAL_DESTINATIONS.map((dest) => (
									<SelectItem key={dest.id} value={dest.id}>
										{dest.name} ({dest.type})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="••••••••"
								{...field}
								disabled={isSubmitting}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{!isDesktop && <div className="pt-4" />}
		</>
	);

	const formContentWrapper = (
		<Form {...form}>
			<form
				// biome-ignore lint/suspicious/noExplicitAny: onSubmit is passed the transformed zod input which is of type  WithdrawFundsValidatedData but the actual function is typed to receive arguments of type WithdrawFundsFormInput
				onSubmit={form.handleSubmit(onSubmit as any)}
				className="space-y-4 px-1 py-2"
				id="withdraw-funds-form"
			>
				{formContent}
			</form>
		</Form>
	);

	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader className="text-left !gap-0">
						<HeaderContent />
					</DialogHeader>
					<div className="pt-2 pb-4 px-1">{formContentWrapper}</div>
					<DialogFooter className="pt-2">
						<Button
							type="submit"
							form="withdraw-funds-form"
							disabled={isSubmitting}
							className="p-6 bg-primary w-full hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Withdraw Funds
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="text-left pb-0 gap-0">
					<HeaderContent />
				</DrawerHeader>
				<div className="p-4 pt-2 pb-0">
					<div className="p-4 pt-2 pb-0">{formContentWrapper}</div>
				</div>
				<DrawerFooter className="pt-2">
					<Button
						type="submit"
						form="withdraw-funds-form"
						disabled={isSubmitting}
						className="bg-primary p-6 hover:bg-slate-700 dark:bg-primary dark:hover:bg-primary/90 text-white"
					>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Withdraw Funds
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
