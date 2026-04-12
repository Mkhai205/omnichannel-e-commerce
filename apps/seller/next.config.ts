import type { NextConfig } from "next";

function parseRemotePattern(rawUrl?: string): {
    protocol: "http" | "https";
    hostname: string;
    port?: string;
    pathname: string;
} | null {
    if (!rawUrl || rawUrl.trim().length === 0) {
        return null;
    }

    try {
        const parsed = new URL(rawUrl);
        const protocol = parsed.protocol.replace(":", "");

        if (protocol !== "http" && protocol !== "https") {
            return null;
        }

        return {
            protocol,
            hostname: parsed.hostname,
            port: parsed.port || undefined,
            pathname: "/**",
        };
    } catch {
        return null;
    }
}

const apiRemotePattern = parseRemotePattern(process.env.NEXT_PUBLIC_API_URL);

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "101.96.66.225", port: "8006", pathname: "/**" },
            { protocol: "http", hostname: "localhost", port: "9000", pathname: "/**" },
            ...(apiRemotePattern ? [apiRemotePattern] : []),
        ],
    },
};

export default nextConfig;
