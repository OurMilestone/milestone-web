"use client";

import { registerAction } from "@/actions/auth-actions/auth.actions";
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
import { registerFormSchema } from "@/lib/schemas/auth-schema";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface RegistrationFormProps {
	selectedRole: UserRole;
}

const fieldClass =
	"h-11 rounded-lg border-[#d0d5dd] bg-white px-3.5 text-[#101828] shadow-none placeholder:text-[#98a2b3] focus-visible:border-[#98a2b3] focus-visible:ring-[#98a2b3]/20";

const RegistrationForm = ({ selectedRole }: RegistrationFormProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [parentLegal] = useAutoAnimate();
	const [parentPreferred] = useAutoAnimate();
	const [parentEmail] = useAutoAnimate();
	const [parentPassword] = useAutoAnimate();
	const [parentConfirm] = useAutoAnimate();
	const router = useRouter();

	const form = useForm<z.infer<typeof registerFormSchema>>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			legalName: "",
			preferredName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			const firstErrorField = Object.keys(form.formState.errors)[0];
			form.setFocus(
				firstErrorField as keyof z.infer<typeof registerFormSchema>,
				{
					shouldSelect: true,
				},
			);
		}
	}, [form.formState.errors, form]);

	const onsubmit = (data: z.infer<typeof registerFormSchema>) => {
		const formData = { ...data, role: selectedRole };

		toast.promise(
			(async () => {
				const result = await registerAction(formData);

				if (!result.success) {
					throw new Error(result.message || "Registration failed");
				}

				form.reset();
				router.push(
					`${AppRoutePaths.VerifyEmail}?email=${encodeURIComponent(
						formData.email,
					)}`,
				);
			})(),
			{
				loading: "Registering...",
				success:
					"Registration successful. Please check your email for verification code.",
				error: (err) => err.message || "Registration failed",
			},
		);
	};

	return (
		<div className="w-full">
			<div className="mb-8">
				<p className="mb-2 text-sm font-medium text-[#667085]">
					Signing up as{" "}
					<span className="font-semibold text-[#101828]">{selectedRole}</span>
				</p>
				<h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#101828] sm:text-[1.9rem]">
					Create your account
				</h1>
				<p className="mt-2 text-[0.95rem] text-[#667085]">
					Enter your details below to get started.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="legalName"
						render={({ field }) => (
							<FormItem ref={parentLegal} className="space-y-1.5">
								<FormLabel className="text-sm font-medium text-[#344054]">
									Legal name
								</FormLabel>
								<FormControl>
									<Input
										placeholder="John Doe"
										className={cn(
											fieldClass,
											form.formState.errors.legalName &&
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
						name="preferredName"
						render={({ field }) => (
							<FormItem ref={parentPreferred} className="space-y-1.5">
								<FormLabel className="text-sm font-medium text-[#344054]">
									Preferred name
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Johnny"
										className={cn(
											fieldClass,
											form.formState.errors.preferredName &&
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
											fieldClass,
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
												fieldClass,
												"pr-11",
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

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem ref={parentConfirm} className="space-y-1.5">
								<FormLabel className="text-sm font-medium text-[#344054]">
									Confirm password
								</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											className={cn(
												fieldClass,
												"pr-11",
												form.formState.errors.confirmPassword &&
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

					<LoadingButton
						type="submit"
						className="mt-2 h-11 w-full rounded-lg bg-[#101828] text-sm font-semibold text-white hover:bg-black"
						isLoading={form.formState.isSubmitting}
						loadingText="Creating account..."
						spinnerClassName="size-4 mr-2"
					>
						Get started
					</LoadingButton>
				</form>
			</Form>

			<p className="mt-8 text-center text-sm text-[#667085]">
				Already have an account?{" "}
				<Link
					href={AppRoutePaths.SignIn}
					className="font-semibold text-[#101828] underline decoration-[#101828]/30 underline-offset-4 hover:decoration-[#101828]"
				>
					Log in
				</Link>
			</p>
		</div>
	);
};

export default RegistrationForm;
