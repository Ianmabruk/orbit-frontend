interface MabrixelLogoProps {
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
}

export function MabrixelLogo({ size = 'md', dark = false }: MabrixelLogoProps) {
  const textColor = dark ? '#FFFFFF' : '#172536'
  const subColor = dark ? '#94A3B8' : '#617184'
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36

  return (
    <div className="flex items-center gap-2.5">
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#F45B16" />
        <path d="M8 30V12l8 10 4-5 4 5 8-10v18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.9" />
      </svg>
      <div>
        <div style={{ color: textColor }} className="text-sm font-bold tracking-tight leading-none">
          Mabrixel
        </div>
        <div style={{ color: subColor }} className="text-[10px] tracking-wide leading-none mt-0.5">
          Technologies
        </div>
      </div>
    </div>
  )
}
