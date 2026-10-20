import { BarChart2, Mail, MessageSquare, Plus, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

type Summary = {
  contacts: number
  campaigns: number
  sentMessages: number
  smsSent: number
  emailSent: number
  deliveryRate: number
}

type CampaignRow = {
  id?: string
  name: string
  channel?: string
  status: string
  scheduledFor?: string | null
  audience?: number
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const statusColors: Record<string, string> = {
  draft: 'bg-[#F0F2F5] text-[#617184]',
  queued: 'bg-amber-50 text-amber-700 border border-amber-200',
  sending: 'bg-blue-50 text-blue-700 border border-blue-200',
  sent: 'bg-green-50 text-[#16865B] border border-green-200',
  scheduled: 'bg-purple-50 text-purple-700 border border-purple-200',
  failed: 'bg-red-50 text-red-700 border border-red-200',
  partially_failed: 'bg-orange-50 text-orange-700 border border-orange-200',
  not_configured: 'bg-gray-50 text-gray-500 border border-gray-200',
}

function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status] ?? statusColors.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#E8EAF0] p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 bg-[#E8EAF0] rounded" />
        <div className="h-9 w-9 bg-[#FFF3E8] rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-[#E8EAF0] rounded mb-2" />
      <div className="h-3 w-16 bg-[#E8EAF0] rounded" />
    </div>
  )
}

interface OverviewPageProps {
  summary: Summary | null
  loading: boolean
  error: string | null
  onRetry: () => void
  campaigns: CampaignRow[]
  userName: string
}

export function OverviewPage({ summary, loading, error, onRetry, campaigns, userName }: OverviewPageProps) {
  const navigate = useNavigate()
  const firstName = userName.split(' ')[0] || userName

  const cards = summary
    ? [
        { label: 'Total Sent', value: summary.sentMessages.toLocaleString(), icon: Mail, sub: 'All channels' },
        { label: 'SMS Sent', value: summary.smsSent.toLocaleString(), icon: MessageSquare, sub: 'This period' },
        { label: 'Delivery Rate', value: `${summary.deliveryRate}%`, icon: BarChart2, sub: 'Delivered / sent' },
        { label: 'Active Contacts', value: summary.contacts.toLocaleString(), icon: Users, sub: 'Total contacts' },
      ]
    : []

  const recent = campaigns.slice(0, 8)

  return (
    <div className="space-y-7">
      {/* Greeting */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172536]">{getGreeting()}, {firstName}</h1>
          <p className="text-sm text-[#617184] mt-0.5">Here's what's happening with your campaigns today.</p>
        </div>
        <Button onClick={() => navigate('/app/campaigns/new')} className="hidden sm:flex items-center gap-2">
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {/* Analytics cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-[#E8EAF0] p-8 text-center">
          <p className="text-sm text-[#617184] mb-3">Unable to load dashboard data.</p>
          <Button variant="secondary" onClick={onRetry}>Try again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#617184]">{label}</span>
                <div className="w-9 h-9 rounded-lg bg-[#FFF3E8] flex items-center justify-center">
                  <Icon size={17} className="text-[#F45B16]" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#172536] mb-1">{value}</div>
              <div className="text-xs text-[#617184]">{sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recent campaigns */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EAF0]">
          <h2 className="text-base font-bold text-[#172536]">Recent Campaigns</h2>
          <button onClick={() => navigate('/app/campaigns')} className="text-sm font-semibold text-[#F45B16] hover:underline">
            View all
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[0,1,2].map((i) => (
              <div key={i} className="h-10 bg-[#FAF9F6] rounded animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[#617184] mb-3">No campaigns yet.</p>
            <Button onClick={() => navigate('/app/campaigns/new')}>Create your first campaign</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E8EAF0]">
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">Recipients</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]">
                {recent.map((c, i) => (
                  <tr key={c.id ?? i} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {c.channel === 'email'
                          ? <Mail size={14} className="text-[#617184]" />
                          : <MessageSquare size={14} className="text-[#617184]" />}
                        <span className="text-xs font-medium text-[#617184] capitalize">{c.channel ?? 'sms'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#172536]">{c.name}</td>
                    <td className="px-5 py-3.5 text-[#617184]">{c.audience ? c.audience.toLocaleString() : '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5 text-[#617184]">
                      {c.scheduledFor ? new Date(c.scheduledFor).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
