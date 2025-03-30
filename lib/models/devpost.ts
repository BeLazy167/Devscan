import mongoose from "mongoose";

export interface RawDevPost {
    scrapeData: Object;
    updatedAt: Date;
    createdAt: Date;
    id: string;
}

// export interface DevPost {
//     url: string;
//     title: string;
//     description: string;
//     techStack: string[];
//     teamMembers: string[];
//     repoUrl?: string;
//     repoOwner?: string;
//     repoName?: string;
//     demoUrl?: string;
//     imageUrls?: string[];
//     analysis: {
//         summary?: string;
//         technicalHighlights?: string;
//         keyFeatures?: string[];
//         complexity?: string;
//         useCases?: string[];
//         improvements?: string[];
//     };
//     createdAt: Date;
//     updatedAt: Date;
// }

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
    gallery: Gallery;
    summary: Summary;
    team: TeamMember[];
    details: Details;
}

export interface ScrapeResult {
    markdown: string;
    metadata: {
        title: string;
    };
}
export interface ScrapeResponse {
    success: boolean;
    data: ScrapeResult;
}

// Then, define ProjectPageData
export interface ProjectPageData {
    gallery: Gallery;
    summary: Summary;
    team: TeamMember[];
    details: Details;
}

// // Now, define Devpost, which extends ProjectPageData
// export interface Devpost extends ProjectPageData {
//     id: string;
//     url: string;
//     title: string;
//     description: string;
//     techStack: string[];
//     teamMembers: string[];
//     repoUrl?: string;
//     repoOwner?: string;
//     repoName?: string;
//     demoUrl?: string;
//     imageUrls?: string[];
//     analysis?: {
//         summary?: string;
//         technicalHighlights?: string;
//         keyFeatures?: string[];
//         complexity?: string;
//         useCases?: string[];
//         improvements?: string[];
//         geminiInsights?: any;
//     };
//     createdAt: Date;
//     updatedAt: Date;
// }

// // Finally, define the schema and model
// const DevPostSchema = new mongoose.Schema<Devpost>({
//     id: { type: String, required: true },
//     url: { type: String, required: true },
//     title: { type: String, required: true },
//     // ... other fields
// });

export interface Devpost {
    id: string;
    analysis: Object;
    createdAt: Date;
    updatedAt: Date;
}
