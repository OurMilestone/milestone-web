"use client";

import { motion } from "framer-motion";

const solutions = [
	{
		title: "Startups",
		copy: "Move fast without losing control of your external workforce.",
	},
	{
		title: "Agencies",
		copy: "Manage contractors and project-based teams across multiple engagements.",
	},
	{
		title: "SMEs",
		copy: "Bring contracts, work and payments into one operational system.",
	},
	{
		title: "Remote Teams",
		copy: "Keep distributed work visible from anywhere.",
	},
	{
		title: "Growing Companies",
		copy: "Build structure around an increasingly distributed workforce.",
	},
];

export default function SolutionsSection() {
	return (
		<section id="solutions" className="bg-white py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<div className="max-w-3xl">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-h2"
					>
						Built for companies that work beyond the traditional employee.
					</motion.h2>
				</div>

				<div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-[var(--ms-border)] bg-[var(--ms-border)] sm:grid-cols-2 lg:grid-cols-3">
					{solutions.map((item, i) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.05 }}
							className={`group relative cursor-default bg-white p-7 transition-colors duration-300 hover:z-10 hover:bg-[var(--ms-accent)] sm:p-8 ${
								i === solutions.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
							}`}
						>
							<p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ms-muted)] transition-colors duration-300 group-hover:text-[var(--ms-navy)]/70">
								{item.title}
							</p>
							<p className="mt-4 text-lg font-medium leading-snug tracking-tight text-[var(--ms-navy)]">
								{item.copy}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
