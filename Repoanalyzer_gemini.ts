import { Octokit } from "@octokit/rest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/env";
import PrismaService from "./PrismaService";
import RedisService from "./RedisService";
import { z } from "zod";

interface RepoAnalysis {
    summary: string;
    technicalHighlights: string;
    keyFeatures: string[];
    complexity: string;
    useCases: string[];
    improvements: string[];
    lastAnalyzed: string;
    analysisQuality: "basic" | "detailed";
}

const MAX_FILES_TO_ANALYZE = 30;
const IMPORTANT_FILES = [
    "README.md",
    "package.json",
    "requirements.txt",
    "go.mod",
    "pom.xml",
    "build.gradle",
];

export class RepoAnalyzerGemini {
    private static instance: RepoAnalyzerGemini;
    private prisma: PrismaService;
    private redis: RedisService;
    private octokit: Octokit;
    private genAI: GoogleGenerativeAI;
    private model: any;

    private constructor() {
        if (!config.geminiApiKey) {
            throw new Error("Gemini API key is not configured");
        }

        this.prisma = PrismaService.getInstance();
        this.redis = RedisService.getInstance();
        this.octokit = new Octokit({ auth: config.githubToken });
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);

        // Define the response schema for repository analysis
        const schema = {
            summary: {
                type: "string",
                description: "2-3 impactful sentences about technical overview",
            },
            technicalHighlights: {
                type: "string",
                description: "Detailed analysis of architecture and tech stack",
            },
            keyFeatures: {
                type: "array",
                description: "3-5 most impressive technical achievements",
                items: {
                    type: "string",
                },
            },
            complexity: {
                type: "string",
                description: "2 sentences about technical sophistication",
            },
            useCases: {
                type: "array",
                description: "Potential use cases",
                items: {
                    type: "string",
                },
            },
            improvements: {
                type: "array",
                description: "Suggested improvements",
                items: {
                    type: "string",
                },
            },
        };

