"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

interface DevpostClientProps {
    id: string;
}

interface TeamMember {
    name: string;
    role?: string;
    avatar?: string;
    links?: Record<string, string>;
}

// Enhanced project data type to include GitHub analysis
interface ProjectData {
    id: string;
    title: string;
    description: string;
    url?: string;
    techStack: string[];
    imageUrls: string[];
    teamMembers: string[];
    team: TeamMember[];
    summary: any;
    repoUrl?: string;
    githubAnalysis?: {
        summary: string;
        technicalHighlights: string;
        keyFeatures: string[];
        complexity: string;
        useCases: string[];
        improvements: string[];
        lastAnalyzed: string;
        analysisQuality: string;
    };
}

function DevpostClient({ id }: DevpostClientProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["devpost", id],
        queryFn: async () => {
            console.log(`[Client] Fetching data for project ID: ${id}`);
            const response = await fetch(`/api/devpost`, {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `[Client] API request failed: ${response.status} ${response.statusText}`
                );
                console.error(`[Client] Error response: ${errorText}`);
                throw new Error(
                    `Failed to fetch devpost data: ${response.status} ${response.statusText}`
                );
            }

            const responseData = await response.json();
            console.log(
                `[Client] Received response for ${id}:`,
                responseData.success ? "Success" : "Failed",
                `Source: ${responseData.data?.source || "unknown"}`
            );
            return responseData;
        },
        enabled: !!id,
        retry: 2,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    });

    if (isLoading) return <ProjectDetailLoading />;

    if (error) {
        console.error(`[Client] Error loading project:`, error);
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-400 mb-4">
                    Error loading project: {(error as Error).message}
                </div>
                <div className="flex flex-col md:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        Retry Loading
                    </Button>
                    <Button
                        onClick={() => window.open("/api/diagnostic", "_blank")}
                        variant="outline"
                        className="border-emerald-500/40 text-emerald-300"
                    >
                        Run Diagnostics
                    </Button>
                </div>
                <p className="mt-6 text-sm text-emerald-100/60 max-w-xl mx-auto">
                    If this issue persists, try checking the diagnostic tools to
                    ensure the backend API services and database connections are
                    working properly.
                </p>
            </div>
        );
    }

    // The API returns data in this format: { success: true, data: { source: "cached", projectData: {...} } }
    const projectData = data?.data?.projectData || {};
    const analysisData = projectData?.analysis || {};
    const githubAnalysis = projectData?.githubAnalysis || {};

    console.log(
        `[Client] Project data:`,
        `ID: ${projectData.id || "missing"}`,
        `Has analysis: ${
            !!analysisData && Object.keys(analysisData).length > 0
        }`,
        `Has GitHub analysis: ${
            !!githubAnalysis && Object.keys(githubAnalysis).length > 0
        }`
    );

    // Map data to a more structured format
    const enhancedData: ProjectData = {
        id: analysisData.id || id,
        title: analysisData.title || "Untitled Project",
        description: analysisData.description || "No description available",
        url: analysisData.url,
        techStack: analysisData.details?.techStack || [],
        imageUrls: analysisData.gallery?.images || [],
        teamMembers: analysisData.team?.map((t: TeamMember) => t.name) || [],
        team: analysisData.team || [],
        summary: analysisData.summary || {},
        repoUrl: analysisData.details?.links?.github,
        githubAnalysis: githubAnalysis,
    };

    return (
        <ProjectDetail
            devpostData={{
                id: enhancedData.id,
                title: enhancedData.title,
                description: enhancedData.description,
                url: enhancedData.url,
                techStack: enhancedData.techStack,
                imageUrls: enhancedData.imageUrls,
                teamMembers: enhancedData.teamMembers,
                team: enhancedData.team,
                analysis: enhancedData.summary,
                repoUrl: enhancedData.repoUrl,
                githubAnalysis: enhancedData.githubAnalysis,
            }}
        />
    );
}

export default function ClientPage({ id }: DevpostClientProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <DevpostClient id={id} />
        </QueryClientProvider>
    );
}
