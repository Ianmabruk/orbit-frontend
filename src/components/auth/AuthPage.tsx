import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { useAuth } from '../../App'

type AuthMode = 'signin' | 'register'

type SignInValues = {
  email: string
  password: string
}

type RegisterValues = {
  fullName: string
  businessName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const { register: registerUser, login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const signInForm = useForm<SignInValues>({
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterValues>({
    defaultValues: {
      fullName: '',
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const onSubmitSignIn = async (values: SignInValues) => {
    setSubmitError('')
    const ok = await login(values.email, values.password)
    if (!ok) {
      setSubmitError('Invalid credentials. Use demo@example.com / DemoPass123')
      return
    }
    navigate('/onboarding')
  }

  const onSubmitRegister = async (values: RegisterValues) => {
    setSubmitError('')

    if (values.password.length < 8) {
      registerForm.setError('password', { message: 'Password must be at least 8 characters.' })
      return
    }

    if (values.password !== values.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match.' })
      return
    }

    if (!values.acceptTerms) {
      registerForm.setError('acceptTerms', { message: 'You must accept the terms.' })
      return
    }

    const ok = await registerUser({
      fullName: values.fullName,
      businessName: values.businessName,
      email: values.email,
      password: values.password,
    })

    if (!ok) {
      setSubmitError('An account with this email already exists in demo mode.')
      return
    }

    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_20%),linear-gradient(180deg,#fffaf5_0%,#fff7ed_35%,#ffffff_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <button type="button" onClick={() => navigate('/')} className="text-sm text-slate-600 hover:text-orange-600">
            ← Back to landing page
          </button>
          <div className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-orange-700">
            ORBIT AUTH
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="hidden lg:block">
            <div className="rounded-[32px] border border-orange-100 bg-white/70 p-8 shadow-[0_18px_60px_rgba(249,115,22,0.08)] backdrop-blur-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-700">
                <ShieldCheck size={14} />
                Secure workspace access
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-slate-900">
                {mode === 'signin' ? 'Sign in to your client workspace' : 'Create your operating workspace'}
              </h1>
              <p className="mt-4 max-w-md text-base text-slate-600">
                Manage campaigns, reviews, renewal reminders, and team permissions without exposing customer data to the browser.
              </p>
              <div className="mt-8 space-y-4 text-sm text-slate-700">
                <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">Tenant-scoped contacts and messaging rules</div>
                <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">Protected access and session controls</div>
                <div className="rounded-2xl border border-orange-100 bg-white/80 p-4">Renewal automation and delivery tracking</div>
              </div>
            </div>
          </div>

          <GlassCard className="border border-orange-100 bg-white/80 p-6 shadow-[0_18px_60px_rgba(249,115,22,0.08)] sm:p-8">
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)} className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-orange-700">Welcome back</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">Sign in</h2>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-slate-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...signInForm.register('email', { required: 'Email is required' })}
                    className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                    placeholder="name@business.com"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-xs text-rose-300">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...signInForm.register('password', { required: 'Password is required' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-xs text-rose-300">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="text-xs text-slate-500">Demo credentials: demo@example.com / DemoPass123</span>
                  <button type="button" className="text-orange-600 hover:text-orange-700">Forgot password?</button>
                </div>

                {submitError && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}

                <Button type="submit" className="w-full justify-center py-3" disabled={signInForm.formState.isSubmitting}>
                  {signInForm.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Need an account?{' '}
                  <button type="button" onClick={() => navigate('/register')} className="font-medium text-orange-600 hover:text-orange-700">
                    Create one
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-orange-700">Get started</p>
                  <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create account</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="fullName" className="text-sm text-slate-700">Full name</label>
                    <input
                      id="fullName"
                      type="text"
                      {...registerForm.register('fullName', { required: 'Full name is required' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="Jane Smith"
                    />
                    {registerForm.formState.errors.fullName && (
                      <p className="text-xs text-rose-300">{registerForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="businessName" className="text-sm text-slate-700">Business name</label>
                    <input
                      id="businessName"
                      type="text"
                      {...registerForm.register('businessName', { required: 'Business name is required' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="Northwind Services"
                    />
                    {registerForm.formState.errors.businessName && (
                      <p className="text-xs text-rose-300">{registerForm.formState.errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="register-email" className="text-sm text-slate-700">Email</label>
                    <input
                      id="register-email"
                      type="email"
                      {...registerForm.register('email', { required: 'Email is required' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="hello@northwind.co"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-rose-300">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm text-slate-700">Password</label>
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('password', { required: 'Password is required' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="At least 8 chars"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-rose-300">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm text-slate-700">Confirm password</label>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...registerForm.register('confirmPassword', { required: 'Please confirm your password' })}
                      className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300"
                      placeholder="Repeat password"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-rose-300">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl border border-orange-100 bg-[#fffaf6] p-3 text-sm text-slate-700">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" {...registerForm.register('acceptTerms', { required: 'You must accept the terms' })} className="mt-1 h-4 w-4 rounded border-orange-200 bg-white text-orange-600" />
                    <span>I accept the applicable privacy policy and terms for secure communication workflows.</span>
                  </label>
                  {registerForm.formState.errors.acceptTerms && (
                    <p className="text-xs text-rose-300">{registerForm.formState.errors.acceptTerms.message}</p>
                  )}
                </div>

                {submitError && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</div>}

                <div className="flex items-center justify-between gap-3">
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-sm text-slate-600 hover:text-slate-900">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </button>
                  <Button type="submit" className="justify-center px-5">Create account</Button>
                </div>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/signin')} className="font-medium text-orange-600 hover:text-orange-700">
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
