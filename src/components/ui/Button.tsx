import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#f97316_0%,#fb923c_35%,#fdba74_100%)] text-white shadow-[0_18px_40px_rgba(249,115,22,0.28)] hover:translate-y-[-1px] hover:shadow-[0_20px_50px_rgba(249,115,22,0.35)] border border-orange-200/70',
  secondary:
    'bg-white/80 text-slate-800 border border-orange-200/80 hover:bg-orange-50',
  ghost:
    'bg-white/35 text-slate-700 hover:bg-orange-50/80 border border-white/50',
  glass:
    'bg-white/55 text-slate-800 border border-white/70 backdrop-blur-xl shadow-[0_12px_30px_rgba(251,146,60,0.12)] hover:bg-white/75',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
