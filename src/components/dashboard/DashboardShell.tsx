import { Bell, CalendarCheck, CalendarClock, CreditCard, LayoutGrid, LineChart, LogOut, Mail, MailPlus, MessageSquare, MessageSquareText, PlugZap, Search, Send, Settings, Users, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'
import { OrbitLogo } from './OrbitLogo'
import { useAuth } from '../../App'

const demoContacts = [
  { name: 'Alicia Patel', channel: 'SMS + Email', status: 'Consent active', lastSeen: '2 hours ago', value: '$1,240' },
  { name: 'Brendan Shaw', channel: 'Email only', status: 'Review needed', lastSeen: '1 day ago', value: '$480' },
  { name: 'Mina Okafor', channel: 'SMS', status: 'Opted out', lastSeen: '4 days ago', value: '$0' },
  { name: 'Darnell Brooks', channel: 'Email + Voice', status: 'Priority', lastSeen: '6 hours ago', value: '$2,010' },
  { name: 'Sofia Nguyen', channel: 'SMS + Email', status: 'Consent active', lastSeen: '3 days ago', value: '$890' },
]

type ContactRow = {
  id?: string
  name: string
  email?: string | null
  phone?: string | null
  status?: string
  consent?: string
}

type CampaignRow = {
  id?: string
  name: string
  audience: number
  status: string
  scheduledFor?: string | null
  channel?: string
}

const navItems = [
  { to: '/app/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/app/campaigns', label: 'Campaigns', icon: MessageSquareText },
  { to: '/app/contacts', label: 'Contacts', icon: Users },
  { to: '/app/messages', label: 'Renewal automation', icon: CalendarClock },
  { to: '/app/settings', label: 'Integrations', icon: PlugZap },
  { to: '/app/overview', label: 'Analytics', icon: LineChart },
  { to: '/app/overview', label: 'Billing and usage', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

type DashboardSummary = {
  contacts: number
  campaigns: number
  sentMessages: number
  smsSent: number
  emailSent: number
  deliveryRate: number
  renewalAlerts: number
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function StatCardSkeleton() {
  return (
    <div className="rounded-[22px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5 shadow-[var(--orbit-shadow)]">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3 w-24 animate-pulse rounded bg-[var(--orbit-border)]" />
        <div className="h-9 w-9 animate-pulse rounded-xl bg-[var(--orbit-pale)]" />
      </div>
      <div className="mt-5 h-8 w-24 animate-pulse rounded bg-[var(--orbit-border)]" />
      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-[var(--orbit-border)]" />
    </div>
  )
}

function StatCard({
  label,
  value,
  meta,
  icon: Icon,
}: {
  label: string
  value: string
  meta: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="rounded-[22px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5 shadow-[var(--orbit-shadow)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--orbit-muted)]">
          {label}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--orbit-pale)] text-[var(--orbit-accent)]">
          <Icon size={16} />
        </span>
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[var(--orbit-text)]">
        {value}
      </div>
      <div className="mt-2 text-xs text-[var(--orbit-muted)]">{meta}</div>
    </div>
  )
}

function OverviewPage({
  summary,
  loading,
  error,
  onRetry,
}: {
  summary: DashboardSummary | null
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  const navigate = useNavigate()

  const statCards = summary
    ? [
        { label: 'SMS', value: summary.smsSent.toLocaleString(), meta: 'Sent this month', icon: MessageSquare },
        { label: 'EMAIL', value: summary.emailSent.toLocaleString(), meta: 'Sent this month', icon: Mail },
        { label: 'CONTACTS', value: summary.contacts.toLocaleString(), meta: 'Total contacts', icon: Users },
        { label: 'RENEWALS', value: summary.renewalAlerts.toLocaleString(), meta: 'Upcoming', icon: CalendarClock },
      ]
    : []

  const actionCards = [
    { title: 'New SMS campaign', subtitle: 'Compose and schedule', icon: Send, to: '/app/campaigns' },
    { title: 'New email', subtitle: 'Design and send', icon: MailPlus, to: '/app/messages' },
    { title: 'Set reminders', subtitle: 'Automate renewals', icon: CalendarCheck, to: '/app/settings' },
    { title: 'Import contacts', subtitle: 'CSV or WordPress', icon: UsersRound, to: '/app/contacts' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[var(--orbit-text)]">
            {getGreeting()}
          </h1>
          <p className="mt-2 text-sm text-[var(--orbit-muted)]">
            Your communication overview at a glance.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[24px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-8 text-center shadow-[var(--orbit-shadow)]">
          <p className="text-sm text-[var(--orbit-muted)]">Unable to load your dashboard data.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-4 py-2 text-sm font-medium text-[var(--orbit-text)] transition hover:bg-[var(--orbit-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {statCards.map(({ label, value, meta, icon: Icon }) => (
            <StatCard key={label} label={label} value={value} meta={meta} icon={Icon} />
          ))}
        </div>
      )}

      <div className="rounded-[24px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5 shadow-[var(--orbit-shadow)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xl font-semibold text-[var(--orbit-text)]">Campaign performance</p>
          <button
            type="button"
            className="rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-1.5 text-xs font-medium text-[var(--orbit-text)]"
          >
            7 days
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[var(--orbit-muted)]">Delivery rate</span>
            <span className="font-medium text-[var(--orbit-text)]">
              {loading ? '—' : `${summary?.deliveryRate ?? 0}%`}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--orbit-border)]">
            <div
              className="h-full rounded-full bg-[var(--orbit-accent)]"
              style={{ width: `${loading ? 0 : summary?.deliveryRate ?? 0}%` }}
            />
          </div>
          <p className="text-xs text-[var(--orbit-muted)]">
            Successful deliveries ÷ total messages sent.
          </p>
        </div>
      </div>

      <GlassCard className="rounded-[24px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5 shadow-[var(--orbit-shadow)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--orbit-accent)]">WordPress sync</p>
            <p className="mt-2 text-lg font-semibold text-[var(--orbit-text)]">Status: Connected</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => navigate('/app/settings')} aria-label="Sync WordPress">
            Sync WordPress
          </Button>
        </div>
      </GlassCard>

      <section className="rounded-[24px] border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-5 shadow-[var(--orbit-shadow)]">
        <div className="mb-4">
          <p className="text-lg font-semibold text-[var(--orbit-text)]">Quick actions</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {actionCards.map(({ title, subtitle, icon: Icon, to }) => (
            <button
              key={title}
              type="button"
              onClick={() => navigate(to)}
              className="rounded-[20px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-4 text-left transition-colors hover:shadow-[var(--orbit-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--orbit-pale)] text-[var(--orbit-accent)]">
                <Icon size={18} />
              </div>
              <div className="text-base font-semibold text-[var(--orbit-text)]">{title}</div>
              <div className="mt-1 text-sm text-[var(--orbit-muted)]">{subtitle}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function ContactsPage({ contacts, onCreateContact, onImportCsv }: {
  contacts?: ContactRow[]
  onCreateContact?: (payload: { name: string; email: string; phone: string }) => Promise<void>
  onImportCsv?: (rows: Array<{ name: string; email?: string; phone?: string }>) => Promise<void>
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [showCsvImport, setShowCsvImport] = useState(true)
  const [formState, setFormState] = useState({ name: '', email: '', phone: '' })
  const [csvText, setCsvText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImportingCsv, setIsImportingCsv] = useState(false)

  const rows = contacts && contacts.length > 0
    ? contacts.map((contact) => ({
        name: contact.name,
        channel: contact.email ? (contact.phone ? 'SMS + Email' : 'Email only') : 'SMS',
        status: contact.status ?? 'active',
        lastSeen: 'Now',
        value: contact.phone ? '$0' : '$120',
      }))
    : demoContacts

  const filteredContacts = rows.filter((contact) => {
    const matchesSearch = `${contact.name} ${contact.channel}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === 'All' || contact.status === status
    return matchesSearch && matchesStatus
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onCreateContact || !formState.name.trim()) return
    setIsSubmitting(true)
    await onCreateContact({
      name: formState.name.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim(),
    })
    setFormState({ name: '', email: '', phone: '' })
    setShowForm(false)
    setIsSubmitting(false)
  }

  const parseCsvRows = (value: string) => {
    const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    if (lines.length === 0) return []
    const headerRow = lines[0].split(',').map((chunk) => chunk.trim().toLowerCase())
    const nameIndex = headerRow.findIndex((value) => ['name', 'full name', 'contact name'].includes(value))
    const emailIndex = headerRow.findIndex((value) => ['email', 'email address'].includes(value))
    const phoneIndex = headerRow.findIndex((value) => ['phone', 'phone number', 'mobile'].includes(value))
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((part) => part.trim().replace(/^"|"$/g, ''))
      const row: { name: string; email?: string; phone?: string } = {
        name: values[nameIndex >= 0 ? nameIndex : 0] ?? '',
      }
      if (emailIndex >= 0 && values[emailIndex]) row.email = values[emailIndex]
      if (phoneIndex >= 0 && values[phoneIndex]) row.phone = values[phoneIndex]
      return row
    }).filter((row) => row.name)
  }

  const handleCsvImport = async () => {
    if (!onImportCsv || !csvText.trim()) return
    const rows = parseCsvRows(csvText)
    if (rows.length === 0) return
    setIsImportingCsv(true)
    await onImportCsv(rows)
    setCsvText('')
    setShowCsvImport(false)
    setIsImportingCsv(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">Contacts</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--orbit-text)]">Customer directory</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm((value) => !value)}>Import contacts</Button>
          <Button variant="ghost" onClick={() => setShowCsvImport((value) => !value)}>CSV import</Button>
        </div>
      </div>

      {showForm && (
        <GlassCard className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder="Contact name" className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
            <input value={formState.email} onChange={(event) => setFormState((state) => ({ ...state, email: event.target.value }))} placeholder="Email" className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
            <div className="flex gap-2">
              <input value={formState.phone} onChange={(event) => setFormState((state) => ({ ...state, phone: event.target.value }))} placeholder="Phone" className="flex-1 rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
              <Button type="submit" disabled={isSubmitting} className="shrink-0">{isSubmitting ? 'Saving...' : 'Add'}</Button>
            </div>
          </form>
        </GlassCard>
      )}

      {showCsvImport && (
        <GlassCard className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
          <div className="space-y-4">
            <label className="block space-y-2 text-sm text-[var(--orbit-text)]">
              <span>Paste CSV rows</span>
              <textarea aria-label="Paste CSV rows" value={csvText} onChange={(event) => setCsvText(event.target.value)} rows={5} className="w-full rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" placeholder="name,email,phone\nJane Doe,jane@example.com,+123456789" />
            </label>
            <div className="flex justify-end">
              <Button type="button" onClick={handleCsvImport} disabled={isImportingCsv}>{isImportingCsv ? 'Importing...' : 'Import CSV'}</Button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {[['Active leads', '3,482', '+12.8%'], ['Awaiting review', '84', 'Needs action'], ['Revenue tracked', '$84.3K', 'This quarter']].map(([label, value, meta]) => (
          <GlassCard key={label} className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-4">
            <div className="text-sm text-[var(--orbit-muted)]">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-[var(--orbit-text)]">{value}</div>
            <div className="mt-1 text-xs text-emerald-700">{meta}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="overflow-hidden border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--orbit-muted)]" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contacts" className="w-full rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] pl-9 pr-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]">
            <option>All</option>
            <option>Consent active</option>
            <option>Review needed</option>
            <option>Opted out</option>
            <option>Priority</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-[var(--orbit-text)]">
            <thead className="bg-[var(--orbit-pale)] text-[var(--orbit-muted)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last seen</th>
                <th className="px-4 py-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.name} className="border-t border-[var(--orbit-border)]">
                  <td className="px-4 py-3 font-medium text-[var(--orbit-text)]">{contact.name}</td>
                  <td className="px-4 py-3">{contact.channel}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-2 py-1 text-xs text-[var(--orbit-text)]">
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{contact.lastSeen}</td>
                  <td className="px-4 py-3 text-emerald-700">{contact.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}

function CampaignsPage({ campaignRows, onCreateCampaign }: { campaignRows?: CampaignRow[]; onCreateCampaign?: (payload: { name: string; channel: 'sms' | 'email'; template: string; scheduledFor?: string }) => Promise<void> }) {
  const campaigns = campaignRows && campaignRows.length > 0
    ? campaignRows.map((campaign) => ({
        name: campaign.name,
        audience: `${Math.max(0, campaign.audience).toLocaleString()} contacts`,
        status: campaign.status || 'draft',
        next: campaign.scheduledFor ? new Date(campaign.scheduledFor).toLocaleString() : 'Queued for delivery',
      }))
    : [
        { name: 'Welcome sequence', audience: '1,240 contacts', status: 'Running', next: 'Today, 2:00 PM' },
        { name: 'Renewal reminder', audience: '384 contacts', status: 'Queued', next: 'Tomorrow, 9:30 AM' },
        { name: 'Service check-in', audience: '620 contacts', status: 'Healthy', next: 'Thu, 11:00 AM' },
      ]

  const [showForm, setShowForm] = useState(false)
  const [formState, setFormState] = useState({ name: '', channel: 'sms' as 'sms' | 'email', template: 'Customer follow-up', scheduledFor: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onCreateCampaign || !formState.name.trim()) return
    setIsSubmitting(true)
    await onCreateCampaign({
      name: formState.name.trim(),
      channel: formState.channel,
      template: formState.template.trim(),
      scheduledFor: formState.scheduledFor || undefined,
    })
    setFormState({ name: '', channel: 'sms', template: 'Customer follow-up', scheduledFor: '' })
    setShowForm(false)
    setIsSubmitting(false)
  }

  const statusStyles: Record<string, string> = {
    Running: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Queued: 'border-amber-200 bg-amber-50 text-amber-700',
    Healthy: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    draft: 'border-[var(--orbit-border)] bg-[var(--orbit-pale)] text-[var(--orbit-text)]',
    scheduled: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
    queued: 'border-amber-200 bg-amber-50 text-amber-700',
    sent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    failed: 'border-rose-200 bg-rose-50 text-rose-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">Campaigns</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--orbit-text)]">Broadcast and workflow history</h1>
        </div>
        <Button onClick={() => setShowForm((value) => !value)}>New campaign</Button>
      </div>

      {showForm && (
        <GlassCard className="p-5 border-[var(--orbit-border)] bg-[var(--orbit-surface)]">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input value={formState.name} onChange={(event) => setFormState((state) => ({ ...state, name: event.target.value }))} placeholder="Campaign name" className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
            <select value={formState.channel} onChange={(event) => setFormState((state) => ({ ...state, channel: event.target.value as 'sms' | 'email' }))} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]">
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
            <input value={formState.template} onChange={(event) => setFormState((state) => ({ ...state, template: event.target.value }))} placeholder="Template message" className="md:col-span-2 rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="datetime-local" value={formState.scheduledFor} onChange={(event) => setFormState((state) => ({ ...state, scheduledFor: event.target.value }))} className="flex-1 rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Create'}</Button>
            </div>
          </form>
        </GlassCard>
      )}

      <GlassCard className="p-5 border-[var(--orbit-border)] bg-[var(--orbit-surface)]">
        <div className="grid gap-4 md:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4 text-sm text-[var(--orbit-text)]">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--orbit-muted)]">
                <span className={`rounded-full border px-2 py-1 text-[10px] font-medium ${statusStyles[campaign.status] ?? 'border-[var(--orbit-border)] bg-[var(--orbit-pale)] text-[var(--orbit-text)]'}`}>
                  {campaign.status}
                </span>
                <Send size={14} className="text-[var(--orbit-accent)]" />
              </div>
              <div className="text-lg font-medium text-[var(--orbit-text)]">{campaign.name}</div>
              <div className="mt-2 text-[var(--orbit-muted)]">Audience: {campaign.audience}</div>
              <div className="mt-1 text-xs text-emerald-600">Next send: {campaign.next}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 border-[var(--orbit-border)] bg-[var(--orbit-surface)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">Composer</div>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--orbit-text)]">Campaign intelligence</h2>
          </div>
          <Button variant="ghost">Review schedule</Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[{ label: 'Template', value: 'Renewal reminder' }, { label: 'Channel mix', value: 'SMS + Email' }, { label: 'Delivery confidence', value: '92% open rate' }].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4 text-sm text-[var(--orbit-text)]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--orbit-muted)]">{item.label}</div>
              <div className="mt-2 text-base font-medium text-[var(--orbit-text)]">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[['Best send window', 'Today · 2:00 PM'], ['Audience fit', '94% consented'], ['Automation health', 'Healthy']].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-[var(--orbit-text)]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-700">{label}</div>
              <div className="mt-2 text-base font-medium text-[var(--orbit-text)]">{value}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function MessagesPage() {
  const [tab, setTab] = useState<'sent' | 'inbox' | 'failed'>('sent')
  const messageRows = {
    sent: ['SMS: 2,138 delivered', 'Email: 1,947 delivered', 'Welcome sequence re-sent to 96 contacts'],
    inbox: ['2 missed follow-ups', '4 customer replies awaiting response', '1 quote request from a hot lead'],
    failed: ['38 recipients requiring review', '12 soft bounces', '4 opt-out flags to audit'],
  }
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">Messages</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--orbit-text)]">Delivery and template activity</h1>
      </div>
      <GlassCard className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
        <div className="mb-4 flex gap-2">
          {(['sent', 'inbox', 'failed'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${
                tab === key ? 'bg-[var(--orbit-pale)] text-[var(--orbit-accent)] ring-1 ring-[var(--orbit-border)]' : 'bg-[var(--orbit-pale)] text-[var(--orbit-muted)]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {messageRows[tab].map((line) => (
            <div key={line} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4 text-sm text-[var(--orbit-text)]">
              {line}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function SettingsPage({ token }: { token?: string | null }) {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
  const [siteUrl, setSiteUrl] = useState('https://northwind-services.example.com')
  const [syncStatus, setSyncStatus] = useState('Connected')
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    async function loadConnection() {
      try {
        const response = await fetch(`${apiBaseUrl}/integrations/wordpress`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (data.connection?.siteUrl) {
          setSiteUrl(data.connection.siteUrl)
          setSyncStatus(data.connection.status ?? 'Connected')
        }
      } catch {
        // ignore and keep defaults for demo-mode fallback
      }
    }
    void loadConnection()
    return () => controller.abort()
  }, [apiBaseUrl, token])

  const handleSync = async () => {
    if (!token) { setSyncStatus('Demo mode'); return }
    setIsSyncing(true)
    try {
      const response = await fetch(`${apiBaseUrl}/integrations/wordpress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ siteUrl }),
      })
      if (!response.ok) throw new Error('Sync failed')
      const data = await response.json()
      setSyncStatus(data.status ?? 'Synced')
      setSiteUrl(data.connection?.siteUrl ?? siteUrl)
    } catch {
      setSyncStatus('Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--orbit-text)]">Workspace configuration</h1>
      </div>
      <GlassCard className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
        <div className="space-y-4 text-sm text-[var(--orbit-text)]">
          <div className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4">Default sender identity: Northwind Services</div>
          <div className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4">Timezone: Africa/Nairobi</div>
          <div className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4">Retention policy: 12 months</div>
          <div className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] p-4">Auto-send reminders: Enabled</div>
        </div>
      </GlassCard>
      <GlassCard className="border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--orbit-accent)]">WordPress sync</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--orbit-text)]">Site connection</h2>
          </div>
          <Button type="button" variant="ghost" aria-label="Sync WordPress" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? 'Syncing...' : 'Sync WordPress'}
          </Button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <input value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} className="rounded-2xl border border-[var(--orbit-border)] bg-[var(--orbit-pale)] px-3 py-2.5 text-sm text-[var(--orbit-text)] outline-none focus:border-[var(--orbit-accent)]" />
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {syncStatus}
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export function DashboardShell() {
  const { logout, user, token } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [campaignRows, setCampaignRows] = useState<CampaignRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

  const loadDashboardData = async () => {
    if (!user || !token) return
    setLoading(true)
    setError(null)
    try {
      const [summaryResponse, campaignsResponse, contactsResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBaseUrl}/campaigns`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBaseUrl}/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData.summary ?? summaryData)
      } else {
        throw new Error('summary failed')
      }

      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json()
        const rows = Array.isArray(campaignsData.campaigns)
          ? campaignsData.campaigns.map((campaign: { name: string; status: string; scheduledFor?: string | null; channel?: string; template?: string }) => ({
              name: campaign.name,
              audience: 0,
              status: campaign.status ?? 'draft',
              scheduledFor: campaign.scheduledFor ?? null,
              channel: campaign.channel ?? 'sms',
            }))
          : []
        setCampaignRows(rows)
      }

      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json()
        setContacts(Array.isArray(contactsData.contacts) ? contactsData.contacts : [])
      }
    } catch {
      setError('Unable to load your dashboard data.')
      setSummary(null)
      setCampaignRows([])
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboardData()
  }, [apiBaseUrl, token, user])

  if (!user) return <Navigate to="/signin" replace />

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

  const handleCreateContact = async (payload: { name: string; email: string; phone: string }) => {
    if (!token) return
    const response = await fetch(`${apiBaseUrl}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: payload.name, email: payload.email || undefined, phone: payload.phone || undefined }),
    })
    if (response.ok) {
      const data = await response.json()
      setContacts((current) => [data.contact, ...current])
    }
  }

  const handleCreateCampaign = async (payload: { name: string; channel: 'sms' | 'email'; template: string; scheduledFor?: string }) => {
    if (!token) return
    const response = await fetch(`${apiBaseUrl}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: payload.name, channel: payload.channel, template: payload.template, scheduledFor: payload.scheduledFor }),
    })
    if (response.ok) {
      const data = await response.json()
      setCampaignRows((current) => [{ name: data.campaign.name, audience: 0, status: data.campaign.status ?? 'draft', scheduledFor: data.campaign.scheduledFor ?? null, channel: data.campaign.channel }, ...current])
    }
  }

  const handleImportCsv = async (rows: Array<{ name: string; email?: string; phone?: string }>) => {
    if (!token || rows.length === 0) return
    const response = await fetch(`${apiBaseUrl}/contacts/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rows }),
    })
    if (!response.ok) return
    const data = await response.json()
    setContacts((current) => [...data.contacts.filter(Boolean), ...current])
  }

  const sidebarContent = (
    <>
      <div className={`mb-6 flex items-center gap-3 rounded-[20px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-3 shadow-[var(--orbit-shadow)] ${collapsed ? 'justify-center' : ''}`}>
        <OrbitLogo size={collapsed ? 28 : 34} />
        {!collapsed && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--orbit-accent)]">ORBIT</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--orbit-muted)]">Messaging intelligence</div>
          </div>
        )}
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/app/overview'}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--orbit-pale)] text-[var(--orbit-accent)] shadow-[inset_0_0_0_1px_rgba(240,120,40,0.12)]'
                  : 'text-[var(--orbit-muted)] hover:bg-[var(--orbit-surface)] hover:text-[var(--orbit-text)]'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <Icon size={17} />
            <span className={collapsed ? 'sr-only' : ''}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 border-t border-[var(--orbit-border)] pt-5">
        <div className={`mb-3 flex items-center gap-2 text-sm font-medium text-[var(--orbit-text)] ${collapsed ? 'justify-center' : ''}`}>
          <Bell size={15} /> {!collapsed && 'Alerts'}
        </div>
        {!collapsed && (
          <div className="rounded-[18px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-3 text-sm text-[var(--orbit-muted)]">
            3 renewal reminders due today
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden w-full items-center justify-center gap-2 rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-surface)] px-4 py-2.5 text-sm font-medium text-[var(--orbit-text)] transition hover:bg-[var(--orbit-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2 lg:flex"
        >
          {collapsed ? <span className="text-xs">Expand</span> : <span className="text-xs">Collapse</span>}
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          className={`flex w-full items-center gap-2 rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-surface)] px-4 py-2.5 text-sm font-medium text-[var(--orbit-text)] transition hover:bg-[var(--orbit-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2 ${collapsed ? 'justify-center' : 'justify-center'}`}
        >
          <LogOut size={16} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[var(--orbit-bg)] text-[var(--orbit-text)]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col rounded-r-[28px] border-r border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-4 shadow-[var(--orbit-shadow)] lg:hidden">
          {sidebarContent}
        </aside>
      )}

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-5 lg:px-6">
        <aside
          className={`hidden shrink-0 rounded-[28px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-4 shadow-[var(--orbit-shadow)] lg:flex lg:flex-col ${
            collapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
        >
          {sidebarContent}
        </aside>

        <main className="flex-1 rounded-[28px] border border-[var(--orbit-border)] bg-[var(--orbit-surface)] p-4 shadow-[var(--orbit-shadow)] sm:p-6">
          <header className="mb-6 flex items-center justify-between border-b border-[var(--orbit-border)] pb-4 sm:mb-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-surface)] text-[var(--orbit-text)] transition hover:bg-[var(--orbit-pale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2 lg:hidden"
              >
                <span className="text-lg leading-none">☰</span>
              </button>
              <OrbitLogo size={34} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--orbit-text)]">
                  ORBIT
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--orbit-muted)]">
                  MESSAGING INTELLIGENCE
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-pale)] text-[var(--orbit-accent)] transition hover:bg-[var(--orbit-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2"
              >
                <Bell size={17} />
              </button>
              <button
                type="button"
                aria-label="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--orbit-border)] bg-[var(--orbit-surface)] text-[var(--orbit-text)] shadow-[var(--orbit-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orbit-accent)] focus-visible:ring-offset-2"
              >
                <span className="text-sm font-medium">
                  {user.fullName.slice(0, 1).toUpperCase()}
                </span>
              </button>
            </div>
          </header>

          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="text-xl font-semibold text-[var(--orbit-text)]">
              {user.businessName}
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>

          <Routes>
            <Route
              path="overview"
              element={
                <OverviewPage
                  summary={summary}
                  loading={loading}
                  error={error}
                  onRetry={() => void loadDashboardData()}
                />
              }
            />
            <Route path="contacts" element={<ContactsPage contacts={contacts} onCreateContact={handleCreateContact} onImportCsv={handleImportCsv} />} />
            <Route path="campaigns" element={<CampaignsPage campaignRows={campaignRows} onCreateCampaign={handleCreateCampaign} />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage token={token} />} />
            <Route path="*" element={<Navigate to="/app/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
