export interface ProfileData {
  id: string
  fullName: string
  title: string
  bio: string
  about: string
  email: string
  resume: string | null
  linkedin: string | null
  github: string | null
  facebook: string | null
  updatedAt: string
  photos: { id: string; image: string; order: number }[]
  roles: { id: string; title: string }[]
}

export interface SkillData {
  id: string
  name: string
  icon: string | null
}

export interface ProjectData {
  id: string
  title: string
  description: string
  techStack: string
  githubLink: string | null
  liveLink: string | null
  image: string | null
  createdAt: string
}

export interface CertificationData {
  id: string
  title: string
  description: string
  issuer: string
  dateAwarded: string | null
  certificateUrl: string | null
  image: string | null
  createdAt: string
}
