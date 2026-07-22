export default function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`border border-terminal-border rounded overflow-hidden bg-terminal-surface ${className}`}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-terminal-bg border-b border-terminal-border">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-auto text-xs text-terminal-text-dim">{title}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
