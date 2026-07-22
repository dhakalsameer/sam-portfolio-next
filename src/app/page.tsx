"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/sections/Navbar"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import SkillsSection from "@/components/sections/SkillsSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import CertificatesSection from "@/components/sections/CertificatesSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/sections/Footer"
import type { ProfileData, SkillData, ProjectData, CertificationData } from "@/types"

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [skills, setSkills] = useState<SkillData[]>([])
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [certificates, setCertificates] = useState<CertificationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/skills").then(r => r.json()),
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/certificates").then(r => r.json()),
    ]).then(([profileData, skillsData, projectsData, certsData]) => {
      setProfile(profileData)
      setSkills(skillsData)
      setProjects(projectsData)
      setCertificates(certsData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terminal-bg">
        <div className="text-terminal-green text-lg animate-pulse">[ LOADING SYSTEM... ]</div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>
      <Footer />
    </>
  )
}
