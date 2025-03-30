"use client";

import { Sparkles, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { Suspense } from "react";

// Loading skeleton component
function ProjectsLoadingSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden h-[400px] animate-pulse"
                >
                    <div className="bg-emerald-900/30 h-48 w-full"></div>
                    <div className="p-5 space-y-4">
                        <div className="h-6 bg-emerald-900/30 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-emerald-900/30 rounded w-full"></div>
                            <div className="h-4 bg-emerald-900/30 rounded w-5/6"></div>
                            <div className="h-4 bg-emerald-900/30 rounded w-4/6"></div>
                        </div>
                        <div className="h-16 bg-emerald-900/20 rounded w-full"></div>
                        <div className="pt-4 flex justify-between">
                            <div className="h-4 bg-emerald-900/30 rounded w-1/4"></div>
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-emerald-900/30"></div>
                                <div className="h-8 w-8 rounded-full bg-emerald-900/30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

// Client component for the refresh functionality
export function SoftwareClientPage({ projects }: { projects: any[] }) {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <main className="min-h-screen bg-[#0a0a16] text-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,#10b981_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 container mx-auto py-12 px-4 sm:px-6">
                {/* Header Section */}
                <div className="mb-12 text-center animate-fadeIn">
                    <div className="inline-flex items-center gap-2 mb-4 bg-emerald-900/20 border border-emerald-500/20 rounded-full px-4 py-1.5">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">
                            Discover Amazing Projects
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white animate-shimmer bg-[length:200%_100%] mb-4">
                        Explore Awesome Hackathon Projects
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-emerald-100/80 mb-6">
                        Discover innovative projects created by talented
                        developers. Each project has been analyzed with our
                        AI-powered system to highlight technical excellence.
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-emerald-200 transition-all hover:-translate-y-1"
                        >
                            <Search className="h-4 w-4" />
                            <span>Advanced Search</span>
                        </Link>
                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-emerald-200 transition-all hover:-translate-y-1"
                        >
                            <RefreshCw className="h-4 w-4" />
                            <span>Refresh Projects</span>
                        </button>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    <Suspense fallback={<ProjectsLoadingSkeleton />}>
                        {projects.length > 0 ? (
                            projects.map((project: any) => (
                                <div
                                    key={project.id}
                                    className="animate-fadeIn"
                                >
                                    <ProjectCard
                                        id={project.id}
                                        title={project.title}
                                        description={project.description}
                                        techStack={project.techStack || []}
                                        image={project.image}
                                        github={project.github}
                                        devpost={project.devpost}
                                        score={project.analysis?.score}
                                        summary={project.analysis?.summary}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-emerald-300">
                                    No projects found. Try refreshing the page.
                                </p>
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
