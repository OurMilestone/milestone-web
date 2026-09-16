"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const items = [
	"Secure contractor records",
	"Permission-based access",
	"Clear payment trails",
	"Controlled workspace access",
	"Connected integrations",
];

const dashboardImage =
	"https://ik.imagekit.io/lbmbhaciz/Image.png?updatedAt=1789486749946";

export default function SecuritySection() {
	return (
		<section
			id="security"
			className="overflow-hidden border-y border-[var(--ms-border)] bg-[var(--ms-surface-2)] py-20 sm:py-24 lg:py-28"
		>
			<div className="ms-container">
				<div className="mx-auto max-w-3xl text-center">
					<motion.p
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-eyebrow"
					>
						Built for sensitive operations
					</motion.p>
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.05 }}
						className="ms-h2 mt-4"
					>
						See your contractor work in one{" "}
						<span className="text-[var(--ms-muted)]">clear dashboard.</span>
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="ms-body mx-auto mt-5 max-w-2xl"
					>
						Contracts, projects, milestones and payments — with controlled
						access and clear operational trails.
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 32 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.12 }}
					className="relative mx-auto mt-12 max-w-6xl sm:mt-14"
				>
					<div className="overflow-hidden rounded-[1.25rem] border border-[var(--ms-border)] bg-white shadow-[0_24px_80px_rgb(20_24_31/0.12)] sm:rounded-[1.5rem]">
						<div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
							<Image
								src={dashboardImage}
								alt="Milestone dashboard showing overview metrics and active projects"
								fill
								sizes="(max-width: 1024px) 100vw, 1152px"
								className="object-cover object-top"
								priority={false}
							/>
						</div>
					</div>

					{/* Soft edge fade into section background */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--ms-surface-2)] to-transparent sm:h-24"
					/>
				</motion.div>

				<ul className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-12 sm:gap-x-8">
					{items.map((item, i) => (
						<motion.li
							key={item}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.15 + i * 0.04 }}
							className="flex items-center gap-2 text-sm font-medium text-[var(--ms-navy)] sm:text-[0.95rem]"
						>
							<span className="size-1.5 shrink-0 rounded-full bg-[var(--ms-navy)]" />
							{item}
						</motion.li>
					))}
				</ul>
			</div>
		</section>
	);
}
