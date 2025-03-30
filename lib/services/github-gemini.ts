import { Octokit } from "@octokit/rest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config/env";

// Export types
export interface RepoAnalysis {
    summary: string;
    technicalHighlights: string;
    keyFeatures: string[];
    complexity: string;
    useCases: string[];
    improvements: string[];
    lastAnalyzed: string;
    analysisQuality: "basic" | "detailed";
}

export type RepoIdentifier = {
    owner: string;
    repo: string;
};

// Constants
const MAX_FILES_TO_ANALYZE = 30;
const IMPORTANT_FILES = [
    "README.md",
    "package.json",
    "requirements.txt",
    "go.mod",
    "pom.xml",
    "build.gradle",
];

// Initialize services
const octokit = new Octokit({ auth: config.githubToken });

// Initialize Gemini
if (!config.geminiApiKey) {
    throw new Error("Gemini API key is not configured");
}

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        topK: 1,
        topP: 0.7,
        candidateCount: 1,
    },
});

// Helper functions
const sleep = async (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Checks if a string is valid JSON and roughly matches the expected analysis structure.
 * Does not perform deep validation of types or array contents.
 */
const isValidJsonAnalysisStructure = (str: string): boolean => {
    try {
        const parsed = JSON.parse(str);
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
};

/**
 * Performs a more thorough check on the structure and types of a potential RepoAnalysis object.
 */
const isValidAnalysisObject = (
    data: any
): data is Omit<RepoAnalysis, "lastAnalyzed" | "analysisQuality"> => {
    return (
        data &&
        typeof data.summary === "string" &&
        data.summary.length > 0 &&
        typeof data.technicalHighlights === "string" &&
        data.technicalHighlights.length > 0 &&
        Array.isArray(data.keyFeatures) &&
        data.keyFeatures.every(
            (item: string) => typeof item === "string" && item.length > 0
        ) &&
        typeof data.complexity === "string" &&
        data.complexity.length > 0 &&
        Array.isArray(data.useCases) &&
        data.useCases.every((item: string) => typeof item === "string") &&
        Array.isArray(data.improvements) &&
        data.improvements.every((item: string) => typeof item === "string")
    );
};

const sanitizeContent = (content: string): string => {
    const MAX_FILE_SIZE = 50000; // 50KB per file
    const TRUNCATED_INDICATOR = "\n...[truncated due to size]...\n";

    return content.length > MAX_FILE_SIZE
        ? content.slice(0, MAX_FILE_SIZE) + TRUNCATED_INDICATOR
        : content.replace(/[^\x20-\x7E\n\r\t]/g, ""); // Keep ASCII + whitespace
};

// Core functions
export const getRepoContent = async (
    owner: string,
    repo: string
): Promise<string> => {
    console.log(`[Repo Content] Fetching content for ${owner}/${repo}`);
    try {
        // Add timeout for GitHub API calls
        const timeoutSignal = AbortSignal.timeout(3000); // 3 seconds timeout

        // Get default branch with timeout
        const { data: repoInfo } = await octokit.repos.get({
            owner,
            repo,
            request: { signal: timeoutSignal },
        });
        console.log(
            `[Repo Content] Found repository with default branch: ${repoInfo.default_branch}`
        );
        const defaultBranch = repoInfo.default_branch;

        // Get repository tree
        const { data: tree } = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: defaultBranch,
            recursive: "1", // Use '1' for recursive fetching as per Octokit docs
            request: { signal: timeoutSignal },
        });
        console.log(
            `[Repo Content] Retrieved tree with ${tree.tree.length} items (files/dirs)`
        );

        // Prioritize important files first
        const allFiles = tree.tree.filter(
            (
                item
            ): item is {
                path: string;
                type: "blob";
                sha: string;
                size?: number;
                url?: string;
                mode?: string;
            } =>
                item.path !== undefined &&
                item.type === "blob" &&
                item.sha !== undefined
        );

        const importantFiles = allFiles.filter((file) =>
            IMPORTANT_FILES.some((important) => file.path.endsWith(important))
        );
        console.log(
            `[Repo Content] Found ${importantFiles.length} important files`
        );

        const otherFiles = allFiles
            .filter((file) => {
                // Filter out files already included as important
                if (
                    importantFiles.some((impFile) => impFile.path === file.path)
                ) {
                    return false;
                }
                const path = file.path.toLowerCase();
                // Include common code and documentation file types
                return (
                    path.endsWith(".md") ||
                    path.endsWith(".txt") || // Added .txt
                    path.endsWith(".js") ||
                    path.endsWith(".ts") ||
                    path.endsWith(".py") ||
                    path.endsWith(".go") ||
                    path.endsWith(".java") ||
                    path.endsWith(".rb") || // Added Ruby
                    path.endsWith(".php") || // Added PHP
                    path.endsWith(".cs") || // Added C#
                    path.endsWith(".c") || // Added C
                    path.endsWith(".cpp") || // Added C++
                    path.endsWith(".rs") // Added Rust
                );
            })
            .slice(0, MAX_FILES_TO_ANALYZE - importantFiles.length);
        console.log(
            `[Repo Content] Selected ${otherFiles.length} additional relevant files`
        );

        const filesToAnalyze = [...importantFiles, ...otherFiles];

        // Handle case where no relevant files are found
        if (filesToAnalyze.length === 0) {
            console.warn(
                `[Repo Content] No suitable files found for analysis in ${owner}/${repo}`
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
Forks: ${repoInfo.forks_count}

NOTE: No primary code or documentation files (like README, package.json, source files) were identified for detailed analysis.`;
        }

        // Get content of selected files in parallel
        console.log(
            `[Repo Content] Fetching content for ${filesToAnalyze.length} files`
        );
        const fileContentsPromises = filesToAnalyze.map(async (file) => {
            try {
                // Use getBlob for potentially better performance with SHAs
                const { data: blobData } = await octokit.git.getBlob({
                    owner,
                    repo,
                    file_sha: file.sha,
                    request: { signal: timeoutSignal },
                });

                if (blobData.content) {
                    return {
                        path: file.path,
                        content: sanitizeContent(
                            Buffer.from(
                                blobData.content,
                                "base64" // Assuming base64 encoding from getBlob
                            ).toString("utf-8")
                        ),
                    };
                }
                console.warn(
                    `[Repo Content] No content retrieved for blob ${file.path} (SHA: ${file.sha})`
                );
                return null;
            } catch (error: any) {
                // Log specific errors, e.g., if a blob is too large or inaccessible
                if (
                    error.status === 403 &&
                    error.message?.includes("Blob is too large")
                ) {
                    console.warn(
                        `[Repo Content] File too large to fetch: ${file.path}`
                    );
                    return {
                        path: file.path,
                        content: "[Content Too Large To Fetch]",
                    };
                }
                console.warn(
                    `[Repo Content] Failed to fetch blob ${file.path} (SHA: ${file.sha}):`,
                    error.message || error
                );
                // Provide placeholder content on failure
                return { path: file.path, content: "[Content Unavailable]" };
            }
        });

        const fileContents = await Promise.all(fileContentsPromises);
        const validContents = fileContents.filter(Boolean); // Filter out nulls

        console.log(
            `[Repo Content] Successfully processed ${validContents.length} files`
        );

        // Fallback if all file fetches failed but some were selected
        if (validContents.length === 0 && filesToAnalyze.length > 0) {
            console.warn(
                `[Repo Content] All selected files failed to fetch for ${owner}/${repo}`
            );
            return `Repository: ${owner}/${repo}
Default Branch: ${defaultBranch}
Description: ${repoInfo.description || "No description available"}
Language: ${repoInfo.language || "Not specified"}
Topics: ${repoInfo.topics?.join(", ") || "None"}
Created: ${repoInfo.created_at}
Last Updated: ${repoInfo.updated_at}
Stars: ${repoInfo.stargazers_count}
Forks: ${repoInfo.forks_count}

NOTE: Attempted to fetch ${
                filesToAnalyze.length
            } files, but encountered errors retrieving their content.`;
        }

        // Combine file contents into a single string for the AI
        return validContents
            .map((file) => `File: ${file?.path}\n\n${file?.content}`)
            .join("\n\n---\n\n");
    } catch (error: any) {
        console.error(
            `[Repo Content] Error fetching content for ${owner}/${repo}:`,
            error
        );
        if (
            error.name === "AbortError" ||
            error.message?.includes("timed out")
        ) {
            throw new Error(
                `GitHub API request timed out while fetching content for ${owner}/${repo}`
            );
        }
        if (error.status === 404) {
            throw new Error(
                `Repository ${owner}/${repo} not found or not accessible.`
            );
        }
        if (error.status === 403) {
            // Check if it's a rate limit error
            const rateLimitReset =
                error.response?.headers?.["x-ratelimit-reset"];
            const resetTime = rateLimitReset
                ? new Date(rateLimitReset * 1000).toLocaleTimeString()
                : "unknown";
            if (error.message?.includes("API rate limit exceeded")) {
                throw new Error(
                    `GitHub API rate limit exceeded. Limit resets around ${resetTime}. Please try again later.`
                );
            } else {
                throw new Error(
                    `Access denied for ${owner}/${repo}. Ensure the repository is public or the token has permissions. ${error.message}`
                );
            }
        }
        // Rethrow other errors
        throw new Error(
            `Failed to get repository content: ${error.message || error}`
        );
    }
};

/**
 * Extracts JSON content from a string that may be wrapped in markdown code blocks.
 * @param text The raw response text from the AI.
 * @returns The cleaned JSON string.
 */
const extractJsonFromMarkdown = (text: string): string => {
    const trimmed = text.trim();
    const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
    const match = codeBlockRegex.exec(trimmed);
    if (match) {
        return match[1].trim();
    }
    return trimmed;
};
//
export const analyzeWithGemini = async (
    repoIdentifier: RepoIdentifier,
    content: string
): Promise<RepoAnalysis> => {
    const MAX_RETRIES = 3;
    let retries = 0;
    const { owner, repo } = repoIdentifier;

    while (retries <= MAX_RETRIES) {
        try {
            const timeLabel = `[AI Analysis ${owner}/${repo}] Completion time ${Date.now()}`;
            console.log(
                `[AI Analysis ${owner}/${repo}] Starting analysis (attempt ${
                    retries + 1
                }/${MAX_RETRIES + 1})`
            );
            console.time(timeLabel);

            const prompt = [
                `Analyze the following GitHub repository content for ${owner}/${repo}.`,
                "Provide a technical assessment.",
                "",
                "**Your response MUST be a valid JSON object containing ONLY the JSON and nothing else. Do not wrap the JSON in code blocks, markdown, or add any additional text before or after the JSON.**",
                "Adhere STRICTLY to this JSON structure:",
                "{",
                '    "summary": "string (Single concise sentence: project purpose & main tech stack).",',
                '    "technicalHighlights": "string (Single paragraph: core technical implementation, architecture, key technologies, patterns, notable decisions. Focus on specifics).",',
                '    "keyFeatures": [',
                '        "string (Describe 1st key technical feature/implementation)",',
                '        "string (Describe 2nd key technical feature/implementation)",',
                '        "string (Describe 3rd key technical feature/implementation)",',
                '        "string (Describe 4th key technical feature/implementation)",',
                '        "string (Describe 5th key technical feature/implementation)"',
                "    ],",
                '    "complexity": "string (1-2 sentences: code structure, organization, dependencies, overall technical complexity assessment).",',
                '    "useCases": [',
                '        "string (Describe 1st specific technical use case/application)",',
                '        "string (Describe 2nd specific technical use case/application)",',
                '        "string (Optionally describe 3rd specific technical use case)"',
                "    ],",
                '    "improvements": [',
                '        "string (Suggest 1st concrete technical improvement)",',
                '        "string (Suggest 2nd concrete technical improvement)",',
                '        "string (Optionally suggest 3rd concrete technical improvement)"',
                "    ]",
                "}",
                "",
                "**Guidelines:**",
                "1. **JSON ONLY:** Output absolutely nothing before or after the JSON object.",
                "2. **No Code Blocks:** Do not enclose the JSON in ```json, ```, or any markdown formatting.",
                "3. **Be Specific:** Use names of libraries, frameworks, algorithms, patterns observed.",
                "4. **Concise:** Keep descriptions brief and to the point.",
                "5. **Technical Focus:** Emphasize implementation details, architecture, and tech choices.",
                "6. **Structure Adherence:** Ensure all keys are present and types match the specification.",
                "7. **Handle Limited Info:** If content is minimal (e.g., just repo metadata), state that analysis is limited.",
                "",
                "**Repository Content to Analyze:**",
                "```",
                content,
                "```",
                "",
                "**JSON Response:**",
            ].join("\n");
            const result = await model.generateContent(prompt);
            const response = result.response;
            const candidate = response?.candidates?.[0];

            if (!candidate?.content?.parts?.[0]?.text) {
                const blockReason = candidate?.finishReason;
                const safetyRatings = candidate?.safetyRatings;
                console.error(
                    `[AI Analysis ${owner}/${repo}] Failed to get valid response part. Reason: ${blockReason}, Safety: ${JSON.stringify(
                        safetyRatings
                    )}`
                );
                throw new Error(
                    `AI analysis failed. Reason: ${
                        blockReason || "No text content received"
                    }.`
                );
            }

            const responseText = candidate.content.parts[0].text.trim();

            // Extract JSON from potential markdown code blocks
            const cleanedText = extractJsonFromMarkdown(responseText);

            // Parse the cleaned text as JSON
            let parsedJson: any;
            try {
                parsedJson = JSON.parse(cleanedText);
            } catch (parseError: any) {
                console.error(
                    `[AI Analysis ${owner}/${repo}] Failed to parse cleaned response as JSON: ${parseError.message}`,
                    cleanedText
                );
                throw new Error(
                    `Failed to parse AI response as JSON: ${parseError.message}`
                );
            }

            // Validate the parsed object's structure and types
            if (!isValidAnalysisObject(parsedJson)) {
                console.error(
                    `[AI Analysis ${owner}/${repo}] Parsed JSON does not match required RepoAnalysis structure:`,
                    parsedJson
                );
                throw new Error(
                    "Parsed JSON from AI does not match the required analysis structure."
                );
            }

            // Create the final analysis object
            const analysisResult: RepoAnalysis = {
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
            console.log(
                `[AI Analysis ${owner}/${repo}] Successfully generated analysis.`
            );
            return analysisResult;
        } catch (error: any) {
            console.error(
                `[AI Analysis ${owner}/${repo}] Error during attempt ${
                    retries + 1
                }:`,
                error.message || error
            );

            retries++;
            if (retries > MAX_RETRIES) {
                console.error(
                    `[AI Analysis ${owner}/${repo}] Max retries exceeded. Failing analysis.`
                );
                if (error.status === 429 || error.message?.includes("429")) {
                    console.warn(
                        `[AI Analysis ${owner}/${repo}] Rate limit hit on final attempt, returning basic analysis.`
                    );
                    return {
                        summary: `Analysis failed for ${owner}/${repo} due to AI rate limiting.`,
                        technicalHighlights:
                            "AI service rate limit was exceeded. Please try again later.",
                        keyFeatures: ["Rate limit exceeded"],
                        complexity: "Analysis unavailable due to API limits.",
                        useCases: ["Retry analysis later"],
                        improvements: ["Wait for API quota reset"],
                        lastAnalyzed: new Date().toISOString(),
                        analysisQuality: "basic" as const,
                    };
                }
                throw new Error(
                    `AI analysis failed after ${
                        MAX_RETRIES + 1
                    } attempts for ${owner}/${repo}: ${error.message}`
                );
            }

            let backoffTime = 1500 * Math.pow(2, retries);
            if (error.status === 429 || error.message?.includes("429")) {
                console.log(
                    `[AI Analysis ${owner}/${repo}] Rate limit hit, backing off for ${backoffTime}ms...`
                );
            } else {
                console.log(
                    `[AI Analysis ${owner}/${repo}] Encountered error, backing off for ${backoffTime}ms...`
                );
            }
            await sleep(backoffTime);
        }
    }
    throw new Error(
        `Max retries exceeded for AI analysis for ${owner}/${repo}`
    );
};

export const getRepoAnalysis = async (
    owner: string,
    repo: string
): Promise<RepoAnalysis> => {
    console.log(`[Analysis Process] Starting analysis for ${owner}/${repo}`);
    try {
        // Step 1: Get repo content
        console.log(`[Analysis Process] Fetching content for ${owner}/${repo}`);
        const content = await getRepoContent(owner, repo);

        // Check for no files case
        if (content.includes("No primary code or documentation files")) {
            return {
                summary: `Repository ${owner}/${repo} contains no primary code or documentation files for analysis.`,
                technicalHighlights:
                    "Analysis could not be performed as no standard source code, README, or package manager files were found.",
                keyFeatures: ["No analyzable content found"],
                complexity: "Unable to determine due to error.",
                useCases: [],
                improvements: ["Verify repository access and try again later."],
                lastAnalyzed: new Date().toISOString(),
                analysisQuality: "basic",
            };
        }

        console.log(
            `[Analysis Process] Content fetched successfully for ${owner}/${repo}`
        );

        // Step 2: Analyze with Gemini
        console.log(
            `[Analysis Process] Starting AI analysis for ${owner}/${repo}`
        );
        const analysis = await analyzeWithGemini({ owner, repo }, content);
        console.log(
            `[Analysis Process] AI analysis completed for ${owner}/${repo}`
        );

        return analysis;
    } catch (error: any) {
        console.error(
            `[Analysis Process] Failed analysis for ${owner}/${repo}:`,
            error.message
        );

        // Handle specific error cases to provide a basic analysis object
        let summary = `Failed to analyze ${owner}/${repo}.`;
        let details = `Error: ${error.message}`;
        let features = ["Analysis failed"];

        if (error.message?.includes("not found")) {
            summary = `Repository ${owner}/${repo} not found or is private.`;
            details =
                "Please ensure the repository exists and is public, or the provided token has access.";
            features = ["Repository not accessible"];
        } else if (error.message?.includes("rate limit exceeded")) {
            summary = `Analysis failed due to API rate limits for ${owner}/${repo}.`;
            details =
                "GitHub or AI API rate limit was hit. Please try again later.";
            features = ["Rate limit hit"];
        } else if (error.message?.includes("timed out")) {
            summary = `Analysis timed out for ${owner}/${repo}.`;
            details =
                "The request to GitHub or the AI service took too long to complete.";
            features = ["Request timeout"];
        }

        // Create and return a basic analysis indicating failure
        const basicFailureAnalysis: RepoAnalysis = {
            summary: summary,
            technicalHighlights: details,
            keyFeatures: features,
            complexity: "Unable to determine due to error.",
            useCases: [],
            improvements: ["Verify repository access and try again later."],
            lastAnalyzed: new Date().toISOString(),
            analysisQuality: "basic",
        };

        return basicFailureAnalysis; // Return the basic failure info
    }
};

// Reanalyze function now essentially just calls getRepoAnalysis as there's no cache to clear
export const reanalyzeRepo = async (
    owner: string,
    repo: string
): Promise<RepoAnalysis> => {
    console.log(`[Reanalysis] Starting reanalysis for ${owner}/${repo}`);
    // No cache to clear, directly proceed to fetch and analyze
    return getRepoAnalysis(owner, repo);
};

// Export default function for potential backward compatibility or direct use
export default getRepoAnalysis;
