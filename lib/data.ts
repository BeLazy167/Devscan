interface BaseProject {
    id: string;
    name: string;
    description: string;
    techStack: string[];
}

export interface Project extends BaseProject {
    members: string[];
}

export interface ProjectDetail extends BaseProject {
    devpostLink?: string;
    githubLink?: string;
    demoLink?: string;
    teamMembers: {
        name: string;
        role: string;
        avatar: string;
    }[];
    images: string[];
}

// Mock data - in a real app, this would be fetched from an API
export async function fetchProjects(hackathonId: string): Promise<Project[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
        {
            id: "1",
            name: "EcoTrack",
            description:
                "A sustainability tracking app that helps users monitor and reduce their carbon footprint through daily activities.",
            techStack: ["React", "Node.js", "MongoDB"],
            members: ["Alex Johnson", "Sam Lee", "Taylor Smith"],
        },
        {
            id: "2",
            name: "MediConnect",
            description:
                "Telemedicine platform connecting patients with healthcare providers for virtual consultations and follow-ups.",
            techStack: ["Next.js", "Firebase", "TailwindCSS"],
            members: ["Jamie Rodriguez", "Casey Wong", "Morgan Taylor"],
        },
        {
            id: "3",
            name: "CodeCollab",
            description:
                "Real-time collaborative coding environment for remote teams with integrated video chat and version control.",
            techStack: ["Vue.js", "WebRTC", "Express"],
            members: ["Jordan Patel", "Riley Kim", "Quinn Chen"],
        },
        {
            id: "4",
            name: "FinTrack",
            description:
                "Personal finance management tool with budgeting features, expense tracking, and financial goal setting.",
            techStack: ["React Native", "GraphQL", "PostgreSQL"],
            members: ["Avery Martinez", "Dakota Lee", "Reese Johnson"],
        },
        {
            id: "5",
            name: "StudyBuddy",
            description:
                "AI-powered study assistant that creates personalized learning plans and adaptive quizzes for students.",
            techStack: ["Python", "TensorFlow", "Flask"],
            members: ["Cameron White", "Skyler Brown", "Jordan Green"],
        },
        {
            id: "6",
            name: "FoodShare",
            description:
                "Platform connecting restaurants with excess food to local shelters and food banks to reduce waste.",
            techStack: ["React", "Express", "MongoDB"],
            members: ["Emerson Davis", "Hayden Wilson", "Parker Thomas"],
        },
    ];
}

