"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, ExternalLink } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons"
import TerminalWindow from "@/components/ui/TerminalWindow"
import type { ProfileData } from "@/types"
import { useEffect, useState, useRef } from "react"
import { cl } from "@/lib/images"

export default function HeroSection({ profile }: { profile: ProfileData | null }) {
  const [typedText, setTypedText] = useState("")
  const photos = profile?.photos ?? []
  const [photoIndex, setPhotoIndex] = useState(0)

  const roles = [
    ...(profile?.roles?.map(r => r.title) ?? []),
  ].filter(Boolean) as string[]

  const fallbackRoles = ["Backend & Web3 Developer", "Linux Enthusiast", "Open Source Contributor"]
  const rolesRef = useRef(roles.length > 0 ? roles : fallbackRoles)

  if (roles.length > 0) {
    rolesRef.current = roles
  }

  useEffect(() => {
    if (photos.length < 2) return
    const interval = setInterval(() => {
      setPhotoIndex(i => (i + 1) % photos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [photos.length])

  useEffect(() => {
    let current = 0
    let char = 0
    let deleting = false
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const word = rolesRef.current[current]
      if (deleting) {
        setTypedText(word.slice(0, --char))
      } else {
        setTypedText(word.slice(0, ++char))
      }

      if (!deleting && char === word.length) {
        timeout = setTimeout(() => { deleting = true; tick() }, 1500)
        return
      }
      if (deleting && char === 0) {
        deleting = false
        current = (current + 1) % rolesRef.current.length
      }
      timeout = setTimeout(tick, deleting ? 40 : 70)
    }

    timeout = setTimeout(tick, 100)
    return () => clearTimeout(timeout)
  }, [])

  function scrollToAbout() {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="min-h-[80vh] flex items-center justify-center relative px-4 pt-6">
      <div className="max-w-3xl mx-auto w-full">


        <TerminalWindow title="sameer@ubuntu:~" className="mb-4">
          <div className="text-center">
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative w-36 h-36 sm:w-56 sm:h-56 mx-auto mb-2 sm:mb-3 rounded-xl overflow-hidden border-2 border-terminal-green/40 shadow-lg shadow-terminal-green/10"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={photoIndex}
                    src={cl(photos[photoIndex].image, 256)}
                    alt={profile?.fullName ?? "Profile photo"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-terminal-text text-base font-semibold mb-4"
            >
              <span className="text-terminal-green">$</span> whoami
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-terminal-text-bright via-terminal-green/80 to-terminal-blue/60 bg-clip-text text-transparent">{profile?.fullName || "Sameer Dhakal"}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-terminal-text text-base font-semibold mb-3"
            >
              <span className="text-terminal-green">$</span> echo $ROLE
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl text-terminal-green mb-4 h-8"
            >
              <span>{typedText}</span>
              <span className="animate-pulse">|</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-terminal-text text-base font-semibold mb-2"
            >
              <span className="text-terminal-green">$</span> cat bio.txt
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-terminal-text-dim text-base sm:text-lg max-w-xl mx-auto mb-6"
            >
              {profile?.bio || "Building scalable backends, exploring Web3, and automating everything on Linux."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-terminal-border rounded text-base text-terminal-text-dim hover:text-terminal-green hover:border-terminal-green transition-all">
                  <GithubIcon size={18} /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 border border-terminal-border rounded text-base text-terminal-text-dim hover:text-terminal-green hover:border-terminal-green transition-all">
                  <LinkedinIcon size={18} /> LinkedIn
                </a>
              )}
              {profile?.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-terminal-green text-terminal-bg rounded text-base font-semibold hover:bg-terminal-green-dim transition-colors">
                  <ExternalLink size={16} /> Resume
                </a>
              )}
            </motion.div>
          </div>
        </TerminalWindow>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-terminal-text-dim hover:text-terminal-green transition-colors animate-bounce"
      >
        <ArrowDown size={20} />
      </button>
    </section>
  )
}
