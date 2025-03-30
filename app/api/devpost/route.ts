import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { Devpost, RawDevPost } from "../../../lib/models/devpost";
import { scrapeDevPost } from "../../../lib/utils";
import mongoose from "mongoose";
import { analyzeDevPost } from "@/lib/services/devpost-gemini";
import { getRepoAnalysis } from "@/lib/services/github-gemini";

// Define schemas with necessary fields
const RawDevPostSchema = new mongoose.Schema<RawDevPost>({
    scrapeData: { type: Object, required: true },
    githubUrl: { type: String }, // Added to store GitHub URL
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    id: { type: String, required: true, unique: true },
});

const DevPostSchema = new mongoose.Schema<Devpost>({
    id: { type: String, required: true, unique: true },
    analysis: { type: Object, required: true },
    githubAnalysis: { type: Object }, // Added to store GitHub analysis
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Create models
export const RawDevPostModel =
    mongoose.models.RawDevPost ||
    mongoose.model<RawDevPost>("RawDevPost", RawDevPostSchema);

export const DevPostModel =
    mongoose.models.Devpost ||
    mongoose.model<Devpost>("Devpost", DevPostSchema);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;
        await connectToDatabase();

        // Check for cached analysis
        const existingAnalysis = await DevPostModel.findOne({ id });
        if (existingAnalysis) {
            return NextResponse.json(
                {
                    success: true,
                    data: {
                        source: "cached",
                        projectData: existingAnalysis,
                    },
                },
                { status: 200 }
            );
        }

        // Get or create raw data
        let rawpost = await RawDevPostModel.findOne({ id });
        if (!rawpost) {
            const url = `https://devpost.com/software/${id}`;
            const scrapeData = await scrapeDevPost(url);

            const githubRegex = /https:\/\/github\.com\/([\w.-]+\/[\w.-]+)/;

            const githubMatch = githubRegex.exec(scrapeData.markdown);

            rawpost = await RawDevPostModel.create({
                scrapeData,
                id,
                githubUrl: githubMatch
                    ? `https://github.com/${githubMatch[1]}`
                    : "Not Found",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Analyze the project
        const projectData = await analyzeDevPost(rawpost);

        // Handle GitHub analysis safely
        let githubAnalysis = null;
        if (rawpost.githubUrl && rawpost.githubUrl !== "Not Found") {
            try {
                const [owner, repo] = rawpost.githubUrl.split("/").slice(3, 5);
                githubAnalysis = await getRepoAnalysis(owner, repo);
            } catch (error) {
                console.error("GitHub analysis failed:", error);
                githubAnalysis = {
                    error: "Failed to analyze GitHub repository",
                };
            }
        } else {
            githubAnalysis = { error: "No GitHub repository found" };
        }

        // Save and return the analyzed data
        const devpost = await DevPostModel.create({
            id,
            analysis: projectData,
            githubAnalysis,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    source: "fresh",
                    projectData: devpost,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error processing DevPost:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to process DevPost",
            },
            { status: 500 }
        );
    }
}
