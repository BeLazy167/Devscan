import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a16] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#6366f1_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32 rounded-md bg-indigo-500/10" />
            </div>

            <Skeleton className="h-12 w-3/4 max-w-xl bg-indigo-500/10" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-16 rounded-full bg-indigo-500/10" />
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-indigo-500/10" />
              <Skeleton className="h-4 w-full bg-indigo-500/10" />
              <Skeleton className="h-4 w-3/4 bg-indigo-500/10" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl overflow-hidden border border-indigo-500/20 bg-[#1a1a2e]/70 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 py-4">
                <Skeleton className="h-6 w-40 mx-auto bg-indigo-500/10" />
              </div>
              <div className="p-6">
                <Skeleton className="h-40 w-40 rounded-full mx-auto mb-6 bg-indigo-500/10" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24 bg-indigo-500/10" />
                        <Skeleton className="h-4 w-10 bg-indigo-500/10" />
                      </div>
                      <Skeleton className="h-2 w-full bg-indigo-500/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-1 rounded-lg border border-indigo-500/20 bg-[#1a1a2e]/70 shadow-sm">
                  <div className="p-4">
                    <Skeleton className="h-8 w-full bg-indigo-500/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="gallery">
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-[#1a1a2e]/50 backdrop-blur-md p-1 rounded-xl">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-8 mt-4">
              <Skeleton className="aspect-video w-full rounded-xl bg-indigo-500/10" />

              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video w-full rounded-lg bg-indigo-500/10" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

