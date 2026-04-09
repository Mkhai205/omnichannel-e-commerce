import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
        protocol: "http",
        hostname: "101.96.66.225",
        port: "8006",
        pathname: "/products/**",
    },
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (apiUrl) {
    try {
        const parsedApiUrl = new URL(apiUrl);
        const protocol = parsedApiUrl.protocol.replace(":", "");

        if (protocol === "http" || protocol === "https") {
            remotePatterns.push({
                protocol,
                hostname: parsedApiUrl.hostname,
                port: parsedApiUrl.port,
                pathname: "/products/**",
            });
        }
    } catch {
        // Ignore invalid NEXT_PUBLIC_API_URL and keep default remote patterns.
    }
}

const nextConfig: NextConfig = {
    images: {
        remotePatterns,
    },
};

export default nextConfig;
