import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DevScan - Discover Hackathon Projects",
    description:
        "Discover amazing projects from Major League Hacking events with AI-powered analysis",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} dark min-h-screen bg-[#0a0a16]`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="pt-16">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}

import "./globals.css";
