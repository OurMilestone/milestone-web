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
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isRunning) {
			setSeconds(initialSeconds);

			intervalRef.current = setInterval(() => {
				setSeconds((prevSeconds) => {
					if (prevSeconds <= 1) {
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
						}
						//Defer this state update to the next event loop tick to prevent React from trying to immediately re-render the verify email form component but instead wait until the next event loop tick to ensure Reacts render/commit phase of this component is complete.
						setTimeout(() => onComplete(), 0);
						return 0;
					}
					return prevSeconds - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, initialSeconds, onComplete]);

	const handleResendClick = () => {
		onReset();
	};

	const formatTime = (time: number) => {
		return `${time}s`;
	};

	return (
		<div className="text-sm text-primary">
			{seconds > 0 ? (
				<span>Resend code in {formatTime(seconds)}</span>
			) : (
				<button
					onClick={handleResendClick}
					className="text-secondary hover:underline cursor-pointer"
					type="button"
				>
					Resend code
				</button>
			)}
		</div>
	);
}
