import type { SVGProps } from 'react'

interface OrbitLogoProps extends SVGProps<SVGSVGElement> {
  size?: number
}

export function OrbitLogo({ size = 36, className = '', ...props }: OrbitLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <title>Orbit</title>
      <circle cx="16" cy="16" r="10" stroke="var(--orbit-accent)" strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
      <ellipse cx="16" cy="16" rx="7.5" ry="3.6" stroke="var(--orbit-accent)" strokeWidth={1.2} strokeLinecap="round" opacity={0.5} transform="rotate(22 16 16)" />
      <circle cx="16" cy="16" r="2.7" fill="var(--orbit-accent)" />
      <circle cx="24.2" cy="16" r="1.6" fill="var(--orbit-accent)" />
      <circle cx="8.8" cy="13.2" r="1.2" fill="var(--orbit-accent)" opacity={0.75} />
      <circle cx="7.2" cy="20.4" r="1" fill="var(--orbit-accent)" opacity={0.55} />
      <path d="M16 13.2c2.2 0 4.4 1.1 4.4 2.4" stroke="var(--orbit-accent)" strokeWidth={1.4} strokeLinecap="round" fill="none" />
    </svg>
  )
}
