import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectDetail from "@/components/project-detail";
import ProjectDetailLoading from "@/components/project-detail-loading";
import ClientPage from "./client-page";

export default function ProjectPage({
    params,
}: {
    params: { id: string; projectId?: string };
}) {
    return (
        <div className="min-h-screen bg-[#0a0a16] text-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#6366f1_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="relative z-10 container mx-auto py-8 px-4">
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-indigo-200 hover:text-white hover:bg-indigo-500/10"
                    >
                        <Link
                            href={`/hackathons/${params.id}`}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to Projects
                        </Link>
                    </Button>
                </div>

                <Suspense fallback={<ProjectDetailLoading />}>
                    <ClientPage id={params.id} />
                </Suspense>
            </div>
        </div>
    );
}
