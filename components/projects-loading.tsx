"use client"

export default function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="backdrop-blur-md bg-[#1a1a2e]/50 rounded-xl overflow-hidden border border-emerald-500/20 h-full shadow-[0_0_20px_rgba(16,185,129,0.05)]"
        >
          <div className="p-6 flex flex-col h-full space-y-4">
            <div className="h-7 w-3/4 bg-emerald-500/10 rounded-md"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-emerald-500/10 rounded-md"></div>
              <div className="h-4 w-5/6 bg-emerald-500/10 rounded-md"></div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-5 w-16 bg-emerald-500/10 rounded-full"></div>
              ))}
            </div>
            <div className="mt-auto space-y-2">
              <div className="h-4 w-3/4 bg-emerald-500/10 rounded-md"></div>
              <div className="h-5 w-1/3 bg-emerald-500/10 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

