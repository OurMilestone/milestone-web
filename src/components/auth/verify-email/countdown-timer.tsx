"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownTimerProps {
	initialSeconds: number;
	onComplete: () => void;
	isRunning: boolean;
	onReset: () => void;
}

export default function CountdownTimer({
	initialSeconds,
	onComplete,
	isRunning,
	onReset,
}: CountdownTimerProps) {
	const [seconds, setSeconds] = useState(initialSeconds);
	const onCompleteRef = useRef(onComplete);

	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	useEffect(() => {
		if (!isRunning) {
			return;
		}

		setSeconds(initialSeconds);

		const intervalId = setInterval(() => {
			setSeconds((prevSeconds) => {
				if (prevSeconds <= 1) {
					clearInterval(intervalId);
					queueMicrotask(() => onCompleteRef.current());
					return 0;
				}
				return prevSeconds - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
		// Only restart when the timer is (re)started — not when callbacks change
	}, [isRunning, initialSeconds]);

	return (
		<div className="text-sm text-[#667085]">
			{isRunning && seconds > 0 ? (
				<span>Resend code in {seconds}s</span>
			) : (
				<button
					onClick={onReset}
					className="cursor-pointer font-semibold text-[#101828] hover:underline"
					type="button"
				>
					Resend code
				</button>
			)}
		</div>
	);
}
