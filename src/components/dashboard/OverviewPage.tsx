import { BarChart2, Bell, Check, ChevronRight, Mail, MessageSquare, Plus, Settings, Users } from 'lucide-react'
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

type ShowcaseVariant = 'overview' | 'contacts' | 'campaigns' | 'messages' | 'templates' | 'integrations' | 'settings' | 'mobile'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function StatusBadge({ status }: { status: string }) {
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

  const cls = statusColors[status] ?? statusColors.draft
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function DashboardTile({
  title,
  variant,
  accent = 'bg-[#F45B16]',
  metric,
}: {
  title: string
  variant: ShowcaseVariant
  accent?: string
  metric?: string
}) {
  const overview = variant === 'overview'
  const contacts = variant === 'contacts'
  const campaigns = variant === 'campaigns'
  const messages = variant === 'messages'
  const templates = variant === 'templates'
  const integrations = variant === 'integrations'
  const settings = variant === 'settings'
  const mobile = variant === 'mobile'

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#E7EAF0] bg-white shadow-[0_20px_40px_rgba(18,42,65,0.08)]">
      <div className="flex items-center justify-between border-b border-[#E7EAF0] bg-[#F9F8F5] px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${accent} text-[10px] font-bold text-white`}>
            M
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#172536]">{title}</div>
        </div>
        <div className="flex items-center gap-2 text-[#617184]">
          <Bell size={12} />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F45B16] text-[9px] font-bold text-white">A</div>
        </div>
      </div>

      <div className={mobile ? 'bg-[#FAF9F6] p-3' : 'bg-[#FAF9F6] p-3'}>
        {overview && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Welcome back, Lisa</div>
              <button className="flex items-center gap-1 rounded-md border border-[#E7EAF0] bg-white px-2 py-1 text-[10px] font-medium text-[#172536]">
                <Plus size={10} /> New
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total Users', value: '2,483', tone: 'bg-[#FFF3E8]' },
                { label: 'Campaigns', value: '24', tone: 'bg-[#F3F7FF]' },
                { label: 'Revenue', value: '$18,742', tone: 'bg-[#F6F3FF]' },
                { label: 'Delivery', value: '98.4%', tone: 'bg-[#ECFDF5]' },
              ].map((item) => (
                <div key={item.label} className={`rounded-xl ${item.tone} px-2.5 py-2`}>
                  <div className="text-[9px] uppercase tracking-[0.12em] text-[#617184]">{item.label}</div>
                  <div className="mt-1.5 text-lg font-bold text-[#172536]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[#E7EAF0] bg-white p-3">
              <div className="mb-2 flex items-center justify-between text-[10px] text-[#617184]">
                <span>Message impact</span>
                <span className="font-semibold text-[#172536]">{metric ?? '18,742'}</span>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-[8px] border-[#F45B16] border-t-[#FDE6DA] border-l-[#FDE6DA] text-xs font-bold text-[#172536]">
                  82%
                </div>
                <div className="flex-1 space-y-2">
                  {[52, 72, 94, 68].map((height, index) => (
                    <div key={index} className="flex items-end gap-1.5">
                      <div className="h-3 w-1 rounded-full bg-[#F45B16]/20" />
                      <div className="w-full rounded-full bg-[#E7EAF0]">
                        <div className="rounded-full bg-[#F45B16]" style={{ height: `${height}px`, width: `${Math.min(height, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {contacts && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Contacts</div>
              <button className="rounded-md bg-[#F45B16] px-2 py-1 text-[10px] font-semibold text-white">Import</button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Total', value: '2,483' },
                { label: 'Active', value: '2,401' },
                { label: 'New', value: '42' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#E7EAF0] bg-white p-2">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-[#617184]">{item.label}</div>
                  <div className="mt-1 text-sm font-bold text-[#172536]">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="overflow-hidden rounded-xl border border-[#E7EAF0] bg-white">
              <div className="grid grid-cols-[1.4fr_1.6fr_0.9fr_0.8fr] gap-2 border-b border-[#E7EAF0] bg-[#FAF9F6] px-2 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#617184]">
                <span>Name</span>
                <span>Email</span>
                <span>Status</span>
                <span>Meta</span>
              </div>
              {[
                ['Brianna', 'brianna@domain.com', 'Active', '12'],
                ['Henry', 'henry@northwind.com', 'New', '9'],
                ['Nora', 'nora@company.io', 'Segment', '16'],
                ['Ava', 'ava@mabrixel.com', 'Active', '7'],
              ].map(([name, email, status, meta]) => (
                <div key={name} className="grid grid-cols-[1.4fr_1.6fr_0.9fr_0.8fr] gap-2 border-b border-[#F1F3F5] px-2 py-2 text-[10px] last:border-b-0">
                  <span className="font-medium text-[#172536]">{name}</span>
                  <span className="text-[#617184]">{email}</span>
                  <span className="text-[#16865B]">{status}</span>
                  <span className="text-[#617184]">{meta}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {campaigns && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Campaigns</div>
              <button className="rounded-md border border-[#E7EAF0] bg-white px-2 py-1 text-[10px] font-medium text-[#172536]">View all</button>
            </div>
            <div className="space-y-2">
              {[
                ['Customer Nurture', 'SMS', 'scheduled', '2.4k'],
                ['Product Launch', 'Email', 'sent', '3.2k'],
                ['Follow-up Flow', 'SMS', 'queued', '1.8k'],
                ['Re-engagement', 'Email', 'draft', '890'],
              ].map(([name, channel, status, value]) => (
                <div key={name} className="rounded-xl border border-[#E7EAF0] bg-white p-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold text-[#172536]">{name}</div>
                      <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#617184]">{channel}</div>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9px] text-[#617184]">
                    <span>Audience</span>
                    <span className="font-semibold text-[#172536]">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Messages</div>
              <button className="rounded-md bg-[#F45B16] px-2 py-1 text-[10px] font-semibold text-white">Compose</button>
            </div>
            <div className="space-y-2">
              {[
                ['Jacob', '12:08 PM', 'Welcome back! We have a new update for your team.', 'sent'],
                ['Maya', '11:54 AM', 'Your campaign is going live today at 2pm.', 'queued'],
                ['Oliver', '10:42 AM', 'Customer feedback is trending upward this week.', 'read'],
              ].map(([person, time, text, state]) => (
                <div key={person} className="rounded-xl border border-[#E7EAF0] bg-white p-2.5">
                  <div className="mb-1 flex items-center justify-between text-[9px] text-[#617184]">
                    <span className="font-semibold text-[#172536]">{person}</span>
                    <span>{time}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-[#617184]">{text}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[9px] text-[#16865B]">
                      <Check size={10} /> {state}
                    </div>
                    <ChevronRight size={12} className="text-[#617184]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {templates && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Templates</div>
              <button className="rounded-md border border-[#E7EAF0] bg-white px-2 py-1 text-[10px] font-medium text-[#172536]">New</button>
            </div>
            <div className="space-y-2">
              {[
                ['Welcome Email', 'Marketing', '4.8'],
                ['Product update', 'Lifecycle', '4.5'],
                ['A/B test', 'Automation', '4.7'],
              ].map(([name, tag, score]) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-[#E7EAF0] bg-white p-2.5">
                  <div>
                    <div className="text-[10px] font-semibold text-[#172536]">{name}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#617184]">{tag}</div>
                  </div>
                  <div className="rounded-md bg-[#FFF3E8] px-2 py-1 text-[9px] font-semibold text-[#F45B16]">{score}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {integrations && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Integrations</div>
              <button className="rounded-md bg-[#F45B16] px-2 py-1 text-[10px] font-semibold text-white">Connect</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Shopify', 'Active'],
                ['Slack', 'Live'],
                ['HubSpot', 'Syncing'],
                ['Stripe', 'Ready'],
              ].map(([name, state]) => (
                <div key={name} className="rounded-xl border border-[#E7EAF0] bg-white p-2.5">
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF3E8] text-[10px] font-bold text-[#F45B16]">{name[0]}</div>
                  <div className="text-[10px] font-semibold text-[#172536]">{name}</div>
                  <div className="mt-1 text-[9px] text-[#617184]">{state}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {settings && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-[#172536]">Settings</div>
              <button className="rounded-md border border-[#E7EAF0] bg-white p-1 text-[#617184]">
                <Settings size={12} />
              </button>
            </div>
            <div className="space-y-2 rounded-xl border border-[#E7EAF0] bg-white p-2.5">
              {[
                ['Two-factor authentication', 'On'],
                ['Email digest', 'Weekly'],
                ['Auto-replies', 'Enabled'],
                ['Usage alerts', 'On'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[#F1F3F5] pb-2 last:border-b-0 last:pb-0">
                  <span className="text-[10px] text-[#617184]">{label}</span>
                  <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[9px] font-semibold text-[#16865B]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mobile && (
          <div className="flex items-center justify-center py-4">
            <div className="relative w-[150px] rounded-[28px] border-[7px] border-[#172536] bg-[#F5F6F8] p-2 shadow-[0_16px_30px_rgba(23,37,54,0.18)]">
              <div className="flex items-center justify-between rounded-t-[18px] bg-[#F45B16] px-2 py-1.5 text-white">
                <div className="text-[9px] font-semibold">Mabrixel</div>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[8px]">A</div>
              </div>
              <div className="space-y-2 bg-white p-2">
                <div className="rounded-xl bg-[#FFF3E8] p-2">
                  <div className="text-[8px] uppercase tracking-[0.12em] text-[#617184]">Welcome back</div>
                  <div className="mt-1 text-xs font-bold text-[#172536]">2,483</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div className="rounded-lg border border-[#E7EAF0] p-1.5 text-[#617184]">
                    <div className="text-[7px] uppercase tracking-[0.12em]">SMS</div>
                    <div className="mt-1 text-[10px] font-bold text-[#172536]">4.8k</div>
                  </div>
                  <div className="rounded-lg border border-[#E7EAF0] p-1.5 text-[#617184]">
                    <div className="text-[7px] uppercase tracking-[0.12em]">Email</div>
                    <div className="mt-1 text-[10px] font-bold text-[#172536]">3.7k</div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#E7EAF0] p-2">
                  <div className="mb-1 flex items-center justify-between text-[7px] text-[#617184]">
                    <span>Delivery</span>
                    <span className="font-semibold text-[#172536]">98.4%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F1F3F5]">
                    <div className="h-1.5 w-[98%] rounded-full bg-[#F45B16]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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
  const safeSummary = summary ?? { contacts: 2483, campaigns: 24, sentMessages: 18742, smsSent: 4826, emailSent: 3102, deliveryRate: 98.4 }
  const recent = campaigns.slice(0, 8)

  const cards = [
    { label: 'Total Sent', value: safeSummary.sentMessages.toLocaleString(), icon: Mail, sub: 'All channels' },
    { label: 'SMS Sent', value: safeSummary.smsSent.toLocaleString(), icon: MessageSquare, sub: 'This period' },
    { label: 'Delivery Rate', value: `${safeSummary.deliveryRate}%`, icon: BarChart2, sub: 'Delivered / sent' },
    { label: 'Active Contacts', value: safeSummary.contacts.toLocaleString(), icon: Users, sub: 'Total contacts' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172536]">{getGreeting()}, {firstName}</h1>
          <p className="text-sm text-[#617184] mt-0.5">Here’s what your customer growth looks like today.</p>
        </div>
        <Button onClick={() => navigate('/app/campaigns/new')} className="hidden sm:flex items-center gap-2">
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
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

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <DashboardTile title="Main Dashboard" variant="overview" metric={safeSummary.sentMessages.toLocaleString()} />
        <DashboardTile title="Contacts Dashboard" variant="contacts" />
        <DashboardTile title="Campaigns Dashboard" variant="campaigns" />
        <DashboardTile title="Messages Dashboard" variant="messages" />
        <DashboardTile title="Templates Dashboard" variant="templates" />
        <DashboardTile title="Integrations Dashboard" variant="integrations" />
        <DashboardTile title="Settings Dashboard" variant="settings" />
        <DashboardTile title="Mobile View" variant="mobile" accent="bg-[#172536]" />
      </div>

      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8EAF0]">
          <h2 className="text-base font-bold text-[#172536]">Recent Campaigns</h2>
          <button onClick={() => navigate('/app/campaigns')} className="text-sm font-semibold text-[#F45B16] hover:underline">
            View all
          </button>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[0, 1, 2].map((i) => (
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
                        {c.channel === 'email' ? <Mail size={14} className="text-[#617184]" /> : <MessageSquare size={14} className="text-[#617184]" />}
                        <span className="text-xs font-medium text-[#617184] capitalize">{c.channel ?? 'sms'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#172536]">{c.name}</td>
                    <td className="px-5 py-3.5 text-[#617184]">{c.audience ? c.audience.toLocaleString() : '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3.5 text-[#617184]">{c.scheduledFor ? new Date(c.scheduledFor).toLocaleDateString() : '—'}</td>
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
