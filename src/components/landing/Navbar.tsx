import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MabrixelLogo } from '../ui/MabrixelLogo'
import { Button } from '../ui/Button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'About', href: '#about' },
]

export function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E8EAF0] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" aria-label="Mabrixel Technologies home">
            <MabrixelLogo />
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#617184] hover:text-[#F45B16] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/signin')}
              className="text-sm font-semibold text-[#172536] hover:text-[#F45B16] transition-colors px-3 py-2"
            >
              Log in
            </button>
            <Button onClick={() => navigate('/register')}>Get Started</Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-[#617184] hover:text-[#172536]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E8EAF0] bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm font-medium text-[#617184] hover:text-[#F45B16] py-1"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E8EAF0]">
            <button onClick={() => { navigate('/signin'); setOpen(false) }} className="text-sm font-semibold text-[#172536] py-2 text-left">Log in</button>
            <Button onClick={() => { navigate('/register'); setOpen(false) }} className="w-full justify-center">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  )
}
