"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FinalCta() {
	return (
		<section className="bg-[var(--ms-surface)] py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mx-auto max-w-3xl text-center"
				>
					<h2 className="ms-h2">Run external work with confidence.</h2>
					<p className="ms-body mx-auto mt-5 max-w-2xl">
						Manage contracts. Track work. Verify deliverables. Approve payments.
						Get professional support when you need it.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Link href="/register" className="ms-btn-primary w-full sm:w-auto">
							Get started
						</Link>
						<a
							href="https://calendly.com/yourmilestone-support/milestone-discovery-call"
							target="_blank"
							rel="noreferrer noopener"
							className="ms-btn-secondary w-full sm:w-auto"
						>
							Talk to us
						</a>
					</div>
					<p className="mt-6 text-sm text-[var(--ms-muted)]">
						Legal and HR support available when requested.
					</p>
				</motion.div>
			</div>
		</section>
	);
}
