"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronRight,
    Code,
    Sparkles,
    Zap,
    Search,
    BarChart3,
    Github,
    Star,
    Brain,
    Rocket,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ProjectShowcase } from "@/components/project-showcase";
import { Testimonials } from "@/components/testimonials";

// Predefined values for animations to avoid hydration mismatches
const BLOB_CONFIGS = [
    { width: 450, height: 350, left: 15, top: 25, duration: 42 },
    { width: 550, height: 450, left: 75, top: 65, duration: 38 },
    { width: 400, height: 400, left: 45, top: 10, duration: 45 },
    { width: 350, height: 300, left: 10, top: 80, duration: 35 },
    { width: 300, height: 350, left: 80, top: 30, duration: 32 },
];

const PARTICLE_CONFIGS = [
    { floatX: 20, floatY: -15, delay: 0 },
    { floatX: -20, floatY: 20, delay: 1.5 },
    { floatX: 10, floatY: 25, delay: 3 },
];

export default function Home() {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const handleMouseMove = (e: MouseEvent) => {
            requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isMounted]);

    const calcParallax = (depth = 10) => {
        if (!isMounted) return { x: 0, y: 0 };

        const x = (window.innerWidth / 2 - mousePosition.x) / (depth * 2);
        const y = (window.innerHeight / 2 - mousePosition.y) / (depth * 2);
        return { x, y };
    };

    return (
        <div className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[#0a0a16] overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_50%)]"></div>

                {/* Animated background shapes - using predefined values */}
                {BLOB_CONFIGS.map((config, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 blur-xl animate-blob"
                        style={{
                            width: config.width,
                            height: config.height,
                            left: `${config.left}%`,
                            top: `${config.top}%`,
                            animationDelay: `${i * -6}s`,
                            animationDuration: `${config.duration}s`,
                        }}
                    />
                ))}

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 w-full">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* Main heading with staggered animation */}
                        <div className="overflow-hidden mb-8">
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                                    DevScan
                                </span>
                            </h1>
                        </div>

                        {/* Animated subtitle */}
                        <div className="mb-6">
                            <p className="text-2xl text-emerald-100/90 max-w-2xl">
                                AI-Powered Analysis for Hackathon Projects
                            </p>
                        </div>

                        <p className="text-lg text-emerald-100/80 max-w-2xl mb-10">
                            Discover, analyze, and evaluate innovative projects
                            from hackathons around the world with our advanced
                            AI toolkit
                        </p>

                        {/* Hero CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <Button
                                size="lg"
                                onClick={() => router.push("/software")}
                                className="relative bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border-0 px-8 py-6 text-lg rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all duration-300 group w-full sm:w-auto"
                            >
                                <span className="mr-2">Explore Projects</span>
                                <ChevronRight className="h-5 w-5" />
                            </Button>

                            <Button
                                size="lg"
                                onClick={() => router.push("/search")}
                                className="relative bg-black/40 hover:bg-black/60 text-white border border-emerald-500/30 px-8 py-6 text-lg rounded-lg hover:border-emerald-500/60 transition-all duration-300 group w-full sm:w-auto"
                            >
                                <span className="mr-2">Search Projects</span>
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Stats showcase */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 w-full max-w-4xl">
                            {[
                                {
                                    value: "100+",
                                    label: "Projects Analyzed",
                                    icon: (
                                        <BarChart3 className="h-5 w-5 text-emerald-400" />
                                    ),
                                },
                                {
                                    value: "50+",
                                    label: "GitHub Repositories",
                                    icon: (
                                        <Github className="h-5 w-5 text-emerald-400" />
                                    ),
                                },
                                {
                                    value: "20+",
                                    label: "Technologies",
                                    icon: (
                                        <Code className="h-5 w-5 text-emerald-400" />
                                    ),
                                },
                                {
                                    value: "95%",
                                    label: "Analysis Accuracy",
                                    icon: (
                                        <Star className="h-5 w-5 text-emerald-400" />
                                    ),
                                },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 bg-[rgba(16,16,32,0.4)] backdrop-blur-sm border border-emerald-500/10 rounded-xl hover:border-emerald-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {stat.icon}
                                        <span className="text-3xl font-bold text-white">
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className="text-emerald-100/70 text-sm">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Add Project Showcase before How It Works section */}
                <section className="py-20 container mx-auto px-4">
                    <ProjectShowcase />
                </section>

                {/* How It Works Section */}
                <section className="py-20 bg-[#080812] border-y border-emerald-900/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 mb-4 bg-emerald-900/20 border border-emerald-500/20 rounded-full px-4 py-1.5">
                                <Rocket className="h-4 w-4 text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-300">
                                    Our Process
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                How DevScan Works
                            </h2>
                            <p className="text-emerald-100/70 max-w-2xl mx-auto">
                                Our AI-powered analysis provides deep insights
                                into hackathon projects through a three-step
                                process
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                {
                                    icon: (
                                        <Search className="h-8 w-8 text-emerald-400" />
                                    ),
                                    title: "1. Data Collection",
                                    description:
                                        "We collect project information from DevPost submissions and associated GitHub repositories",
                                },
                                {
                                    icon: (
                                        <Brain className="h-8 w-8 text-emerald-400" />
                                    ),
                                    title: "2. AI Analysis",
                                    description:
                                        "Our AI models analyze code, descriptions, and technical details to extract key insights",
                                },
                                {
                                    icon: (
                                        <BarChart3 className="h-8 w-8 text-emerald-400" />
                                    ),
                                    title: "3. Insight Generation",
                                    description:
                                        "Results are presented in an accessible format with technical highlights and metrics",
                                },
                            ].map((step, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center text-center p-6 bg-[rgba(16,16,32,0.6)] backdrop-blur-sm border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                >
                                    <div className="bg-[rgba(16,185,129,0.2)] rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-emerald-100/70">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Add Testimonials section here */}
                <Testimonials />

                {/* Feature Highlights Section */}
                <section className="py-20 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4 bg-emerald-900/20 border border-emerald-500/20 rounded-full px-4 py-1.5">
                            <Sparkles className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-300">
                                Key Features
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            What Sets DevScan Apart
                        </h2>
                        <p className="text-emerald-100/70 max-w-2xl mx-auto">
                            Advanced features designed specifically for
                            hackathon project evaluation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: (
                                    <Brain className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "AI-Powered Analysis",
                                description:
                                    "Deep technical insights extracted from code and descriptions using cutting-edge AI models",
                            },
                            {
                                icon: (
                                    <Search className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "Advanced Search",
                                description:
                                    "Find relevant projects by keywords, technologies, or specific technical criteria",
                            },
                            {
                                icon: (
                                    <Github className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "GitHub Integration",
                                description:
                                    "Direct analysis of repositories to evaluate code quality and implementation details",
                            },
                            {
                                icon: (
                                    <Star className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "Project Scoring",
                                description:
                                    "Objective technical scoring to assist in fair and consistent evaluation",
                            },
                            {
                                icon: (
                                    <Users className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "Team Analysis",
                                description:
                                    "Insights into team composition and contribution patterns for collaborative assessment",
                            },
                            {
                                icon: (
                                    <Zap className="h-6 w-6 text-emerald-400" />
                                ),
                                title: "Fast Processing",
                                description:
                                    "Real-time analysis and caching for quick access to project insights when you need them",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-[rgba(16,16,32,0.6)] backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                            >
                                <div className="bg-[rgba(16,185,129,0.2)] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-emerald-100/70">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-[#0c0c1a] border-t border-emerald-900/30">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-2xl mx-auto">
                            Ready to discover innovative hackathon projects?
                        </h2>
                        <p className="text-emerald-100/80 mb-8 max-w-2xl mx-auto">
                            Start exploring our database of analyzed projects or
                            search for specific technologies and solutions
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                onClick={() => router.push("/software")}
                                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border-0 px-8 py-6 text-lg rounded-lg transition-all duration-300 w-full sm:w-auto"
                            >
                                <span className="mr-2">Start Exploring</span>
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.push("/search")}
                                className="border-emerald-500/40 hover:bg-emerald-950/30 text-emerald-300 px-8 py-6 text-lg rounded-lg transition-all duration-300 w-full sm:w-auto"
                            >
                                <span className="mr-2">Search Projects</span>
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
