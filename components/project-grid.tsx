"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { fetchProjects } from "@/lib/data";
import type { Project } from "@/lib/data";
import ProjectsLoading from "./projects-loading";

export default function ProjectGrid({ hackathonId }: { hackathonId: string }) {
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProjects = async () => {
            try {
                const data = await fetchProjects(hackathonId);
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        getProjects();
    }, [hackathonId]);

    if (loading) {
        return <ProjectsLoading />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="cursor-pointer backdrop-blur-md bg-[#1a1a2e]/50 rounded-xl overflow-hidden border border-emerald-500/20 h-full hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 relative group"
                    onClick={() =>
                        router.push(
                            `/hackathons/${hackathonId}/project/${project.id}`
                        )
                    }
                >
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/70 to-teal-500/70 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                    <div className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-200 transition-colors duration-300">
                                {project.name}
                            </h3>
                            <p className="text-emerald-100/70 line-clamp-2 mb-4">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.techStack.map((tech) => (
                                    <Badge
                                        key={tech}
                                        className="bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="mt-auto">
                            <p className="text-sm text-emerald-300/80 mb-2">
                                <span className="font-medium">Team:</span>{" "}
                                {project.members.join(", ")}
                            </p>
                            <Badge
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-200"
                            >
                                MLH Hackathon #{hackathonId}
                            </Badge>
                        </div>
                    </div>

                    {/* Hover effect glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            ))}
        </div>
    );
}
