import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function ProjectDetailLoading() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                <div className="animate-spin">
                    <Loader2 className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white animate-pulse">
                    Loading Project Data
                </h2>
                <p className="text-emerald-100/70 text-center max-w-lg">
                    We're fetching and analyzing this hackathon project. If this
                    is the first time viewing this project, our AI is generating
                    deep insights which may take a moment to complete.
                </p>
                <div className="text-sm text-emerald-100/50 mt-8 text-center">
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Checking for cached analysis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/60"></div>
                            <span>Retrieving project data from DevPost</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
                            <span>Analyzing project with AI</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500/20"></div>
                            <span>
                                Processing GitHub repository (if available)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
