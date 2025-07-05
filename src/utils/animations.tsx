//import { delay } from "framer-motion";

export const fadeInUp = {
	initial: { opacity: 0, y: 60 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};
export const fadeInDown = {
	initial: { opacity: 0, y: -60 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};
export const staggerContainer = {
	animate: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};
export const scaleOnHover = {
	whileHover: { scale: 1.05 },
	transition: { type: "spring", stiffness: 300 },
};
