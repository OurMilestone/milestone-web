"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingSection() {
	return (
		<section id="pricing" className="bg-white py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<div className="mx-auto max-w-3xl text-center">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-h2"
					>
						Simple pricing that scales with your business.
					</motion.h2>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.1 }}
					className="mx-auto mt-12 max-w-xl border border-[var(--ms-border)] bg-[var(--ms-surface-2)] p-8 sm:p-10"
				>
					<p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ms-muted)]">
						For companies
					</p>
					<p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--ms-navy)]">
						Custom pricing
					</p>
					<p className="ms-body mt-4">
						Pricing based on your contractor operations and requirements.
					</p>
					<a
						href="https://calendly.com/yourmilestone-support/milestone-discovery-call"
						target="_blank"
						rel="noreferrer noopener"
						className="ms-btn-primary mt-8 inline-flex"
					>
						Talk to us
					</a>
					<p className="mt-4 text-sm text-[var(--ms-muted)]">
						Or{" "}
						<Link
							href="/register"
							className="font-medium text-[var(--ms-navy)] underline-offset-2 hover:underline"
						>
							get started
						</Link>{" "}
						and explore the platform.
					</p>
				</motion.div>
			</div>
		</section>
	);
}
