"use client";

import { useEffect, useRef } from "react";
import { Code } from "lucide-react";

export function HeroAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cubeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrame: number;
        let rotationX = 0;
        let rotationY = 0;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate rotation based on mouse position relative to center
            targetRotationY = ((e.clientX - centerX) / rect.width) * 20;
            targetRotationX = ((e.clientY - centerY) / rect.height) * -20;
        };

        const animate = () => {
            // Smooth rotation
            rotationX += (targetRotationX - rotationX) * 0.1;
            rotationY += (targetRotationY - rotationY) * 0.1;

            if (cubeRef.current) {
                cubeRef.current.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        document.addEventListener("mousemove", handleMouseMove);
        animationFrame = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-64 h-64 md:w-80 md:h-80 perspective-1000 mx-auto relative"
        >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/30 blur-3xl animate-pulse"></div>

            {/* 3D Cube */}
            <div
                ref={cubeRef}
                className="w-full h-full relative transform-style-3d transition-transform duration-300 ease-out"
            >
                {/* Cube faces */}
                {[
                    // Front
                    {
                        transform: "translateZ(8rem)",
                        bg: "from-emerald-900/80 to-teal-900/80",
                        snippet: "function analyze() {",
                    },
                    // Back
                    {
                        transform: "rotateY(180deg) translateZ(8rem)",
                        bg: "from-emerald-900/80 to-teal-900/80",
                        snippet: "return insights;",
                    },
                    // Left
                    {
                        transform: "rotateY(-90deg) translateZ(8rem)",
                        bg: "from-emerald-800/80 to-teal-800/80",
                        snippet: "const data = {",
                    },
                    // Right
                    {
                        transform: "rotateY(90deg) translateZ(8rem)",
                        bg: "from-emerald-800/80 to-teal-800/80",
                        snippet: "AI.process(code);",
                    },
                    // Top
                    {
                        transform: "rotateX(90deg) translateZ(8rem)",
                        bg: "from-emerald-700/80 to-teal-700/80",
                        snippet: "import { analyze }",
                    },
                    // Bottom
                    {
                        transform: "rotateX(-90deg) translateZ(8rem)",
                        bg: "from-emerald-700/80 to-teal-700/80",
                        snippet: "export default AI;",
                    },
                ].map((face, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-md border border-emerald-500/30 bg-gradient-to-br ${face.bg} transform-style-3d`}
                        style={{ transform: face.transform }}
                    >
                        <div className="p-6 text-center">
                            <Code className="h-10 w-10 text-emerald-400 mb-4 mx-auto" />
                            <pre className="font-mono text-emerald-300 text-sm">
                                {face.snippet}
                            </pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
