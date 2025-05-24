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
		],
	},
};

export default nextConfig;
