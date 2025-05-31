"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import {
	AtSign,
	Bold,
	Check as CheckIcon,
	ChevronDown,
	ChevronUp,
	Code,
	Code2,
	Image as ImageIcon,
	Info,
	Italic,
	Link2,
	List,
	ListOrdered,
	Minus,
	Quote,
	Smile,
	Strikethrough,
	Type,
	Underline,
	WrapText,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import LinkModal from "../modals/link-modal";

const FONT_FAMILIES = [
	{ name: "Inter", value: "Inter, sans-serif" },
	{ name: "Comic Sans", value: "Comic Sans MS, Comic Sans, cursive" },
	{ name: "Serif", value: "serif" },
	{ name: "Monospace", value: "monospace" },
	{ name: "Cursive", value: "cursive" },
];

interface MenuBarProps {
	editor: Editor | null;
}

const MenuButton = ({
	onClick,
	isActive,
	title,
	children,
	disabled,
	variant,
	className,
}: {
	onClick: () => void;
	isActive?: boolean;
	title: string;
	children: React.ReactNode;
	disabled?: boolean;
	variant?: "ghost";
	className?: string;
}) => (
	<Button
		variant={variant ?? "ghost"}
		size="icon"
		onClick={onClick}
		disabled={disabled || !onClick}
		className={cn(
			"h-8 w-8 p-1.5 bg-transparent text-[#2B3C66] hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:ring-primary/50",
			isActive && "bg-primary/20 text-primary ",
			className,
		)}
		title={title}
		type="button"
	>
		{children}
	</Button>
);

const ToolbarSeparator = () => (
	<Separator orientation="vertical" className="!h-6 mx-1 bg-[#CCD0DA]" />
);

