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
import { AppRoutePaths } from "@/config/routes-config";
import { registerFormSchema } from "@/lib/schemas/auth-schema";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth/auth-types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import SectionHeader from "../../typography/section-header";
import { Input } from "../../ui/input";
import { LoadingButton } from "../../ui/loading-button";

interface RegistrationFormProps {
	selectedRole: UserRole;
}

const RegistrationForm = ({ selectedRole }: RegistrationFormProps) => {
	const [showPassword, setShowPassword] = useState(false);
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
				console.log("Registration result", { result });

				if (!result.success) {
					throw new Error(result.message || "Registration failed");
				}

				form.reset();
				router.push(AppRoutePaths.SignIn);
			})(),
			{
				loading: "Registering...",
				success: "Registration successful",
				error: (err) => err.message || "Registration failed",
			},
		);
	};
	return (
		<div className="flex flex-col items-center">
			<SectionHeader
				title="Create your account"
				caption="Let&apos;s get you started"
				className="flex flex-col items-center mb-7"
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onsubmit)}
					className="space-y-6 w-full max-w-md"
				>
					<FormField
						control={form.control}
						name="legalName"
						render={({ field }) => {
							const [parent] = useAutoAnimate();
							return (
								<FormItem ref={parent}>
									<FormLabel className="text-primary">Legal Name</FormLabel>
									<FormControl>
										<div className="relative">
											<UserRound className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												placeholder="John Doe"
												className={cn(
													"pl-10 h-[50px] text-primary placeholder:text-primary/50 placeholder:tracking-tight font-medium outline-0",
													form.formState.errors.legalName &&
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
						name="preferredName"
						render={({ field }) => {
							const [parent] = useAutoAnimate();
							return (
								<FormItem ref={parent}>
									<FormLabel className="text-primary">Preferred Name</FormLabel>
									<FormControl>
										<div className="relative">
											<UserRound className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												placeholder="Johnny"
												className={cn(
													"pl-10 h-[50px] text-primary placeholder:text-primary/50 placeholder:tracking-tight font-medium outline-0",
													form.formState.errors.preferredName &&
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
						name="email"
						render={({ field }) => {
							const [parent] = useAutoAnimate();
							return (
								<FormItem ref={parent}>
									<FormLabel className="text-primary">Email Address</FormLabel>
									<FormControl>
										<div className="relative">
											<Mail className="absolute left-4 top-4 h-4 w-4 text-primary" />
											<Input
												type="email"
												placeholder="johnny@milestone.com"
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
							const [parent] = useAutoAnimate();
							return (
								<FormItem ref={parent}>
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
								</FormItem>
							);
						}}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => {
							const [parent] = useAutoAnimate();
							return (
								<FormItem ref={parent}>
									<FormLabel className="text-primary">
										Confirm Password
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
						loadingText="Registering..."
						spinnerClassName="size-4 mr-3"
					>
						Register
					</LoadingButton>
				</form>
			</Form>

			<div className="mt-6 text-sm text-primary">
				Already have an account?{" "}
				<Link
					href={AppRoutePaths.SignIn}
					className="text-secondary hover:underline"
				>
					Sign in here
				</Link>
			</div>
		</div>
	);
};

export default RegistrationForm;
