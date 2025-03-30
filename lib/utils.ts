import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from "../config/env";

// Define response types for better type safety
export interface ScrapeResultMetadata {
    title?: string;
    description?: string;
    scrapeId?: string;
    technologies?: string[];
    team?: string[];
    github?: string;
    repository?: string;
    demo?: string;
    live?: string;
    images?: string[];
    [key: string]: any;
}

export interface ScrapeResultData {
    success: boolean;
    error?: string;
    markdown: string;
    content?: string;
    html?: string;
    rawHtml?: string;
    metadata: ScrapeResultMetadata;
    warning?: string;
    data?: any;
}

export interface ScrapeResponse {
    success: boolean;
    data?: ScrapeResultData;
    error?: string;
}

// Initialize Firecrawl with config
const firecrawl = new FirecrawlApp({
    apiKey: config.firecrawlApiKey,
});

/**
 * Scrapes a DevPost link using Firecrawl
 * @param url DevPost URL to scrape
 * @returns Scraped content or throws an error
 */
export async function scrapeDevPost(url: string): Promise<ScrapeResultData> {
    if (!config.firecrawlApiKey) {
        console.error(
            "Firecrawl API key not configured in environment variables"
        );
        throw new Error(
            "Firecrawl API key not configured in environment variables"
        );
    }

    console.log(`[Firecrawl] Starting scrape for URL: ${url}`);
    console.log(
        `[Firecrawl] Using API key: ${config.firecrawlApiKey.substring(
            0,
            5
        )}...`
    );

    try {
        // Using the Firecrawl library with standard parameters
        const scrapeResult = (await firecrawl.scrapeUrl(url, {
            formats: ["markdown"],
            onlyMainContent: false,
            timeout: 15000, // 15 second timeout
        })) as ScrapeResultData;

        if (!scrapeResult || !scrapeResult.markdown) {
            console.error(`[Firecrawl] Received empty result for ${url}`);
            throw new Error(`Firecrawl returned empty result for ${url}`);
        }

        console.log(`[Firecrawl] Scrape successful for ${url}`);
        console.log(
            `[Firecrawl] Content length: ${scrapeResult.markdown.length} characters`
        );

        // Create basic metadata if it doesn't exist
        if (!scrapeResult.metadata) {
            console.warn(
                `[Firecrawl] No metadata returned, creating placeholder`
            );
            scrapeResult.metadata = {
                title: url.split("/").pop() || "Unknown Project",
            };
        }

        return scrapeResult;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error(`[Firecrawl] Scraping error for ${url}:`, errorMessage);

        // Return a minimal valid result rather than throwing
        return {
            success: false,
            error: errorMessage,
            markdown: `Failed to scrape ${url}: ${errorMessage}`,
            metadata: {
                title: url.split("/").pop() || "Unknown Project",
                description: `Failed to load project data: ${errorMessage}`,
                error: errorMessage,
            },
        };
    }
}

/**
 * Utility function for merging class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
