export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  members: string[]
}

export interface TeamMember {
  name: string
  role: string
  avatar: string
}

export interface ProjectDetail {
  id: string
  name: string
  description: string
  techStack: string[]
  devpostLink: string
  githubLink: string
  demoLink?: string
  teamMembers: TeamMember[]
  images: string[]
}

