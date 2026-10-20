import { Copy, Eye, EyeOff, Key, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'

type ApiKey = {
  id: string
  name: string
  preview: string
  createdAt: string
  lastUsed?: string | null
  fullKey?: string
}

export function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [revealId, setRevealId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKeyName.trim()) return
    setGenerating(true)
    // Simulate key generation — in production this calls the backend
    await new Promise((r) => setTimeout(r, 600))
    const id = Math.random().toString(36).slice(2)
    const fullKey = `mbx_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`
    setKeys((prev) => [{
      id,
      name: newKeyName.trim(),
      preview: `mbx_${fullKey.slice(4, 12)}…`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      fullKey,
    }, ...prev])
    setNewKeyName('')
    setGenerating(false)
  }

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#172536]">API Keys</h1>
        <p className="text-sm text-[#617184] mt-0.5">Generate and manage API keys for your integrations.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
        <strong>Security notice:</strong> API keys grant full access to your account. Never share them publicly or commit them to source control. Store them in environment variables.
      </div>

      {/* Generate form */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
        <h2 className="text-base font-bold text-[#172536] mb-4">Generate New Key</h2>
        <form onSubmit={handleGenerate} className="flex gap-3">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production, WordPress)"
            className="flex-1 rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
          />
          <Button type="submit" disabled={generating || !newKeyName.trim()}>
            <Plus size={15} /> {generating ? 'Generating…' : 'Generate'}
          </Button>
        </form>
      </div>

      {/* Keys list */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EAF0]">
          <h2 className="text-base font-bold text-[#172536]">Your API Keys</h2>
        </div>
        {keys.length === 0 ? (
          <div className="p-10 text-center">
            <Key size={32} className="mx-auto text-[#E8EAF0] mb-3" />
            <p className="text-sm text-[#617184]">No API keys yet. Generate your first key above.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8EAF0]">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-lg bg-[#FFF3E8] flex items-center justify-center shrink-0">
                  <Key size={16} className="text-[#F45B16]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#172536]">{k.name}</p>
                  <p className="text-xs text-[#617184] font-mono mt-0.5">
                    {revealId === k.id && k.fullKey ? k.fullKey : k.preview}
                  </p>
                  <p className="text-xs text-[#617184] mt-0.5">
                    Created {new Date(k.createdAt).toLocaleDateString()}
                    {k.lastUsed ? ` · Last used ${new Date(k.lastUsed).toLocaleDateString()}` : ' · Never used'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {k.fullKey && (
                    <>
                      <button
                        onClick={() => setRevealId(revealId === k.id ? null : k.id)}
                        className="p-2 text-[#617184] hover:text-[#172536] transition-colors"
                        aria-label={revealId === k.id ? 'Hide key' : 'Show key'}
                      >
                        {revealId === k.id ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => handleCopy(k.fullKey!, k.id)}
                        className="p-2 text-[#617184] hover:text-[#F45B16] transition-colors"
                        aria-label="Copy key"
                      >
                        <Copy size={15} className={copied === k.id ? 'text-[#16865B]' : ''} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="p-2 text-[#617184] hover:text-red-600 transition-colors"
                    aria-label="Revoke key"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
