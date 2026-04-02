import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SellerPageFrame } from "@/components/layout/seller-page-frame";
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
    title: "Cổng Người Bán",
    description: "Không gian vận hành bán hàng đa kênh",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SellerPageFrame>{children}</SellerPageFrame>
            </body>
        </html>
    );
}
