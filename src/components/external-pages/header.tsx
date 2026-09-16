"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Platform", href: "#platform" },
	{ label: "Solutions", href: "#solutions" },
	{ label: "Contact", href: "mailto:hello@ourmilestones.com" },
];

function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 bg-white">
			<div className="ms-container">
				<div className="flex h-16 items-center justify-between lg:h-[72px]">
					<Link
						href="/"
						className="text-[1.125rem] font-semibold tracking-tight text-[#111827]"
						onClick={() => setMobileOpen(false)}
					>
						Milestone
					</Link>

					<nav className="hidden items-center gap-8 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="text-sm font-medium text-[#6b7280] transition-colors hover:text-[#111827]"
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className="hidden items-center gap-5 md:flex">
						<Link
							href="/login"
							className="text-sm font-medium text-[#6b7280] transition-colors hover:text-[#111827]"
						>
							Sign In
						</Link>
						<Link
							href="/register"
							className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#111827] px-5 text-sm font-medium text-white transition-colors hover:bg-black"
						>
							Get Started
							<ArrowUpRight className="size-3.5" />
						</Link>
					</div>

					<button
						type="button"
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						className="inline-flex size-10 items-center justify-center rounded-full border border-[#e5e7eb] text-[#111827] md:hidden"
						onClick={() => setMobileOpen((v) => !v)}
					>
						{mobileOpen ? (
							<X className="size-5" />
						) : (
							<Menu className="size-5" />
						)}
					</button>
				</div>
			</div>

			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="overflow-hidden border-t border-[#e5e7eb] bg-white md:hidden"
					>
						<div className="ms-container space-y-1 py-4">
							{navLinks.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									onClick={() => setMobileOpen(false)}
									className="block py-2.5 text-sm font-medium text-[#111827]"
								>
									{link.label}
								</Link>
							))}
							<div className="flex flex-col gap-3 border-t border-[#e5e7eb] pt-4">
								<Link
									href="/login"
									onClick={() => setMobileOpen(false)}
									className="inline-flex h-11 items-center justify-center rounded-full border border-[#e5e7eb] text-sm font-medium text-[#111827]"
								>
									Sign In
								</Link>
								<Link
									href="/register"
									onClick={() => setMobileOpen(false)}
									className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#111827] text-sm font-medium text-white"
								>
									Get Started
									<ArrowUpRight className="size-3.5" />
								</Link>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}

export default Header;
