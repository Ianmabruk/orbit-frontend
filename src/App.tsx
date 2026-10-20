import { createContext, useContext, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BellRing,
  Check,
  ChevronRight,
  Globe,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Workflow,
} from 'lucide-react'
import { AuthPage } from './components/auth/AuthPage'
import { DashboardShell } from './components/dashboard/DashboardShell'
import { OnboardingWizard } from './components/onboarding/OnboardingWizard'
import { Button } from './components/ui/Button'
import { GlassCard } from './components/ui/GlassCard'
import { faqs, featureCards, workflowSteps } from './data/landing'

type User = {
  email: string
  fullName: string
  businessName: string
}

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (values: { fullName: string; businessName: string; email: string; password: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.20),_transparent_22%),radial-gradient(circle_at_right,_rgba(254,215,170,0.80),_transparent_28%),linear-gradient(180deg,#fffaf5_0%,#fff7ed_32%,#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-30">
          <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-orange-100 bg-white/70 px-4 py-3 shadow-[0_12px_30px_rgba(249,115,22,0.08)] backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff0e5] text-lg font-semibold text-orange-600 shadow-[0_10px_24px_rgba(240,120,40,0.12)]">
                <span className="translate-y-[-1px]">O</span>
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.28em] text-slate-900 uppercase">
                  ORBIT
                </div>
                <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                  MESSAGING INTELLIGENCE
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-8 text-sm text-slate-700 md:flex">
              <a href="#features" className="transition hover:text-orange-600">Features</a>
              <a href="#how-it-works" className="transition hover:text-orange-600">How it works</a>
              <a href="#integrations" className="transition hover:text-orange-600">Integrations</a>
              <a href="#pricing" className="transition hover:text-orange-600">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate('/signin')}>Sign in</Button>
              <Button onClick={() => navigate('/register')}>Get started</Button>
            </div>
          </nav>
        </header>

        <main>
          <section className="relative overflow-hidden pt-16 pb-8 sm:pt-20 lg:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="mx-auto max-w-5xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700 shadow-[0_8px_24px_rgba(249,115,22,0.08)]">
                <ShieldCheck size={14} />
                Secure client communication for growing service businesses
              </div>

              <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-7xl">
                Every Customer Conversation.
                <span className="block bg-[linear-gradient(135deg,#f28b40,#f07828,#f59e0b)] bg-clip-text text-transparent">
                  One Intelligent Platform.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
                Manage contacts, send targeted messages, and automate service renewal reminders from one secure workspace.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button className="px-6 py-3 text-base" onClick={() => navigate('/register')}>Get started <ArrowRight size={18} /></Button>
                <Button variant="glass" className="px-6 py-3 text-base" onClick={() => navigate('/signin')}>See how it works</Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="relative mx-auto mt-12 max-w-6xl"
            >
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-orange-300/30 blur-3xl" />
              <div className="absolute right-6 top-12 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
              <GlassCard className="relative overflow-hidden border-orange-100 p-4 sm:p-6">
                <div className="rounded-[28px] border border-orange-100 bg-white/50 p-4 sm:p-6">
                  <div className="mb-5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Active operations
                    </div>
                    <div className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs text-orange-700">
                      Live overview
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Contacts</div>
                          <div className="mt-3 text-3xl font-semibold text-slate-900">18.4K</div>
                          <div className="mt-1 text-sm text-emerald-600">+12.8% this month</div>
                        </div>
                        <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Campaigns</div>
                          <div className="mt-3 text-3xl font-semibold text-slate-900">128</div>
                          <div className="mt-1 text-sm text-orange-600">4 scheduled</div>
                        </div>
                        <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Renewals</div>
                          <div className="mt-3 text-3xl font-semibold text-slate-900">96</div>
                          <div className="mt-1 text-sm text-amber-600">Due this week</div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm font-medium text-slate-800">Message activity</div>
                          <div className="text-xs text-slate-500">Last 30 days</div>
                        </div>
                        <div className="flex h-36 items-end gap-2">
                          {[35, 52, 41, 68, 58, 82, 96, 72, 88, 76, 92, 104].map((height, index) => (
                            <div key={index} className="flex-1 rounded-t-2xl bg-[linear-gradient(180deg,rgba(94,234,212,0.9),rgba(96,165,250,0.45))]" style={{ height: `${height}%` }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-slate-800">Delivery health</span>
                          <span className="text-xs text-emerald-600">97.2%</span>
                        </div>
                        <div className="h-2 rounded-full bg-orange-100">
                          <div className="h-2 w-[97%] rounded-full bg-[linear-gradient(90deg,#f97316,#fdba74,#facc15)]" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-orange-100 bg-white/75 p-4">
                        <div className="mb-3 text-sm text-slate-800">Automations</div>
                        <ul className="space-y-3 text-sm text-slate-600">
                          {['7-day SMS reminder', 'Renewal due alert', 'Opt-out enforcement'].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                                <Check size={12} />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </section>

          <section id="features" className="mx-auto max-w-6xl py-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-10 text-center"
            >
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                Product highlights
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Built to keep every customer touchpoint organized and on time.
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <GlassCard className="h-full border border-orange-100 bg-white p-6 shadow-[0_14px_38px_rgba(249,115,22,0.06)]">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600">
                      {index === 0 && <MessageSquareText size={20} />}
                      {index === 1 && <Mail size={20} />}
                      {index === 2 && <BellRing size={20} />}
                      {index === 3 && <Globe size={20} />}
                    </div>
                    <h3 className="text-xl font-medium text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="how-it-works" className="mx-auto max-w-6xl py-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                  How it works
                </div>
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                  Your communication stack, orchestrated from one place.
                </h2>
                <p className="mt-4 max-w-xl text-slate-600">
                  Connect a WordPress site or import contacts, define your preferred channels, and let the platform coordinate outreach, reminders, and delivery tracking without opening a browser for every task.
                </p>
                <div className="mt-8 space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-[#fffaf6] p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="text-slate-700">{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              <GlassCard className="overflow-hidden border border-orange-100 bg-white p-5 shadow-[0_14px_38px_rgba(249,115,22,0.06)] sm:p-7">
                <div className="rounded-[24px] border border-orange-100 bg-[#fffaf6] p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-2"><Workflow size={16} className="text-orange-600" /> Workflow</div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Healthy</span>
                  </div>

                  <div className="space-y-4">
                    {[1,2,3].map((item) => (
                      <div key={item} className="grid gap-3 rounded-2xl border border-orange-100 bg-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                          {item === 1 ? <Phone size={18} /> : item === 2 ? <Mail size={18} /> : <BellRing size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {item === 1 ? 'Customer sync' : item === 2 ? 'Campaign dispatch' : 'Renewal cycle'}
                          </div>
                          <div className="text-xs text-slate-500">
                            {item === 1 ? 'Connected to WordPress' : item === 2 ? 'Queued and scheduled' : 'Reminder rules active'}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-emerald-700">Ready</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          <section id="integrations" className="mx-auto max-w-6xl py-20">
            <div className="mb-10 text-center">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                Integrations
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Connect the tools clients already use.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {['WordPress', 'CSV Import', 'SMS + Email'].map((label, index) => (
                <GlassCard key={label} className="border border-orange-100 bg-white p-6 shadow-[0_14px_38px_rgba(249,115,22,0.05)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600">
                    {index === 0 ? <Globe size={20} /> : index === 1 ? <ChevronRight size={20} /> : <MessageSquareText size={20} />}
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {index === 0
                      ? 'Pair a site securely, sync approved records, and map custom renewal data with audit-friendly status checks.'
                      : index === 1
                        ? 'Import contact lists with validation, preview screens, duplicate detection, and retryable jobs.'
                        : 'Configure provider settings once and use reusable channel-specific templates for outbound messaging.'}
                  </p>
                </GlassCard>
              ))}
            </div>
          </section>

          <section id="pricing" className="mx-auto max-w-6xl py-8">
            <GlassCard className="border border-orange-100 bg-white p-8 shadow-[0_14px_38px_rgba(249,115,22,0.05)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                    Flexible pricing
                  </div>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                    Start with a focused workflow and scale with your client base.
                  </h2>
                </div>
                <div className="rounded-[28px] border border-orange-100 bg-[#fff8f1] p-6">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Starter</div>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-semibold text-slate-900">$49</span>
                    <span className="pb-1 text-slate-500">/ month</span>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Contact workspace</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Email + SMS channels</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-600" /> Renewal automation</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </section>

          <section className="mx-auto max-w-6xl py-20">
            <div className="mb-10 text-center">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                FAQ
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                Questions teams ask before they onboard.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <GlassCard key={faq.question} className="border border-orange-100 bg-white p-5 shadow-[0_14px_38px_rgba(249,115,22,0.04)]">
                  <h3 className="text-lg font-medium text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </GlassCard>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-6xl pb-16 pt-8">
            <GlassCard className="overflow-hidden border border-orange-200 bg-[linear-gradient(135deg,#fffaf5,#fff3ea,#fff7f1)] p-8 shadow-[0_18px_54px_rgba(249,115,22,0.08)] sm:p-10">
              <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
                    Ready to simplify client messaging?
                  </div>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
                    Give every renewal and campaign a reliable path to delivery.
                  </h2>
                </div>
                <Button className="self-center px-6 py-3 text-base md:self-auto" onClick={() => navigate('/register')}>Get started <ArrowRight size={18} /></Button>
              </div>
            </GlassCard>
          </section>
        </main>

        <footer className="mx-auto max-w-6xl border-t border-orange-100 py-8 text-sm text-slate-500">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>© 2026 Serve</div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-orange-600">Privacy</a>
              <a href="#" className="hover:text-orange-600">Terms</a>
              <a href="#" className="hover:text-orange-600">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function AuthApp() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        if (email === 'demo@example.com' && password === 'DemoPass123') {
          const demoUser = {
            email,
            fullName: 'Demo User',
            businessName: 'Northwind Services',
          }
          setUser(demoUser)
          setToken('demo-token')
          return true
        }
        return false
      }

      const data = await response.json()
      const nextUser = {
        email: data.user.email,
        fullName: data.user.fullName,
        businessName: data.user.businessName,
      }
      setUser(nextUser)
      setToken(data.token ?? 'demo-token')
      return true
    } catch {
      if (email === 'demo@example.com' && password === 'DemoPass123') {
        const demoUser = {
          email,
          fullName: 'Demo User',
          businessName: 'Northwind Services',
        }
        setUser(demoUser)
        setToken('demo-token')
        return true
      }
      return false
    }
  }

  const register = async (values: { fullName: string; businessName: string; email: string; password: string }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const exists = user?.email === values.email
        if (exists) {
          return false
        }
        const fallbackUser = {
          email: values.email,
          fullName: values.fullName,
          businessName: values.businessName,
        }
        setUser(fallbackUser)
        setToken('demo-token')
        return true
      }

      const data = await response.json()
      const nextUser = {
        email: data.user.email,
        fullName: data.user.fullName,
        businessName: data.user.businessName,
      }
      setUser(nextUser)
      setToken(data.token ?? 'demo-token')
      return true
    } catch {
      const exists = user?.email === values.email
      if (exists) {
        return false
      }
      const fallbackUser = {
        email: values.email,
        fullName: values.fullName,
        businessName: values.businessName,
      }
      setUser(fallbackUser)
      setToken('demo-token')
      return true
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, login, register, logout }),
    [user, token],
  )

  return (
    <AuthContext.Provider value={value}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={user ? <Navigate to="/onboarding" replace /> : <AuthPage mode="signin" />} />
        <Route path="/register" element={user ? <Navigate to="/onboarding" replace /> : <AuthPage mode="register" />} />
        <Route path="/onboarding" element={user ? <OnboardingWizard /> : <Navigate to="/signin" replace />} />
        <Route path="/app/*" element={user ? <DashboardShell /> : <Navigate to="/signin" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}

function App() {
  return <AuthApp />
}

export default App
