import { BarChart2, Mail, MessageSquare, TrendingUp } from 'lucide-react'

type Summary = {
  sentMessages: number
  smsSent: number
  emailSent: number
  deliveryRate: number
  campaigns: number
}

export function ReportsPage({ summary }: { summary: Summary | null }) {
  const stats = summary
    ? [
        { label: 'Total Messages Sent', value: summary.sentMessages.toLocaleString(), icon: TrendingUp, color: 'text-[#F45B16]', bg: 'bg-[#FFF3E8]' },
        { label: 'Email Sent', value: summary.emailSent.toLocaleString(), icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'SMS Sent', value: summary.smsSent.toLocaleString(), icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Delivery Rate', value: `${summary.deliveryRate}%`, icon: BarChart2, color: 'text-[#16865B]', bg: 'bg-green-50' },
      ]
    : []

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-[#172536]">Reports</h1>
        <p className="text-sm text-[#617184] mt-0.5">Campaign delivery statistics and performance metrics.</p>
      </div>

      {!summary ? (
        <div className="bg-white rounded-xl border border-[#E8EAF0] p-10 text-center">
          <p className="text-sm text-[#617184]">No data available yet. Send your first campaign to see reports.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">{label}</span>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon size={17} className={color} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#172536]">{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
            <h2 className="text-base font-bold text-[#172536] mb-4">Delivery Rate</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-[#E8EAF0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F45B16] rounded-full transition-all duration-700"
                  style={{ width: `${summary.deliveryRate}%` }}
                />
              </div>
              <span className="text-sm font-bold text-[#172536] w-12 text-right">{summary.deliveryRate}%</span>
            </div>
            <p className="text-xs text-[#617184] mt-2">Calculated as: delivered messages ÷ total messages sent × 100</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
            <h2 className="text-base font-bold text-[#172536] mb-4">Channel Breakdown</h2>
            <div className="space-y-4">
              {[
                { label: 'Email', value: summary.emailSent, total: summary.sentMessages, color: 'bg-blue-500' },
                { label: 'SMS', value: summary.smsSent, total: summary.sentMessages, color: 'bg-purple-500' },
              ].map(({ label, value, total, color }) => {
                const pct = total > 0 ? Math.round((value / total) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-[#172536]">{label}</span>
                      <span className="text-sm text-[#617184]">{value.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-[#E8EAF0] rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
