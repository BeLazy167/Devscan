import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { Devpost, RawDevPost } from "../../../lib/models/devpost";
import { scrapeDevPost } from "../../../lib/utils";
import { z } from "zod";
import mongoose from "mongoose";
import { analyzeDevPost } from "@/lib/services/devpost-gemini";
// Schema for raw devpost data
const RawDevPostSchema = new mongoose.Schema<RawDevPost>({
    scrapeData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    id: { type: String, required: true, unique: true },
});
const DevPostSchema = new mongoose.Schema<Devpost>({
    id: { type: String, required: true, unique: true },
    analysis: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Model for raw devpost data (create if it doesn't exist)
export const RawDevPostModel =
    mongoose.models.RawDevPost ||
    mongoose.model<RawDevPost>("RawDevPost", RawDevPostSchema);

export const DevPostModel =
    mongoose.models.Devpost ||
    mongoose.model<Devpost>("Devpost", DevPostSchema);

// Validation schema for request body

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id } = body;
        await connectToDatabase();

        // First check if we already have analyzed data
        const existingAnalysis = await DevPostModel.findOne({ id });
        if (existingAnalysis) {
            console.log(
                `Analysis already exists for project ${id}, returning cached data`
            );
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

        // Check if we have raw data but not analyzed
        const existingRaw = await RawDevPostModel.findOne({ id });
        let rawpost;

        if (existingRaw) {
            console.log(`Raw data exists for ${id}, analyzing...`);
            rawpost = existingRaw;
        } else {
            // Need to scrape
            console.log(`No data for ${id}, scraping from DevPost...`);
            const url = `https://devpost.com/software/${id}`;
            const scrapeData = await scrapeDevPost(url);

            // Save raw data
            rawpost = await RawDevPostModel.create({
                scrapeData,
                id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Analyze data
        const projectData = await analyzeDevPost(rawpost);

        // Save to database
        await DevPostModel.create({
            analysis: projectData,
            createdAt: new Date(),
            updatedAt: new Date(),
            id,
        });

        return NextResponse.json(
            {
                success: true,
                data: {
                    source: existingRaw ? "analyzed_existing" : "fresh",
                    projectData,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in DevPost processing:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to process DevPost",
            },
            { status: 500 }
        );
    }
}
