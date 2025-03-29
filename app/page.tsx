"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Code, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Calculate parallax effect based on mouse position
  const calcParallax = (depth = 10) => {
    const x = (window.innerWidth / 2 - mousePosition.x) / depth
    const y = (window.innerHeight / 2 - mousePosition.y) / depth
    return { x, y }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[#0a0a16] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_50%)]"></div>

        {/* Animated background shapes */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 blur-xl animate-blob"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Animated logo/icon */}
          <div className="mb-8 relative">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 blur-md opacity-70"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Code className="text-white w-10 h-10" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/30 animate-pulse"></div>
            </div>

            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-float"
                style={{
                  top: `${50 + (Math.random() - 0.5) * 20}%`,
                  left: `${50 + (Math.random() - 0.5) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Main heading with staggered animation */}
          <div className="overflow-hidden mb-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
              Welcome to, 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                {" "}
                DevScan
              </span>
            </h1>
          </div>

          {/* Animated subtitle */}
          <div className="mb-10">
            <p className="text-xl text-emerald-100/80 max-w-2xl">
              Discover extraordinary projects from Major League Hacking events around the world
            </p>
          </div>

          {/* Animated CTA button */}
          <div
            className="relative"
            style={{
              transform: `translate(${calcParallax(100).x}px, ${calcParallax(100).y}px)`,
            }}
          >
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 opacity-70 blur-lg group-hover:opacity-100 transition duration-1000"></div>
            <Button
              size="lg"
              onClick={() => router.push("/hackathons/1")}
              className="relative bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border-0 px-8 py-7 text-lg rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all duration-300 group"
            >
              <span className="mr-2">Explore MLH Projects</span>
              <span className="animate-bounce-x">
                <ChevronRight className="h-5 w-5" />
              </span>
              <span className="absolute inset-0 rounded-lg border border-emerald-400/50 animate-pulse"></span>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl">
            {[
              {
                icon: <Code className="h-6 w-6 text-emerald-400" />,
                title: "Innovative Projects",
                description: "Explore cutting-edge hackathon submissions",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-emerald-400" />,
                title: "Talented Teams",
                description: "Connect with brilliant developers and designers",
              },
              {
                icon: <Zap className="h-6 w-6 text-emerald-400" />,
                title: "Inspiring Ideas",
                description: "Discover solutions to real-world problems",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[rgba(16,16,32,0.6)] backdrop-blur-sm border border-emerald-500/20 rounded-xl p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <div className="bg-[rgba(16,185,129,0.2)] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-emerald-100/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