export async function fetchProjectDetail(
    hackathonId: string,
    projectId: string
): Promise<ProjectDetail> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const projects: Record<string, ProjectDetail> = {
        "1": {
            id: "1",
            name: "EcoTrack",
            description:
                "EcoTrack is a comprehensive sustainability tracking application designed to help users monitor and reduce their carbon footprint through daily activities. The app provides personalized recommendations based on user behavior and location, gamifies eco-friendly actions, and connects users with local sustainability initiatives. Features include carbon emission calculators, sustainable product recommendations, and community challenges.",
            techStack: ["React", "Node.js", "MongoDB", "Express", "Chart.js"],
            devpostLink: "https://devpost.com/software/ecotrack",
            githubLink: "https://github.com/ecotrack/ecotrack",
            demoLink: "https://ecotrack-demo.vercel.app",
            teamMembers: [
                {
                    name: "Alex Johnson",
                    role: "Frontend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Sam Lee",
                    role: "Backend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Taylor Smith",
                    role: "UI/UX Designer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
        "2": {
            id: "2",
            name: "MediConnect",
            description:
                "MediConnect is a telemedicine platform that bridges the gap between patients and healthcare providers through secure virtual consultations. The platform features appointment scheduling, secure video conferencing, digital prescription management, and integration with electronic health records. MediConnect aims to improve healthcare accessibility, especially for underserved communities and those with mobility challenges.",
            techStack: [
                "Next.js",
                "Firebase",
                "TailwindCSS",
                "WebRTC",
                "Stripe",
            ],
            devpostLink: "https://devpost.com/software/mediconnect",
            githubLink: "https://github.com/mediconnect/platform",
            teamMembers: [
                {
                    name: "Jamie Rodriguez",
                    role: "Full Stack Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Casey Wong",
                    role: "Backend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Morgan Taylor",
                    role: "Frontend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
        "3": {
            id: "3",
            name: "CodeCollab",
            description:
                "CodeCollab is a real-time collaborative coding environment designed for remote development teams. The platform supports multiple programming languages, features integrated video chat for team communication, version control integration, and code execution capabilities. CodeCollab aims to streamline remote pair programming and code reviews, making distributed development more efficient and engaging.",
            techStack: ["Vue.js", "WebRTC", "Express", "Socket.io", "Docker"],
            devpostLink: "https://devpost.com/software/codecollab",
            githubLink: "https://github.com/codecollab/app",
            demoLink: "https://codecollab.dev",
            teamMembers: [
                {
                    name: "Jordan Patel",
                    role: "Backend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Riley Kim",
                    role: "Frontend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Quinn Chen",
                    role: "DevOps Engineer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
        "4": {
            id: "4",
            name: "FinTrack",
            description:
                "FinTrack is a comprehensive personal finance management tool that helps users take control of their financial health. The application includes features for budgeting, expense tracking, bill reminders, investment monitoring, and financial goal setting. FinTrack uses data visualization to provide insights into spending patterns and offers personalized recommendations for improving financial habits.",
            techStack: [
                "React Native",
                "GraphQL",
                "PostgreSQL",
                "Apollo",
                "D3.js",
            ],
            devpostLink: "https://devpost.com/software/fintrack",
            githubLink: "https://github.com/fintrack/mobile-app",
            teamMembers: [
                {
                    name: "Avery Martinez",
                    role: "Mobile Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Dakota Lee",
                    role: "Backend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Reese Johnson",
                    role: "Data Scientist",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
        "5": {
            id: "5",
            name: "StudyBuddy",
            description:
                "StudyBuddy is an AI-powered study assistant designed to optimize learning outcomes for students. The application creates personalized learning plans based on individual learning styles, generates adaptive quizzes that focus on areas needing improvement, and provides spaced repetition reminders to enhance retention. StudyBuddy also features collaborative study groups and progress tracking to keep students motivated.",
            techStack: ["Python", "TensorFlow", "Flask", "React", "MongoDB"],
            devpostLink: "https://devpost.com/software/studybuddy-ai",
            githubLink: "https://github.com/studybuddy/learning-platform",
            demoLink: "https://studybuddy.ai",
            teamMembers: [
                {
                    name: "Cameron White",
                    role: "Machine Learning Engineer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Skyler Brown",
                    role: "Frontend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Jordan Green",
                    role: "Backend Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
        "6": {
            id: "6",
            name: "FoodShare",
            description:
                "FoodShare is a platform that addresses food waste and food insecurity by connecting restaurants and grocery stores with excess food to local shelters and food banks. The application includes features for inventory management, real-time notifications, delivery coordination, and impact tracking. FoodShare aims to create a more sustainable food ecosystem while helping those in need.",
            techStack: [
                "React",
                "Express",
                "MongoDB",
                "Node.js",
                "Google Maps API",
            ],
            devpostLink: "https://devpost.com/software/foodshare",
            githubLink: "https://github.com/foodshare/platform",
            teamMembers: [
                {
                    name: "Emerson Davis",
                    role: "Full Stack Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Hayden Wilson",
                    role: "Mobile Developer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
                {
                    name: "Parker Thomas",
                    role: "UI/UX Designer",
                    avatar: "/placeholder.svg?height=40&width=40",
                },
            ],
            images: [
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
                "/placeholder.svg?height=300&width=500",
            ],
        },
    };

    return projects[projectId] || projects["1"];
}
