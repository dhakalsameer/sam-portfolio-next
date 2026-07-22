import { Terminal } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-terminal-border py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-xs font-mono text-terminal-text-dim/30 text-center mb-4 select-none">
          {'═'.repeat(40)}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-terminal-text-dim text-sm font-mono">
            <Terminal size={14} className="text-terminal-green" />
            <span>
              <span className="text-terminal-text-dim/50">Built with</span>
              <span className="text-terminal-green"> ● </span>
              <span className="text-terminal-text-dim/80">Ubuntu</span>
              <span className="text-terminal-text-dim/30"> + </span>
              <span className="text-terminal-text-dim/80">Next.js</span>
              <span className="text-terminal-text-dim/30"> + </span>
              <span className="text-terminal-text-dim/80">TypeScript</span>
            </span>
          </div>
          <div className="text-sm font-mono text-terminal-text-dim">
            <span className="text-terminal-green">$</span>
            <span className="text-terminal-text-dim/50"> echo </span>
            <span className="text-terminal-green/80">&quot;© {new Date().getFullYear()} Sameer Dhakal&quot;</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
