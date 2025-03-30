import { Badge } from "@/components/ui/badge";
import { Code, ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    image?: string;
    github?: string;
    devpost?: string;
    score?: number;
    summary?: string;
}

export function ProjectCard({
    id,
    title,
    description,
    techStack,
    image,
    github,
    devpost,
    score,
    summary,
}: ProjectCardProps) {
    // Truncate description to a reasonable length
    const truncatedDescription =
        description.length > 160
            ? description.substring(0, 157) + "..."
            : description;

    // Take only first 3 tech items for display
    const displayTech = techStack.slice(0, 3);
    const extraTechCount = Math.max(0, techStack.length - 3);

    return (
        <div className="h-full group backdrop-blur-md bg-[rgba(26,26,46,0.7)] border border-emerald-500/20 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300">
            {/* Project Image */}
            <div className="relative w-full h-48 overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 flex items-center justify-center">
                        <Code className="h-12 w-12 text-emerald-400/60" />
                    </div>
                )}

                {/* Score badge */}
                {score && (
                    <div className="absolute top-3 right-3 bg-[rgba(0,0,0,0.7)] rounded-lg backdrop-blur-md px-2 py-1 flex items-center gap-1">
                        <Star
                            className="h-3.5 w-3.5 text-yellow-400"
                            fill="#facc15"
                        />
                        <span className="text-xs font-semibold text-white">
                            {score}
                        </span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>

                {/* Tech stack badges */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-24px)]">
                    {displayTech.map((tech) => (
                        <Badge
                            key={tech}
                            className="rounded-md text-xs bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border-emerald-500/20 text-emerald-200"
                        >
                            {tech}
                        </Badge>
                    ))}
                    {extraTechCount > 0 && (
                        <Badge className="rounded-md text-xs bg-[rgba(26,26,46,0.8)] backdrop-blur-sm border-emerald-500/20 text-emerald-200">
                            +{extraTechCount} more
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 truncate group-hover:text-emerald-300 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
                    {truncatedDescription}
                </p>

                {/* Summary if available */}
                {summary && (
                    <div className="bg-emerald-900/20 rounded-lg border border-emerald-500/10 p-3 mb-4">
                        <p className="text-xs text-emerald-200/90 leading-relaxed italic">
                            "
                            {summary.length > 120
                                ? summary.substring(0, 117) + "..."
                                : summary}
                            "
                        </p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-emerald-500/10">
                    <Link
                        href={`/software/${id}`}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        View Details
                    </Link>

                    <div className="flex gap-2">
                        {github && (
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-800 transition-colors"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                        )}

                        {devpost && (
                            <a
                                href={devpost}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-800 transition-colors"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
