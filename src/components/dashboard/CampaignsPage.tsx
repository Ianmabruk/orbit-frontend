import { Mail, MessageSquare, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

type CampaignRow = {
  id?: string
  name: string
  channel?: string
  status: string
  scheduledFor?: string | null
  audience?: number
}

const statusColors: Record<string, string> = {
  draft: 'bg-[#F0F2F5] text-[#617184]',
  queued: 'bg-amber-50 text-amber-700 border border-amber-200',
  sending: 'bg-blue-50 text-blue-700 border border-blue-200',
  sent: 'bg-green-50 text-[#16865B] border border-green-200',
  scheduled: 'bg-purple-50 text-purple-700 border border-purple-200',
  failed: 'bg-red-50 text-red-700 border border-red-200',
  not_configured: 'bg-gray-50 text-gray-500 border border-gray-200',
}

export function CampaignsPage({ campaigns }: { campaigns: CampaignRow[] }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchChannel = channelFilter === 'all' || c.channel === channelFilter
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchChannel && matchStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172536]">Campaigns</h1>
          <p className="text-sm text-[#617184] mt-0.5">Manage and track all your campaigns.</p>
        </div>
        <Button onClick={() => navigate('/app/campaigns/new')}>
          <Plus size={16} /> New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#617184] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E8EAF0] bg-white text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-lg border border-[#E8EAF0] bg-white px-3 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16]"
        >
          <option value="all">All channels</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#E8EAF0] bg-white px-3 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16]"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="queued">Queued</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[#617184] mb-3">No campaigns found.</p>
            <Button onClick={() => navigate('/app/campaigns/new')}>Create a campaign</Button>
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
                {filtered.map((c, i) => (
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
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[c.status] ?? statusColors.draft}`}>
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
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
