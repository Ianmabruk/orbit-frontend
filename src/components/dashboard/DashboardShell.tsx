import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from '../../App'
import { ApiKeysPage } from './ApiKeysPage'
import { CampaignWizard } from './CampaignWizard'
import { CampaignsPage } from './CampaignsPage'
import { ContactsPage } from './ContactsPage'
import { IntegrationsPage } from './IntegrationsPage'
import { OverviewPage } from './OverviewPage'
import { ReportsPage } from './ReportsPage'
import { SettingsPage } from './SettingsPage'
import { Sidebar } from './Sidebar'

type DashboardSummary = {
  contacts: number
  campaigns: number
  sentMessages: number
  smsSent: number
  emailSent: number
  deliveryRate: number
  renewalAlerts: number
}

type ContactRow = { id?: string; name: string; email?: string | null; phone?: string | null; status?: string; consent?: string }
type CampaignRow = { id?: string; name: string; channel?: string; status: string; scheduledFor?: string | null; audience?: number }

export function DashboardShell() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

  const loadData = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const [sRes, cRes, ctRes] = await Promise.all([
        fetch(`${apiBaseUrl}/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBaseUrl}/campaigns`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiBaseUrl}/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (sRes.ok) {
        const d = await sRes.json()
        setSummary(d.summary ?? d)
      } else {
        throw new Error('summary failed')
      }
      if (cRes.ok) {
        const d = await cRes.json()
        setCampaigns(Array.isArray(d.campaigns) ? d.campaigns : [])
      }
      if (ctRes.ok) {
        const d = await ctRes.json()
        setContacts(Array.isArray(d.contacts) ? d.contacts : [])
      }
    } catch {
      setError('Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [token])

  if (!user) return <Navigate to="/signin" replace />

  const handleLogout = () => { logout(); navigate('/signin') }

  const handleCreateContact = async (p: { name: string; email: string; phone: string }) => {
    if (!token) return
    const res = await fetch(`${apiBaseUrl}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: p.name, email: p.email || undefined, phone: p.phone || undefined }),
    })
    if (res.ok) {
      const d = await res.json()
      setContacts((prev) => [d.contact, ...prev])
    }
  }

  const handleImportCsv = async (rows: Array<{ name: string; email?: string; phone?: string }>) => {
    if (!token || !rows.length) return
    const res = await fetch(`${apiBaseUrl}/contacts/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ rows }),
    })
    if (res.ok) {
      const d = await res.json()
      setContacts((prev) => [...(d.contacts ?? []), ...prev])
    }
  }

  const handleCreateCampaign = async (p: { name: string; channel: 'sms' | 'email'; template: string; scheduledFor?: string; recipientIds?: string[] }) => {
    if (!token) return { ok: false, message: 'Not authenticated' }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      const res = await fetch(`${apiBaseUrl}/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: p.name, channel: p.channel, template: p.template, scheduledFor: p.scheduledFor, recipientIds: p.recipientIds }),
        signal: controller.signal,
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok) {
        setCampaigns((prev) => [{ id: d.campaign?.id, name: d.campaign?.name, channel: d.campaign?.channel, status: d.campaign?.status ?? 'queued', scheduledFor: d.campaign?.scheduledFor ?? null, audience: d.recipients ?? 0 }, ...prev])
        return { ok: true }
      }
      return { ok: false, message: d.message ?? `Campaign creation failed (HTTP ${res.status})` }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return { ok: false, message: 'Request timed out. Check your API URL and network.' }
      }
      return { ok: false, message: `Network error: ${err instanceof Error ? err.message : 'unknown'}` }
    } finally {
      clearTimeout(timeout)
    }
  }

  const initials = user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E8EAF0] shadow-xl lg:hidden">
          <Sidebar onLogout={handleLogout} onClose={() => setMobileOpen(false)} mobile />
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 bg-white border-r border-[#E8EAF0] min-h-screen sticky top-0 h-screen overflow-y-auto">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-[#E8EAF0] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#617184] hover:text-[#172536] hover:bg-[#FAF9F6] transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-lg text-[#617184] hover:text-[#172536] hover:bg-[#FAF9F6] transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F45B16] flex items-center justify-center text-white text-xs font-bold">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#172536] leading-none">{user.fullName}</p>
                <p className="text-xs text-[#617184] mt-0.5">{user.businessName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="overview"
              element={
                <OverviewPage
                  summary={summary}
                  loading={loading}
                  error={error}
                  onRetry={() => void loadData()}
                  campaigns={campaigns}
                  userName={user.fullName}
                />
              }
            />
            <Route path="campaigns" element={<CampaignsPage campaigns={campaigns} />} />
            <Route
              path="campaigns/new"
              element={<CampaignWizard contacts={contacts} onSubmit={handleCreateCampaign} />}
            />
            <Route
              path="contacts"
              element={
                <ContactsPage
                  contacts={contacts}
                  onCreateContact={handleCreateContact}
                  onImportCsv={handleImportCsv}
                />
              }
            />
            <Route path="integrations" element={<IntegrationsPage token={token} apiBaseUrl={apiBaseUrl} />} />
            <Route path="apikeys" element={<ApiKeysPage />} />
            <Route path="reports" element={<ReportsPage summary={summary} />} />
            <Route path="settings" element={<SettingsPage user={user} token={token} apiBaseUrl={apiBaseUrl} />} />
            <Route path="*" element={<Navigate to="/app/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
