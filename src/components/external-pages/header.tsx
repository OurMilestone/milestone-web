import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const menuItemVariants = {
		closed: {
			opacity: 0,
			x: -20,
			transition: {
				duration: 0.2,
			},
		},
		open: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.2,
			},
		},
	};

	const hamburgerVariants = {
		closed: {
			rotate: 0,
			transition: {
				duration: 0.2,
			},
		},
		open: {
			rotate: 45,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="border border-gray-100 mx-7 md:max-w-3xl lg:max-w-5xl md:mx-auto rounded-2xl bg-white/80 backdrop-blur-md sticky top-4 z-50"
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Image
							src="/assets/images/milestone-logo.png"
							alt="logo"
							width={140}
							height={140}
						/>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						<Link
							href="#about"
							className="text-primary hover:text-gray-900 transition-colors"
						>
							About Us
						</Link>
						<Link
							href="#products"
							className="text-primary hover:text-gray-900 transition-colors"
						>
							Products
						</Link>
						<Link
							href="#teams"
							className="text-primary hover:text-gray-900 transition-colors"
						>
							Teams
						</Link>
						<Link
							href="#community"
							className="text-primary hover:text-gray-900 transition-colors"
						>
							Our Community
						</Link>
					</nav>

					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="hidden md:block"
					>
						<Link href="/login">
							<Button className=" text-white px-8 h-12 rounded-full">
								Login
							</Button>
						</Link>
					</motion.div>

					{/* Mobile Hamburger Menu */}
					<motion.button
						onClick={toggleMenu}
						className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5"
						whileTap={{ scale: 0.95 }}
					>
						<motion.span
							className="w-6 h-0.5 bg-gray-600 block"
							variants={hamburgerVariants}
							animate={isMenuOpen ? "open" : "closed"}
						/>
						<motion.span
							className="w-6 h-0.5 bg-gray-600 block"
							animate={{
								opacity: isMenuOpen ? 0 : 1,
								transition: { duration: 0.2 },
							}}
						/>
						<motion.span
							className="w-6 h-0.5 bg-gray-600 block"
							animate={{
								rotate: isMenuOpen ? -45 : 0,
								y: isMenuOpen ? -16 : 0,
								transition: { duration: 0.2 },
							}}
						/>
					</motion.button>
				</div>

				{/* Mobile Menu */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							variants={menuItemVariants}
							initial="closed"
							animate="open"
							exit="closed"
							className="md:hidden overflow-hidden"
						>
							<nav className="pt-4 pb-2 space-y-4">
								{["About Us", "Products", "Teams", "Our Community"].map(
									(item, index) => (
										<motion.div
											key={item}
											variants={menuItemVariants}
											initial="closed"
											animate="open"
											exit="closed"
											transition={{ delay: index * 0.1 }}
										>
											<Link
												href="#nav"
												className="block text-primary hover:text-gray-900 transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
												onClick={() => setIsMenuOpen(false)}
											>
												{item}
											</Link>
										</motion.div>
									),
								)}

								<motion.div
									variants={menuItemVariants}
									initial="closed"
									animate="open"
									exit="closed"
									transition={{ delay: 0.4 }}
									className="pt-2"
								>
									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Link href="/login">
											<Button
												className="px-8 h-12 rounded-full w-full"
												onClick={() => setIsMenuOpen(false)}
											>
												Login
											</Button>
										</Link>
									</motion.div>
								</motion.div>
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.header>
	);
}

export default Header;
