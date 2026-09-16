"use client";

import { motion } from "framer-motion";

const categories = [
	"Startups",
	"Agencies",
	"Technology Companies",
	"Professional Services",
	"Growing Businesses",
];

export default function TrustBar() {
	return (
		<section className="border-y border-[var(--ms-border)] bg-white py-10 sm:py-12">
			<div className="ms-container">
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="text-center text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ms-muted)]"
				>
					Built for companies managing external teams
				</motion.p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
					{categories.map((item) => (
						<span
							key={item}
							className="text-sm font-medium tracking-tight text-[var(--ms-navy)]/45 sm:text-base"
						>
							{item}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
