import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/utils/animations";
import { motion } from "framer-motion";
import Image from "next/image";

function Hero() {
	return (
		<div>
			<section className="pt-20  relative overflow-hidden">
				<div className="container mx-auto px-4 text-center relative z-10">
					<motion.div
						variants={staggerContainer}
						initial="initial"
						animate="animate"
						className="max-w-5xl mx-auto"
					>
						<motion.h1
							variants={fadeInUp}
							className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight"
						>
							Get Paid Faster and Manage Projects{" "}
							<br className="hidden md:block" />
							Seamlessly
						</motion.h1>

						<motion.p
							variants={fadeInUp}
							className="text-base text-primary mb-8 max-w-3xl mx-auto leading-relaxed"
						>
							Streamline your workflow with our comprehensive project management
							platform. Track progress, manage teams, and get paid faster with
							automated invoicing and milestone tracking.
						</motion.p>

						<motion.div
							variants={fadeInUp}
							className="flex flex-col sm:flex-row gap-4 justify-center items-center"
						>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button size="lg" className="px-8 h-12 rounded-full text-lg">
									Schedule a Demo
								</Button>
							</motion.div>
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button
									size="lg"
									variant="secondary"
									className="px-12 h-12 rounded-full text-lg"
									onClick={() => {
										document.getElementById("how-it-works")?.scrollIntoView({
											behavior: "smooth",
										});
									}}
								>
									How it Works
								</Button>
							</motion.div>
						</motion.div>
					</motion.div>
				</div>

				{/* Floating avatars */}
				<motion.div
					animate={{ y: [0, -10, 0] }}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute top-4 md:top-20 left-0 md:left-10 2xl:left-60 w-16 h-16 rounded-full flex items-center justify-center"
				>
					<Image
						src="/assets/images/hero-avatar-1.png"
						alt="avatar float Icon"
						width={50}
						height={50}
					/>
				</motion.div>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{
						duration: 4,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute top-4 md:top-20 right-0 md:right-10 2xl:right-60 w-16 h-16 rounded-full flex items-center justify-center"
				>
					<Image
						src="/assets/images/hero-avatar-2.png"
						alt="avatar float Icon"
						width={50}
						height={50}
					/>
				</motion.div>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{
						duration: 4,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute bottom-[220px] md:bottom-96 left-0 md:left-10 2xl:left-60 w-16 h-16 rounded-full flex items-center justify-center"
				>
					<Image
						src="/assets/images/hero-avatar-3.png"
						alt="avatar float Icon"
						width={50}
						height={50}
					/>
				</motion.div>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{
						duration: 4,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute bottom-[220px] md:bottom-96 right-0 md:right-10 2xl:right-60 w-16 h-16 rounded-full flex items-center justify-center"
				>
					<Image
						src="/assets/images/hero-avatar-4.png"
						alt="avatar float Icon"
						width={50}
						height={50}
					/>
				</motion.div>
				<motion.div
					variants={fadeInUp}
					className="relative w-96 flex items-center justify-center md:max-w-5xl md:w-full  mx-auto md:h-[500px] mt-10 "
				>
					<Image
						src="/assets/images/home-hero.png"
						alt="home hero dashboard preview"
						width={1000}
						height={1000}
						objectFit="cover"
						className="w-[500px] lg:w-[1000px] h-auto object-cover"
					/>
				</motion.div>
			</section>
		</div>
	);
}

export default Hero;
