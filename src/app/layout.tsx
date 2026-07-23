import type { Metadata } from "next"
import "./globals.css"
import ThemeProvider from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: "Sameer Dhakal | Portfolio",
  description: "Backend & Web3 Developer | Linux Enthusiast",
  icons: {
    icon: [
      { url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='%23121212'/><text x='16' y='22' font-family='monospace' font-size='18' font-weight='bold' fill='%2300ff41' text-anchor='middle'>~&gt;</text></svg>", type: "image/svg+xml" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="light">
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
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-orb">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-terminal-green/5 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-terminal-amber/5 blur-[100px] animate-pulse" style={{ animationDuration: "10s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-terminal-blue/5 blur-[140px] animate-pulse" style={{ animationDuration: "12s" }} />
          </div>
          <div className="bg-char bg-char--1">_</div>
          <div className="bg-char bg-char--2">{">"}</div>
          <div className="bg-char bg-char--3">~</div>
          <div className="bg-char bg-char--4">/*</div>
          <div className="bg-char bg-char--5">$</div>
          <div className="bg-char bg-char--6">⚡</div>
          <div className="bg-char bg-char--7">λ</div>
          <div className="bg-char bg-char--8">#</div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
