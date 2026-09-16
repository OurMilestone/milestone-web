"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

const contactItems = [
	{
		label: "Location",
		value: "Remote-first · Serving teams worldwide",
	},
	{
		label: "Call Us",
		value: "Book a discovery call",
		href: "https://calendly.com/yourmilestone-support/milestone-discovery-call",
	},
	{
		label: "Email",
		value: "hello@ourmilestones.com",
		href: "mailto:hello@ourmilestones.com",
	},
	{
		label: "Working Hours",
		value: "Mon – Fri: 9:00 AM – 6:00 PM (GMT)",
	},
];

const columns: {
	title: string;
	links: { label: string; href: string; external?: boolean }[];
}[] = [
	{
		title: "Platform",
		links: [
			{ label: "Contracts", href: "#platform" },
			{ label: "Dispute Resolution", href: "#dispute" },
			{ label: "Integrations", href: "#integrations" },
		],
	},
	{
		title: "Solutions",
		links: [
			{ label: "Startups", href: "#solutions" },
			{ label: "Agencies", href: "#solutions" },
			{ label: "SMEs", href: "#solutions" },
			{ label: "Remote Teams", href: "#solutions" },
			{ label: "Growing Companies", href: "#solutions" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Getting Started", href: "/register" },
			{ label: "Help Center", href: "#pricing" },
			{ label: "Product Updates", href: "#insights" },
			{ label: "Guides & Insights", href: "#insights" },
			{ label: "Talk to Us", href: "#pricing" },
		],
	},
];

const socials = [
	{
		label: "Facebook",
		href: "https://www.facebook.com/",
		icon: (
			<svg
				className="size-4"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden
			>
				<path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.099 2.794.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763V11.01h3.59l-.467 3.696h-3.123V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
			</svg>
		),
	},
	{
		label: "X",
		href: "https://x.com/_yourmilestone",
		icon: (
			<svg
				className="size-4"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden
			>
				<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
			</svg>
		),
	},
	{
		label: "Instagram",
		href: "https://www.instagram.com/",
		icon: (
			<svg
				className="size-4"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden
			>
				<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
			</svg>
		),
	},
	{
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/yourmilestone/",
		icon: (
			<svg
				className="size-4"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden
			>
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
			</svg>
		),
	},
];

export default function Footer() {
	return (
		<footer className="bg-[var(--ms-navy)] text-white">
			<div className="ms-container py-14 sm:py-16 lg:py-20">
				{/* Top: CTA + contact */}
				<div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-24">
					<div className="max-w-xl">
						<h2 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-white sm:text-[2.15rem] lg:text-[2.35rem]">
							Let&apos;s manage contractors with clarity.
						</h2>

						<form
							className="mt-8"
							onSubmit={(e) => e.preventDefault()}
							action="#"
						>
							<label htmlFor="footer-email" className="sr-only">
								Email address
							</label>
							<div className="flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-4 sm:pl-5">
								<Mail
									className="size-4 shrink-0 text-white/45"
									strokeWidth={1.75}
								/>
								<input
									id="footer-email"
									type="email"
									name="email"
									placeholder="Enter your email"
									autoComplete="email"
									className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/40"
								/>
								<button
									type="submit"
									className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--ms-navy)] transition-colors hover:bg-white/90"
								>
									Subscribe
								</button>
							</div>
							<p className="mt-3 text-xs leading-relaxed text-white/40">
								By subscribing you agree to our{" "}
								<a
									href="/assets/docs/privacy.pdf"
									target="_blank"
									rel="noreferrer noopener"
									className="underline underline-offset-2 transition-colors hover:text-white/70"
								>
									Privacy Policy
								</a>
							</p>
						</form>
					</div>

					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10">
						{contactItems.map((item) => (
							<div key={item.label}>
								<p className="text-sm font-medium text-white">{item.label}</p>
								{item.href ? (
									<a
										href={item.href}
										target={item.href.startsWith("http") ? "_blank" : undefined}
										rel={
											item.href.startsWith("http")
												? "noreferrer noopener"
												: undefined
										}
										className="mt-2 block text-sm leading-relaxed text-white/50 transition-colors hover:text-white/80"
									>
										{item.value}
									</a>
								) : (
									<p className="mt-2 text-sm leading-relaxed text-white/50">
										{item.value}
									</p>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Middle: nav + social */}
				<div className="mt-14 grid gap-10 border-t border-white/10 pt-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
					{columns.map((col) => (
						<div key={col.title}>
							<p className="text-sm font-semibold text-white">{col.title}</p>
							<ul className="mt-5 space-y-3">
								{col.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-white/50 transition-colors hover:text-white"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					<div>
						<p className="text-sm font-semibold text-white">Social Media</p>
						<div className="mt-5 flex flex-wrap gap-3">
							{socials.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noreferrer noopener"
									aria-label={social.label}
									className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-white/45">
						© 2026 Milestone. All rights reserved.
					</p>
					<div className="flex flex-wrap items-center gap-6">
						<a
							href="#pricing"
							className="text-sm text-white/45 transition-colors hover:text-white"
						>
							Terms of Service
						</a>
						<a
							href="/assets/docs/privacy.pdf"
							target="_blank"
							rel="noreferrer noopener"
							className="text-sm text-white/45 transition-colors hover:text-white"
						>
							Privacy Policy
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
