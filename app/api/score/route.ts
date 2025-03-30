import { config } from "@/config/env";
import { analyzeDevPost } from "@/lib/services/devpost-gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Parse the project data from the request body
        const projectData = await request.json();

        // Extract relevant fields from the project data
        const { analysis, githubAnalysis } = projectData;

        // Ensure required fields are present
        if (!analysis || !githubAnalysis) {
            return NextResponse.json(
                { error: "Invalid project data: missing required fields" },
                { status: 400 }
            );
        }

        // Prepare a detailed prompt for the "gemin" model to evaluate the project
        const prompt = `
Evaluate the following project based on these criteria:
- Innovation: How novel and creative are the project's features and approach?
- Technical: How well-implemented and technically sound is the solution?
- Design: How user-friendly and aesthetically pleasing is the user experience?
- Impact: What is the potential significance and reach of the project?

Provide scores out of 100 for each category (Innovation, Technical, Design, Impact) and an overall score in the following JSON format:
{
  "overall": <overall_score>,
  "categories": {
    "Innovation": <innovation_score>,
    "Technical": <technical_score>,
    "Design": <design_score>,
    "Impact": <impact_score>
  }
}

Project Information:
- Title: ${analysis.title}
- Description: ${analysis.description}
- Key Features: ${analysis.summary.keyFeatures.join(", ")}
- Technical Highlights: ${analysis.summary.technicalHighlights.join(", ")}
- Impact Potential: ${analysis.summary.impactPotential.join(", ")}
- Tech Stack: ${analysis.details.techStack.join(", ")}
- GitHub Analysis Summary: ${githubAnalysis.summary}
`;

        const genAI = new GoogleGenerativeAI(config.geminiApiKey);

        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.1, // Low temperature for deterministic output
            },
        });
        const modelResponse = await model.generateContent(prompt);
        // Parse the model’s response
        let scores;
        try {
            scores = JSON.parse(modelResponse.response.text().trim());
        } catch (parseError) {
            throw new Error("Invalid response format from scoring model");
        }

        // Validate the scores structure
        if (!scores.overall || !scores.categories) {
            throw new Error("Model response missing required score fields");
        }

        // Extract links from the project details

        // Construct the response object
        const response = {
            overall: scores.overall,
            categories: scores.categories,
        };

        // Return the JSON response
        return NextResponse.json(response);
    } catch (error) {
        // Handle any errors during processing
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}
