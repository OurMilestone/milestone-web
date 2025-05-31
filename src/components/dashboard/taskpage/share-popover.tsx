"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Copy, Facebook, Mail, MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { DiscordIcon } from "../../../../public/assets/svgs/__index__";
import { FacebookIcon } from "../../../../public/assets/svgs/__index__";
import { GmailIcon } from "../../../../public/assets/svgs/__index__";
import { WhatsappIcon } from "../../../../public/assets/svgs/__index__";

interface SharePopoverProps {
	children: React.ReactNode;
	taskUrl: string;
}

export default function SharePopover({ children, taskUrl }: SharePopoverProps) {
	const [hasCopied, setHasCopied] = useState(false);

	const onCopy = () => {
		navigator.clipboard.writeText(taskUrl);
		setHasCopied(true);
		toast.success("Link copied to clipboard!");
		setTimeout(() => setHasCopied(false), 2000);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className="w-80 p-4 space-y-3 bg-white">
				<h4 className="font-medium leading-none text-sm">
					Share this document
				</h4>
				<div className="flex items-center justify-around gap-2">
					{/* //Todo: I'll replace with actual sharing logic or links */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => alert("Share WhatsApp")}
					>
						<Image src={WhatsappIcon} alt="Whatsapp Icon" className="h-6 w-6" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => alert("Share Discord")}
					>
						<Image src={DiscordIcon} alt="Discord Icon" className="h-6 w-6" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => alert("Share Gmail")}
					>
						<Image src={GmailIcon} alt="Gmail Icon" className="h-6 w-6" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => alert("Share Facebook")}
					>
						<Image src={FacebookIcon} alt="Facebook Icon" className="h-6 w-6" />
					</Button>
				</div>
				<div>
					<label
						htmlFor="slack-link"
						className="text-xs font-medium text-primary"
					>
						Slack
					</label>
					<div className="flex items-center gap-2 mt-1">
						<Input
							id="slack-link"
							defaultValue={taskUrl}
							readOnly
							className="h-9 text-xs"
						/>
						<Button
							size="sm"
							onClick={onCopy}
							className="h-9 px-3 bg-primary text-white"
						>
							{hasCopied ? "Link Copied" : "Copy Link"}
							<span className="sr-only">
								{hasCopied ? "Copied" : "Copy Link"}
							</span>
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
