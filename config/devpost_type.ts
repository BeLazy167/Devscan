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
