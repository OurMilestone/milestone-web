"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useBanks } from "@/hooks/queries/use-banks";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAddBankAccount } from "@/hooks/mutations/use-wallet-mutations";
import { useBankResolution } from "@/hooks/payments/use-bank-resolution";
import {
	type AddBankInput,
	addBankSchema,
} from "@/lib/schemas/payments-schema";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "../ui/drawer";

interface AddBankAccountModalProps {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}

export default function AddBankAccountModal({
	open,
	onOpenChange,
}: AddBankAccountModalProps) {
	const { data: banks, isLoading: banksLoading } = useBanks();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const addBank = useAddBankAccount();
	const { resolveAccountName, accountResolution, isResolving } =
		useBankResolution();

	const form = useForm<AddBankInput>({
		resolver: zodResolver(addBankSchema),
		defaultValues: { account_number: "", bank_code: "" },
	});

	const bankCode = form.watch("bank_code");
	const acct = form.watch("account_number");
	if (bankCode && acct.length === 10) resolveAccountName(acct, bankCode);

	const submit = async (values: AddBankInput) => {
		if (!accountResolution) return;
		await addBank.mutateAsync({
			bank_code: values.bank_code,
			account_number: values.account_number,
		});
		if (addBank.isSuccess) onOpenChange(false);
	};

	const renderForm = () => (
		<Form {...form}>
			<form
				id="add-bank-form"
				onSubmit={form.handleSubmit(submit)}
				className="space-y-4"
			>
				<FormField
					control={form.control}
					name="bank_code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bank</FormLabel>
							<Select disabled={banksLoading} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select bank" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{banks?.map((b) => (
										<SelectItem key={b.code} value={b.code}>
											{b.name}
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
					name="account_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account number</FormLabel>
							<FormControl>
								<Input maxLength={10} placeholder="0000000000" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{accountResolution && (
					<div className="text-sm text-green-600">
						{accountResolution.account_name}
					</div>
				)}
				{isResolving && (
					<div className="text-sm flex items-center gap-2 text-muted-foreground">
						<Loader2 className="animate-spin h-3 w-3" />
						Resolving account name…
					</div>
				)}
			</form>
		</Form>
	);

	const renderFooter = () => (
		<Button
			type="submit"
			form="add-bank-form"
			disabled={
				addBank.isPending ||
				isResolving ||
				!accountResolution ||
				!form.formState.isValid
			}
			className="w-full"
		>
			{addBank.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			Save account
		</Button>
	);

	if (!isDesktop) {
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="sm:max-w-md">
					<DrawerTitle>Add bank account</DrawerTitle>
				</DrawerHeader>
				{renderForm()}

				<DrawerFooter>{renderFooter()}</DrawerFooter>
			</DrawerContent>
		</Drawer>;
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add bank account</DialogTitle>
				</DialogHeader>
				{renderForm()}
				<DialogFooter>{renderFooter()}</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
