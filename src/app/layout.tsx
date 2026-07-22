import type { Metadata } from "next"
import "./globals.css"
import ThemeProvider from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: "Sameer Dhakal | Portfolio",
  description: "Backend & Web3 Developer | Linux Enthusiast",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <div className="scanline" />
          <div className="bg-char bg-char--1">_</div>
          <div className="bg-char bg-char--2">{">"}</div>
          <div className="bg-char bg-char--3">~</div>
          <div className="bg-char bg-char--4">/*</div>
          <div className="bg-char bg-char--5">$</div>
          <div className="bg-char bg-char--6">⚡</div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
