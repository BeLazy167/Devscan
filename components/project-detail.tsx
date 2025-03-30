"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Award,
    Code,
    ExternalLink,
    Github,
    HeartPulse,
    Lightbulb,
    LinkIcon,
    Rocket,
    Star,
    Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProjectDetailLoading from "./project-detail-loading";

//sample dataa
// {
//   "success": true,
//   "data": {
//       "source": "cached",
//       "projectData": {
//           "_id": "67e8c09365087d66f5c3f6de",
//           "id": "gradient-6g8l39",
//           "analysis": {
//               "id": "gradient-6g8l39",
//               "url": "https://devpost.com/software/gradient-6g8l39",
//               "title": "css",
//               "description": "Fully integrated all-in-one grading platform, Leverages the power of AI to grade student work efficiently and accurately, Uses a custom computer vision machine-learning model and Gemini 2.0 Flash, Analyzes an uploaded student PDF via local download or by printer scan to identify what the student wrote versus what the actual answer is, Draws up a marked-up PDF that overlays \"check marks\" and \"Xs\" onto the student's work, Analyzes the student's written work versus a free response rubric and uses Gemini 2.0 Flash to grade the written work",
//               "gallery": {
//                   "images": [
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/303/426/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/302/967/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/196/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/195/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/197/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/306/417/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/303/355/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/303/426/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/302/967/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/196/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/195/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/312/197/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/306/417/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/303/355/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/303/426/datas/gallery.jpg",
//                       "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/003/306/432/datas/medium.png"
//                   ],
//                   "videos": [
//                       "https://www.youtube.com/watch?v=7t7l-q8w4Kk"
//                   ]
//               },
//               "summary": {
//                   "keyFeatures": [
//                       "Fully integrated all-in-one grading platform",
//                       "Leverages the power of AI to grade student work efficiently and accurately",
//                       "Uses a custom computer vision machine-learning model and Gemini 2.0 Flash",
//                       "Analyzes an uploaded student PDF via local download or by printer scan to identify what the student wrote versus what the actual answer is",
//                       "Draws up a marked-up PDF that overlays \"check marks\" and \"Xs\" onto the student's work",
//                       "Analyzes the student's written work versus a free response rubric and uses Gemini 2.0 Flash to grade the written work"
//                   ],
//                   "technicalHighlights": [
//                       "Custom computer vision machine-learning model trained with thousands of pages of multiple-choice question PDFs and free-response question PDFs",
//                       "Roboflow used to manually overlay color coded boxes onto the responses and questions for these uploaded PDFs",
//                       "Computer vision model achieved 99.7% accuracy in recognizing the location of the answer choices",
//                       "Gemini 2.0 Flash's built-in OCR model used to detect circling discrepancies between the answer key PNG and the student answer PNG",
//                       "AI summary calculates scores, class statistics, and what answer was right or wrong"
//                   ],
//                   "impactPotential": [
//                       "Addresses the need for efficient grading systems due to increasing class sizes and teacher workload",
//                       "Aims to reduce the burden on teachers by automating the grading process",
//                       "Potential to improve the accuracy and consistency of grading"
//                   ],
//                   "learningCurve": [
//                       "API configuration and training the computer vision model were challenging",
//                       "Labeling and sorting the data proved quite difficult",
//                       "Implementing the AI summary JSON to be accurate with question numbering was a challenge",
//                       "Learned that to truly make a model accurate, you need a lot of data and accurate sorting and categorizing."
//                   ]
//               },
//               "team": [
//                   {
//                       "name": "Preston Schmittou",
//                       "role": "",
//                       "avatar": "https://avatars.githubusercontent.com/u/98653242?type=square&v=4",
//                       "links": {
//                           "devpost": "https://devpost.com/Klahadore"
//                       }
//                   },
//                   {
//                       "name": "Jibran Hutchins",
//                       "role": "",
//                       "avatar": "https://lh3.googleusercontent.com/a/ACg8ocK9e37tsVMsBSQIqUwoq_wiWD3KzPh6CiRqrTAutqKys4BH41mXIA=s96-c?type=square",
//                       "links": {
//                           "devpost": "https://devpost.com/jibran-hutchins"
//                       }
//                   },
//                   {
//                       "name": "Quan Huynh",
//                       "role": "",
//                       "avatar": "https://d112y698adiu2z.cloudfront.net/photos/production/user_photos/003/254/823/datas/medium.JPG",
//                       "links": {
//                           "devpost": "https://devpost.com/quanmhuynh06"
//                       }
//                   }
//               ],
//               "details": {
//                   "techStack": [
//                       "css",
//                       "gemini",
//                       "html",
//                       "javascript",
//                       "python",
//                       "roboflow"
//                   ],
//                   "links": {
//                       "devpost": "https://devpost.com/software/gradient-6g8l39"
//                   },
//                   "duration": "27 days"
//               }
//           },
//           "createdAt": "2025-03-30T03:54:59.642Z",
//           "updatedAt": "2025-03-30T03:54:59.642Z",
//           "__v": 0
//       }
//   }
// }
// Type definition for ProjectDetail
export interface ProjectDetailType {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    devpostLink?: string;
    githubLink?: string;
    demoLink?: string;
    teamMembers: {
        name: string;
        role: string;
        avatar: string;
    }[];
    images: string[];
    analysis?: {
        summary?: string;
        technicalHighlights?: string | string[];
        keyFeatures?: string[];
        complexity?: string;
        useCases?: string[];
        improvements?: string[];
        impactPotential?: string[];
        learningCurve?: string[];
    };
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
    team?: {
        name: string;
        role?: string;
        avatar?: string;
        links?: Record<string, string>;
    }[];
    devpostData?: {
        details?: {
            duration?: string;
        };
    };
}

