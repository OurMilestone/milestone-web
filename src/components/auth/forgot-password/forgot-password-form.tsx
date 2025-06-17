"use client";

import { forgotPasswordAction } from "@/actions/auth-actions/auth.actions";
import SectionHeader from "@/components/typography/section-header";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { AppRoutePaths } from "@/config/routes-config";
import { forgotPasswordFormSchema } from "@/lib/schemas/auth-schema";
import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function ForgotPasswordForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [parentEmail] = useAutoAnimate();
	const [parentPassword] = useAutoAnimate();
	const [parentConfirmPassword] = useAutoAnimate();

	const router = useRouter();

	const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
		resolver: zodResolver(forgotPasswordFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			const firstErrorField = Object.keys(form.formState.errors)[0];
			form.setFocus(
				firstErrorField as keyof z.infer<typeof forgotPasswordFormSchema>,
				{
					shouldSelect: true,
				},
			);
		}
	}, [form.formState.errors, form]);

	const onSubmit = (data: z.infer<typeof forgotPasswordFormSchema>) => {
		toast.promise(
			(async () => {
				const result = await forgotPasswordAction(data);

				if (!result.success) {
					throw new Error(
						result.message ??
							"Failed to reset your password. Please try again.",
					);
				}

				form.reset();
				router.push(AppRoutePaths.SignIn);

				return result.message;
			})(),
			{
				loading: "Resetting your password...",
				success: (message) => message ?? "Password reset successful!",
				error: (err) => err.message ?? "Failed to reset your password",
			},
		);
	};

	return (
		<div className="flex flex-col items-center">
			<SectionHeader
				title="Reset your password"
				caption="Enter your email and create a new password"
				className="flex flex-col items-center mb-7"
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 w-full max-w-md"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => {
							return (
								<FormItem ref={parentEmail}>
									<FormLabel className="text-primary">Email Address</FormLabel>
									<FormControl>
										<div className="relative">
											<Mail className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												type="email"
												placeholder="your.email@example.com"
												className={cn(
													"pl-10 h-[50px] text-primary placeholder:text-primary/50 placeholder:tracking-tight font-medium outline-0",
													form.formState.errors.email &&
														"border-red-500 focus:border-red-500",
												)}
												{...field}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => {
							return (
								<FormItem ref={parentPassword}>
									<FormLabel className="text-primary">New Password</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="* * * * * * * *"
												className={cn(
													"pl-10 h-[50px] text-primary placeholder:text-primary/50 placeholder:tracking-tight font-medium outline-0",
													form.formState.errors.password &&
														"border-red-500 focus:border-red-500",
												)}
												{...field}
											/>
											<button
												type="button"
												className="absolute right-3 top-3 text-primary"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4 cursor-pointer" />
												) : (
													<Eye className="h-4 w-4 cursor-pointer" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => {
							return (
								<FormItem ref={parentConfirmPassword}>
									<FormLabel className="text-primary">
										Confirm New Password
									</FormLabel>
									<FormControl>
										<div className="relative">
											<Lock className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="* * * * * * * *"
												className={cn(
													"pl-10 h-[50px] text-primary placeholder:text-primary/50 placeholder:tracking-tight font-medium outline-0",
													form.formState.errors.confirmPassword &&
														"border-red-500 focus:border-red-500",
												)}
												{...field}
											/>
											<button
												type="button"
												className="absolute right-3 top-3 text-primary"
												onClick={() => setShowPassword(!showPassword)}
											>
												{showPassword ? (
													<EyeOff className="h-4 w-4 cursor-pointer" />
												) : (
													<Eye className="h-4 w-4 cursor-pointer" />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<LoadingButton
						type="submit"
						className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
						isLoading={form.formState.isSubmitting}
						loadingText="Resetting password..."
						spinnerClassName="size-4 mr-3"
					>
						Reset Password
					</LoadingButton>
				</form>
			</Form>

			<div className="mt-6 text-sm text-primary">
				Remember your password?{" "}
				<Link
					href={AppRoutePaths.SignIn}
					className="text-secondary hover:underline"
				>
					Sign in here
				</Link>
			</div>
		</div>
	);
}
