"use client"

import { useEffect, useState } from "react"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored)
    } else {
      document.documentElement.setAttribute("data-theme", "light")
    }
    setMounted(true)
  }, [])

  return <>{children}</>
}
