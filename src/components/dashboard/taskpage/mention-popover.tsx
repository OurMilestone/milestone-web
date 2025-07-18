"use client";

import type React from "react";

import type { MentionableUser } from "@/hooks/comments/useMentions";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface MentionPopoverProps {
	show: boolean;
	users: MentionableUser[];
	selectedIndex: number;
	onUserSelect: (user: MentionableUser) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
	onClose: () => void;
}

export const MentionPopover = ({
	show,
	users,
	selectedIndex,
	onUserSelect,
	onClose,
	inputRef,
}: MentionPopoverProps) => {
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
	const [direction, setDirection] = useState<"bottom" | "top">("bottom");
	const POPOVER_HEIGHT = 192;
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!show || !inputRef.current) return;

		const updatePosition = () => {
			if (!inputRef.current) return;

			const rect = inputRef.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;

			let top = rect.bottom + window.scrollY + 4;
			let newDirection: "bottom" | "top" = "bottom";

			if (spaceBelow < POPOVER_HEIGHT && spaceAbove > POPOVER_HEIGHT) {
				top = rect.top + window.scrollY - POPOVER_HEIGHT - 4;
				newDirection = "top";
			}

			setPosition({
				top,
				left: rect.left + window.scrollX,
				width: rect.width,
			});
			setDirection(newDirection);
		};

		updatePosition();

		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);

		return () => {
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
		};
	}, [show, inputRef]);

	useEffect(() => {
		if (!show) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (inputRef.current?.contains(target)) {
				return;
			}

			if (popoverRef.current?.contains(target)) {
				return;
			}

			onClose();
		};

		document.addEventListener("mousedown", handleClickOutside, true);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside, true);
	}, [show, onClose, inputRef]);

	if (!show || users.length === 0) return null;

	return createPortal(
		<div
			className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
			style={{
				top: position.top,
				left: position.left,
				width: position.width,
			}}
			data-direction={direction}
			ref={popoverRef}
		>
			{users.map((user, index) => (
				<button
					key={user.id}
					type="button"
					onClick={() => onUserSelect(user)}
					className={`flex items-center gap-3 px-4 py-3 transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
						index === selectedIndex
							? "bg-blue-50 border-l-2 border-blue-500"
							: "hover:bg-gray-50 cursor-pointer"
					}`}
				>
					<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
						{user.initials}
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium line-clamp-1 text-gray-900">
							{user.name}
						</span>
					</div>
				</button>
			))}
		</div>,
		document.body,
	);
};
