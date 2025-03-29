"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectGrid from "@/components/project-grid"
import ProjectsLoading from "@/components/projects-loading"

export default function HackathonPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#0a0a16] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-emerald-200 hover:text-white hover:bg-emerald-500/10"
          >
            <Link href="/" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="space-y-8 max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
              MLH Hackathon #{params.id}
            </h1>
          </div>

          <p className="text-emerald-100/80 text-lg">
            Browse all the amazing projects submitted to this hackathon. Click on any project to view more details.
          </p>

          <div className="bg-[#1a1a2e]/50 backdrop-blur-md border border-emerald-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 text-emerald-200">
              <div className="bg-emerald-500/10 rounded-full p-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p>
                <span className="font-semibold">Pro Tip:</span> Hover over projects to see more details and click to
                explore in-depth.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<ProjectsLoading />}>
          <ProjectGrid hackathonId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}

