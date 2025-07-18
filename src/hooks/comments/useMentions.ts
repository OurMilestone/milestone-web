import { useCallback, useRef, useState } from "react";

export interface MentionableUser {
	id: string;
	name: string;
	email: string;
	initials: string;
}

interface UseMentionsReturn {
	showMentionPopover: boolean;
	mentionSearch: string;
	filteredUsers: MentionableUser[];
	selectedIndex: number;
	mentions: string[];
	text: string;
	inputRef: React.RefObject<HTMLInputElement | null>;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleUserSelect: (user: MentionableUser) => void;
	handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	setText: React.Dispatch<React.SetStateAction<string>>;
	setMentions: React.Dispatch<React.SetStateAction<string[]>>;
	closeMentionPopover: () => void;
}

const useMentions = (
	mentionableUsers: MentionableUser[],
): UseMentionsReturn => {
	const [showMentionPopover, setShowMentionPopover] = useState(false);
	const [mentionSearch, setMentionSearch] = useState("");
	const [mentionStartIndex, setMentionStartIndex] = useState(-1);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [mentions, setMentions] = useState<string[]>([]);
	const [text, setText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredUsers = mentionableUsers.filter(
		(user) =>
			user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
			user.email.toLowerCase().includes(mentionSearch.toLowerCase()),
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const cursorPos = e.target.selectionStart || 0;

		setText(value);

		const beforeCursor = value.slice(0, cursorPos);
		const atIndex = beforeCursor.lastIndexOf("@");

		if (atIndex !== -1) {
			const charBeforeAt = atIndex === 0 ? "" : beforeCursor[atIndex - 1];
			const validBoundary =
				atIndex === 0 || /[\s.,;:!?()\[\]{}]/.test(charBeforeAt);
			const afterAt = beforeCursor.slice(atIndex + 1);
			const hasSpace = afterAt.includes(" ");

			if (validBoundary && !hasSpace) {
				setMentionStartIndex(atIndex);
				setMentionSearch(afterAt);
				setShowMentionPopover(true);
				setSelectedIndex(0);
			} else {
				setShowMentionPopover(false);
				setMentionSearch("");
				setMentionStartIndex(-1);
			}
		} else {
			setShowMentionPopover(false);
			setMentionSearch("");
			setMentionStartIndex(-1);
		}
	};

	const handleUserSelect = (user: MentionableUser) => {
		if (mentionStartIndex === -1) return;

		const cursorPos = inputRef.current?.selectionStart || 0;
		const beforeMention = text.slice(0, mentionStartIndex);
		const afterCursor = text.slice(cursorPos);
		const mentionText = `@${user.name}`;

		const newText = `${beforeMention}${mentionText} ${afterCursor}`;
		const newCursorPos = beforeMention.length + mentionText.length + 1;

		setText(newText);
		setMentions((prev) => [...new Set([...prev, user.name])]);
		setShowMentionPopover(false);
		setMentionSearch("");
		setMentionStartIndex(-1);

		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
		}, 0);
	};

	const closeMentionPopover = useCallback(() => {
		setShowMentionPopover(false);
		setMentionSearch("");
		setSelectedIndex(0);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (showMentionPopover && filteredUsers.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				setSelectedIndex(
					(prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length,
				);
			} else if (e.key === "Enter") {
				e.preventDefault();
				handleUserSelect(filteredUsers[selectedIndex]);
				return;
			} else if (e.key === "Escape") {
				setShowMentionPopover(false);
				setMentionSearch("");
				setMentionStartIndex(-1);
				return;
			}
		}
	};

	return {
		showMentionPopover,
		mentionSearch,
		filteredUsers,
		selectedIndex,
		mentions,
		text,
		inputRef,
		handleInputChange,
		handleUserSelect,
		handleKeyDown,
		setText,
		setMentions,
		closeMentionPopover,
	};
};

export default useMentions;
