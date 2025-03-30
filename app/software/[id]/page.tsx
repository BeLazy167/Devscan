import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";
import { redirect } from "next/navigation";
import ClientPage from "./client-page";

// TypeScript interface to help with type checking
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
        team?: Array<{
            name: string;
            role?: string;
            avatar?: string;
            links?: Record<string, string>;
        }>;
        summary?: any;
    };
    githubAnalysis?: any;
    [key: string]: any;
}

// Generate title and description for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    try {
        await connectToDatabase();
        const project = (await DevPostModel.findOne({
            id: resolvedParams.id,
        }).lean()) as DevPostDocument | null;

        if (!project) {
            return {
                title: "Project Details",
                description: "Analyzing project data...",
            };
        }

        return {
            title: `${
                project.analysis?.title || project.id
            } | AI-Analyzed Project`,
            description:
                project.analysis?.description ||
                "View detailed project analysis with AI-powered insights",
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {
            title: "Project Details",
            description:
                "View detailed project analysis with AI-powered insights",
        };
    }
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;

    // Instead of analyzing directly, use the client component that calls the API
    return (
        <Suspense fallback={<ProjectDetailLoading />}>
            <ClientPage id={resolvedParams.id} />
        </Suspense>
    );
}
