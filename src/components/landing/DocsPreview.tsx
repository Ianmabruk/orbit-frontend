import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const sidebarLinks = ['API Overview', 'Authentication', 'Endpoints', 'Examples', 'Webhooks']

const docSteps = [
  {
    step: 'Step 1: Get Your API Key',
    body: 'Log in to your Mabrixel dashboard, navigate to API Keys, and generate a new key. Store it securely — it will only be shown once.',
  },
  {
    step: 'Step 2: Make Your First Request',
    body: 'Use your API key in the Authorization header as a Bearer token. All requests must be made over HTTPS.',
  },
]

const codeSnippets: Record<string, string> = {
  PHP: `$response = $client->post('/v1/messages/send', [\n  'headers' => ['Authorization' => 'Bearer <YOUR_API_KEY>'],\n  'json'    => ['to' => '+1234567890', 'message' => 'Hello!'],\n]);`,
  JavaScript: `const res = await fetch('/v1/messages/send', {\n  method: 'POST',\n  headers: { Authorization: 'Bearer <YOUR_API_KEY>' },\n  body: JSON.stringify({ to: '+1234567890', message: 'Hello!' }),\n})`,
  Python: `import requests\nrequests.post('/v1/messages/send',\n  headers={'Authorization': 'Bearer <YOUR_API_KEY>'},\n  json={'to': '+1234567890', 'message': 'Hello!'}\n)`,
  'Node.js': `await axios.post('/v1/messages/send',\n  { to: '+1234567890', message: 'Hello!' },\n  { headers: { Authorization: 'Bearer <YOUR_API_KEY>' } }\n)`,
  cURL: `curl -X POST /v1/messages/send \\\n  -H "Authorization: Bearer <YOUR_API_KEY>" \\\n  -d '{"to":"+1234567890","message":"Hello!"}'`,
}

const langs = Object.keys(codeSnippets)

export function DocsPreview() {
  const [activeLang, setActiveLang] = useState('PHP')
  const [copied, setCopied] = useState(false)
  const [activeLink, setActiveLink] = useState('API Overview')

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="py-20 bg-white" id="docs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F45B16] mb-2">Integration</p>
          <h2 className="text-3xl font-bold text-[#172536]">Simple, Powerful API</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-2xl border border-[#E8EAF0] overflow-hidden shadow-sm">
          {/* Sidebar */}
          <div className="bg-[#FAF9F6] border-r border-[#E8EAF0] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#617184] mb-4">Documentation</p>
            <nav className="space-y-1">
              {sidebarLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => setActiveLink(link)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeLink === link
                      ? 'bg-[#FFF3E8] text-[#F45B16] font-semibold'
                      : 'text-[#617184] hover:text-[#172536] hover:bg-white'
                  }`}
                >
                  {link}
                </button>
              ))}
            </nav>
          </div>

          {/* Guide */}
          <div className="p-6 border-r border-[#E8EAF0]">
            <h3 className="text-base font-bold text-[#172536] mb-5">Integration Guide</h3>
            <div className="space-y-6">
              {docSteps.map(({ step, body }) => (
                <div key={step}>
                  <p className="text-sm font-bold text-[#172536] mb-1">{step}</p>
                  <p className="text-sm text-[#617184] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#docs" className="text-sm font-semibold text-[#F45B16] hover:underline">Full Documentation →</a>
            </div>
          </div>

          {/* Code */}
          <div className="flex flex-col">
            <div className="flex items-center border-b border-[#E8EAF0] overflow-x-auto">
              {langs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeLang === lang
                      ? 'text-[#F45B16] border-b-2 border-[#F45B16]'
                      : 'text-[#617184] hover:text-[#172536]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="relative flex-1 bg-[#172536]">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1 text-xs text-[#617184] hover:text-white transition-colors bg-[#1E3248] rounded px-2 py-1"
                aria-label="Copy code"
              >
                {copied ? <Check size={12} className="text-[#16865B]" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <pre className="p-5 text-xs text-[#94A3B8] leading-relaxed font-mono overflow-x-auto whitespace-pre">
                <code>{codeSnippets[activeLang]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