        // Use gemini-pro for text generation
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1000,
                topK: 1,
                topP: 0.7,
                candidateCount: 1,
            },
        });
    }

    public static getInstance(): RepoAnalyzerGemini {
        if (!RepoAnalyzerGemini.instance) {
            RepoAnalyzerGemini.instance = new RepoAnalyzerGemini();
        }
        return RepoAnalyzerGemini.instance;
    }

    private async getFromDatabase(
        owner: string,
        repo: string
    ): Promise<RepoAnalysis | null> {
        const analysis = await this.prisma.getClient().repoAnalysis.findUnique({
            where: {
                owner_repo: {
                    owner,
                    repo,
                },
            },
        });

        if (!analysis) return null;

        return {
            summary: analysis.summary,
            technicalHighlights: analysis.technicalHighlights,
            keyFeatures: analysis.keyFeatures,
            complexity: analysis.complexity,
            useCases: analysis.useCases,
            improvements: analysis.improvements,
            lastAnalyzed: analysis.lastAnalyzed.toISOString(),
            analysisQuality: "detailed" as const,
        };
    }

    private async saveToDatabase(
        owner: string,
        repo: string,
        data: RepoAnalysis
    ): Promise<void> {
        await this.prisma.getClient().repoAnalysis.upsert({
            where: {
                owner_repo: {
                    owner,
                    repo,
                },
            },
            create: {
                owner,
                repo,
                summary: data.summary,
                technicalHighlights: data.technicalHighlights,
                keyFeatures: data.keyFeatures,
                complexity: data.complexity,
                useCases: data.useCases,
                improvements: data.improvements,
                lastAnalyzed: new Date(data.lastAnalyzed),
            },
            update: {
                summary: data.summary,
                technicalHighlights: data.technicalHighlights,
                keyFeatures: data.keyFeatures,
                complexity: data.complexity,
                useCases: data.useCases,
                improvements: data.improvements,
                lastAnalyzed: new Date(data.lastAnalyzed),
            },
        });
    }

    private sanitizeContent(content: string): string {
        const MAX_FILE_SIZE = 50000; // 50KB per file
        const TRUNCATED_INDICATOR = "\n...[truncated due to size]...\n";

        return content.length > MAX_FILE_SIZE
            ? content.slice(0, MAX_FILE_SIZE) + TRUNCATED_INDICATOR
            : content.replace(/[^\x20-\x7E]/g, ""); // Remove non-ASCII characters
    }

    private async getRepoContent(owner: string, repo: string): Promise<string> {
        console.log(`[Repo Analysis] Fetching content for ${owner}/${repo}`);
        try {
            // Add timeout for GitHub API calls
            const timeoutSignal = AbortSignal.timeout(30000);

            // Get default branch with timeout
            const { data: repoInfo } = await this.octokit.repos.get({
                owner,
                repo,
                request: { signal: timeoutSignal },
            });
            console.log(
                `[Repo Analysis] Found repository with default branch: ${repoInfo.default_branch}`
            );
            const defaultBranch = repoInfo.default_branch;

            // Get repository tree
            const { data: tree } = await this.octokit.git.getTree({
                owner,
                repo,
                tree_sha: defaultBranch,
                recursive: "1",
            });
            console.log(
                `[Repo Analysis] Retrieved tree with ${tree.tree.length} files`
            );

            // Prioritize important files first
            const allFiles = tree.tree.filter(
                (file) => file.path && file.type === "blob"
            );
            const importantFiles = allFiles.filter((file) =>
                IMPORTANT_FILES.some((important) =>
                    file.path?.endsWith(important)
                )
            );
            console.log(
                `[Repo Analysis] Found ${importantFiles.length} important files`
            );

            const otherFiles = allFiles
                .filter((file) => {
                    const path = file.path?.toLowerCase();
                    return (
                        path &&
                        (path.endsWith(".md") ||
                            path.endsWith(".js") ||
                            path.endsWith(".ts") ||
                            path.endsWith(".py") ||
                            path.endsWith(".go") ||
                            path.endsWith(".java"))
                    );
                })
                .slice(0, MAX_FILES_TO_ANALYZE - importantFiles.length);
            console.log(
                `[Repo Analysis] Selected ${otherFiles.length} additional files`
            );

            const filesToAnalyze = [...importantFiles, ...otherFiles];
            if (filesToAnalyze.length === 0) {
                console.log(
                    `[Repo Analysis] No suitable files found for analysis`
                );
                // Create a minimal content string with repo information
                return `Repository: ${owner}/${repo}
Default Branch: ${defaultBranch}
Description: ${repoInfo.description || "No description available"}
Language: ${repoInfo.language || "Not specified"}
Topics: ${repoInfo.topics?.join(", ") || "None"}
Created: ${repoInfo.created_at}
Last Updated: ${repoInfo.updated_at}
Stars: ${repoInfo.stargazers_count}
Forks: ${repoInfo.forks_count}`;
            }

            // Get content of files in parallel
            console.log(
                `[Repo Analysis] Fetching content for ${filesToAnalyze.length} files`
            );
            const fileContents = await Promise.all(
                filesToAnalyze.map(async (file) => {
                    try {
                        const { data } = await this.octokit.repos.getContent({
                            owner,
                            repo,
                            path: file.path!,
                            request: { signal: timeoutSignal },
                        });

                        if ("content" in data) {
                            return {
                                path: file.path,
                                content: this.sanitizeContent(
                                    Buffer.from(
                                        data.content,
                                        "base64"
                                    ).toString()
                                ),
                            };
                        }
                        console.warn(
                            `[Repo Analysis] No content found for ${file.path}`
                        );
                        return null;
                    } catch (error) {
                        console.warn(
                            `[Repo Analysis] Failed to fetch ${file.path}:`,
                            error
                        );
                        return {
                            path: file.path,
                            content: "[Content Unavailable]",
                        }; // Graceful degradation
                    }
                })
            );

            const validContents = fileContents.filter(Boolean);
            console.log(
                `[Repo Analysis] Successfully fetched ${validContents.length} files`
            );

            if (validContents.length === 0) {
                // If no file contents were retrieved, return repository information
                return `Repository: ${owner}/${repo}
Default Branch: ${defaultBranch}
Description: ${repoInfo.description || "No description available"}
Language: ${repoInfo.language || "Not specified"}
Topics: ${repoInfo.topics?.join(", ") || "None"}
Created: ${repoInfo.created_at}
Last Updated: ${repoInfo.updated_at}
Stars: ${repoInfo.stargazers_count}
Forks: ${repoInfo.forks_count}`;
            }

            return validContents
                .map((file) => `File: ${file?.path}\n\n${file?.content}`)
                .join("\n\n---\n\n");
        } catch (error: any) {
            console.error(
                `[Repo Analysis] Error fetching content for ${owner}/${repo}:`,
                error
            );
            if (error.name === "AbortError") {
                throw new Error(
                    `Repository analysis timed out for ${owner}/${repo}`
                );
            }
            if (error.status === 404) {
                throw new Error(`Repository ${owner}/${repo} not found`);
            }
            if (error.status === 403) {
                throw new Error(
                    `Rate limit exceeded or access denied for ${owner}/${repo}`
                );
            }
            throw error;
        }
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private isValidJson(str: string): boolean {
        try {
            const parsed = JSON.parse(str);
            // Check if all required fields are present
            return (
                typeof parsed === "object" &&
                parsed !== null &&
                "summary" in parsed &&
                "technicalHighlights" in parsed &&
                "keyFeatures" in parsed &&
                "complexity" in parsed &&
                "useCases" in parsed &&
                "improvements" in parsed
            );
        } catch {
            return false;
        }
    }

    private async analyzeWithGemini(content: string): Promise<RepoAnalysis> {
        const MAX_RETRIES = 3;
        let retries = 0;

        while (retries <= MAX_RETRIES) {
            try {
                const timeLabel = `[AI Analysis] Completion time ${Date.now()}`;
                console.log(
                    `[AI Analysis] Starting analysis (attempt ${retries + 1}/${
                        MAX_RETRIES + 1
                    })`
                );
                console.time(timeLabel);

                const prompt = `You are analyzing GitHub repositories to provide clear, concise technical assessments.
Focus on the core technical aspects and provide a brief, focused analysis.

IMPORTANT: Your response must be a valid JSON object with EXACTLY this structure:
{
    "summary": "One clear sentence about what the project does and its main technology stack",
    "technicalHighlights": "A focused paragraph describing the core technical implementation and architecture. Include the main technologies, patterns, and notable technical decisions.",
    "keyFeatures": [
        "5 key technical features, each in one line",
        "Focus on specific technical implementations",
        "Mention actual technologies and patterns used",
        "Highlight concrete technical achievements",
        "Note specific technical integrations"
    ],
    "complexity": "Two short sentences about code structure and organization",
    "useCases": ["2-3 specific technical applications"],
    "improvements": ["2-3 concrete technical suggestions"]
}

Guidelines:
1. Keep technicalHighlights as a SINGLE STRING PARAGRAPH, not an array
2. Be specific and technical
3. Keep descriptions short and focused
4. Name actual technologies and patterns
5. Focus on technical implementation details

Repository Content to Analyze:
${content}

Remember: Output ONLY the JSON object, no additional text or formatting.`;

                const result = await this.model.generateContent(prompt);
                const response = result.response;

                if (!response || !response.text()) {
                    throw new Error("Failed to get analysis from Gemini");
                }

                const responseText = response.text().trim();

                // Validate JSON before parsing
                if (!this.isValidJson(responseText)) {
                    console.error(
                        "[AI Analysis] Invalid JSON response:",
                        responseText
                    );
                    throw new Error("Invalid JSON response from Gemini");
                }

                // Parse the JSON response
                const parsedJson = JSON.parse(responseText);

                // Create the analysis object with the parsed JSON
                const parsedAnalysis: RepoAnalysis = {
                    summary: parsedJson.summary,
                    technicalHighlights: parsedJson.technicalHighlights,
                    keyFeatures: parsedJson.keyFeatures,
                    complexity: parsedJson.complexity,
                    useCases: parsedJson.useCases,
                    improvements: parsedJson.improvements,
                    lastAnalyzed: new Date().toISOString(),
                    analysisQuality: "detailed" as const,
                };

                console.timeEnd(timeLabel);
                return parsedAnalysis;
            } catch (error: any) {
                console.error("[AI Analysis] Error:", error);

                // Handle rate limiting specifically
                if (error.status === 429) {
                    console.log(
                        "[AI Analysis] Rate limit hit, implementing backoff..."
                    );
                    const backoffTime = Math.min(
                        1000 * Math.pow(2, retries),
                        10000
                    ); // Max 10 second delay
                    await this.sleep(backoffTime);
                }

                if (retries === MAX_RETRIES) {
                    // On final retry, if it's a rate limit issue, create a basic analysis
                    if (error.status === 429) {
                        console.log(
                            "[AI Analysis] Rate limit persisted, falling back to basic analysis"
                        );
                        return {
                            summary:
                                "Analysis temporarily unavailable due to rate limiting.",
                            technicalHighlights:
                                "Technical analysis will be available once rate limits reset.",
                            keyFeatures: [
                                "Rate limit exceeded - please try again later",
                            ],
                            complexity:
                                "Analysis pending due to API limitations.",
                            useCases: ["Please retry analysis later"],
                            improvements: [
                                "Retry analysis when API quota resets",
                            ],
                            lastAnalyzed: new Date().toISOString(),
                            analysisQuality: "basic" as const,
                        };
                    }
                    throw error;
                }

                retries++;
                // Exponential backoff for other errors
                await this.sleep(1000 * Math.pow(2, retries));
            }
        }
        throw new Error("Max retries exceeded for AI analysis");
    }

    private async getFromCache(
        owner: string,
        repo: string
    ): Promise<RepoAnalysis | null> {
        try {
            const cacheKey = this.redis.generateKey(
                "repo-analysis",
                owner,
                repo
            );
            const cached = await this.redis.getHash<RepoAnalysis>(cacheKey);

            if (cached) {
                // Validate the cached data has all required fields
                if (this.isValidAnalysis(cached)) {
                    console.log(
                        `[Cache] Found valid analysis for ${owner}/${repo}`
                    );
                    return cached;
                } else {
                    console.warn(
                        `[Cache] Found invalid analysis for ${owner}/${repo}, removing from cache`
                    );
                    await this.redis.delete(cacheKey);
                }
            }
            return null;
        } catch (error) {
            console.error(
                `[Cache] Error retrieving analysis for ${owner}/${repo}:`,
                error
            );
            return null;
        }
    }

    private async saveToCache(
        owner: string,
        repo: string,
        data: RepoAnalysis
    ): Promise<void> {
        try {
            if (!this.isValidAnalysis(data)) {
                console.warn(
                    `[Cache] Attempted to cache invalid analysis for ${owner}/${repo}`
                );
                return;
            }
            const cacheKey = this.redis.generateKey(
                "repo-analysis",
                owner,
                repo
            );
            const success = await this.redis.setHash(cacheKey, data);
            if (success) {
                console.log(`[Cache] Saved analysis for ${owner}/${repo}`);
            } else {
                console.warn(
                    `[Cache] Failed to save analysis for ${owner}/${repo}`
                );
            }
        } catch (error) {
            console.error(
                `[Cache] Error saving analysis for ${owner}/${repo}:`,
                error
            );
        }
    }

    private isValidAnalysis(data: any): data is RepoAnalysis {
        return (
            data &&
            typeof data.summary === "string" &&
            typeof data.technicalHighlights === "string" &&
            Array.isArray(data.keyFeatures) &&
            typeof data.complexity === "string" &&
            Array.isArray(data.useCases) &&
            Array.isArray(data.improvements) &&
            typeof data.lastAnalyzed === "string" &&
            (data.analysisQuality === "basic" ||
                data.analysisQuality === "detailed")
        );
    }

    public async getRepoAnalysis(
        owner: string,
        repo: string
    ): Promise<RepoAnalysis | null> {
        try {
            // Try to get from cache first
            const cachedAnalysis = await this.getFromCache(owner, repo);
            if (cachedAnalysis) {
                return cachedAnalysis;
            }

            // Try to get from database
            const existingAnalysis = await this.getFromDatabase(owner, repo);
            if (existingAnalysis) {
                // Save to cache for future requests
                await this.saveToCache(owner, repo, existingAnalysis);
                console.log(
                    `[DB] Found existing analysis for ${owner}/${repo}`
                );
                return existingAnalysis;
            }

            console.log(
                `[DB] No existing analysis for ${owner}/${repo}, generating new analysis`
            );

            // Get repo content
            const content = await this.getRepoContent(owner, repo);

            // Analyze with Gemini
            const analysis = await this.analyzeWithGemini(content);

            // Save to both database and cache
            await Promise.all([
                this.saveToDatabase(owner, repo, analysis),
                this.saveToCache(owner, repo, analysis),
            ]);

            return analysis;
        } catch (error: any) {
            console.error(`[Analysis] Failed for ${owner}/${repo}:`, error);

            // Create a basic analysis for repositories with no analyzable content
            if (error.message === "No content found to analyze") {
                const basicAnalysis: RepoAnalysis = {
                    summary:
                        "This repository appears to be empty or contains no analyzable content.",
                    technicalHighlights:
                        "No technical details available for analysis.",
                    keyFeatures: ["Repository is empty or inaccessible"],
                    complexity:
                        "Unable to determine complexity due to limited content.",
                    useCases: [],
                    improvements: [
                        "Add source code or documentation to enable analysis",
                    ],
                    lastAnalyzed: new Date().toISOString(),
                    analysisQuality: "basic",
                };

                // Save basic analysis to both database and cache
                await Promise.all([
                    this.saveToDatabase(owner, repo, basicAnalysis),
                    this.saveToCache(owner, repo, basicAnalysis),
                ]);

                return basicAnalysis;
            }

            return null;
        }
    }

    public async clearAnalysis(owner: string, repo: string): Promise<void> {
        try {
            const cacheKey = this.redis.generateKey(
                "repo-analysis",
                owner,
                repo
            );
            await Promise.all([
                this.prisma.getClient().repoAnalysis.deleteMany({
                    where: {
                        owner,
                        repo,
                    },
                }),
                this.redis.delete(cacheKey),
            ]);
        } catch (error) {
            console.warn(
                `[Clear Analysis] No existing analysis to clear for ${owner}/${repo}`
            );
        }
    }

    public async reanalyzeRepo(
        owner: string,
        repo: string
    ): Promise<RepoAnalysis> {
        try {
            console.log(
                `[Reanalysis] Starting reanalysis for ${owner}/${repo}`
            );

            // First clear existing analysis
            console.log(
                `[Reanalysis] Clearing existing analysis for ${owner}/${repo}`
            );
            await this.clearAnalysis(owner, repo);
            console.log(`[Reanalysis] Successfully cleared existing analysis`);

            // Get fresh repo content
            console.log(`[Reanalysis] Fetching fresh repository content`);
            const content = await this.getRepoContent(owner, repo);
            console.log(`[Reanalysis] Successfully fetched repository content`);

            // Perform new analysis
            console.log(`[Reanalysis] Starting AI analysis`);
            const analysis = await this.analyzeWithGemini(content);
            console.log(`[Reanalysis] Successfully completed AI analysis`);

            // Save to both database and cache
            console.log(`[Reanalysis] Saving analysis results`);
            await Promise.all([
                this.saveToDatabase(owner, repo, analysis),
                this.saveToCache(owner, repo, analysis),
            ]);
            console.log(`[Reanalysis] Successfully saved analysis results`);

            return analysis;
        } catch (error: any) {
            console.error(`[Reanalysis] Failed for ${owner}/${repo}:`, error);
            throw new Error(`Failed to reanalyze repository: ${error.message}`);
        }
    }
}

export default RepoAnalyzerGemini;
