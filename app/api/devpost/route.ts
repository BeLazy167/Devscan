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
        console.log("[API] Starting DevPost analysis request");
        const body = await req.json();
        const { id } = body;
        console.log(`[API] Processing DevPost ID: ${id}`);

        await connectToDatabase();
        console.log(`[API] Connected to database`);

        // Check for cached analysis
        console.log(`[API] Checking for cached analysis for ID: ${id}`);
        const existingAnalysis = await DevPostModel.findOne({ id });
        if (existingAnalysis) {
            console.log(`[API] Found cached analysis for ID: ${id}`);
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
        console.log(`[API] No cached analysis found, checking for raw data`);
        let rawpost = await RawDevPostModel.findOne({ id });
        if (!rawpost) {
            console.log(`[API] No raw data found, scraping DevPost`);
            const url = `https://devpost.com/software/${id}`;
            console.log(`[API] Scraping URL: ${url}`);
            const scrapeData = await scrapeDevPost(url);
            console.log(`[API] Scraping complete, extracting GitHub URL`);

            const githubRegex = /https:\/\/github\.com\/([\w.-]+\/[\w.-]+)/;
            const githubMatch = githubRegex.exec(scrapeData.markdown);
            const githubUrl = githubMatch
                ? `https://github.com/${githubMatch[1]}`
                : "Not Found";
            console.log(`[API] GitHub URL: ${githubUrl}`);

            console.log(`[API] Creating raw DevPost record`);
            rawpost = await RawDevPostModel.create({
                scrapeData,
                id,
                githubUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`[API] Raw DevPost record created`);
        } else {
            console.log(`[API] Found existing raw data for ID: ${id}`);
        }

        // Analyze the project
        console.log(`[API] Starting DevPost analysis`);
        const projectData = await analyzeDevPost(rawpost);
        console.log(`[API] DevPost analysis complete`);

        // Handle GitHub analysis safely
        console.log(`[API] Starting GitHub analysis`);
        let githubAnalysis = null;
        if (rawpost.githubUrl && rawpost.githubUrl !== "Not Found") {
            try {
                const [owner, repo] = rawpost.githubUrl.split("/").slice(3, 5);
                console.log(`[API] Analyzing GitHub repo: ${owner}/${repo}`);
                githubAnalysis = await getRepoAnalysis(owner, repo);
                console.log(`[API] GitHub analysis complete`);
            } catch (error) {
                console.error("[API] GitHub analysis failed:", error);
                githubAnalysis = {
                    error: "Failed to analyze GitHub repository",
                };
            }
        } else {
            console.log(`[API] No GitHub repository found`);
            githubAnalysis = { error: "No GitHub repository found" };
        }

        // Save and return the analyzed data
        console.log(`[API] Saving analyzed data to database`);
        const devpost = new DevPostModel({
            id,
            analysis: projectData,
            githubAnalysis,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await devpost.save();
        console.log(`[API] Analysis saved successfully`);

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
        console.error("[API] Error processing DevPost:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to process DevPost",
            },
            { status: 500 }
        );
    }
}
