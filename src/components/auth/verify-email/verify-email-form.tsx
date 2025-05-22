"use client";

import {
	resendOtpAction,
	verifyOtpAction,
} from "@/actions/auth-actions/auth.actions";
import SectionHeader from "@/components/typography/section-header";
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
	const email = searchParams.get("email");
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

	const initialOtpResendDone = useRef(false);

	const emailToVerify = emailFromQuery || session?.user?.email;

	const doResendOtp = useCallback(
		async (email: string, showLoadingToast = true) => {
			if (isResending) return;

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
				setTimerRunning(true);

				if (showLoadingToast) {
					toast.success(
						result.message || "Verification code resent successfully.",
						{ id: "resend-otp-toast" },
					);
				} else {
					toast.success(
						result.message || "Verification code resent successfully.",
					);
				}
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				if (showLoadingToast) {
					toast.error(error.message || "Failed to resend OTP.", {
						id: "resend-otp-toast",
					});
				} else {
					toast.error(error.message || "Failed to resend OTP.");
				}
			} finally {
				setIsResending(false);
			}
		},
		[isResending],
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
			console.log(
				"VerifyEmailForm: Logged-in, unverified user from banner. Resending OTP.",
			);
			doResendOtp(emailToVerify, false);
			initialOtpResendDone.current = true;
			setTimerRunning(true);
		} else if (!sessionStatus || sessionStatus === "unauthenticated") {
			setTimerRunning(true);
		}
	}, [
		emailToVerify,
		sessionStatus,
		session,
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

	const handleResendCode = useCallback(async () => {
		if (isResending) return;

		if (!emailToVerify) {
			toast.error("Email address is missing for resending OTP.");
			return;
		}

		setIsResending(true);

		try {
			const result = await resendOtpAction({ email: emailToVerify });
			if (!result.success) {
				throw new Error(result.message || "Failed to resend OTP.");
			}
			setOtp("");
			setTimerRunning(true);
			toast.success(result.message || "Verification code resent successfully.");

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (error: any) {
			setTimerRunning(false);
			toast.error(error.message || "Failed to resend OTP.");
		} finally {
			setIsResending(false);
		}
	}, [emailToVerify, isResending]);

	const handleTimerComplete = useCallback(() => {
		setTimerRunning(false);
	}, []);

	const handleTimerInitiatedResend = useCallback(() => {
		if (emailToVerify) {
			doResendOtp(emailToVerify);
		} else {
			toast.error("Cannot resend OTP: Email address is missing.");
		}
	}, [emailToVerify, doResendOtp]);

	if (sessionStatus === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader className="h-8 w-8 text-primary animate-spin" />
			</div>
		);
	}

	if (!emailToVerify) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
				<SectionHeader
					title="Verification Error"
					caption="Could not determine the email address for verification."
					className="flex flex-col items-center mb-8"
				/>
				<Link
					href={AppRoutePaths.SignIn}
					className="text-secondary hover:underline mt-4"
				>
					Go to Login
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center">
			<SectionHeader
				title="Verify your account"
				caption={`We've sent a 6-digit code to ${emailToVerify}. If you don't see it, check your spam folder or resend.`}
				className="flex flex-col items-center mb-8 text-center"
			/>

			<div className="w-full max-w-md space-y-6">
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
						initialSeconds={60}
						onComplete={handleTimerComplete}
						isRunning={timerRunning}
						onReset={handleTimerInitiatedResend}
					/>
				</div>

				<LoadingButton
					className="w-full bg-primary hover:bg-primary/80 text-white"
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
