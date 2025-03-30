import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";
import { Suspense } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";
import { redirect } from "next/navigation";
import { scrapeDevPost } from "@/lib/utils";
import { analyzeDevPost } from "@/lib/services/devpost-gemini";
import { getRepoAnalysis } from "@/lib/services/github-gemini";

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
export async function generateMetadata({ params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const project = (await DevPostModel.findOne({
            id: params.id,
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

// Fetch or analyze project data
async function getOrAnalyzeProject(id: string) {
    try {
        await connectToDatabase();

        // First check if we already have analysis data
        let project = (await DevPostModel.findOne({
            id,
        }).lean()) as DevPostDocument | null;

        if (project) {
            console.log(`Found existing analysis for ${id}`);
            return {
                id: project.id,
                title: project.analysis?.title || project.id,
                description: project.analysis?.description || "",
                techStack: project.analysis?.details?.techStack || [],
                imageUrls: project.analysis?.gallery?.images || [],
                url: project.analysis?.url,
                teamMembers: project.analysis?.team?.map((t) => t.name) || [],
                team: project.analysis?.team || [],
                analysis: project.analysis?.summary || {},
                repoUrl: project.analysis?.details?.links?.github,
                githubAnalysis: project.githubAnalysis || null,
            };
        }

        console.log(`No existing data for ${id}, analyzing...`);

        // Need to analyze the project
        // Start by scraping the DevPost page
        const url = `https://devpost.com/software/${id}`;
        const scrapeData = await scrapeDevPost(url);

        // Extract GitHub repo link if available
        const pattern = /\[GitHub Repo\]\(([^ ]+)\)/;
        const match = scrapeData.markdown.match(pattern);
        const githubUrl = match ? match[1] : "Not Found";

        // Create raw data object
        const rawpost = {
            scrapeData,
            id,
            githubUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            // Analyze the data in parallel
            console.log(`Analyzing project ${id}...`);
            const [projectData, githubAnalysis] = await Promise.all([
                analyzeDevPost(rawpost),
                githubUrl !== "Not Found"
                    ? getRepoAnalysis(
                          githubUrl.split("/")[3],
                          githubUrl.split("/")[4]
                      )
                    : null,
            ]);

            // Save analysis result to database
            const newProject = await DevPostModel.create({
                id,
                analysis: projectData,
                githubAnalysis,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Return formatted data for the UI
            return {
                id: id,
                title: projectData.title || id,
                description: projectData.description || "",
                techStack: projectData.details?.techStack || [],
                imageUrls: projectData.gallery?.images || [],
                url: projectData.url || url,
                teamMembers: projectData.team?.map((t: any) => t.name) || [],
                team: projectData.team || [],
                analysis: projectData.summary || {},
                repoUrl: githubUrl !== "Not Found" ? githubUrl : null,
                githubAnalysis: githubAnalysis || null,
            };
        } catch (error) {
            console.error(`Error analyzing project ${id}:`, error);

            // Even if analysis fails, return basic data from scrape
            return {
                id: id,
                title: scrapeData.metadata?.title || id,
                description:
                    scrapeData.metadata?.description ||
                    "No description available.",
                techStack: [],
                imageUrls:
                    scrapeData.metadata?.images &&
                    scrapeData.metadata.images.length > 0
                        ? scrapeData.metadata.images
                        : [],
                url: url,
                teamMembers: [],
                team: [],
                analysis: {},
                repoUrl: githubUrl !== "Not Found" ? githubUrl : null,
                githubAnalysis: null,
            };
        }
    } catch (error) {
        console.error("Error processing project:", error);
        // Return null and let the caller handle the case
        return null;
    }
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const projectData = await getOrAnalyzeProject(resolvedParams.id);

    if (!projectData) {
        // Only redirect if we couldn't get any data
        redirect("/software");
    }

    return (
        <Suspense fallback={<ProjectDetailLoading />}>
            <ProjectDetail
                projectId={resolvedParams.id}
                devpostData={projectData}
            />
        </Suspense>
    );
}
