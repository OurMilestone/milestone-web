import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "ik.imagekit.io",
				port: "",
				pathname: "/**",
			},
		],
	},
	output: "standalone",
};

export default nextConfig;
