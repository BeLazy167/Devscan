"use client";

import { useQuery } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";

const queryClient = new QueryClient();

interface DevpostClientProps {
    id: string;
}

interface TeamMember {
    name: string;
    role?: string;
    avatar?: string;
    links?: Record<string, string>;
}

// Enhanced project data type to include GitHub analysis
interface ProjectData {
    id: string;
    title: string;
    description: string;
    url?: string;
    techStack: string[];
    imageUrls: string[];
    teamMembers: string[];
    team: TeamMember[];
    summary: any;
    repoUrl?: string;
    githubAnalysis?: {
        summary: string;
        technicalHighlights: string;
        keyFeatures: string[];
        complexity: string;
        useCases: string[];
        improvements: string[];
        lastAnalyzed: string;
        analysisQuality: string;
    };
}

//sample data
// {
//     "success": true,
//     "data": {
//         "source": "cached",
//         "projectData": {
//             "_id": "67e92a46eed651706435d2ce",
//             "id": "three-way-authentication",
//             "analysis": {
//                 "title": "auth0",
//                 "description": "Generates unique, secure passwords for online accounts without storing the original password., Addresses risks of centralized password storage and weak master passwords., Allows users to use a single master password while ensuring each website gets a distinct, strong password.",
//                 "gallery": {
//                     "images": [
//                         "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/305/094/datas/medium.png",
//                         "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/003/280/322/datas/medium.png"
//                     ],
//                     "videos": [
//                         "https://www.youtube.com/watch?v=Akj1qr9nB-s"
//                     ]
//                 },
//                 "summary": {
//                     "keyFeatures": [
//                         "Generates unique, secure passwords for online accounts without storing the original password.",
//                         "Addresses risks of centralized password storage and weak master passwords.",
//                         "Allows users to use a single master password while ensuring each website gets a distinct, strong password."
//                     ],
//                     "technicalHighlights": [
//                         "Chrome extension development.",
//                         "OAuth login integration.",
//                         "Password generation and autofill functionality.",
//                         "Utilizes auth0, bcrypt, firebase, css3, html5, and javascript."
//                     ],
//                     "impactPotential": [
//                         "Cross-platform support (app and web interface).",
//                         "Continuous improvement of security and user experience.",
//                         "Integration of more customization options and additional security measures."
//                     ],
//                     "learningCurve": []
//                 },
//                 "team": [
//                     {
//                         "name": "Anas Al Darwashi",
//                         "role": "",
//                         "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJWkJnSvBXYCzmoU5VDVvqN07otFPOqVpzqQpzE3Q9eAA=s96-c?height=180&width=180",
//                         "links": {
//                             "devpost": "https://devpost.com/darwashi"
//                         }
//                     },
//                     {
//                         "name": "Jacob Whitman",
//                         "role": "",
//                         "avatar": "https://avatars.githubusercontent.com/u/113045473?height=180&v=4&width=180",
//                         "links": {
//                             "devpost": "https://devpost.com/Jacob-Whitman"
//                         }
//                     },
//                     {
//                         "name": "Andrew Roberts",
//                         "role": "",
//                         "avatar": "https://lh3.googleusercontent.com/a/AATXAJyQFOtVtI3c_82KZ-Av3L_wFYJ4wXdImKaBAs1p=s96-c?height=180&width=180",
//                         "links": {
//                             "devpost": "https://devpost.com/andrewzr"
//                         }
//                     },
//                     {
//                         "name": "Matthew Gwin",
//                         "role": "",
//                         "avatar": "https://www.gravatar.com/avatar/ee4b597c537de4e870f2330cb790e673?d=https%3A%2F%2Fd2dmyh35ffsxbl.cloudfront.net%2Fassets%2Fdefaults%2Fno-avatar-180.png&s=180",
//                         "links": {
//                             "devpost": "https://devpost.com/mattgwin"
//                         }
//                     }
//                 ],
//                 "details": {
//                     "techStack": [
//                         "auth0",
//                         "bcrypt",
//                         "css3",
//                         "firebase",
//                         "html5",
//                         "javascript"
//                     ],
//                     "links": {
//                         "github": "https://github.com/mattgwin29/hackathon-2025",
//                         "devpost": "https://devpost.com/software/three-way-authentication"
//                     },
//                     "duration": ""
//                 },
//                 "id": "three-way-authentication",
//                 "url": "https://devpost.com/software/three-way-authentication"
//             },
//             "githubAnalysis": {
//                 "summary": "CyberFrat Password Manager is a Chrome extension that generates unique passwords for each website based on a master password, salt, and pepper, storing salt and pepper in Firebase.",
//                 "technicalHighlights": "The extension uses Firebase for user authentication (Google OAuth) and stores salt/pepper values. It employs a modified bcrypt algorithm (from Nevins Bartolomeo's implementation) for password hashing, incorporating a salt and a randomly generated 'pepper' for added security. The `checkOrCreateSaltPepper` function retrieves or creates salt/pepper combinations in Firebase, then uses `hashpw` to generate the final password, which is a substring of the bcrypt hash. The extension injects JavaScript into web pages to detect password fields and autofill them with the generated password.",
//                 "keyFeatures": [
//                     "Three-factor authentication using a master password, a website-specific salt, and a randomly generated pepper.",
//                     "Firebase integration for user authentication (Google OAuth) and secure storage of salt and pepper values.",
//                     "Modified bcrypt implementation for password hashing, providing a computationally intensive one-way function.",
//                     "Dynamic password field detection and autofilling using content scripts injected into web pages.",
//                     "Generation of a unique password substring (15 characters) from the full bcrypt hash."
//                 ],
//                 "complexity": "The code involves asynchronous operations (Firebase reads/writes, bcrypt hashing), DOM manipulation in content scripts, and a custom implementation of bcrypt. The overall complexity is moderate, requiring careful handling of promises and asynchronous callbacks to ensure correct password generation and storage.",
//                 "useCases": [
//                     "Generating unique and strong passwords for different websites using a single master password.",
//                     "Protecting against password reuse and mitigating the impact of website security breaches.",
//                     "Providing a password management solution that avoids storing the user's master password directly."
//                 ],
//                 "improvements": [
//                     "Consider using a more robust and actively maintained bcrypt library instead of the custom implementation.",
//                     "Implement proper error handling and user feedback mechanisms for all asynchronous operations, especially Firebase interactions.",
//                     "Enhance the password field detection logic to handle a wider range of website password input structures and dynamically rendered elements."
//                 ],
//                 "lastAnalyzed": "2025-03-30T11:25:58.741Z",
//                 "analysisQuality": "detailed"
//             },
//             "createdAt": "2025-03-30T11:25:58.741Z",
//             "updatedAt": "2025-03-30T11:25:58.741Z",
//             "__v": 0
//         }
//     }
// }
function DevpostClient({ id }: DevpostClientProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["devpost", id],
        queryFn: async () => {
            const response = await fetch(`/api/devpost`, {
                method: "POST",
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Failed to fetch devpost data");
            return response.json();
        },
        enabled: !!id,
    });

    if (isLoading) return <ProjectDetailLoading />;

    if (error)
        return (
            <div className="text-red-400">
                Error loading project: {(error as Error).message}
            </div>
        );

    // The API returns data in this format: { success: true, data: { source: "cached", projectData: {...} } }
    const projectData = data?.data?.projectData || {};
    const analysisData = projectData?.analysis || {};
    const githubAnalysis = projectData?.githubAnalysis || {};

    // Map data to a more structured format
    const enhancedData: ProjectData = {
        id: analysisData.id || id,
        title: analysisData.title || "Untitled Project",
        description: analysisData.description || "No description available",
        url: analysisData.url,
        techStack: analysisData.details?.techStack || [],
        imageUrls: analysisData.gallery?.images || [],
        teamMembers: analysisData.team?.map((t: TeamMember) => t.name) || [],
        team: analysisData.team || [],
        summary: analysisData.summary || {},
        repoUrl: analysisData.details?.links?.github,
        githubAnalysis: githubAnalysis,
    };

    return (
        <ProjectDetail
            devpostData={{
                id: enhancedData.id,
                title: enhancedData.title,
                description: enhancedData.description,
                url: enhancedData.url,
                techStack: enhancedData.techStack,
                imageUrls: enhancedData.imageUrls,
                teamMembers: enhancedData.teamMembers,
                team: enhancedData.team,
                analysis: enhancedData.summary,
                repoUrl: enhancedData.repoUrl,
                githubAnalysis: enhancedData.githubAnalysis,
            }}
        />
    );
}

export default function ClientPage({ id }: DevpostClientProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <DevpostClient id={id} />
        </QueryClientProvider>
    );
}
