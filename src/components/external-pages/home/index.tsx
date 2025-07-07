"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Footer from "../footer";
import Header from "../header";
import Hero from "./hero";

const fadeInUp = {
	initial: { opacity: 0, y: 60 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const scaleOnHover = {
	whileHover: { scale: 1.05 },
	transition: { type: "spring", stiffness: 300 },
};

export default function HomeLandingPage() {
	return (
		<div className="min-h-screen bg-white mx-auto">
			<div className="bg-[#FAFAFA]">
				<Header />

				<Hero />
			</div>

			<section id="how-it-works" className="py-20 xl:px-4 bg-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
								How It Works
							</h2>

							<div className="space-y-8">
								{[
									{
										step: "01",
										title: "Fund the Project Upfront",
										description:
											"Clients deposit the total project cost into Milestone’s secure escrow, guaranteeing payment is ready when work is done.",
										icon: "fund",
										color: "bg-[#FDECFF]",
									},
									{
										step: "02",
										title: "Break Work into Milestones",
										description:
											"Projects are structured into clear, manageable milestones, keeping everyone aligned on expectations and deliverables.",
										icon: "file",
										color: "bg-[#FFECEC]",
									},
									{
										step: "03",
										title: "Track Progress in Real Time",
										description:
											"Workers update milestones as they’re completed, giving clients instant visibility into what’s happening at each stage.",
										icon: "track",
										color: "bg-[#ECECFF]",
									},
									{
										step: "04",
										title: "Review and Approve",
										description:
											"Clients review completed milestones, test deliverables, and provide feedback or approval seamlessly within the platform.",
										icon: "review",
										color: "bg-[#DBF0DE]",
									},
									{
										step: "05",
										title: "Release Instant Payment",
										description:
											"Once approved, payments are instantly released to workers in their preferred currency—no delays, no excuses.",
										icon: "release",
										color: "bg-[#F1EDDE]",
									},
								].map((item, index) => (
									<motion.div
										key={item.step}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.2 }}
										viewport={{ once: true }}
										className="flex items-start gap-x-4"
									>
										<div
											className={`size-14 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}
										>
											<Image
												src={`/assets/icons/${item.icon}.svg`}
												alt={item.title}
												width={40}
												height={40}
											/>
										</div>
										<div>
											<h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">
												{item.title}
											</h3>
											<p className="text-primary leading-relaxed">
												{item.description}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="relative"
						>
							<Image
								src="/assets/images/how-it-works.png"
								alt="how it works"
								width={700}
								height={700}
							/>
						</motion.div>
					</div>
				</div>
			</section>

			<section className="py-20 xl:px-4  bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="flex flex-col lg:flex-row gap-16 items-center justify-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<Image
								src="/assets/images/task-management.png"
								alt="how it works"
								width={516}
								height={566}
							/>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="lg:max-w-[50%]"
						>
							<h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
								Built for Transparent, Secure, and Efficient Workflows.
							</h2>
							<p className="text-primary mb-5">
								Milestone gives your team the power to manage projects, track
								progress, and guarantee payments—all in one place.
							</p>

							<div className="space-y-6">
								{[
									{
										title: "Track Every Milestone with Ease",
										description:
											"Break projects into clear milestones and keep everyone aligned with real-time updates and approvals.",
										color: "bg-secondary",
									},
									{
										title: "Get Paid Faster, Without Hassles",
										description:
											"Funds are secured upfront and released instantly upon milestone completion, so you never chase payments again.",
										color: "bg-primary",
									},
									{
										title: "Build Trust with Clients",
										description:
											"Show clients exactly what’s happening at each stage, enhancing transparency and reducing back-and-forths.",
										color: "bg-secondary",
									},
								].map((feature, index) => (
									<motion.div
										key={feature.title}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.2 }}
										className="flex items-start space-x-4"
									>
										<div
											className={`size-7 ${feature.color} rounded-full flex items-center justify-center flex-shrink-0`}
										>
											<Check className="size-5 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-semibold text-primary mb-2">
												{feature.title}
											</h3>
											<p className="text-primary">{feature.description}</p>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			<section className="py-20 bg-[#0C153C] text-white">
				<div className="container mx-auto px-4">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 xl:px-4  lg:grid-cols-6 gap-8"
					>
						{[
							{
								title: "Real-Time Project Tracking",
								description:
									"Monitor your projects with real-time updates and comprehensive analytics for better decision making.",
								icon: "📈",
							},
							{
								title: "Built for Modern Work",
								description:
									"Designed for remote teams with collaborative tools and seamless communication features.",
								icon: "🛠",
							},
							{
								title: "Guaranteed Payments",
								description:
									"Secure escrow system ensures you get paid on time, every time, with automated milestone releases.",
								icon: "💵",
							},
							{
								title: "Global Payouts",
								description:
									"Receive payments in your local currency with support for multiple payment methods worldwide.",
								icon: "🌏",
							},
							{
								title: "Dispute Resolution",
								description:
									"Fair and transparent dispute resolution system to protect both clients and freelancers.",
								icon: "👨🏻‍💻",
							},
						].map((feature, index) => (
							<motion.div
								key={feature.title}
								variants={fadeInUp}
								whileHover={{ scale: 1.02 }}
								className={`${
									index < 2 ? "lg:col-span-3" : "lg:col-span-2"
								} bg-[#142544] backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300`}
							>
								<div className=" flex items-center justify-between mb-4">
									<p className="text-2xl">{feature.icon}</p>
									<ArrowUpRight />
								</div>
								<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
								<p className="text-blue-100 leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Statistics */}
			<section className="py-20 xl:px-4  bg-[#FAFAFA]">
				<div className="container  mx-auto px-4 text-center">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
							Numbers That Drive Confidence
						</h2>
						<p className="text-base text-primary max-w-2xl mx-auto">
							Trusted by remote teams and freelancers worldwide to simplify
							payments and project management.
						</p>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="initial"
						whileInView="animate"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-3 gap-8"
					>
						{[
							{ number: "24%", label: "Increase in on-time project delivery" },
							{ number: "180K", label: "Payments securely processed" },
							{
								number: "12+",
								label: "Supported currencies for global payouts",
							},
						].map((stat) => (
							<motion.div
								key={stat.number}
								variants={fadeInUp}
								className="text-center"
							>
								<div className="text-3xl md:text-4xl font-medium text-primary mb-2">
									{stat.number}
								</div>
								<div className="text-primary">{stat.label}</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			<section className="py-10 md:py-20 xl:px-4 relative overflow-hidden">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
						>
							<motion.div className="flex items-center justify-center gap-x-2 mb-4 py-2 max-w-xs  bg-[#FBF1D38A] rounded-xl">
								<Image
									src="/assets/icons/empower.svg"
									width={25}
									height={25}
									alt="remote"
								/>
								<span className=" text-[#EDBB24]">
									Empower Remote Collaboration
								</span>
							</motion.div>
							<h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
								Connect, Track, And Pay Your Global Team With Ease.
							</h2>
							<p className="text-base text-primary mb-8 leading-relaxed">
								Milestone simplifies how you work with remote teams and
								contractors worldwide. From tracking project milestones to
								ensuring payments are secure and instant, everything happens in
								one seamless platform.
							</p>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.95 }}
							>
								<a
									href="https://calendly.com/yourmilestone-support/milestone-discovery-call"
									target="_blank"
									rel="noreferrer noopener"
								>
									<Button
										size="lg"
										className=" text-white px-8 h-12 cursor-pointer rounded-full"
									>
										Schedule a Demo
									</Button>
								</a>
							</motion.div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							className="relative"
						>
							<Image
								src="/assets/images/connect.png"
								alt="how it works"
								width={600}
								height={600}
							/>
						</motion.div>
					</div>
				</div>
			</section>

			<motion.section
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				viewport={{ once: true }}
				className="py-16 mx-5 md:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl rounded-3xl flex flex-col items-center justify-center md:mx-auto bg-[url('/assets/images/grid-bg.svg')] bg-cover h-[400px] bg-center bg-no-repeat text-white text-center"
			>
				<div className="container mx-auto px-4">
					<h2 className="text-2xl md:text-4xl leading-[1.4] font-bold mb-6">
						Make Your Next Project Smoother—
						<br />
						For Everyone Involved.
					</h2>
					<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						<a
							href="https://calendly.com/yourmilestone-support/milestone-discovery-call"
							target="_blank"
							rel="noreferrer noopener"
						>
							<Button
								size="lg"
								variant="secondary"
								className=" px-8 h-12 cursor-pointer rounded-full font-semibold"
							>
								Schedule a Demo
							</Button>
						</a>

						<p className="text-xs mt-1">Start using Milestone today. </p>
					</motion.div>
				</div>
			</motion.section>

			<Footer />
		</div>
	);
}
