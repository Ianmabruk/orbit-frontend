import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

type User = { email: string; fullName: string; businessName: string }

interface SettingsPageProps {
  user: User
  token: string | null
  apiBaseUrl: string
}

export function SettingsPage({ user, token, apiBaseUrl }: SettingsPageProps) {
  const [siteUrl, setSiteUrl] = useState('')
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    const ctrl = new AbortController()
    fetch(`${apiBaseUrl}/integrations/wordpress`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ctrl.signal,
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.connection?.siteUrl) setSiteUrl(data.connection.siteUrl)
        if (data?.connection?.status) setSyncStatus(data.connection.status)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [apiBaseUrl, token])

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setSyncing(true)
    setSyncError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/integrations/wordpress/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ siteUrl: siteUrl || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Sync failed')
      setSyncStatus(data.status ?? 'synced')
      if (data.connection?.siteUrl) setSiteUrl(data.connection.siteUrl)
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-[#172536]">Settings</h1>
        <p className="text-sm text-[#617184] mt-0.5">Manage your account and workspace configuration.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
        <h2 className="text-base font-bold text-[#172536] mb-4">Profile</h2>
        <div className="space-y-3">
          {[
            { label: 'Full name', value: user.fullName },
            { label: 'Email', value: user.email },
            { label: 'Business name', value: user.businessName },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-4 py-2 border-b border-[#E8EAF0] last:border-0">
              <span className="text-xs font-semibold text-[#617184] w-28 shrink-0">{label}</span>
              <span className="text-sm text-[#172536]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WordPress sync */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
        <h2 className="text-base font-bold text-[#172536] mb-1">WordPress Integration</h2>
        <p className="text-sm text-[#617184] mb-4">Sync contacts from your connected WordPress site.</p>
        <form onSubmit={handleSync} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="flex-1 rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
          />
          <Button type="submit" disabled={syncing || !token}>
            {syncing ? 'Syncing…' : 'Sync WordPress'}
          </Button>
        </form>
        {syncStatus && (
          <p className="mt-2 text-sm text-[#16865B] font-medium">Status: {syncStatus}</p>
        )}
        {syncError && <p className="mt-2 text-sm text-red-600">{syncError}</p>}
        {!token && <p className="mt-2 text-xs text-[#617184]">Sign in to sync your WordPress site.</p>}
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
        <h2 className="text-base font-bold text-[#172536] mb-4">Security</h2>
        <div className="space-y-3 text-sm text-[#617184]">
          <div className="flex items-center justify-between py-2 border-b border-[#E8EAF0]">
            <span>Password</span>
            <button className="text-[#F45B16] font-semibold hover:underline text-xs">Change password</button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Two-factor authentication</span>
            <span className="text-xs bg-[#F0F2F5] text-[#617184] px-2.5 py-1 rounded-full">Not configured</span>
          </div>
        </div>
      </div>
    </div>
  )
}
