"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll events to update navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Links for both desktop and mobile navigation
    const navLinks = [
        { href: "/", label: "Home", exact: true },
        { href: "/software", label: "Explore" },
        { href: "/search", label: "Search" },
    ];

    // Check if a link is active
    const isActive = (path: string, exact: boolean = false) => {
        if (exact) return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-[rgba(10,10,22,0.8)] backdrop-blur-lg border-b border-emerald-500/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white font-bold text-xl"
                >
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 blur-[2px] opacity-70"></div>
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Code className="text-white w-4 h-4" />
                        </div>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
                        DevScan
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-emerald-400",
                                isActive(link.href, link.exact)
                                    ? "text-emerald-400"
                                    : "text-emerald-100/80"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/search">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-emerald-500/20 bg-black/20 text-emerald-300 hover:bg-emerald-950/60 hover:text-emerald-200"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search Projects
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-emerald-300"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0a0a16] border-b border-emerald-500/10">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "py-2 px-3 rounded-md text-sm font-medium transition-colors",
                                    isActive(link.href, link.exact)
                                        ? "bg-emerald-900/30 text-emerald-400"
                                        : "text-emerald-100/80 hover:bg-emerald-900/20 hover:text-emerald-300"
                                )}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Link
                            href="/search"
                            className="mt-2 bg-emerald-900/20 hover:bg-emerald-900/40 border border-emerald-500/20 text-emerald-300 rounded-md py-2 px-3 flex items-center justify-center gap-2 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Search className="h-4 w-4" />
                            Search Projects
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
