import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress:true,
  reactStrictMode:true,
  compiler:{
    removeConsole:process.env.NODE_ENV === "production"
  },
  experimental:{
    authInterrupts:true,
    optimizeCss:true,
    optimisticClientCache:true,
    optimizePackageImports:["lucide-react","date-fns"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vl.imgix.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "velocity-motors.imgix.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'velocity-motors.s3.eu-north-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  async headers(){
    return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Permissions-Policy",
						value: `camera=(), microphone=(), geolocation=(), midi=(), sync-xhr=(), fullscreen=(self "${process.env.NEXT_PUBLIC_APP_URL}"), geolocation=("${process.env.NEXT_PUBLIC_APP_URL}")`,
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
  }
};

export default nextConfig;
