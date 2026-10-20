import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { MabrixelLogo } from '../ui/MabrixelLogo'
import { useAuth } from '../../App'

type AuthMode = 'signin' | 'register'

type SignInValues = { email: string; password: string }
type RegisterValues = {
  fullName: string
  businessName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate()
  const { register: registerUser, login, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const signInForm = useForm<SignInValues>({ defaultValues: { email: '', password: '' } })
  const registerForm = useForm<RegisterValues>({
    defaultValues: { fullName: '', businessName: '', email: '', password: '', confirmPassword: '', acceptTerms: false },
  })

  const onSubmitSignIn = async (values: SignInValues) => {
    setSubmitError('')
    const ok = await login(values.email, values.password)
    if (!ok) { setSubmitError('Invalid email or password. Please try again.'); return }
    navigate('/app/overview')
  }

  const onSubmitRegister = async (values: RegisterValues) => {
    setSubmitError('')
    if (values.password !== values.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match.' })
      return
    }
    if (!values.acceptTerms) {
      registerForm.setError('acceptTerms', { message: 'You must accept the terms.' })
      return
    }
    const ok = await registerUser({ fullName: values.fullName, businessName: values.businessName, email: values.email, password: values.password })
    if (!ok) { setSubmitError('An account with this email already exists.'); return }
    navigate('/app/overview')
  }

  const greeting = user?.fullName ? `Welcome Back, ${user.fullName.split(' ')[0]}.` : 'Welcome Back.'

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E8EAF0] px-6 py-4 flex items-center justify-between">
        <a href="/"><MabrixelLogo /></a>
        <button onClick={() => navigate('/')} className="text-sm text-[#617184] hover:text-[#F45B16] transition-colors">
          ← Back to home
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-[#E8EAF0] shadow-md p-8">
            {mode === 'signin' ? (
              <form onSubmit={signInForm.handleSubmit(onSubmitSignIn)} className="space-y-5" noValidate>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-1">Sign In</p>
                  <h1 className="text-2xl font-bold text-[#172536]">{greeting}</h1>
                  <p className="text-sm text-[#617184] mt-1">Sign in to your account to continue.</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-[#172536]">Email address</label>
                  <input
                    id="email"
                    type="email"
                    {...signInForm.register('email', { required: 'Email is required' })}
                    className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                    placeholder="you@business.com"
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-[#172536]">Password</label>
                    <button type="button" className="text-xs text-[#F45B16] hover:underline">Forgot password?</button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...signInForm.register('password', { required: 'Password is required' })}
                      className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 pr-11 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#617184] hover:text-[#172536]"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
                )}

                <Button type="submit" className="w-full justify-center py-3" disabled={signInForm.formState.isSubmitting}>
                  {signInForm.formState.isSubmitting ? 'Signing in…' : 'Log In'}
                </Button>

                <p className="text-center text-sm text-[#617184]">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => navigate('/register')} className="font-semibold text-[#F45B16] hover:underline">
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="space-y-5" noValidate>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-1">Get Started</p>
                  <h1 className="text-2xl font-bold text-[#172536]">Create Your Account</h1>
                  <p className="text-sm text-[#617184] mt-1">Start sending SMS and emails in minutes.</p>
                </div>

                {[
                  { id: 'fullName', label: 'Full name', placeholder: 'Jane Smith', type: 'text', key: 'fullName' as const },
                  { id: 'businessName', label: 'Business name', placeholder: 'Acme Corp', type: 'text', key: 'businessName' as const },
                  { id: 'reg-email', label: 'Email address', placeholder: 'you@business.com', type: 'email', key: 'email' as const },
                ].map(({ id, label, placeholder, type, key }) => (
                  <div key={id} className="space-y-1.5">
                    <label htmlFor={id} className="text-sm font-medium text-[#172536]">{label}</label>
                    <input
                      id={id}
                      type={type}
                      {...registerForm.register(key, { required: `${label} is required` })}
                      className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                      placeholder={placeholder}
                    />
                    {registerForm.formState.errors[key] && (
                      <p className="text-xs text-red-500">{registerForm.formState.errors[key]?.message}</p>
                    )}
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  {(['password', 'confirmPassword'] as const).map((field) => (
                    <div key={field} className="space-y-1.5">
                      <label htmlFor={field} className="text-sm font-medium text-[#172536]">
                        {field === 'password' ? 'Password' : 'Confirm password'}
                      </label>
                      <input
                        id={field}
                        type={showPassword ? 'text' : 'password'}
                        {...registerForm.register(field, { required: true, minLength: field === 'password' ? { value: 8, message: 'Min 8 characters' } : undefined })}
                        className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                        placeholder={field === 'password' ? 'Min 8 chars' : 'Repeat'}
                      />
                      {registerForm.formState.errors[field] && (
                        <p className="text-xs text-red-500">{registerForm.formState.errors[field]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>

                <label className="flex items-start gap-3 text-sm text-[#617184]">
                  <input
                    type="checkbox"
                    {...registerForm.register('acceptTerms', { required: 'You must accept the terms.' })}
                    className="mt-0.5 h-4 w-4 rounded border-[#E8EAF0] text-[#F45B16]"
                  />
                  <span>I accept the <a href="#" className="text-[#F45B16] hover:underline">Terms of Service</a> and <a href="#" className="text-[#F45B16] hover:underline">Privacy Policy</a>.</span>
                </label>
                {registerForm.formState.errors.acceptTerms && (
                  <p className="text-xs text-red-500">{registerForm.formState.errors.acceptTerms.message}</p>
                )}

                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
                )}

                <Button type="submit" className="w-full justify-center py-3" disabled={registerForm.formState.isSubmitting}>
                  {registerForm.formState.isSubmitting ? 'Creating account…' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-[#617184]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/signin')} className="font-semibold text-[#F45B16] hover:underline">
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
