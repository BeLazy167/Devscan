import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";

// Get 6-8 random projects
export async function GET() {
    try {
        await connectToDatabase();

        // Find all projects and select a random sample
        const allProjects = await DevPostModel.find({}).lean();

        // Get a random number between 6 and 8
        const count = Math.floor(Math.random() * 3) + 6;

        // Shuffle and select random projects
        const randomProjects = allProjects
            .sort(() => 0.5 - Math.random())
            .slice(0, count);

        // Transform data for the frontend
        const projects = randomProjects.map((project) => ({
            id: project.id,
            title: project.analysis?.title || project.id,
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

        return NextResponse.json({
            success: true,
            data: projects,
        });
    } catch (error: any) {
        console.error("Error fetching random projects:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch projects",
            },
            { status: 500 }
        );
    }
}
