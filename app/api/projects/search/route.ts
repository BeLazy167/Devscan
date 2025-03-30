import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DevPostModel } from "@/app/api/devpost/route";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        // Extract query parameters
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get("query")?.toLowerCase() || "";
        const tech = searchParams.get("tech")?.toLowerCase() || "";
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        // Build MongoDB query
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

        // Execute query with pagination
        const total = await DevPostModel.countDocuments(filter);
        const projects = await DevPostModel.find(filter)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Transform data for the frontend
        const results = projects.map((project) => ({
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

        return NextResponse.json({
            success: true,
            data: {
                results,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("Error searching projects:", error);
        return NextResponse.json(
            { success: false, error: "Failed to search projects" },
            { status: 500 }
        );
    }
}

// Helper function to calculate a score based on GitHub analysis
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
