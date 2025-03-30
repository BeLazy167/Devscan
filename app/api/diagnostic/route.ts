import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { config } from "@/config/env";
import { default as FirecrawlApp } from "@mendable/firecrawl-js";
import mongoose from "mongoose";
import { DevPostModel, RawDevPostModel } from "../devpost/route";

interface DiagnosticResult {
    timestamp: string;
    environment: {
        mongodbUri: string;
        githubToken: string;
        geminiApiKey: string;
        firecrawlApiKey: string;
    };
    database: {
        status: string;
        connected: boolean;
        collections: string[];
        error: string | null;
    };
    apis: {
        firecrawl: {
            status: string;
            error: string | null;
        };
    };
    devpost: {
        totalProjects: number;
        rawProjects: number;
        recentProjects: Array<{
            id: string;
            createdAt: Date;
            hasAnalysis: boolean;
            hasGithubAnalysis: boolean;
        }>;
    };
}

// Diagnostic utility to check API keys and connections
export async function GET(req: NextRequest) {
    const diagnostics: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        environment: {
            mongodbUri: config.mongodbUri ? "Configured" : "Missing",
            githubToken: config.githubToken ? "Configured" : "Missing",
            geminiApiKey: config.geminiApiKey ? "Configured" : "Missing",
            firecrawlApiKey: config.firecrawlApiKey ? "Configured" : "Missing",
        },
        database: {
            status: "Not checked",
            connected: false,
            collections: [],
            error: null,
        },
        apis: {
            firecrawl: {
                status: "Not checked",
                error: null,
            },
        },
        devpost: {
            totalProjects: 0,
            rawProjects: 0,
            recentProjects: [],
        },
    };

    // Check database connection
    try {
        await connectToDatabase();
        diagnostics.database.status = "Connected";
        diagnostics.database.connected = true;

        // Get collections info
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db
                .listCollections()
                .toArray();
            diagnostics.database.collections = collections.map((c) => c.name);

            // Check project counts
            diagnostics.devpost.totalProjects =
                await DevPostModel.countDocuments();
            diagnostics.devpost.rawProjects =
                await RawDevPostModel.countDocuments();

            // Get recent projects
            const recentProjects = await DevPostModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean();

            diagnostics.devpost.recentProjects = recentProjects.map((p) => ({
                id: p.id,
                createdAt: p.createdAt,
                hasAnalysis: !!p.analysis,
                hasGithubAnalysis: !!p.githubAnalysis,
            }));
        } else {
            diagnostics.database.status =
                "Connected but DB reference unavailable";
        }
    } catch (error: any) {
        diagnostics.database.status = "Error";
        diagnostics.database.error = error.message || "Unknown database error";
    }

    // Check Firecrawl API
    if (config.firecrawlApiKey) {
        try {
            const firecrawl = new FirecrawlApp({
                apiKey: config.firecrawlApiKey,
            });

            // Just check API key validity, don't actually scrape to avoid unnecessary costs
            diagnostics.apis.firecrawl.status =
                "API key configured, but not tested";
        } catch (error: any) {
            diagnostics.apis.firecrawl.status = "Error initializing";
            diagnostics.apis.firecrawl.error =
                error.message || "Unknown Firecrawl error";
        }
    } else {
        diagnostics.apis.firecrawl.status = "API key missing";
    }

    return NextResponse.json(diagnostics);
}
