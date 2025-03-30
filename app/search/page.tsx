import { ProjectCard } from "@/components/project-card";
import { SearchBar } from "@/components/search-bar";
import { Pagination } from "@/components/pagination";
import { Suspense } from "react";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";

// This interface represents the shape of our project data from MongoDB
interface DevPostDocument {
    id: string;
    analysis?: {
        title?: string;
        description?: string;
        details?: {
            techStack?: string[];
            links?: {
                github?: string;
                devpost?: string;
            };
        };
        gallery?: {
            images?: string[];
        };
        url?: string;
    };
    githubAnalysis?: {
        summary: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// This function fetches projects based on search parameters
async function searchProjects(
    queryParam: string = "",
    techParam: string = "",
    pageParam: number = 1
) {
    try {
        await connectToDatabase();

        // Use the extracted parameters
        const query = queryParam.toLowerCase();
        const tech = techParam.toLowerCase();
        const page = pageParam;
        const limit = 9; // Number of results per page
        const skip = (page - 1) * limit;

        // Build MongoDB query based on search parameters
        const filter: any = {};

        if (query) {
            filter.$or = [
                { "analysis.title": { $regex: query, $options: "i" } },
                { "analysis.description": { $regex: query, $options: "i" } },
                { id: { $regex: query, $options: "i" } },
                { "githubAnalysis.summary": { $regex: query, $options: "i" } },
            ];
        }

        if (tech) {
            filter["analysis.details.techStack"] = {
                $regex: tech,
                $options: "i",
            };
        }

        // Count total matching documents for pagination
        const total = await DevPostModel.countDocuments(filter);

        // If no search parameters, return a selection of featured projects
        if (!query && !tech) {
            const featuredProjects = await DevPostModel.find({})
                .sort({ updatedAt: -1 }) // Sort by most recently updated
                .skip(skip)
                .limit(limit)
                .lean();

            return {
                projects: transformProjects(featuredProjects),
                pagination: {
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }

        // Execute the search query
        const searchResults = await DevPostModel.find(filter)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            projects: transformProjects(searchResults),
            pagination: {
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Error searching projects:", error);
        return {
            projects: [],
            pagination: {
                total: 0,
                currentPage: 1,
                totalPages: 0,
            },
        };
    }
}

// Helper function to transform database results to UI format
function transformProjects(projects: any[]) {
    return projects.map((project) => ({
        id: project.id || "",
        title: project.analysis?.title || project.id || "",
        description: project.analysis?.description || "",
        techStack: project.analysis?.details?.techStack || [],
        image: project.analysis?.gallery?.images?.[0] || "",
        github: project.analysis?.details?.links?.github || "",
        devpost: project.analysis?.details?.links?.devpost || "",
        analysis: project.githubAnalysis
            ? {
                  summary: project.githubAnalysis.summary,
                  score: calculateScore(project.githubAnalysis),
              }
            : null,
    }));
}

// Calculate a project score based on GitHub analysis metrics
function calculateScore(githubAnalysis: any): number {
    if (!githubAnalysis) return 70;

    // Base score
    let score = 80;

    // Add points for various factors
    if (githubAnalysis.keyFeatures?.length > 3) score += 5;
    if (githubAnalysis.complexity?.includes("high")) score += 5;
    if (githubAnalysis.useCases?.length > 2) score += 5;
    if (githubAnalysis.technicalHighlights?.length > 100) score += 5;

    // Cap the score at 99
    return Math.min(score, 99);
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Extract search parameters safely
    const queryParam =
        typeof searchParams.query === "string" ? searchParams.query : "";
    const techParam =
        typeof searchParams.tech === "string" ? searchParams.tech : "";
    const pageParam = parseInt(
        typeof searchParams.page === "string" ? searchParams.page : "1"
    );

    // Call searchProjects with extracted parameters
    const { projects, pagination } = await searchProjects(
        queryParam,
        techParam,
        pageParam
    );

    // Determine appropriate heading text based on search parameters
    const headingText =
        queryParam && techParam
            ? `Search results for "${queryParam}" with technology "${techParam}"`
            : queryParam
            ? `Search results for "${queryParam}"`
            : techParam
            ? `Projects using ${techParam}`
            : "Browse All Projects";

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
                        <Search className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">
                            Find Projects
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white animate-shimmer bg-[length:200%_100%] mb-4">
                        Search Hackathon Projects
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg text-emerald-100/80 mb-8">
                        Find innovative projects by searching keywords,
                        technologies, or browse our collection.
                    </p>

                    {/* Search bar component */}
                    <Suspense>
                        <SearchBar />
                    </Suspense>
                </div>

                {/* Search Results Heading */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-emerald-100">
                        {headingText}
                    </h2>

                    {pagination.total > 0 && (
                        <p className="text-sm text-emerald-300">
                            {pagination.total}{" "}
                            {pagination.total === 1 ? "project" : "projects"}{" "}
                            found
                        </p>
                    )}
                </div>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
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
                                <p className="text-emerald-300 mb-4">
                                    No projects found matching your search
                                    criteria.
                                </p>
                                <Link
                                    href="/search"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg text-emerald-200 transition-all"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Clear filters</span>
                                </Link>
                            </div>
                        )}
                    </Suspense>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        className="mt-8"
                    />
                )}
            </div>
        </main>
    );
}

// Loading skeleton
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