export default function MenuBar({ editor }: MenuBarProps) {
	const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
	const [moreActionsOpen, setMoreActionsOpen] = useState(false);
	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
	const [currentLinkForModal, setCurrentLinkForModal] = useState("");
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

	const onEmojiClick = useCallback(
		(emojiData: EmojiClickData) => {
			if (!editor) return;

			if (emojiData.emoji) {
				editor.chain().focus().insertContent(emojiData.emoji).run();
			} else {
				console.error(
					"Emoji data does not contain an emoji string:",
					emojiData,
				);
			}
			setIsEmojiPickerOpen(false);
		},
		[editor],
	);

	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleImageFileSelected = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!editor || !event.target.files || event.target.files.length === 0) {
				return;
			}
			const file = event.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				editor
					.chain()
					.focus()
					.setImage({ src: reader.result as string })
					.run();
			};
			reader.readAsDataURL(file);

			if (imageInputRef.current) {
				imageInputRef.current.value = "";
			}
		},
		[editor],
	);

	const triggerImageUpload = () => {
		imageInputRef.current?.click();
	};

	const openLinkModal = useCallback(() => {
		if (!editor) return;

		setCurrentLinkForModal(editor.getAttributes("link").href || "");
		setIsLinkModalOpen(true);
	}, [editor]);

	const handleSetLinkFromModal = useCallback(
		(url: string) => {
			if (!editor) return;

			if (url === "") {
				editor.chain().focus().extendMarkRange("link").unsetLink().run();
			} else {
				editor
					.chain()
					.focus()
					.extendMarkRange("link")
					.setLink({ href: url })
					.run();
			}
		},
		[editor],
	);

	const handleUnsetLinkFromModal = useCallback(() => {
		if (!editor) return;
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
	}, [editor]);

	const handleMention = () => {
		// Todo: I will implement a mention functionality later
		alert("Mention button clicked. Implement mention functionality.");
	};

	if (!editor) {
		return null;
	}

	console.log("Emoji Picker - isEmojiPickerOpen:", isEmojiPickerOpen);
	return (
		<div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5 bg-[#F8FAFC] top-0 sticky z-10">
			{/* Font Picker Dropdown */}
			<DropdownMenu open={fontDropdownOpen} onOpenChange={setFontDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 px-2 text-primary hover:bg-primary/10 data-[state=open]:bg-primary/20"
						title="Text Styles"
					>
						<Type size={16} />
						{fontDropdownOpen ? (
							<ChevronUp size={14} className="ml-1" />
						) : (
							<ChevronDown size={14} className="ml-1" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Font Family</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								{FONT_FAMILIES.map((font) => (
									<DropdownMenuItem
										key={font.value}
										onClick={() =>
											editor.chain().focus().setFontFamily(font.value).run()
										}
										className={
											editor.isActive("textStyle", { fontFamily: font.value })
												? "bg-muted"
												: ""
										}
									>
										<span style={{ fontFamily: font.value }}>{font.name}</span>
										{editor.isActive("textStyle", {
											fontFamily: font.value,
										}) && <CheckIcon size={14} className="ml-auto" />}
									</DropdownMenuItem>
								))}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => editor.chain().focus().unsetFontFamily().run()}
								>
									Default Font
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => editor.chain().focus().setParagraph().run()}
						className={editor.isActive("paragraph") ? "bg-muted" : ""}
					>
						Paragraph
					</DropdownMenuItem>
					{[1, 2, 3].map((level) => (
						<DropdownMenuItem
							key={`h${level}`}
							onClick={() => {
								console.log("Toggling Heading ");
								editor
									.chain()
									.focus()
									.toggleHeading({ level: level as 1 | 2 | 3 })
									.run();
							}}
							className={
								editor.isActive("heading", { level: level as 1 | 2 | 3 })
									? "bg-muted"
									: ""
							}
						>
							Heading {level}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<ToolbarSeparator />

			{/* Bold, Italic, Strikethrough */}
			<MenuButton
				onClick={() => editor.chain().focus().toggleBold().run()}
				isActive={editor.isActive("bold")}
				title="Bold"
			>
				<Bold size={16} />
			</MenuButton>
			<MenuButton
				onClick={() => editor.chain().focus().toggleItalic().run()}
				isActive={editor.isActive("italic")}
				title="Italic"
			>
				<Italic size={16} />
			</MenuButton>
			<MenuButton
				onClick={() => editor.chain().focus().toggleStrike().run()}
				isActive={editor.isActive("strike")}
				title="Strikethrough"
			>
				<Strikethrough size={16} />
			</MenuButton>
			<MenuButton
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				isActive={editor.isActive("underline")}
				title="Underline"
			>
				<Underline size={16} />
			</MenuButton>

			<ToolbarSeparator />

			{/* Lists */}
			<MenuButton
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				isActive={editor.isActive("bulletList")}
				title="Bullet List"
			>
				<List size={16} />
			</MenuButton>
			<MenuButton
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				isActive={editor.isActive("orderedList")}
				title="Ordered List"
			>
				<ListOrdered size={16} />
			</MenuButton>

			<ToolbarSeparator />

			{/* Link, Image, Mention, Emoji, Code (inline), Code Block */}
			<MenuButton onClick={openLinkModal} title="Insert/Edit Link">
				<Link2 size={16} />
			</MenuButton>
			<MenuButton onClick={triggerImageUpload} title="Add Image">
				<ImageIcon size={16} />
			</MenuButton>
			<input
				type="file"
				ref={imageInputRef}
				onChange={handleImageFileSelected}
				accept="image/*"
				style={{ display: "none" }}
			/>
			<MenuButton onClick={handleMention} title="Mention User (@)">
				<AtSign size={16} />
			</MenuButton>
			<Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
				<PopoverTrigger asChild>
					<MenuButton
						title="Insert Emoji"
						onClick={() => {
							console.log("Emoji MenuButton clicked, toggling picker");
							setIsEmojiPickerOpen((prev) => !prev);
						}}
					>
						<Smile size={16} />
					</MenuButton>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto p-0 translate-x-4 translate-y-6 border-0"
					align="start"
				>
					<EmojiPicker
						onEmojiClick={onEmojiClick}
						autoFocusSearch={false}
						lazyLoadEmojis
					/>
				</PopoverContent>
			</Popover>
			<MenuButton
				onClick={() => editor.chain().focus().toggleCode().run()}
				isActive={editor.isActive("code")}
				title="Inline Code"
			>
				<Code size={16} />
			</MenuButton>
			<MenuButton
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				isActive={editor.isActive("codeBlock")}
				title="Code Block"
			>
				<Code2 size={16} />
			</MenuButton>

			{/* Dropdown for more actions */}
			<DropdownMenu open={moreActionsOpen} onOpenChange={setMoreActionsOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 p-1.5 text-primary hover:bg-primary/10 data-[state=open]:bg-primary/20"
						title="More actions"
					>
						{moreActionsOpen ? (
							<ChevronUp size={16} />
						) : (
							<ChevronDown size={16} />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={cn(
							editor.isActive("blockquote") && "bg-muted dark:bg-slate-700",
							"focus:bg-muted dark:focus:bg-slate-700",
						)}
					>
						<Quote size={14} className="mr-2" /> Blockquote
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					>
						<Minus size={14} className="mr-2" /> Horizontal Rule
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => editor.chain().focus().setHardBreak().run()}
					>
						<WrapText size={14} className="mr-2" /> Hard Break
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
					>
						Undo
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
					>
						Redo
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{isLinkModalOpen && (
				<LinkModal
					isOpen={isLinkModalOpen}
					onOpenChange={setIsLinkModalOpen}
					currentUrl={currentLinkForModal}
					onSetLink={handleSetLinkFromModal}
					onUnsetLink={handleUnsetLinkFromModal}
				/>
			)}
		</div>
	);
}
