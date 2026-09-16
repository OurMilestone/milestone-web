"use client";

import {
	resendOtpAction,
	verifyOtpAction,
} from "@/actions/auth-actions/auth.actions";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoadingButton } from "@/components/ui/loading-button";
import { AppRoutePaths } from "@/config/routes-config";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CountdownTimer from "./countdown-timer";

export default function VerifyEmailForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const emailFromQuery = searchParams.get("email");
	const callbackUrlFromQuery = searchParams.get("callbackUrl");

	const {
		data: session,
		status: sessionStatus,
		update: nextAuthSessionUpdate,
	} = useSession();

	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [timerRunning, setTimerRunning] = useState(true);
	const [timerKey, setTimerKey] = useState(0);

	const initialOtpResendDone = useRef(false);
	const isResendingRef = useRef(false);

	const emailToVerify = emailFromQuery || session?.user?.email;

	const startTimer = useCallback(() => {
		setTimerRunning(true);
		setTimerKey((key) => key + 1);
	}, []);

	const doResendOtp = useCallback(
		async (email: string, showLoadingToast = true) => {
			if (isResendingRef.current) return;

			isResendingRef.current = true;
			setIsResending(true);
			if (showLoadingToast) {
				toast.loading("Resending OTP...", { id: "resend-otp-toast" });
			}

			try {
				const result = await resendOtpAction({ email });

				if (!result.success) {
					throw new Error(result.message || "Failed to resend OTP.");
				}

				setOtp("");
				startTimer();

				toast.success(
					result.message || "Verification code resent successfully.",
					showLoadingToast ? { id: "resend-otp-toast" } : undefined,
				);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				setTimerRunning(false);
				toast.error(
					error.message || "Failed to resend OTP.",
					showLoadingToast ? { id: "resend-otp-toast" } : undefined,
				);
			} finally {
				isResendingRef.current = false;
				setIsResending(false);
			}
		},
		[startTimer],
	);

	useEffect(() => {
		if (sessionStatus === "loading" || !emailToVerify) return;

		if (sessionStatus === "authenticated" && session?.user?.is_verified) {
			toast.info("Your email is already verified.");
			router.replace(callbackUrlFromQuery || AppRoutePaths.Index);
			return;
		}

		if (
			sessionStatus === "authenticated" &&
			session?.user?.email === emailToVerify &&
			!session?.user?.is_verified &&
			callbackUrlFromQuery &&
			!initialOtpResendDone.current
		) {
			initialOtpResendDone.current = true;
			void doResendOtp(emailToVerify, false);
		}
	}, [
		emailToVerify,
		sessionStatus,
		session?.user?.is_verified,
		session?.user?.email,
		router,
		callbackUrlFromQuery,
		doResendOtp,
	]);

	useEffect(() => {
		if (sessionStatus !== "loading" && !emailToVerify) {
			toast.error("Email not found for verification.");
			router.replace(AppRoutePaths.SignIn);
		}
	}, [emailToVerify, sessionStatus, router]);

	const handleVerify = async () => {
		if (!emailToVerify) {
			toast.error("Email address is missing.");
			return;
		}

		if (otp.length !== 6) {
			toast.error("Please enter a valid 6-digit code");
			return;
		}

		setIsVerifying(true);

		try {
			const result = await verifyOtpAction({ email: emailToVerify, otp });

			if (!result.success) {
				throw new Error(result.message || "OTP Verification failed");
			}

			if (
				sessionStatus === "authenticated" &&
				session?.user?.email === emailToVerify
			) {
				await nextAuthSessionUpdate({ is_verified_now: true });
				toast.success("Email verified successfully!");

				setTimeout(() => {
					router.push(callbackUrlFromQuery || AppRoutePaths.Index);
				}, 1000);
			} else {
				toast.success("Email verified successfully! Please login to continue.");

				router.push(
					`${AppRoutePaths.SignIn}?email=${encodeURIComponent(emailToVerify)}&verified=true`,
				);
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			toast.error(
				error.message || "An unexpected error occurred during verification.",
			);
		} finally {
			setIsVerifying(false);
		}
	};

	const handleTimerComplete = useCallback(() => {
		setTimerRunning(false);
	}, []);

	const handleResendCode = useCallback(() => {
		if (!emailToVerify) {
			toast.error("Cannot resend OTP: Email address is missing.");
			return;
		}
		void doResendOtp(emailToVerify);
	}, [emailToVerify, doResendOtp]);

	if (sessionStatus === "loading") {
		return (
			<div className="flex min-h-[40vh] items-center justify-center">
				<Loader className="size-8 animate-spin text-[#101828]" />
			</div>
		);
	}

	if (!emailToVerify) {
		return (
			<div className="flex flex-col items-center text-center">
				<h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#101828]">
					Verification error
				</h1>
				<p className="mt-2 text-sm text-[#667085]">
					Could not determine the email address for verification.
				</p>
				<Link
					href={AppRoutePaths.SignIn}
					className="mt-6 text-sm font-semibold text-[#101828] underline underline-offset-4"
				>
					Go to Login
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="mb-8">
				<h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#101828] sm:text-[1.9rem]">
					Verify your account
				</h1>
				<p className="mt-2 text-[0.95rem] text-[#667085]">
					We&apos;ve sent a 6-digit code to{" "}
					<span className="font-medium text-[#344054]">{emailToVerify}</span>.
					If you don&apos;t see it, check your spam folder or resend.
				</p>
			</div>

			<div className="space-y-6">
				<div className="flex flex-col items-center space-y-4">
					<InputOTP
						maxLength={6}
						value={otp}
						onChange={(value) => setOtp(value)}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>

					<CountdownTimer
						key={timerKey}
						initialSeconds={60}
						onComplete={handleTimerComplete}
						isRunning={timerRunning}
						onReset={handleResendCode}
					/>
				</div>

				<LoadingButton
					className="h-11 w-full rounded-lg bg-[#101828] text-sm font-semibold text-white hover:bg-black"
					onClick={handleVerify}
					isLoading={isVerifying}
					loadingText="Verifying..."
					disabled={otp.length !== 6 || isResending || isVerifying}
				>
					Verify Email
				</LoadingButton>
			</div>
		</div>
	);
}
