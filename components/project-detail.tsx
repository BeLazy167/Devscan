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
import { fetchProjectDetail } from "@/lib/data";
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
        technicalHighlights?: string;
        keyFeatures?: string[];
        complexity?: string;
        useCases?: string[];
        improvements?: string[];
    };
}

export default function ProjectDetail({
    hackathonId,
    projectId,
    devpostData,
}: {
    hackathonId: string;
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
                        name: devpostData.title || "Project",
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
                    });
                } else if (projectId) {
                    // Only fetch if we have a projectId
                    const data = await fetchProjectDetail(
                        hackathonId,
                        projectId
                    );
                    setProject(data);
                } else {
                    // Fallback to first project
                    const data = await fetchProjectDetail(hackathonId, "1");
                    setProject(data);
                }
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjectDetail();
    }, [hackathonId, projectId, devpostData]);

    if (loading || !project) {
        return <ProjectDetailLoading />;
    }

    // Generate some scores for demonstration
    const scores = {
        innovation: 85,
        technical: 92,
        design: 88,
        impact: 90,
        overall: 89,
    };

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
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a16] text-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#10b981_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 container mx-auto py-12 px-4">
                <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="outline"
                                className="px-3 py-1 text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                            >
                                MLH Hackathon #{hackathonId}
                            </Badge>
                            {project.demoLink && (
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1 text-xs border-teal-500/30 bg-teal-500/10 text-teal-200"
                                >
                                    <LinkIcon className="mr-1 h-3 w-3" /> Live
                                    Demo
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
                            {project.name}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <Badge
                                    key={tech}
                                    className="rounded-md bg-[#1a1a2e] border-emerald-500/20 text-emerald-200"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>

                        <p className="text-emerald-100/80 leading-relaxed">
                            {project.description}
                        </p>

                        {/* GitHub Code Analysis Card */}
                        <div className="backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] mt-8">
                            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 py-4">
                                <h3 className="text-center text-lg flex items-center justify-center gap-2 text-white">
                                    <Code className="h-5 w-5 text-emerald-400" />
                                    <span>GitHub Code Analysis</span>
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Technical Overview */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-emerald-300">
                                        Technical Overview
                                    </h4>
                                    <p className="text-sm text-emerald-100/80">
                                        {project.analysis?.summary ||
                                            "This project demonstrates clean architecture with modular components and efficient state management. The codebase follows modern development practices with comprehensive documentation and test coverage."}
                                    </p>
                                </div>

                                {/* Architecture & Tech Stack */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-emerald-300">
                                        Architecture & Tech Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <Badge
                                                key={tech}
                                                className="rounded-md bg-[#1a1a2e] border-emerald-500/20 text-emerald-200"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Engineering Highlights */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-emerald-300">
                                        Engineering Highlights
                                    </h4>
                                    <ul className="space-y-2 text-sm text-emerald-100/80">
                                        {project.analysis
                                            ?.technicalHighlights ? (
                                            <li className="flex items-start gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                <span>
                                                    {
                                                        project.analysis
                                                            .technicalHighlights
                                                    }
                                                </span>
                                            </li>
                                        ) : (
                                            <>
                                                <li className="flex items-start gap-2">
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span>
                                                        Implemented efficient
                                                        algorithms reducing
                                                        processing time by 40%
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span>
                                                        Modular architecture
                                                        with clear separation of
                                                        concerns
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span>
                                                        Comprehensive test
                                                        coverage with 85%+ unit
                                                        test coverage
                                                    </span>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                {/* Technical Complexity */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-emerald-300">
                                        Technical Complexity
                                    </h4>
                                    <div className="space-y-3">
                                        <ProgressBar
                                            value={78}
                                            label={
                                                project.analysis?.complexity ||
                                                "Code Complexity"
                                            }
                                            color="#10b981"
                                        />
                                        <ProgressBar
                                            value={92}
                                            label="Test Coverage"
                                            color="#0d9488"
                                        />
                                        <ProgressBar
                                            value={85}
                                            label="Documentation"
                                            color="#0f766e"
                                        />
                                    </div>
                                </div>

                                {/* Language Distribution */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-emerald-300">
                                        Language Distribution
                                    </h4>
                                    <div className="flex items-center gap-2 h-4 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500"
                                            style={{ width: "65%" }}
                                        ></div>
                                        <div
                                            className="h-full bg-teal-500"
                                            style={{ width: "20%" }}
                                        ></div>
                                        <div
                                            className="h-full bg-cyan-500"
                                            style={{ width: "10%" }}
                                        ></div>
                                        <div
                                            className="h-full bg-sky-500"
                                            style={{ width: "5%" }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 text-xs text-emerald-200/80">
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            <span>TypeScript (65%)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                                            <span>CSS (20%)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                                            <span>JavaScript (10%)</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-sky-500"></div>
                                            <span>Other (5%)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 py-4">
                                <h3 className="text-center text-lg flex items-center justify-center gap-2 text-white">
                                    <Award className="h-5 w-5 text-emerald-400" />
                                    <span>Project Score</span>
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center mb-8">
                                    <div className="relative h-40 w-40 flex items-center justify-center">
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
                                                strokeDasharray={`${
                                                    scores.overall * 2.83
                                                } 283`}
                                                strokeDashoffset="0"
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
                                            <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                                                {scores.overall}
                                            </span>
                                            <span className="text-xs text-emerald-300/70">
                                                OVERALL
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
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
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <a
                                href={project.devpostLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <div className="h-full bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                                    <div className="p-4 flex items-center justify-center gap-2">
                                        <ExternalLink className="h-4 w-4 text-emerald-400" />
                                        <span className="font-medium text-sm text-emerald-100">
                                            Devpost
                                        </span>
                                    </div>
                                </div>
                            </a>

                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <div className="h-full bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                                    <div className="p-4 flex items-center justify-center gap-2">
                                        <Github className="h-4 w-4 text-emerald-400" />
                                        <span className="font-medium text-sm text-emerald-100">
                                            GitHub
                                        </span>
                                    </div>
                                </div>
                            </a>

                            {project.demoLink && (
                                <a
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <div className="h-full bg-[rgba(26,26,46,0.7)] backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/50 rounded-lg shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                                        <div className="p-4 flex items-center justify-center gap-2">
                                            <Rocket className="h-4 w-4 text-emerald-400" />
                                            <span className="font-medium text-sm text-emerald-100">
                                                Demo
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <Tabs defaultValue="gallery" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-12 bg-[#1a1a2e]/50 backdrop-blur-md p-1 rounded-xl">
                            <TabsTrigger
                                value="gallery"
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                            >
                                Gallery
                            </TabsTrigger>
                            <TabsTrigger
                                value="summary"
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                            >
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                                value="team"
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                            >
                                Team
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                            >
                                Details
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="gallery" className="space-y-8 mt-4">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16]/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold text-white">
                                        Project Screenshot {activeImage + 1}
                                    </h3>
                                    <p className="text-emerald-200/80">
                                        Explore the visual elements of{" "}
                                        {project.name}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
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

                        <TabsContent value="summary" className="space-y-8 mt-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-[#1a1a2e] to-[#1a1a2e]/70 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <div className="p-4 border-b border-emerald-500/10 bg-emerald-500/5 flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-emerald-400" />
                                        <h3 className="text-lg font-medium text-white">
                                            Key Features
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <ul className="space-y-3 text-sm">
                                            {(
                                                project.analysis
                                                    ?.keyFeatures || [
                                                    "Intuitive user interface with responsive design",
                                                    "Real-time data synchronization and updates",
                                                    "Advanced analytics and reporting capabilities",
                                                    "Integration with popular third-party services",
                                                ]
                                            ).map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span className="text-emerald-100/90">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-[#1a1a2e]/70 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                    <div className="p-4 border-b border-emerald-500/10 flex items-center gap-2">
                                        <Code className="h-5 w-5 text-emerald-400" />
                                        <h3 className="text-lg font-medium text-white">
                                            Technical Highlights
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <ul className="space-y-3 text-sm">
                                            {[
                                                `Implemented ${project.techStack
                                                    .slice(0, 2)
                                                    .join(
                                                        " and "
                                                    )} for the frontend`,
                                                `Utilized ${project.techStack
                                                    .slice(2, 4)
                                                    .join(
                                                        " with "
                                                    )} for backend services`,
                                                "Optimized performance with efficient data structures",
                                                "Secure authentication and data protection",
                                            ].map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span className="text-emerald-100/90">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="backdrop-blur-md bg-[#1a1a2e]/50 rounded-xl overflow-hidden border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <div className="p-4 border-b border-emerald-500/10 bg-emerald-500/5 flex items-center gap-2">
                                        <HeartPulse className="h-5 w-5 text-emerald-400" />
                                        <h3 className="text-lg font-medium text-white">
                                            Impact & Potential
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <ul className="space-y-3 text-sm">
                                            {[
                                                `Addresses key challenges in ${
                                                    project.name
                                                        .toLowerCase()
                                                        .includes("eco")
                                                        ? "sustainability"
                                                        : project.name
                                                              .toLowerCase()
                                                              .includes("medi")
                                                        ? "healthcare"
                                                        : project.name
                                                              .toLowerCase()
                                                              .includes("code")
                                                        ? "developer productivity"
                                                        : project.name
                                                              .toLowerCase()
                                                              .includes("fin")
                                                        ? "personal finance"
                                                        : project.name
                                                              .toLowerCase()
                                                              .includes("study")
                                                        ? "education"
                                                        : project.name
                                                              .toLowerCase()
                                                              .includes("food")
                                                        ? "food distribution"
                                                        : "its domain"
                                                }`,
                                                "Potential to scale and benefit thousands of users",
                                                "Designed with accessibility and inclusivity in mind",
                                                "Sustainable long-term development roadmap",
                                            ].map((feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2"
                                                >
                                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                                    <span className="text-emerald-100/90">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_70%)] shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                    <div className="p-4 border-b border-emerald-500/10 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-emerald-400" />
                                        <h3 className="text-lg font-medium text-white">
                                            Achievements
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                {
                                                    icon: Star,
                                                    title: "Best Technical Implementation",
                                                },
                                                {
                                                    icon: Lightbulb,
                                                    title: "Most Innovative Solution",
                                                },
                                                {
                                                    icon: HeartPulse,
                                                    title: "Greatest Social Impact",
                                                },
                                                {
                                                    icon: Award,
                                                    title: "Finalist Selection",
                                                },
                                            ].map((achievement, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-lg border border-emerald-500/20 bg-[#1a1a2e]/70 p-3 text-center shadow-sm hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300"
                                                >
                                                    <achievement.icon className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                                                    <p className="text-xs font-medium text-emerald-100">
                                                        {achievement.title}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="team" className="space-y-8 mt-4">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {project.teamMembers.map((member, index) => (
                                    <div
                                        key={member.name}
                                        className="backdrop-blur-md bg-[#1a1a2e]/50 rounded-xl overflow-hidden border border-emerald-500/20 h-full hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300"
                                    >
                                        <div className="p-6 flex flex-col items-center text-center">
                                            <div className="relative mb-6">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-md opacity-70"></div>
                                                <Avatar className="h-24 w-24 border-4 border-[#1a1a2e] relative z-10">
                                                    <AvatarImage
                                                        src={member.avatar}
                                                        alt={member.name}
                                                    />
                                                    <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                                                        {member.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <h3 className="font-bold text-xl mb-1 text-white">
                                                {member.name}
                                            </h3>
                                            <p className="text-sm text-emerald-300/80 mb-6">
                                                {member.role}
                                            </p>
                                            <div className="flex gap-3 mt-auto">
                                                <div className="rounded-full bg-emerald-500/10 p-2 cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                                    <Github className="h-4 w-4 text-emerald-400" />
                                                </div>
                                                <div className="rounded-full bg-emerald-500/10 p-2 cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                                    <LinkIcon className="h-4 w-4 text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                                value: `MLH Hackathon #${hackathonId}`,
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
