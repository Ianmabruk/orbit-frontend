import { useState } from 'react'
import { MabrixelLogo } from '../ui/MabrixelLogo'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'error'>('idle')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubStatus('error')
      return
    }
    // Newsletter submission would connect to backend when endpoint is available
    setSubStatus('idle')
    setEmail('')
  }

  return (
    <footer className="bg-[#07141C] text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <MabrixelLogo dark />
            <p className="mt-4 text-sm text-[#617184] leading-relaxed max-w-xs">
              A reliable SMS and email messaging platform built for businesses of all sizes. Fast, secure, and developer-friendly.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">Product</p>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'API Documentation', 'Integrations', 'Changelog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#617184] hover:text-[#F45B16] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">Company</p>
            <ul className="space-y-2.5">
              {['About Us', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#617184] hover:text-[#F45B16] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">Stay Updated</p>
            <p className="text-sm text-[#617184] mb-4">Get product updates and news delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} noValidate>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSubStatus('idle') }}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 rounded-lg bg-[#0D2030] border border-[#1E3248] text-white text-sm px-3 py-2.5 placeholder-[#617184] outline-none focus:border-[#F45B16] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F45B16] hover:bg-[#D94A0B] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              {subStatus === 'error' && (
                <p className="mt-1.5 text-xs text-red-400">Please enter a valid email address.</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-[#1E3248] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#617184]">© {new Date().getFullYear()} Mabrixel Technologies. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
              <a key={item} href="#" className="text-xs text-[#617184] hover:text-[#F45B16] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
