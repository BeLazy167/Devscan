"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        quote: "DevScan revolutionized our hackathon judging process. The AI analysis gave us deep insights into each project that would have taken hours to uncover manually.",
        author: "Sarah Chen",
        role: "MLH Hackathon Judge",
    },
    {
        quote: "As a mentor, I use DevScan to quickly understand projects and provide targeted feedback. The technical analysis is remarkably accurate.",
        author: "Michael Rodriguez",
        role: "Senior Developer & Mentor",
    },
    {
        quote: "The search functionality is a game-changer. I can find projects using specific technologies or addressing particular challenges in seconds.",
        author: "Priya Sharma",
        role: "Innovation Director",
    },
];

export function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
                setIsAnimating(false);
            }, 500);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#080812] border-y border-emerald-900/30 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4 bg-emerald-900/20 border border-emerald-500/20 rounded-full px-4 py-1.5">
                        <Quote className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">
                            Testimonials
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        What Users Say
                    </h2>
                    <p className="text-emerald-100/70 max-w-2xl mx-auto">
                        Hear from judges, mentors, and participants who use
                        DevScan to evaluate hackathon projects
                    </p>
                </div>

                <div className="relative max-w-3xl mx-auto min-h-[16rem]">
                    {/* Large quote icons */}
                    <Quote className="absolute top-0 left-0 h-16 w-16 text-emerald-500/10 -translate-x-1/2 -translate-y-1/2" />
                    <Quote className="absolute bottom-0 right-0 h-16 w-16 text-emerald-500/10 translate-x-1/2 translate-y-1/2 rotate-180" />

                    {/* Testimonial container */}
                    <div className="relative bg-[rgba(16,16,32,0.6)] backdrop-blur-md border border-emerald-500/20 rounded-2xl p-8 md:p-10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        {/* Testimonial quote */}
                        <div
                            className={`transition-all duration-500 ease-in-out ${
                                isAnimating
                                    ? "opacity-0 translate-y-4"
                                    : "opacity-100 translate-y-0"
                            }`}
                        >
                            <p className="text-lg md:text-xl text-emerald-100/90 mb-6 italic text-center">
                                "{TESTIMONIALS[activeIndex].quote}"
                            </p>

                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 mb-3 flex items-center justify-center text-white font-bold text-lg">
                                    {TESTIMONIALS[activeIndex].author.charAt(0)}
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-white">
                                        {TESTIMONIALS[activeIndex].author}
                                    </p>
                                    <p className="text-emerald-400/80 text-sm">
                                        {TESTIMONIALS[activeIndex].role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    index === activeIndex
                                        ? "bg-emerald-400 w-4"
                                        : "bg-emerald-400/30 hover:bg-emerald-400/50"
                                }`}
                                onClick={() => {
                                    if (isAnimating) return;
                                    setIsAnimating(true);
                                    setTimeout(() => {
                                        setActiveIndex(index);
                                        setIsAnimating(false);
                                    }, 500);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
