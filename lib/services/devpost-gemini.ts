// Import Google's official Generative AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../config/env";

// Interface for the raw data input
interface RawData {
    id: string;
    scrapeId?: string;
    scrapeData?: any;
    metadata?: any;
    markdown?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

// Types for project page data structure
export interface Gallery {
    images: string[];
    videos?: string[];
}

export interface Summary {
    keyFeatures: string[];
    technicalHighlights: string[];
    impactPotential: string[];
    learningCurve: string[];
}

export interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    links?: {
        github?: string;
        linkedin?: string;
        portfolio?: string;
    };
}

export interface ProjectLinks {
    github?: string;
    demo?: string;
    devpost?: string;
    website?: string;
}

export interface Details {
    techStack: string[];
    links: ProjectLinks;
    duration: string;
}

export interface ProjectPageData {
    id?: string;
    url?: string;
    title?: string;
    description?: string;
    gallery: Gallery;
    summary: Summary;
    team: TeamMember[];
    details: Details;
}

/**
 * Analyzes raw Devpost data using the Gemini 2.0 Flash model and returns structured project page data.
 * @param rawData The raw data object containing markdown and metadata from a Devpost page.
 * @returns A Promise resolving to the structured ProjectPageData.
 */
export async function analyzeDevPost(
    rawData: RawData
): Promise<ProjectPageData> {
    console.log(`[Gemini] Starting analysis for project ID: ${rawData.id}`);
    
    // Initialize the Google Generative AI with API key from config
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    console.log(`[Gemini] Initialized with API key: ${config.geminiApiKey.substring(0, 5)}...`);

    // Get the generative model
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature: 0.1, // Low temperature for deterministic output
        },
    });
    console.log(`[Gemini] Using model: gemini-2.0-flash with temperature 0.1`);

    // Construct the prompt for the Gemini model
    const prompt = `
You are a judge in a hackathon competition tasked with evaluating project submissions. Below is the raw data from a Devpost project page, consisting of markdown content and HTML elements, along with additional metadata. Your goal is to analyze this data and extract information to create a structured project page in JSON format, adhering to the TypeScript \`ProjectPageData\` interface defined below.

### ProjectPageData Interface
\`\`\`typescript
export interface Gallery {
    images: string[];
    videos?: string[];
}

export interface Summary {
    keyFeatures: string[];
    technicalHighlights: string[];
    impactPotential: string[];
    learningCurve: string[];
}

export interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    links?: {
        github?: string;
        linkedin?: string;
        portfolio?: string;
    };
}

export interface ProjectLinks {
    github?: string;
    demo?: string;
    devpost?: string;
    website?: string;
}

export interface Details {
    techStack: string[];
    links: ProjectLinks;
    duration: string;
}

export interface ProjectPageData {
    id?: string;
    url?: string;
    title?: string;
    description?: string;
    gallery: Gallery;
    summary: Summary;
    team: TeamMember[];
    details: Details;
}
\`\`\`

### Instructions
Please extract the following information from the raw data:

- **Gallery**: Identify image URLs (e.g., from markdown, HTML, or metadata like \`og:image\`) and video URLs (e.g., YouTube links) present in the content.
- **Summary**:
  - **keyFeatures**: Extract from the "What it does" section.
  - **technicalHighlights**: Derive from the "How we built it" section and technologies mentioned.
  - **impactPotential**: Infer from "Inspiration" and "What's next" sections.
  - **learningCurve**: Use "What we learned" and "Challenges we ran into" sections.
- **Team**: Identify team members, their roles, avatar URLs, and any profile links (e.g., GitHub, LinkedIn, Devpost profiles).
- **Details**:
  - **techStack**: List technologies from the "Built With" section.
  - **links**: Extract project-related URLs (e.g., GitHub, demo, Devpost from metadata \`ogUrl\`, website).
  - **duration**: Estimate the project duration if mentioned; otherwise, leave as an empty string.

If specific information is missing or unclear, set the corresponding fields to empty arrays, empty objects, or empty strings as appropriate (e.g., \`[]\`, \`{}\`, \`""\`). Use the metadata to supplement the markdown content where applicable.

### Raw Data
#### Markdown Content
\`\`\`
${
    rawData.scrapeData?.markdown ||
    rawData.markdown ||
    "No markdown content available"
}
\`\`\`

#### Metadata
\`\`\`json
${JSON.stringify(
    rawData.scrapeData?.metadata || rawData.metadata || {},
    null,
    2
)}
\`\`\`

Please provide your output as a valid JSON string conforming to the \`ProjectPageData\` interface. Ensure the response is well-structured and concise, focusing only on the relevant project details while ignoring extraneous content (e.g., YouTube interface text, login prompts).
`;

    console.log(`[Gemini] Prompt constructed, length: ${prompt.length} characters`);

    // Call the Gemini model with the prompt
    console.log(`[Gemini] Sending request to Gemini API...`);
    const result = await model.generateContent(prompt);
    console.log(`[Gemini] Response received from Gemini API`);
    const response = result.response;

    // Parse the model's response into ProjectPageData
    const responseText = response.text().trim();
    console.log(`[Gemini] Response text length: ${responseText.length} characters`);
    
    try {
        // Clean up the response text to extract just the JSON part
        let jsonString = responseText;

        // Handle markdown code blocks in response
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
            jsonString = jsonMatch[1].trim();
            console.log(`[Gemini] Extracted JSON from code block`);
        }

        // Parse the JSON
        console.log(`[Gemini] Attempting to parse JSON response`);
        const projectPageData: ProjectPageData = JSON.parse(jsonString);
        console.log(`[Gemini] Successfully parsed JSON response`);

        // Ensure the data has required fields for DevPost model
        const result = {
            ...projectPageData,
            id: rawData.id,
            url:
                rawData.scrapeData?.metadata?.url ||
                `https://devpost.com/software/${rawData.id}`,
            title:
                projectPageData.title || 
                projectPageData.details?.techStack?.[0] || 
                "Untitled Project",
            description:
                projectPageData.description ||
                projectPageData.summary?.keyFeatures?.join(", ") ||
                "No description available",
        };
        
        console.log(`[Gemini] Analysis complete for project ID: ${rawData.id}`);
        console.log(`[Gemini] Title: ${result.title}`);
        console.log(`[Gemini] Tech stack: ${result.details.techStack.join(', ')}`);
        console.log(`[Gemini] Team size: ${result.team.length} members`);
        
        return result;
    } catch (e) {
        console.error(`[Gemini] Failed to parse Gemini response:`, e);
        console.log(`[Gemini] Falling back to default project data`);
        
        // Return fallback data with required fields
        return {
            ...createFallbackProjectData(),
            id: rawData.id,
            url: `https://devpost.com/software/${rawData.id}`,
            title: "Untitled Project",
            description: "Failed to parse project description",
        };
    }
}

// Create fallback project data if parsing fails
function createFallbackProjectData(): ProjectPageData {
    console.log(`[Gemini] Creating fallback project data`);
    return {
        gallery: { images: [], videos: [] },
        summary: {
            keyFeatures: ["Project feature extraction failed"],
            technicalHighlights: ["Technical analysis failed"],
            impactPotential: ["Impact analysis failed"],
            learningCurve: ["Learning curve analysis failed"],
        },
        team: [
            {
                name: "Team Member",
                role: "Developer",
                avatar: "/default-avatar.png",
            },
        ],
        details: {
            techStack: [],
            links: {},
            duration: "Hackathon Project",
        },
    };
}

// Example usage (commented out)
/*
async function main() {
    const rawData: RawData = { ... }; // Your provided raw data here
    try {
        const result = await analyzeDevPost(rawData);
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error processing Devpost data:', error);
    }
}
main();
*/
