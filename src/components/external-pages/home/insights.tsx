"use client";

import { motion } from "framer-motion";
import { InsightsMock } from "./mockups";

export default function InsightsSection() {
	return (
		<section id="insights" className="bg-white py-20 sm:py-24 lg:py-28">
			<div className="ms-container">
				<div className="mx-auto max-w-3xl text-center">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="ms-h2"
					>
						See what needs your attention.
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.08 }}
						className="ms-body mx-auto mt-5 max-w-2xl"
					>
						Workforce and project intelligence that helps companies stay ahead
						of delays, approvals and renewals.
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 28 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.55, delay: 0.1 }}
					className="mx-auto mt-12 max-w-5xl sm:mt-14"
				>
					<div className="overflow-x-auto pb-2">
						<div className="min-w-[640px] sm:min-w-0">
							<InsightsMock />
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
