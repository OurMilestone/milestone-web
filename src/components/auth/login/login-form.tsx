"use client";

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
import { loginFormSchema } from "@/lib/schemas/auth-schema";
import { cn, nextAuthErrorMessagesMap } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [parentEmail] = useAutoAnimate();
	const [parentPassword] = useAutoAnimate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const callbackUrlFromQuery = searchParams.get("callbackUrl");
	const emailFromQuery = searchParams.get("email");
	const justVerified = searchParams.get("verified") === "true";

	const postLoginUrl = callbackUrlFromQuery
		? `/post-login-redirect?callbackUrl=${encodeURIComponent(callbackUrlFromQuery)}`
		: "/post-login-redirect";

	const form = useForm<z.infer<typeof loginFormSchema>>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: emailFromQuery || "",
			password: "",
		},
	});

	useEffect(() => {
		if (justVerified && emailFromQuery) {
			toast.success("Email verified! Please log in to continue.");

			if (form.getValues("email")) {
				form.setFocus("password");
			}
		}
	}, [justVerified, emailFromQuery, form]);

	useEffect(() => {
		if (Object.keys(form.formState.errors)?.length > 0) {
			const firstErrorField = Object.keys(form.formState.errors)[0];
			form.setFocus(firstErrorField as keyof z.infer<typeof loginFormSchema>, {
				shouldSelect: true,
			});
		}
	}, [form.formState.errors, form]);

	const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				callbackUrl: postLoginUrl,
				redirect: false,
			});

			if (result.error) {
				const message =
					nextAuthErrorMessagesMap[result.error] || "Login failed";

				toast.error(message);
			} else if (result?.ok) {
				form.reset();
				toast.success("Login successful. Redirecting...");
				router.push(postLoginUrl);
			} else {
				toast.error("An unexpected error occurred during login.");
			}
		} catch (error) {
			console.error("Login submission error:", error);
			toast.error("Login failed due to an unexpected error.");
		}
	};

	return (
		<div className="flex flex-col items-center">
			<SectionHeader
				title="Welcome back!"
				caption="Enter your account information to dive back in."
				className="flex flex-col items-center mb-7"
			/>

			{justVerified && (
				<p className="mb-4 text-green-600 bg-green-100 p-3 rounded-md">
					Your email has been successfully verified! Please log in.
				</p>
			)}

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
								<FormItem ref={parentPassword} className="space-y-1">
									<FormLabel className="text-primary">Password</FormLabel>
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
									<div className="flex justify-end">
										<Link
											href={AppRoutePaths.ForgotPassword}
											className="text-sm text-secondary hover:underline"
										>
											Forgot password?
										</Link>
									</div>
								</FormItem>
							);
						}}
					/>

					<LoadingButton
						type="submit"
						className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
						isLoading={form.formState.isSubmitting}
						loadingText="Logging in..."
						spinnerClassName="size-4 mr-3"
					>
						Continue to dashboard
					</LoadingButton>
				</form>
			</Form>

			<div className="mt-6 text-sm text-primary">
				Don&apos;t have an account?{" "}
				<Link
					href={AppRoutePaths.SignUp}
					className="text-secondary hover:underline"
				>
					Sign up here
				</Link>
			</div>
		</div>
	);
};

export default LoginForm;
