import { PrismaClient } from "../src/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "sameerdhakal1234@gmail.com" },
  })

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("admin123", 10)
    await prisma.user.create({
      data: {
        email: "sameerdhakal1234@gmail.com",
        password: hashedPassword,
        name: "Admin",
      },
    })
    console.log("Created admin user")
  }

  const existingProfile = await prisma.profile.findFirst()
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        fullName: "Sameer Dhakal",
        title: "Backend & Web3 Developer",
        bio: "Building scalable backends, exploring Web3, and automating everything on Linux.",
        about:
          "A passionate backend developer with expertise in building scalable web applications and exploring decentralized technologies. Linux enthusiast who believes in the power of open-source software.\n\nCurrently diving deep into Web3 development, smart contracts, and decentralized applications. Experienced in designing RESTful APIs, microservices architecture, and database management.",
        email: "sameerdhakal1234@gmail.com",
        github: "https://github.com/sameerdhakal",
        linkedin: "https://linkedin.com/in/sameerdhakal",
      },
    })
    console.log("Created profile")
  }

  const skillCount = await prisma.skill.count()
  if (skillCount === 0) {
    const skills = [
      { name: "TypeScript", icon: "📘" },
      { name: "JavaScript", icon: "📜" },
      { name: "Python", icon: "🐍" },
      { name: "Node.js", icon: "💚" },
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Django", icon: "🎯" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Redis", icon: "🔴" },
      { name: "Docker", icon: "🐳" },
      { name: "Linux", icon: "🐧" },
      { name: "Git", icon: "🔀" },
      { name: "Solidity", icon: "🔷" },
      { name: "Rust", icon: "🦀" },
      { name: "Web3.js", icon: "🌐" },
    ]
    for (const skill of skills) {
      await prisma.skill.create({ data: skill })
    }
    console.log(`Created ${skills.length} skills`)
  }

  const projectCount = await prisma.project.count()
  if (projectCount === 0) {
    const projects = [
      {
        title: "Solana Voting dApp",
        description:
          "A decentralized voting application built on the Solana blockchain using Rust and Anchor framework.",
        techStack: "Rust, Solana, Anchor, React, TypeScript",
        githubLink: "https://github.com/sameerdhakal/solana-voting",
      },
      {
        title: "Election Management System",
        description:
          "Full-stack web application for managing and conducting elections with real-time results.",
        techStack: "Django, PostgreSQL, Tailwind CSS, Redis",
        githubLink: "https://github.com/sameerdhakal/election",
      },
      {
        title: "Portfolio Website",
        description:
          "Terminal-inspired personal portfolio built with Next.js, TypeScript, and Tailwind CSS.",
        techStack: "Next.js, TypeScript, Tailwind CSS, Prisma, MongoDB",
        githubLink: "https://github.com/sameerdhakal/portfolio",
      },
    ]
    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
    console.log(`Created ${projects.length} projects`)
  }

  const certCount = await prisma.certification.count()
  if (certCount === 0) {
    const certs = [
      {
        title: "Web3 Development Fundamentals",
        description:
          "Comprehensive course covering blockchain fundamentals, smart contracts, and dApp development.",
        issuer: "Chainlink Labs",
        dateAwarded: "2024-06",
      },
      {
        title: "Full-Stack Web Development",
        description:
          "Advanced full-stack development with modern JavaScript frameworks and cloud deployment.",
        issuer: "Meta (Coursera)",
        dateAwarded: "2024-03",
      },
    ]
    for (const cert of certs) {
      await prisma.certification.create({ data: cert })
    }
    console.log(`Created ${certs.length} certifications`)
  }

  console.log("Database seeded successfully!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
