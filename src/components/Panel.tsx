import type { ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <div
      className={`rounded-xl border border-stone-200/80 bg-white/95 p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function PanelTitle({
  id,
  children,
}: {
  id?: string
  children: ReactNode
}) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold uppercase tracking-wide text-stone-500"
    >
      {children}
    </h2>
  )
}
