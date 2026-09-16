"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
import { Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

function GoogleIcon() {
	return (
		<svg className="size-5" viewBox="0 0 24 24" aria-hidden>
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	);
}

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(true);
	const [parentEmail] = useAutoAnimate();
	const [parentPassword] = useAutoAnimate();
	const router = useRouter();
	const searchParams = useSearchParams();

	const callbackUrlFromQuery = searchParams.get("callbackUrl");
	const emailFromQuery = searchParams.get("email");
	const justVerified = searchParams.get("verified") === "true";

	const resolvePostLoginPath = (role?: string | null) => {
		if (callbackUrlFromQuery) {
			const isFreelancerPath = callbackUrlFromQuery.startsWith(
				AppRoutePaths.FreelancerDashboard.Home.split("/overview")[0],
			);
			const isContractorPath = callbackUrlFromQuery.startsWith(
				AppRoutePaths.ContractorDashboard.Home.split("/overview")[0],
			);

			if (
				(role === "Freelancer" && isFreelancerPath) ||
				(role === "Contractor" && isContractorPath)
			) {
				return callbackUrlFromQuery;
			}
		}

		if (role === "Freelancer") return AppRoutePaths.FreelancerDashboard.Home;
		if (role === "Contractor") return AppRoutePaths.ContractorDashboard.Home;
		return AppRoutePaths.CheckRole;
	};

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
			if (remember) {
				localStorage.setItem("milestone-remember-email", data.email);
			} else {
				localStorage.removeItem("milestone-remember-email");
			}

			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result.error) {
				const message =
					nextAuthErrorMessagesMap[result.error] || "Login failed";

				toast.error(message);
			} else if (result?.ok) {
				const session = await getSession();
				const destination = resolvePostLoginPath(session?.user?.role);

				form.reset();
				toast.success("Login successful. Redirecting...");
				router.replace(destination);
			} else {
				toast.error("An unexpected error occurred during login.");
			}
		} catch (error) {
			console.error("Login submission error:", error);
			toast.error("Login failed due to an unexpected error.");
		}
	};

	useEffect(() => {
		const saved = localStorage.getItem("milestone-remember-email");
		if (saved && !emailFromQuery) {
			form.setValue("email", saved);
			setRemember(true);
		}
	}, [emailFromQuery, form]);

	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#101828] sm:text-[1.9rem]">
					Welcome back
				</h1>
				<p className="mt-2 text-[0.95rem] text-[#667085]">
					Welcome back! Please enter your details.
				</p>
			</div>

			{justVerified && (
				<p className="mb-5 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
					Your email has been successfully verified! Please log in.
				</p>
			)}

			<button
				type="button"
				onClick={() =>
					toast.message("Google sign-in isn’t available yet.", {
						description: "Use your email and password to continue.",
					})
				}
				className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#d0d5dd] bg-white text-sm font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
			>
				<GoogleIcon />
				Log in with Google
			</button>

			<div className="relative my-6">
				<div aria-hidden className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-[#eaecf0]" />
				</div>
				<div className="relative flex justify-center">
					<span className="bg-white px-3 text-sm text-[#98a2b3]">or</span>
				</div>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem ref={parentEmail} className="space-y-1.5">
								<FormLabel className="text-sm font-medium text-[#344054]">
									Email
								</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email"
										className={cn(
											"h-11 rounded-lg border-[#d0d5dd] bg-white px-3.5 text-[#101828] shadow-none placeholder:text-[#98a2b3] focus-visible:border-[#98a2b3] focus-visible:ring-[#98a2b3]/20",
											form.formState.errors.email &&
												"border-red-500 focus-visible:border-red-500",
										)}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem ref={parentPassword} className="space-y-1.5">
								<FormLabel className="text-sm font-medium text-[#344054]">
									Password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											className={cn(
												"h-11 rounded-lg border-[#d0d5dd] bg-white px-3.5 pr-11 text-[#101828] shadow-none placeholder:text-[#98a2b3] focus-visible:border-[#98a2b3] focus-visible:ring-[#98a2b3]/20",
												form.formState.errors.password &&
													"border-red-500 focus-visible:border-red-500",
											)}
											{...field}
										/>
										<button
											type="button"
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
											onClick={() => setShowPassword(!showPassword)}
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}
										>
											{showPassword ? (
												<EyeOff className="size-4" />
											) : (
												<Eye className="size-4" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2.5">
							<Checkbox
								id="remember-me"
								checked={remember}
								onCheckedChange={(value) => setRemember(value === true)}
								className="size-4 rounded border-[#d0d5dd] data-[state=checked]:border-[#101828] data-[state=checked]:bg-[#101828]"
							/>
							<label
								htmlFor="remember-me"
								className="cursor-pointer text-sm text-[#344054]"
							>
								Remember for 30 days
							</label>
						</div>

						<Link
							href={AppRoutePaths.ForgotPassword}
							className="text-sm font-semibold text-[#101828] hover:underline"
						>
							Forgot password
						</Link>
					</div>

					<LoadingButton
						type="submit"
						className="h-11 w-full rounded-lg bg-[#101828] text-sm font-semibold text-white hover:bg-black"
						isLoading={form.formState.isSubmitting}
						loadingText="Logging in..."
						spinnerClassName="size-4 mr-2"
					>
						Log in
					</LoadingButton>
				</form>
			</Form>

			<p className="mt-8 text-center text-sm text-[#667085]">
				Don&apos;t have an account?{" "}
				<Link
					href={AppRoutePaths.SignUp}
					className="font-semibold text-[#101828] underline decoration-[#101828]/30 underline-offset-4 hover:decoration-[#101828]"
				>
					Sign up for free
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
