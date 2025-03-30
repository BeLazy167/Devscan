export const config = {
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/devposts",
    githubToken: process.env.GITHUB_TOKEN || "",
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    firecrawlApiKey: process.env.FIRECRAWL_API_KEY || "",
};
