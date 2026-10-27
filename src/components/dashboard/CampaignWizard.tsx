import { Check, Mail, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

type Channel = 'email' | 'sms'

type WizardState = {
  channel: Channel | null
  contactListAll: boolean
  recipientIds: string[]
  name: string
  subject: string
  template: string
  scheduledFor: string
}

type Contact = { id?: string; name: string; email?: string | null; phone?: string | null; consent?: string }

interface CampaignWizardProps {
  contacts: Contact[]
  onSubmit: (payload: { name: string; channel: 'sms' | 'email'; template: string; scheduledFor?: string; recipientIds?: string[] }) => Promise<{ ok: boolean; message?: string }>
}

const stages = ['Details', 'Recipients', 'Content', 'Review']

function StageIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {stages.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-[#F45B16] text-white' : active ? 'bg-[#F45B16] text-white ring-4 ring-[#FFF3E8]' : 'bg-[#E8EAF0] text-[#617184]'
              }`}>
                {done ? <Check size={14} /> : i + 1}
              </div>
              <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${active ? 'text-[#F45B16]' : done ? 'text-[#172536]' : 'text-[#617184]'}`}>
                {label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-colors ${done ? 'bg-[#F45B16]' : 'bg-[#E8EAF0]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function CampaignWizard({ contacts, onSubmit }: CampaignWizardProps) {
  const navigate = useNavigate()
  const [stage, setStage] = useState(0)
  const [state, setState] = useState<WizardState>({
    channel: null, contactListAll: true, recipientIds: [],
    name: '', subject: '', template: '', scheduledFor: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null)

  const eligible = contacts.filter((c) => c.consent !== 'opted_out')
  const suppressed = contacts.length - eligible.length

  const canNext = () => {
    if (stage === 0) return state.channel !== null
    if (stage === 1) return eligible.length > 0
    if (stage === 2) return state.name.trim().length >= 2 && state.template.trim().length >= 2
    return true
  }

  const handleNext = () => { if (canNext()) setStage((s) => s + 1) }
  const handleBack = () => setStage((s) => s - 1)

  const handleConfirm = async () => {
    if (!state.channel) return
    setSubmitting(true)
    try {
      const result = await onSubmit({
        name: state.name,
        channel: state.channel,
        template: state.template,
        scheduledFor: state.scheduledFor || undefined,
        recipientIds: state.contactListAll ? undefined : state.recipientIds,
      })
      setSubmitResult({ ok: result.ok, message: result.message ?? '' })
      if (result.ok) setTimeout(() => navigate('/app/campaigns'), 1800)
    } catch (err) {
      setSubmitResult({ ok: false, message: err instanceof Error ? err.message : 'Submission failed' })
    } finally {
      setSubmitting(false)
    }
  }

  const smsChars = state.template.length
  const smsSegments = Math.ceil(smsChars / 160) || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#172536]">New Campaign</h1>
        <p className="text-sm text-[#617184] mt-0.5">Create and send a campaign to your contacts.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6 sm:p-8">
        <StageIndicator current={stage} />

        {/* Stage 0: Details */}
        {stage === 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#172536] mb-1">Create Your Campaign</h2>
            <p className="text-sm text-[#617184] mb-6">Choose the type of campaign you want to send.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                { ch: 'email' as Channel, icon: Mail, title: 'Email Campaign', desc: 'Send professional emails with personalization and tracking.' },
                { ch: 'sms' as Channel, icon: MessageSquare, title: 'SMS Campaign', desc: 'Send instant SMS messages to your contacts.' },
              ]).map(({ ch, icon: Icon, title, desc }) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, channel: ch }))}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    state.channel === ch
                      ? 'border-[#F45B16] bg-[#FFF3E8]'
                      : 'border-[#E8EAF0] bg-white hover:border-[#F45B16]/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${state.channel === ch ? 'bg-[#F45B16]' : 'bg-[#FFF3E8]'}`}>
                    <Icon size={18} className={state.channel === ch ? 'text-white' : 'text-[#F45B16]'} />
                  </div>
                  <p className="font-bold text-[#172536] mb-1">{title}</p>
                  <p className="text-sm text-[#617184]">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 1: Recipients */}
        {stage === 1 && (
          <div>
            <h2 className="text-lg font-bold text-[#172536] mb-1">Select Recipients</h2>
            <p className="text-sm text-[#617184] mb-6">Choose who will receive this campaign.</p>
            <div className="space-y-4">
              <div className="rounded-xl border border-[#E8EAF0] p-4 bg-[#FAF9F6]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#172536]">All eligible contacts</span>
                  <span className="text-xs font-bold text-[#16865B]">{eligible.length} eligible</span>
                </div>
                {suppressed > 0 && (
                  <p className="text-xs text-[#617184]">{suppressed} contact{suppressed !== 1 ? 's' : ''} excluded (opted out / suppressed)</p>
                )}
                {eligible.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No eligible contacts. Add contacts before sending.</p>
                )}
              </div>
              <label className="flex items-center gap-3 text-sm text-[#617184]">
                <input
                  type="checkbox"
                  checked={state.contactListAll}
                  onChange={(e) => setState((s) => ({ ...s, contactListAll: e.target.checked }))}
                  className="h-4 w-4 rounded border-[#E8EAF0] text-[#F45B16]"
                />
                Send to all eligible contacts ({eligible.length})
              </label>
            </div>
          </div>
        )}

        {/* Stage 2: Content */}
        {stage === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#172536] mb-1">
              {state.channel === 'email' ? 'Email Content' : 'SMS Content'}
            </h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#172536]">Campaign name</label>
              <input
                type="text"
                value={state.name}
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                placeholder="e.g. Summer Promo 2025"
              />
            </div>

            {state.channel === 'email' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#172536]">Subject line</label>
                <input
                  type="text"
                  value={state.subject}
                  onChange={(e) => setState((s) => ({ ...s, subject: e.target.value }))}
                  className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
                  placeholder="Your subject line"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#172536]">
                  {state.channel === 'email' ? 'Email body' : 'Message'}
                </label>
                {state.channel === 'sms' && (
                  <span className="text-xs text-[#617184]">{smsChars} chars · {smsSegments} segment{smsSegments !== 1 ? 's' : ''}</span>
                )}
              </div>
              <textarea
                rows={state.channel === 'email' ? 8 : 4}
                value={state.template}
                onChange={(e) => setState((s) => ({ ...s, template: e.target.value }))}
                className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors resize-none"
                placeholder={state.channel === 'email' ? 'Write your email content here…' : 'Write your SMS message here…'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#172536]">Schedule (optional)</label>
              <input
                type="datetime-local"
                value={state.scheduledFor}
                onChange={(e) => setState((s) => ({ ...s, scheduledFor: e.target.value }))}
                className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Stage 3: Review */}
        {stage === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#172536] mb-1">Review &amp; Confirm</h2>
            <p className="text-sm text-[#617184] mb-4">Review your campaign before sending.</p>

            {submitResult ? (
              <div className={`rounded-xl border p-5 ${submitResult.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <p className={`text-sm font-semibold ${submitResult.ok ? 'text-[#16865B]' : 'text-red-700'}`}>
                  {submitResult.ok ? '✓ Campaign submitted successfully.' : `Error: ${submitResult.message}`}
                </p>
                {submitResult.ok && <p className="text-xs text-[#617184] mt-1">Redirecting to campaigns…</p>}
              </div>
            ) : (
              <div className="rounded-xl border border-[#E8EAF0] divide-y divide-[#E8EAF0] overflow-hidden">
                {[
                  { label: 'Campaign name', value: state.name },
                  { label: 'Channel', value: state.channel === 'email' ? 'Email' : 'SMS' },
                  { label: 'Recipients', value: `${eligible.length} eligible contacts` },
                  ...(state.channel === 'email' ? [{ label: 'Subject', value: state.subject || '(none)' }] : []),
                  { label: 'Message preview', value: state.template.slice(0, 120) + (state.template.length > 120 ? '…' : '') },
                  ...(state.channel === 'sms' ? [{ label: 'Estimated segments', value: `${smsSegments}` }] : []),
                  { label: 'Scheduled for', value: state.scheduledFor ? new Date(state.scheduledFor).toLocaleString() : 'Send immediately' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 px-5 py-3.5 bg-white">
                    <span className="text-xs font-semibold text-[#617184] w-36 shrink-0">{label}</span>
                    <span className="text-sm text-[#172536] break-words">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8EAF0]">
          <div className="flex gap-2">
            {stage > 0 && !submitResult && (
              <Button variant="secondary" onClick={handleBack} disabled={submitting}>Back</Button>
            )}
            <Button variant="ghost" onClick={() => navigate('/app/campaigns')} disabled={submitting}>Cancel</Button>
          </div>
          <div className="flex gap-2">
            {stage < 3 && (
              <Button onClick={handleNext} disabled={!canNext()}>
                Next →
              </Button>
            )}
            {stage === 3 && !submitResult && (
              <Button onClick={handleConfirm} disabled={submitting || eligible.length === 0}>
                {submitting ? 'Submitting…' : 'Confirm & Send'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
