import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`rounded-xl border border-[#E8EAF0] bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
