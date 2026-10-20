import type { HTMLAttributes, ReactNode } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function GlassCard({ children, className = '', ...props }: GlassCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/60 bg-white/60 shadow-[0_24px_80px_rgba(251,146,60,0.12)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
