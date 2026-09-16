"use client";

import { motion } from "framer-motion";

const features = [
	{
		eyebrow: "01 Contract",
		title: "Set terms, deliverables and payment milestones.",
	},
	{
		eyebrow: "02 Manage",
		title: "Track projects, contractors and deadlines in one place.",
	},
	{
		eyebrow: "03 Verify",
		title: "Review activity and approve work before you pay.",
	},
];

export default function PlatformSection() {
	return (
		<section
			id="platform"
			className="bg-[var(--ms-surface)] py-20 sm:py-24 lg:py-28"
		>
			<div className="ms-container">
				<div className="mx-auto max-w-3xl text-center">
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-eyebrow"
					>
						The smart way to manage your practice
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.05 }}
						className="ms-h2 mt-4"
					>
						One place to manage the entire{" "}
						<span className="text-[var(--ms-muted)]">
							contractor lifecycle.
						</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="ms-body mx-auto mt-5 max-w-2xl"
					>
						From the moment a contractor signs an agreement to the moment their
						work is approved and paid.
					</motion.p>
				</div>

				<div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:mt-14 lg:grid-cols-2 lg:gap-6">
					{/* Tall left card */}
					<motion.article
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl bg-[#1a2238] p-7 sm:min-h-[420px] sm:p-8 lg:row-span-2 lg:min-h-0"
					>
						{/* Image placeholder */}
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-[#1a2238]"
						/>
						<div
							aria-hidden
							className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent"
						/>
						<div className="relative z-10 max-w-sm">
							<p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
								{features[0].eyebrow}
							</p>
							<h3 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-white sm:text-[1.65rem]">
								{features[0].title}
							</h3>
						</div>
					</motion.article>

					{/* Top right — blue */}
					<motion.article
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.08 }}
						className="flex min-h-[200px] overflow-hidden rounded-3xl bg-[#3b82f6] sm:min-h-[220px]"
					>
						<div className="flex flex-1 flex-col justify-center p-7 sm:p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/75">
								{features[1].eyebrow}
							</p>
							<h3 className="mt-3 max-w-[16rem] text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl">
								{features[1].title}
							</h3>
						</div>
						{/* UI screenshot placeholder */}
						<div className="hidden w-[42%] shrink-0 items-end justify-end p-5 sm:flex">
							<div className="h-full min-h-[140px] w-full rounded-2xl bg-[#dbeafe]/90" />
						</div>
					</motion.article>

					{/* Bottom right — light */}
					<motion.article
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.14 }}
						className="flex min-h-[200px] overflow-hidden rounded-3xl bg-[#e8eef6] shadow-[0_8px_30px_rgb(20_24_31/0.06)] sm:min-h-[220px]"
					>
						<div className="flex flex-1 flex-col justify-center p-7 sm:p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ms-muted)]">
								{features[2].eyebrow}
							</p>
							<h3 className="mt-3 max-w-[16rem] text-xl font-semibold leading-snug tracking-tight text-[var(--ms-navy)] sm:text-2xl">
								{features[2].title}
							</h3>
						</div>
						{/* Photo placeholder */}
						<div className="hidden w-[38%] shrink-0 items-stretch p-5 sm:flex">
							<div className="h-full min-h-[140px] w-full rounded-2xl bg-[#7b93b8]" />
						</div>
					</motion.article>
				</div>
			</div>
		</section>
	);
}
