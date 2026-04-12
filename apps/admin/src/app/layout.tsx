import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminPageFrame } from "@/components/layout/admin-page-frame";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Omnichannel Admin",
    description: "Admin console for monitoring and operating the e-commerce system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <AdminPageFrame>{children}</AdminPageFrame>
            </body>
        </html>
    );
}
