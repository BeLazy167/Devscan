import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";
import { SoftwareClientPage } from "./software-client";

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
    };
    githubAnalysis?: {
        summary: string;
        [key: string]: any;
    };
    [key: string]: any;
}

// Directly fetch the data from MongoDB instead of using fetch API
async function getRandomProjects() {
    try {
        await connectToDatabase();

        // Find all projects - using any for simplicity with Mongoose types
        const allProjects = await DevPostModel.find({}).lean();

        // Get a random number between 6 and 8
        const count = Math.floor(Math.random() * 3) + 6;

        // Shuffle and select random projects
        const randomProjects = allProjects
            .sort(() => 0.5 - Math.random())
            .slice(0, count);

        // Transform data for the frontend
        return randomProjects.map((project) => ({
            id: project.id || "",
            title: project.id || "",
            description: project.analysis?.description || "",
            techStack: project.analysis?.details?.techStack || [],
            image: project.analysis?.gallery?.images?.[0] || "",
            github: project.analysis?.details?.links?.github || "",
            devpost: project.analysis?.details?.links?.devpost || "",
            analysis: project.githubAnalysis
                ? {
                      summary: project.githubAnalysis.summary,
                      score: Math.floor(Math.random() * 20) + 80, // Random score between 80-99
                  }
                : null,
        }));
    } catch (error) {
        console.error("Error fetching random projects:", error);
        return [];
    }
}

export default async function SoftwarePage() {
    const projects = await getRandomProjects();

    // Use the client component to render the UI
    return <SoftwareClientPage projects={projects} />;
}
