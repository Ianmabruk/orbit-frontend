import { Plus, Search, Upload } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'

type Contact = { id?: string; name: string; email?: string | null; phone?: string | null; status?: string; consent?: string }

interface ContactsPageProps {
  contacts: Contact[]
  onCreateContact: (p: { name: string; email: string; phone: string }) => Promise<void>
  onImportCsv: (rows: Array<{ name: string; email?: string; phone?: string }>) => Promise<void>
}

const consentColors: Record<string, string> = {
  opted_in: 'bg-green-50 text-[#16865B] border border-green-200',
  opted_out: 'bg-red-50 text-red-700 border border-red-200',
  unknown: 'bg-[#F0F2F5] text-[#617184]',
}

export function ContactsPage({ contacts, onCreateContact, onImportCsv }: ContactsPageProps) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showCsv, setShowCsv] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [csvText, setCsvText] = useState('')
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)

  const filtered = contacts.filter((c) =>
    `${c.name} ${c.email ?? ''} ${c.phone ?? ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    await onCreateContact({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() })
    setForm({ name: '', email: '', phone: '' })
    setShowAdd(false)
    setSaving(false)
  }

  const parseCsv = (text: string) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const nameIdx = headers.findIndex((h) => ['name', 'full name'].includes(h))
    const emailIdx = headers.findIndex((h) => ['email', 'email address'].includes(h))
    const phoneIdx = headers.findIndex((h) => ['phone', 'mobile', 'phone number'].includes(h))
    return lines.slice(1).map((line) => {
      const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
      const row: { name: string; email?: string; phone?: string } = { name: vals[nameIdx >= 0 ? nameIdx : 0] ?? '' }
      if (emailIdx >= 0 && vals[emailIdx]) row.email = vals[emailIdx]
      if (phoneIdx >= 0 && vals[phoneIdx]) row.phone = vals[phoneIdx]
      return row
    }).filter((r) => r.name)
  }

  const handleImport = async () => {
    const rows = parseCsv(csvText)
    if (!rows.length) return
    setImporting(true)
    await onImportCsv(rows)
    setCsvText('')
    setShowCsv(false)
    setImporting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172536]">Contacts</h1>
          <p className="text-sm text-[#617184] mt-0.5">{contacts.length} total contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setShowCsv((v) => !v); setShowAdd(false) }}>
            <Upload size={15} /> Import CSV
          </Button>
          <Button onClick={() => { setShowAdd((v) => !v); setShowCsv(false) }}>
            <Plus size={15} /> Add Contact
          </Button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-sm">
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Full name *" className="rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16]" />
            <input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="Email" type="email" className="rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16]" />
            <div className="flex gap-2">
              <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="flex-1 rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16]" />
              <Button type="submit" disabled={saving} className="shrink-0">{saving ? 'Saving…' : 'Add'}</Button>
            </div>
          </form>
        </div>
      )}

      {showCsv && (
        <div className="bg-white rounded-xl border border-[#E8EAF0] p-5 shadow-sm space-y-3">
          <p className="text-sm font-medium text-[#172536]">Paste CSV (name, email, phone headers required)</p>
          <textarea
            rows={5}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="name,email,phone&#10;Jane Doe,jane@example.com,+1234567890"
            className="w-full rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-3 text-sm text-[#172536] outline-none focus:border-[#F45B16] font-mono resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleImport} disabled={importing}>{importing ? 'Importing…' : 'Import'}</Button>
          </div>
        </div>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#617184] pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E8EAF0] bg-white text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[#617184]">{contacts.length === 0 ? 'No contacts yet. Add your first contact.' : 'No contacts match your search.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#E8EAF0]">
                  {['Name', 'Email', 'Phone', 'Status', 'Consent'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#617184]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EAF0]">
                {filtered.map((c, i) => (
                  <tr key={c.id ?? i} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#172536]">{c.name}</td>
                    <td className="px-5 py-3.5 text-[#617184]">{c.email ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[#617184]">{c.phone ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[#617184] capitalize">{c.status ?? 'active'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${consentColors[c.consent ?? 'unknown'] ?? consentColors.unknown}`}>
                        {(c.consent ?? 'unknown').replace(/_/g, ' ')}
                      </span>
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
