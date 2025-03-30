"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";

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

function DevpostClient({ id }: DevpostClientProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["devpost", id],
        queryFn: async () => {
            const response = await fetch(`/api/devpost`, {
                method: "POST",
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Failed to fetch devpost data");
            return response.json();
        },
        enabled: !!id,
    });

    if (isLoading) return <ProjectDetailLoading />;

    if (error)
        return (
            <div className="text-red-400">
                Error loading project: {(error as Error).message}
            </div>
        );

    // The API returns data in this format: { success: true, data: { source: "cached", projectData: {...} } }
    const projectData = data?.data?.projectData || {};
    const analysisData = projectData?.analysis || {};

    return (
        <ProjectDetail
            hackathonId={id}
            devpostData={{
                id: analysisData.id,
                title: analysisData.title,
                description: analysisData.description,
                url: analysisData.url,
                techStack: analysisData.details?.techStack || [],
                imageUrls: analysisData.gallery?.images || [],
                teamMembers:
                    analysisData.team?.map((t: TeamMember) => t.name) || [],
                analysis: analysisData.summary || {},
                repoUrl: analysisData.details?.links?.github,
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
