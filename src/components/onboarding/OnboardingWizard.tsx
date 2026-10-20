import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'

export function OnboardingWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.16),_transparent_24%),linear-gradient(180deg,#fffaf5_0%,#fff7ed_30%,#ffffff_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-6 sm:p-8 border-orange-100 bg-white/70">
          <div className="mb-8 flex items-center justify-between text-sm text-slate-500">
            <span>Business setup</span>
            <span>Step {step} / 3</span>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-orange-700">Welcome</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tell us about your business</h1>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Business type</span>
                  <select className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-slate-900">
                    <option>Service business</option>
                    <option>Healthcare</option>
                    <option>Property management</option>
                    <option>Retail & commerce</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span>Timezone</span>
                  <select className="w-full rounded-2xl border border-orange-100 bg-[#fffaf6] px-4 py-3 text-slate-900">
                    <option>Africa/Nairobi</option>
                    <option>UTC</option>
                    <option>Europe/London</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-orange-700">Connection</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Choose how you’ll connect</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {['WordPress website', 'CSV import', 'Manual setup'].map((option) => (
                  <div key={option} className="rounded-2xl border border-orange-100 bg-[#fffaf6] p-4 text-sm text-slate-700">
                    {option}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-orange-700">Finish</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Review and continue</h2>
              </div>
              <div className="space-y-3 rounded-2xl border border-orange-100 bg-[#fffaf6] p-4 text-sm text-slate-700">
                <div>Business type: Service business</div>
                <div>Connection method: WordPress</div>
                <div>Reminder rules: 7-day and 1-day before renewal</div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between gap-4">
            <Button variant="ghost" className="px-4" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>
              Back
            </Button>
            <Button className="px-5" onClick={() => {
              if (step < 3) {
                setStep((value) => value + 1)
              } else {
                navigate('/app/overview')
              }
            }}>
              {step === 3 ? 'Finish setup' : 'Continue'}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
