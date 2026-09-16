"use client";

import { motion } from "framer-motion";
import { Handshake, Scale, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const steps = [
	{
		day: "DAY 01",
		label: "Legal",
		highlighted: false,
		title: "Access legal support",
		bullets: [
			"Contractor agreements and contract reviews",
			"Help with disputes and termination matters",
			"Request legal support from your workspace",
		],
		icon: Scale,
	},
	{
		day: "DAY 07",
		label: "HR",
		highlighted: false,
		title: "Get HR support",
		bullets: [
			"Contractor onboarding and documentation",
			"Performance issues and offboarding",
			"Workforce matters when you need an expert",
		],
		icon: Users,
	},
	{
		day: "DAY 30",
		label: "Dispute",
		highlighted: true,
		title: "Resolve disputes fairly",
		bullets: [
			"Expert facilitation between client and contractor",
			"Review milestones, deliverables and communication",
			"Protect both parties so the project can move forward",
		],
		icon: Handshake,
	},
];

function CardMark({
	icon: Icon,
	highlighted,
}: {
	icon: LucideIcon;
	highlighted: boolean;
}) {
	return (
		<div
			className={`mt-auto flex h-28 items-end ${
				highlighted ? "justify-end" : ""
			}`}
		>
			<div
				className={`flex size-12 items-center justify-center rounded-xl ${
					highlighted
						? "bg-[var(--ms-navy)] text-white"
						: "bg-[var(--ms-surface)] text-[var(--ms-navy)]"
				}`}
			>
				<Icon className="size-5" strokeWidth={1.75} />
			</div>
		</div>
	);
}

export default function SupportSection() {
	return (
		<section id="services" className="bg-white py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-3xl"
				>
					<p className="ms-eyebrow">03 Legal, HR &amp; Dispute</p>
					<h2 className="ms-h2 mt-4">
						When software isn&apos;t enough, we&apos;re here.
					</h2>
				</motion.div>

				{/* Timeline */}
				<div className="relative mx-auto mt-12 hidden max-w-5xl lg:block">
					<div
						aria-hidden
						className="absolute left-[16.66%] right-[16.66%] top-1/2 h-px -translate-y-1/2 bg-[var(--ms-border)]"
					/>
					<div className="grid grid-cols-3">
						{steps.map((step) => (
							<div
								key={step.day}
								className="relative flex h-12 flex-col items-center justify-center"
							>
								{step.highlighted ? (
									<span className="relative z-10 rounded-full bg-[var(--ms-navy)] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white">
										{step.day}
									</span>
								) : (
									<>
										<span className="absolute -top-1 text-xs font-semibold tracking-wide text-[var(--ms-muted)]">
											{step.day}
										</span>
										<span
											aria-hidden
											className="relative z-10 mt-5 size-2.5 rounded-full bg-[var(--ms-border)] ring-4 ring-white"
										/>
									</>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Cards */}
				<div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
					{steps.map((step, i) => (
						<motion.article
							key={step.title}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.08 }}
							className={`flex min-h-[320px] flex-col rounded-[1.25rem] p-6 sm:p-7 ${
								step.highlighted
									? "bg-[#e8eef6]"
									: "border border-[var(--ms-border)] bg-white"
							}`}
						>
							<div className="flex items-center justify-between gap-3">
								<span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ms-muted)]">
									{step.label}
								</span>
								<span className="text-[11px] font-semibold tracking-wide text-[var(--ms-muted)] lg:hidden">
									{step.day}
								</span>
							</div>

							<h3 className="mt-5 text-[1.35rem] font-semibold leading-snug tracking-tight text-[var(--ms-navy)]">
								{step.title}
							</h3>

							<ul className="mt-5 space-y-3">
								{step.bullets.map((bullet) => (
									<li
										key={bullet}
										className="flex gap-3 text-sm leading-relaxed text-[var(--ms-muted)]"
									>
										<span
											aria-hidden
											className="mt-[9px] size-1 shrink-0 rounded-full bg-[var(--ms-muted)]/40"
										/>
										{bullet}
									</li>
								))}
							</ul>

							<CardMark icon={step.icon} highlighted={step.highlighted} />
						</motion.article>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2 }}
					className="mt-12 flex justify-center"
				>
					<Link
						href="/register"
						className="inline-flex h-12 items-center justify-center rounded-lg bg-[#c9a227] px-8 text-sm font-bold uppercase tracking-wide text-[var(--ms-navy)] transition hover:bg-[#d4af37]"
					>
						Get started for free
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
