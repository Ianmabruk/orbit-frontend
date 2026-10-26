import { createContext, useContext, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AuthPage } from './components/auth/AuthPage'
import { DashboardShell } from './components/dashboard/DashboardShell'
import { DocsPreview } from './components/landing/DocsPreview'
import { FeatureCards } from './components/landing/FeatureCards'
import { Footer } from './components/landing/Footer'
import { Hero } from './components/landing/Hero'
import { Navbar } from './components/landing/Navbar'
import { OnboardingSteps } from './components/landing/OnboardingSteps'
import { TrustStrip } from './components/landing/TrustStrip'

type User = { email: string; fullName: string; businessName: string }

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (values: { fullName: string; businessName: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Navbar />
      <Hero />
      <FeatureCards />
      <TrustStrip />
      <OnboardingSteps />
      <DocsPreview />

      {/* Pricing section */}
      <section id="pricing" className="py-20 bg-[#FAF9F6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-2">Pricing</p>
            <h2 className="text-3xl font-bold text-[#172536]">Simple, Transparent Pricing</h2>
            <p className="text-[#617184] mt-3 max-w-md mx-auto">Start free and scale as your business grows.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '$0', period: '/month', features: ['1,000 SMS/month', '5,000 emails/month', 'Basic analytics', 'API access'], cta: 'Get Started', highlight: false },
              { name: 'Business', price: '$49', period: '/month', features: ['10,000 SMS/month', '50,000 emails/month', 'Advanced analytics', 'Priority support', 'Webhooks'], cta: 'Start Free Trial', highlight: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited SMS', 'Unlimited emails', 'Dedicated support', 'SLA guarantee', 'Custom integrations'], cta: 'Contact Sales', highlight: false },
            ].map(({ name, price, period, features, cta, highlight }) => (
              <div key={name} className={`rounded-2xl border p-6 ${highlight ? 'border-[#F45B16] bg-[#FFF3E8] shadow-lg' : 'border-[#E8EAF0] bg-white shadow-sm'}`}>
                {highlight && <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-3">Most Popular</p>}
                <h3 className="text-lg font-bold text-[#172536]">{name}</h3>
                <div className="mt-3 mb-5">
                  <span className="text-4xl font-bold text-[#172536]">{price}</span>
                  <span className="text-[#617184] text-sm">{period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#617184]">
                      <div className="w-4 h-4 rounded-full bg-[#F45B16]/10 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F45B16]" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(user ? '/app/overview' : '/register')}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${highlight ? 'bg-[#F45B16] text-white hover:bg-[#D94A0B]' : 'bg-white border border-[#E8EAF0] text-[#172536] hover:border-[#F45B16] hover:text-[#F45B16]'}`}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-2">About</p>
            <h2 className="text-3xl font-bold text-[#172536] mb-5">Built for Modern Businesses</h2>
            <p className="text-[#617184] leading-relaxed">
              Mabrixel Technologies is a messaging platform designed to help businesses of all sizes communicate effectively with their customers. We provide reliable SMS and email delivery infrastructure with developer-friendly APIs and a clean, intuitive dashboard.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function AuthApp() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        if (email === 'demo@example.com' && password === 'DemoPass123') {
          setUser({ email, fullName: 'Demo User', businessName: 'Northwind Services' })
          setToken('demo-token')
          return true
        }
        return false
      }
      const data = await res.json()
      setUser({ email: data.user.email, fullName: data.user.fullName, businessName: data.user.businessName })
      setToken(data.token ?? 'demo-token')
      return true
    } catch {
      if (email === 'demo@example.com' && password === 'DemoPass123') {
        setUser({ email, fullName: 'Demo User', businessName: 'Northwind Services' })
        setToken('demo-token')
        return true
      }
      return false
    }
  }

  const register = async (values: { fullName: string; businessName: string; email: string; password: string }): Promise<boolean> => {
    try {
      const res = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        setUser(null)
        setToken(null)
        return false
      }

      const data = await res.json()
      setUser({ email: data.user.email, fullName: data.user.fullName, businessName: data.user.businessName })
      setToken(data.token ?? null)
      return true
    } catch {
      setUser(null)
      setToken(null)
      return false
    }
  }

  const logout = () => { setUser(null); setToken(null) }

  const value = useMemo<AuthContextValue>(() => ({ user, token, login, register, logout }), [user, token])

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={user ? <Navigate to="/app/overview" replace /> : <AuthPage mode="signin" />} />
        <Route path="/register" element={user ? <Navigate to="/app/overview" replace /> : <AuthPage mode="register" />} />
        <Route path="/app/*" element={user ? <DashboardShell /> : <Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default function App() {
  return <AuthApp />
}
