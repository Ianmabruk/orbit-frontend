import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#F45B16] text-white hover:bg-[#D94A0B] shadow-sm border border-[#F45B16]',
  secondary:
    'bg-white text-[#172536] border border-[#E8EAF0] hover:border-[#F45B16] hover:text-[#F45B16]',
  ghost:
    'bg-transparent text-[#172536] border border-[#E8EAF0] hover:bg-[#FFF3E8] hover:text-[#F45B16]',
  outline:
    'bg-transparent text-[#F45B16] border border-[#F45B16] hover:bg-[#FFF3E8]',
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F45B16] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
