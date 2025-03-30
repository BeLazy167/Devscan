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
        throw new Error(
            "Firecrawl API key not configured in environment variables"
        );
    }

    try {
        // Using the Firecrawl library with standard parameters
        const scrapeResult = (await firecrawl.scrapeUrl(url, {
            formats: ["markdown"],
            onlyMainContent: false,
        })) as ScrapeResultData;
        return scrapeResult;
    } catch (error) {
        console.error("Firecrawl scraping error:", error);
        throw error;
    }
}

/**
 * Utility function for merging class names
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
