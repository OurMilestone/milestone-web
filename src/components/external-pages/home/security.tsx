"use client";

import { motion } from "framer-motion";

const items = [
	"Secure contractor records",
	"Permission-based access",
	"Clear payment trails",
	"Controlled workspace access",
	"Connected integrations",
];

export default function SecuritySection() {
	return (
		<section className="border-y border-[var(--ms-border)] bg-[var(--ms-surface-2)] py-20 sm:py-24">
			<div className="ms-container">
				<div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
					<div>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="ms-h2"
						>
							Built for sensitive business operations.
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.08 }}
							className="ms-body mt-5"
						>
							Contractor relationships involve contracts, payments and
							confidential work. Milestone is designed with controlled access
							and clear operational trails.
						</motion.p>
					</div>

					<ul className="space-y-0 divide-y divide-[var(--ms-border)] border-y border-[var(--ms-border)]">
						{items.map((item, i) => (
							<motion.li
								key={item}
								initial={{ opacity: 0, x: 12 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.05 }}
								className="flex items-center gap-3 py-4 text-base font-medium text-[var(--ms-navy)]"
							>
								<span className="size-1.5 shrink-0 rounded-full bg-[var(--ms-navy)]" />
								{item}
							</motion.li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
