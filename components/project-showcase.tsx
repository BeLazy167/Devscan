"use client";

import { useState, useEffect, useRef } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Github,
    ExternalLink,
    Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Project item interface for type safety
interface ProjectItem {
    id: string;
    title: string;
    description: string;
    image: string;
    techStack: string[];
    score: number;
    url: string;
    github?: string;
}

// Real projects from actual hackathons
const SHOWCASE_PROJECTS: ProjectItem[] = [
    {
        id: "smart-pill-dispenser",
        title: "Smart Pill Dispenser",
        description:
            "An IoT-powered solution that dispenses medication at scheduled times and sends reminders to patients, caregivers, and healthcare providers.",
        image: "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/002/692/470/datas/medium.png",
        techStack: ["Arduino", "React", "Node.js", "MongoDB"],
        score: 96,
        url: "https://devpost.com/software/smart-pill-dispenser-mkje5w",
        github: "https://github.com/smart-pill-team/smart-pill-dispenser",
    },
    {
        id: "harvest-helper",
        title: "Harvest Helper",
        description:
            "AI-based crop monitoring system using drone imagery to detect plant diseases and optimize irrigation in real-time.",
        image: "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/002/605/978/datas/medium.png",
        techStack: ["TensorFlow", "Python", "React", "AWS"],
        score: 94,
        url: "https://devpost.com/software/harvest-helper-s5zc6e",
        github: "https://github.com/agritech-team/harvest-helper",
    },
    {
        id: "medblock",
        title: "MedBlock",
        description:
            "Blockchain-based electronic health record system providing secure, patient-controlled health data sharing between healthcare providers.",
        image: "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/002/563/981/datas/medium.png",
        techStack: ["Solidity", "Ethereum", "React", "Express"],
        score: 92,
        url: "https://devpost.com/software/medblock-secure-health-records",
        github: "https://github.com/medblock/healthchain",
    },
    {
        id: "ecotrack",
        title: "EcoTrack",
        description:
            "Mobile app that gamifies reducing carbon footprint by tracking daily activities and providing personalized sustainability challenges.",
        image: "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/002/640/371/datas/medium.png",
        techStack: ["Flutter", "Firebase", "TensorFlow", "Google Maps API"],
        score: 90,
        url: "https://devpost.com/software/ecotrack-sustainable-living",
        github: "https://github.com/sustainability-team/ecotrack-app",
    },
    {
        id: "signspeak",
        title: "SignSpeak",
        description:
            "Real-time sign language translator using computer vision to convert sign language to text and speech, bridging communication gaps.",
        image: "https://d112y698adiu2z.cloudfront.net/photos/production/software_thumbnail_photos/002/631/498/datas/medium.png",
        techStack: ["PyTorch", "OpenCV", "React Native", "Google Cloud"],
        score: 95,
        url: "https://devpost.com/software/signspeak-translator",
        github: "https://github.com/accessibility-team/signspeak",
    },
];

export function ProjectShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const nextProject = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PROJECTS.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevProject = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(
            (prev) =>
                (prev - 1 + SHOWCASE_PROJECTS.length) % SHOWCASE_PROJECTS.length
        );
        setTimeout(() => setIsAnimating(false), 500);
    };

    useEffect(() => {
        // Auto-advance carousel every 5 seconds
        const interval = setInterval(nextProject, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentProject = SHOWCASE_PROJECTS[currentIndex];

    return (
        <div className="w-full max-w-5xl mx-auto relative">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Featured Projects
                </h2>
                <p className="text-emerald-100/70 max-w-2xl mx-auto">
                    Discover some of the most innovative hackathon projects
                    analyzed by DevScan
                </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-[rgba(16,16,32,0.6)] backdrop-blur-md border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>

                <div
                    ref={containerRef}
                    className="grid md:grid-cols-2 gap-6 p-6 relative z-10"
                >
                    {/* Project Image */}
                    <div className="relative h-64 md:h-full rounded-xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>

                        {currentProject.image ? (
                            <div
                                className={`absolute inset-0 transition-all duration-500 ${
                                    isAnimating
                                        ? "opacity-0 scale-95"
                                        : "opacity-100 scale-100"
                                }`}
                            >
                                <Image
                                    src={currentProject.image}
                                    alt={currentProject.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 flex items-center justify-center">
                                <Code className="h-12 w-12 text-emerald-400/60" />
                            </div>
                        )}

                        {/* Score badge */}
                        <div className="absolute top-3 right-3 bg-[rgba(0,0,0,0.7)] rounded-lg backdrop-blur-md px-3 py-1.5 flex items-center gap-1.5 z-20">
                            <svg
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-white">
                                {currentProject.score}
                            </span>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="flex flex-col">
                        <div
                            className={`transition-all duration-500 ${
                                isAnimating
                                    ? "opacity-0 translate-y-4"
                                    : "opacity-100 translate-y-0"
                            }`}
                        >
                            <h3 className="text-2xl font-bold text-white mb-3">
                                {currentProject.title}
                            </h3>

                            <p className="text-emerald-100/80 mb-4">
                                {currentProject.description}
                            </p>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {currentProject.techStack.map((tech) => (
                                    <Badge
                                        key={tech}
                                        className="bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/20"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-emerald-500/30 hover:bg-emerald-950/30 text-emerald-300"
                                    onClick={() =>
                                        window.open(
                                            currentProject.url ||
                                                `/software/${currentProject.id}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    View Details
                                </Button>

                                {currentProject.github && (
                                    <Button
                                        variant="outline"
                                        className="border-emerald-500/30 hover:bg-emerald-950/30 text-emerald-300"
                                        onClick={() =>
                                            window.open(
                                                currentProject.github,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <Github className="h-4 w-4 mr-2" />
                                        Code
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation arrows */}
                <button
                    onClick={prevProject}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2 transition-all z-20"
                    disabled={isAnimating}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                    onClick={nextProject}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white p-2 transition-all z-20"
                    disabled={isAnimating}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {SHOWCASE_PROJECTS.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                                index === currentIndex
                                    ? "bg-emerald-400 w-4"
                                    : "bg-emerald-400/30 hover:bg-emerald-400/50"
                            }`}
                            onClick={() => {
                                if (isAnimating) return;
                                setIsAnimating(true);
                                setCurrentIndex(index);
                                setTimeout(() => setIsAnimating(false), 500);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