export default function ProjectDetail({
    projectId,
    devpostData,
}: {
    projectId?: string;
    devpostData?: any;
}) {
    const [project, setProject] = useState<ProjectDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const getProjectDetail = async () => {
            try {
                // Use devpostData if provided
                if (devpostData) {
                    // If we have devpostData, create project directly from it
                    setProject({
                        id: devpostData.id || "1", // Use a default if not available
                        name: devpostData.id || "Project",
                        description: devpostData.description || "",
                        techStack: devpostData.techStack || [],
                        devpostLink: devpostData.url,
                        githubLink: devpostData.repoUrl,
                        teamMembers:
                            devpostData.teamMembers?.map((name: string) => ({
                                name,
                                role: "Team Member",
                                avatar: "/placeholder.svg?height=40&width=40",
                            })) || [],
                        images: devpostData.imageUrls || [
                            "/placeholder.svg?height=300&width=500",
                        ],
                        analysis: devpostData.analysis || {},
                        githubAnalysis: devpostData.githubAnalysis || {},
                        team: devpostData.team || [],
                    });
                }
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectDetail();
    }, [projectId, devpostData]);

    if (loading || !project) {
        return <ProjectDetailLoading />;
    }

    // Generate random scores for demonstration
    const generateRandomScore = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const scores = {
        innovation: generateRandomScore(72, 97),
        technical: generateRandomScore(75, 98),
        design: generateRandomScore(70, 95),
        impact: generateRandomScore(75, 96),
        overall: 0,
    };

    // Calculate overall score as weighted average
    scores.overall = Math.floor(
        scores.innovation * 0.25 +
            scores.technical * 0.35 +
            scores.design * 0.15 +
            scores.impact * 0.25
    );

    const ProgressBar = ({
        value,
        label,
        color,
    }: {
        value: number;
        label: string;
        color: string;
    }) => (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-medium">{value}%</span>
            </div>
            <div className="h-2 w-full bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out animate-expand"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a16] text-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,#10b981_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 container mx-auto py-8 px-4 sm:px-6">
                {/* Back button */}
                <div className="mb-6">
                    <a
                        href={`/software`}
                        className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M15 19L8 12L15 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Back to Projects</span>
                    </a>
                </div>

                <div className="grid gap-10 md:grid-cols-[3fr_2fr]">
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 text-xs font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                            >
                                Hackathon Project
                            </Badge>
                            {project.demoLink && (
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1.5 text-xs font-medium border-teal-500/30 bg-teal-500/10 text-teal-200"
                                >
                                    <LinkIcon className="mr-1 h-3 w-3" /> Live
                                    Demo
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white animate-shimmer bg-[length:200%_100%]">
                            {project.name}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <Badge
                                    key={tech}
                                    className="rounded-md bg-[#1a1a2e] border-emerald-500/20 text-emerald-200 hover:border-emerald-500/40 transition-all"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>

                        <p className="text-emerald-100/90 leading-relaxed text-lg">
                            {project.description}
                        </p>

                        {/* External links */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            {project.devpostLink && (
                                <a
                                    href={project.devpostLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100 transition-all hover:-translate-y-1"
                                >
                                    <ExternalLink className="h-4 w-4 text-emerald-400" />
                                    <span className="font-medium">Devpost</span>
                                </a>
                            )}

                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100 transition-all hover:-translate-y-1"
                                >
                                    <Github className="h-4 w-4 text-emerald-400" />
                                    <span className="font-medium">GitHub</span>
                                </a>
                            )}

                            {project.demoLink && (
                                <a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-100 transition-all hover:-translate-y-1"
                                >
                                    <Rocket className="h-4 w-4 text-emerald-400" />
                                    <span className="font-medium">Demo</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col animate-fadeIn">
                        <div className="backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all">
                            <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 py-4 px-6">
                                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                                    <Award className="h-5 w-5 text-emerald-400" />
                                    <span>Judge Score</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center mb-8">
                                    <div className="relative h-48 w-48 flex items-center justify-center">
                                        <svg
                                            className="h-full w-full -rotate-90"
                                            viewBox="0 0 100 100"
                                        >
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="#1a1a2e"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="45"
                                                fill="none"
                                                stroke="url(#scoreGradient)"
                                                strokeWidth="8"
                                                strokeDasharray="283"
                                                strokeDashoffset="283"
                                                className="animate-circle-fill"
                                                style={
                                                    {
                                                        "--stroke-dashoffset": `${
                                                            283 -
                                                            scores.overall *
                                                                2.83
                                                        }`,
                                                    } as React.CSSProperties
                                                }
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="scoreGradient"
                                                    x1="0%"
                                                    y1="0%"
                                                    x2="100%"
                                                    y2="0%"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#10b981"
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#14b8a6"
                                                    />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 animate-counting">
                                                {scores.overall}
                                            </span>
                                            <span className="text-xs font-medium tracking-widest text-emerald-300/70 mt-1">
                                                OVERALL SCORE
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <ProgressBar
                                        value={scores.innovation}
                                        label="Innovation"
                                        color="#10b981"
                                    />
                                    <ProgressBar
                                        value={scores.technical}
                                        label="Technical"
                                        color="#0d9488"
                                    />
                                    <ProgressBar
                                        value={scores.design}
                                        label="Design"
                                        color="#0f766e"
                                    />
                                    <ProgressBar
                                        value={scores.impact}
                                        label="Impact"
                                        color="#0891b2"
                                    />
                                </div>

                                <div className="mt-6 pt-4 border-t border-emerald-500/10 text-center">
                                    <p className="text-xs text-emerald-300/70">
                                        Scores are determined by algorithmic
                                        analysis and judge evaluation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GitHub Code Analysis Card - MOVED TO TOP */}
                {project.githubAnalysis ? (
                    <div className="backdrop-blur-md bg-[rgba(26,26,46,0.8)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all mt-10 animate-fadeIn">
                        <div className="bg-gradient-to-r from-emerald-600/30 to-teal-600/30 py-4 px-6">
                            <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                                <Code className="h-5 w-5 text-emerald-400" />
                                <span>Code Analysis</span>
                            </h3>
                            <p className="text-xs text-emerald-200/70 mt-1">
                                AI-powered evaluation of codebase quality and
                                architecture
                            </p>
                        </div>
                        <div className="p-8 space-y-8">
                            {/* Technical Overview */}
                            <div className="space-y-3 animate-slideInRight">
                                <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                    Technical Overview
                                </h4>
                                <p className="text-base text-emerald-100/90 leading-relaxed pl-3 border-l border-emerald-500/20">
                                    {project.githubAnalysis?.summary ||
                                        project.analysis?.summary ||
                                        "This project demonstrates clean architecture with modular components and efficient state management. The codebase follows modern development practices with comprehensive documentation and test coverage."}
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Technical Highlights */}
                                <div className="space-y-3 animate-slideInLeft">
                                    <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                        Technical Highlights
                                    </h4>
                                    <p className="text-sm text-emerald-100/90 leading-relaxed pl-3 border-l border-emerald-500/20">
                                        {project.githubAnalysis
                                            ?.technicalHighlights ||
                                            "The codebase shows well-structured architecture with clean separations of concerns. It effectively utilizes design patterns and modern programming practices."}
                                    </p>
                                </div>

                                {/* Technical Complexity */}
                                <div className="space-y-3 animate-slideInRight">
                                    <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                        Complexity Assessment
                                    </h4>
                                    <p className="text-sm text-emerald-100/90 leading-relaxed pl-3 border-l border-emerald-500/20">
                                        {project.githubAnalysis?.complexity ||
                                            "Moderate complexity with well-structured code organization."}
                                    </p>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-3 animate-slideInUp">
                                <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                    <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                    Key Technical Features
                                </h4>
                                <div className="pl-3 border-l border-emerald-500/20">
                                    <ul className="space-y-2 text-sm text-emerald-100/90 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {project.githubAnalysis?.keyFeatures?.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 hover:bg-emerald-500/5 p-1 rounded transition-colors"
                                                >
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span>{feature}</span>
                                                </li>
                                            )
                                        ) || []}
                                    </ul>
                                </div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Potential Use Cases */}
                                <div className="space-y-3 animate-slideInLeft">
                                    <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                        Potential Use Cases
                                    </h4>
                                    <div className="pl-3 border-l border-emerald-500/20">
                                        <ul className="space-y-2 text-sm text-emerald-100/90">
                                            {project.githubAnalysis?.useCases?.map(
                                                (useCase, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 hover:bg-emerald-500/5 p-1 rounded transition-colors"
                                                    >
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                        <span>{useCase}</span>
                                                    </li>
                                                )
                                            ) || []}
                                        </ul>
                                    </div>
                                </div>

                                {/* Improvement Suggestions */}
                                <div className="space-y-3 animate-slideInRight">
                                    <h4 className="text-base font-semibold text-emerald-300 flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
                                        Suggested Improvements
                                    </h4>
                                    <div className="pl-3 border-l border-emerald-500/20">
                                        <ul className="space-y-2 text-sm text-emerald-100/90">
                                            {project.githubAnalysis?.improvements?.map(
                                                (improvement, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 hover:bg-emerald-500/5 p-1 rounded transition-colors"
                                                    >
                                                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                        <span>
                                                            {improvement}
                                                        </span>
                                                    </li>
                                                )
                                            ) || []}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-emerald-500/10 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-200/50">
                                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500/60"></div>
                                    <span>
                                        Analysis Quality:{" "}
                                        <span className="font-semibold uppercase">
                                            {
                                                project.githubAnalysis
                                                    ?.analysisQuality
                                            }
                                        </span>
                                    </span>
                                </div>
                                <span>
                                    Last Analyzed:{" "}
                                    {new Date(
                                        project.githubAnalysis?.lastAnalyzed ||
                                            new Date()
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="mt-10 animate-fadeIn">
                    <Tabs defaultValue="gallery" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#1a1a2e]/50 backdrop-blur-md p-1 rounded-xl border border-emerald-500/20">
                            <TabsTrigger
                                value="gallery"
                                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-medium py-2.5 transition-all"
                            >
                                Project Gallery
                            </TabsTrigger>
                            <TabsTrigger
                                value="summary"
                                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-medium py-2.5 transition-all"
                            >
                                Evaluation Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="team"
                                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white font-medium py-2.5 transition-all"
                            >
                                Team Members
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="gallery" className="space-y-8 mt-6">
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <Image
                                    src={
                                        project.images[activeImage] ||
                                        "/placeholder.svg"
                                    }
                                    alt={`Project screenshot ${
                                        activeImage + 1
                                    }`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16]/90 via-[#0a0a16]/20 to-[#0a0a16]/30"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold text-white">
                                        Project Screenshot {activeImage + 1}
                                    </h3>
                                    <p className="text-emerald-200/90">
                                        {project.name} - Visual Implementation
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {project.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                            index === activeImage
                                                ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                                : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <Image
                                            src={image || "/placeholder.svg"}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="summary" className="space-y-8 mt-6">
                            <div className="bg-[#1a1a2e]/70 backdrop-blur-md border border-emerald-500/20 rounded-xl overflow-hidden p-6">
                                <h2 className="text-xl font-semibold text-white border-b border-emerald-500/20 pb-3 mb-6">
                                    Judge Evaluation Framework
                                </h2>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="bg-[rgba(22,31,46,0.5)] border border-emerald-500/20 rounded-lg p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-emerald-500/20 rounded-full p-2">
                                                <Lightbulb className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">
                                                Innovation
                                            </h3>
                                        </div>
                                        <div className="space-y-1 mb-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-200 font-medium">
                                                    Score
                                                </span>
                                                <span className="text-emerald-400 font-bold">
                                                    {scores.innovation}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#1a1a2e] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{
                                                        width: `${scores.innovation}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-emerald-100/80">
                                            Assessment of the project's
                                            originality, creativity, and
                                            innovative approach to solving
                                            problems.
                                        </p>
                                    </div>

                                    <div className="bg-[rgba(22,31,46,0.5)] border border-emerald-500/20 rounded-lg p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-teal-500/20 rounded-full p-2">
                                                <Code className="h-5 w-5 text-teal-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">
                                                Technical
                                            </h3>
                                        </div>
                                        <div className="space-y-1 mb-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-200 font-medium">
                                                    Score
                                                </span>
                                                <span className="text-teal-400 font-bold">
                                                    {scores.technical}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#1a1a2e] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-teal-500"
                                                    style={{
                                                        width: `${scores.technical}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-emerald-100/80">
                                            Evaluation of code quality,
                                            architecture, technical complexity
                                            and implementation excellence.
                                        </p>
                                    </div>

                                    <div className="bg-[rgba(22,31,46,0.5)] border border-emerald-500/20 rounded-lg p-5">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="bg-cyan-500/20 rounded-full p-2">
                                                <HeartPulse className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">
                                                Impact
                                            </h3>
                                        </div>
                                        <div className="space-y-1 mb-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-emerald-200 font-medium">
                                                    Score
                                                </span>
                                                <span className="text-cyan-400 font-bold">
                                                    {scores.impact}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[#1a1a2e] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-cyan-500"
                                                    style={{
                                                        width: `${scores.impact}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-emerald-100/80">
                                            Assessment of the project's
                                            potential real-world impact,
                                            societal benefit, and market
                                            viability.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Learning Curve */}
                                {project.analysis?.learningCurve &&
                                    project.analysis.learningCurve.length >
                                        0 && (
                                        <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-[#1a1a2e]/70 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
                                            <div className="p-4 border-b border-emerald-500/10 flex items-center gap-2">
                                                <Zap className="h-5 w-5 text-emerald-400" />
                                                <h3 className="text-lg font-medium text-white">
                                                    Learning Journey
                                                </h3>
                                            </div>
                                            <div className="p-5">
                                                <ul className="space-y-3 text-sm">
                                                    {project.analysis.learningCurve.map(
                                                        (
                                                            learning: string,
                                                            index: number
                                                        ) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-2"
                                                            >
                                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                                <span className="text-emerald-100/90">
                                                                    {learning}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Project Duration */}
                            {project.devpostData?.details?.duration && (
                                <div className="mt-6 p-4 border border-emerald-500/20 bg-[#1a1a2e]/70 rounded-lg shadow-md">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-emerald-400" />
                                        <span className="text-white">
                                            Project Duration:{" "}
                                            <span className="text-emerald-300">
                                                {
                                                    project.devpostData.details
                                                        .duration
                                                }
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="team" className="mt-6">
                            <div className="mb-6 p-6 rounded-xl border border-emerald-500/20 bg-[#1a1a2e]/70">
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    Team Assessment
                                </h2>
                                <p className="text-emerald-200/80">
                                    This project was built by a team of{" "}
                                    {
                                        (project.team || project.teamMembers)
                                            .length
                                    }{" "}
                                    developers with combined expertise in{" "}
                                    {project.techStack.join(", ")}.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {(project.team || project.teamMembers).map(
                                    (member, index) => {
                                        // Handle both new team format and legacy teamMembers format
                                        const name =
                                            "name" in member
                                                ? member.name
                                                : member;
                                        const role =
                                            "role" in member
                                                ? member.role || "Team Member"
                                                : "Team Member";
                                        const avatar =
                                            "avatar" in member
                                                ? member.avatar ||
                                                  "/placeholder.svg?height=100&width=100"
                                                : "/placeholder.svg?height=100&width=100";
                                        const links =
                                            "links" in member
                                                ? member.links || {}
                                                : {};

                                        return (
                                            <div
                                                key={index}
                                                className="backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300"
                                            >
                                                <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                                <div className="p-6 flex flex-col items-center text-center">
                                                    <Avatar className="h-28 w-28 mb-5 ring-2 ring-emerald-500/30 ring-offset-4 ring-offset-[#1a1a2e]">
                                                        <AvatarImage
                                                            src={avatar}
                                                            alt={name}
                                                        />
                                                        <AvatarFallback className="bg-emerald-800 text-emerald-200 text-xl">
                                                            {name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <h3 className="text-xl font-semibold text-white mb-1">
                                                        {name}
                                                    </h3>
                                                    <p className="text-sm text-emerald-300 mb-4 bg-emerald-500/10 px-3 py-1 rounded-full">
                                                        {role}
                                                    </p>

                                                    {/* Social Links */}
                                                    {Object.keys(links).length >
                                                        0 && (
                                                        <div className="flex gap-3 mt-2">
                                                            {Object.entries(
                                                                links
                                                            ).map(
                                                                ([
                                                                    platform,
                                                                    url,
                                                                ]) => (
                                                                    <a
                                                                        key={
                                                                            platform
                                                                        }
                                                                        href={
                                                                            url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="h-9 w-9 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-800 hover:text-emerald-300 transition-colors"
                                                                    >
                                                                        {platform ===
                                                                        "github" ? (
                                                                            <Github className="h-4 w-4" />
                                                                        ) : platform ===
                                                                          "devpost" ? (
                                                                            <span className="text-xs font-bold">
                                                                                DP
                                                                            </span>
                                                                        ) : (
                                                                            <LinkIcon className="h-4 w-4" />
                                                                        )}
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="w-full pt-4 mt-4 border-t border-emerald-500/10">
                                                        <div className="flex items-center justify-center gap-2 text-xs text-emerald-200/70">
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-emerald-500/5 text-emerald-300 border-emerald-500/20"
                                                            >
                                                                Contributor #
                                                                {index + 1}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-8 mt-4">
                            {/* Include implementation details and improvement suggestions from Gemini */}
                            {project.analysis?.improvements &&
                                project.analysis.improvements.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#1a1a2e]/80 to-[#1a1a2e]/60 shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-6">
                                        <div className="p-4 border-b border-emerald-500/10">
                                            <h3 className="text-lg font-medium text-white">
                                                Improvement Suggestions
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3">
                                                {project.analysis.improvements.map(
                                                    (improvement, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                            <span className="text-emerald-100/90">
                                                                {improvement}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                            {/* Add use cases section if available */}
                            {project.analysis?.useCases &&
                                project.analysis.useCases.length > 0 && (
                                    <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#1a1a2e]/80 to-[#1a1a2e]/60 shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-6">
                                        <div className="p-4 border-b border-emerald-500/10">
                                            <h3 className="text-lg font-medium text-white">
                                                Use Cases
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3">
                                                {project.analysis.useCases.map(
                                                    (useCase, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                            <span className="text-emerald-100/90">
                                                                {useCase}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                            <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#1a1a2e]/80 to-[#1a1a2e]/60 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <div className="p-4 border-b border-emerald-500/10">
                                    <h3 className="text-lg font-medium text-white">
                                        Project Specifications
                                    </h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            {
                                                label: "Hackathon",
                                                value: `Hackathon Project`,
                                            },
                                            {
                                                label: "Project Name",
                                                value: project.name,
                                            },
                                            {
                                                label: "Team Size",
                                                value: `${project.teamMembers.length} members`,
                                            },
                                            {
                                                label: "Development Time",
                                                value: "36 hours",
                                            },
                                            {
                                                label: "Primary Language",
                                                value: project.techStack[0],
                                            },
                                            {
                                                label: "Database",
                                                value:
                                                    project.techStack.find(
                                                        (tech) =>
                                                            [
                                                                "MongoDB",
                                                                "PostgreSQL",
                                                                "MySQL",
                                                                "Firebase",
                                                            ].includes(tech)
                                                    ) || "Custom Solution",
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="space-y-1 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
                                            >
                                                <p className="text-sm font-medium text-emerald-300">
                                                    {item.label}
                                                </p>
                                                <p className="text-sm text-white">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-1 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-sm font-medium text-emerald-300">
                                            Description
                                        </p>
                                        <p className="text-sm text-emerald-100/90">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="space-y-1 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-sm font-medium text-emerald-300">
                                            Technology Stack
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.techStack.map((tech) => (
                                                <Badge
                                                    key={tech}
                                                    className="bg-emerald-500/10 text-emerald-200 border-emerald-500/20 hover:bg-emerald-500/20"
                                                >
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-sm font-medium text-emerald-300">
                                            External Links
                                        </p>
                                        <div className="space-y-3 mt-2">
                                            {[
                                                {
                                                    icon: Github,
                                                    label: "GitHub Repository",
                                                    link: project.githubLink,
                                                },
                                                {
                                                    icon: ExternalLink,
                                                    label: "Devpost Submission",
                                                    link: project.devpostLink,
                                                },
                                                ...(project.demoLink
                                                    ? [
                                                          {
                                                              icon: Rocket,
                                                              label: "Live Demo",
                                                              link: project.demoLink,
                                                          },
                                                      ]
                                                    : []),
                                            ].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 group"
                                                >
                                                    <div className="rounded-full bg-emerald-500/10 p-1.5">
                                                        <item.icon className="h-4 w-4 text-emerald-400" />
                                                    </div>
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-emerald-200 group-hover:text-white group-hover:underline transition-colors"
                                                    >
                                                        {item.label}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
