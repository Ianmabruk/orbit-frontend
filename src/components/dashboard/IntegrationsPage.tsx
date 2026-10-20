import { Check, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'

const platforms = ['PHP', 'WordPress', 'JavaScript', 'Node.js', 'Python', 'Laravel', 'Django']

const snippets: Record<string, string> = {
  PHP: `<?php
// Install: composer require guzzlehttp/guzzle
$client = new \\GuzzleHttp\\Client(['base_uri' => 'https://api.mabrixel.com']);
$response = $client->post('/v1/campaigns', [
    'headers' => ['Authorization' => 'Bearer <YOUR_API_KEY>'],
    'json'    => ['name' => 'My Campaign', 'channel' => 'sms', 'template' => 'Hello!'],
]);
$result = json_decode($response->getBody(), true);`,
  WordPress: `// Add to functions.php or a custom plugin
add_action('mabrixel_send_campaign', function($campaign_data) {
    $response = wp_remote_post('https://api.mabrixel.com/v1/campaigns', [
        'headers' => ['Authorization' => 'Bearer ' . get_option('mabrixel_api_key')],
        'body'    => json_encode($campaign_data),
    ]);
    return json_decode(wp_remote_retrieve_body($response), true);
});`,
  JavaScript: `// Browser-side: use a server proxy — never expose API keys in the browser
// Server-side fetch example:
const response = await fetch('https://api.mabrixel.com/v1/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.MABRIXEL_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Campaign', channel: 'email', template: 'Hello!' }),
})
const data = await response.json()`,
  'Node.js': `const axios = require('axios')
// Store API key in environment variable, never in source code
const { data } = await axios.post('https://api.mabrixel.com/v1/campaigns', {
  name: 'My Campaign',
  channel: 'sms',
  template: 'Hello from Node.js!',
}, {
  headers: { Authorization: \`Bearer \${process.env.MABRIXEL_API_KEY}\` },
})`,
  Python: `import requests, os
response = requests.post(
    'https://api.mabrixel.com/v1/campaigns',
    headers={'Authorization': f"Bearer {os.environ['MABRIXEL_API_KEY']}"},
    json={'name': 'My Campaign', 'channel': 'sms', 'template': 'Hello!'},
)
data = response.json()`,
  Laravel: `// config/services.php: 'mabrixel' => ['key' => env('MABRIXEL_API_KEY')]
use Illuminate\\Support\\Facades\\Http;
$response = Http::withToken(config('services.mabrixel.key'))
    ->post('https://api.mabrixel.com/v1/campaigns', [
        'name'     => 'My Campaign',
        'channel'  => 'email',
        'template' => 'Hello from Laravel!',
    ]);
$data = $response->json();`,
  Django: `import requests, os
# Store key in environment: MABRIXEL_API_KEY=...
response = requests.post(
    'https://api.mabrixel.com/v1/campaigns',
    headers={'Authorization': f"Bearer {os.environ.get('MABRIXEL_API_KEY')}"},
    json={'name': 'My Campaign', 'channel': 'sms', 'template': 'Hello from Django!'},
)
data = response.json()`,
}

interface IntegrationsPageProps {
  token: string | null
  apiBaseUrl: string
}

export function IntegrationsPage({ token, apiBaseUrl }: IntegrationsPageProps) {
  const [activePlatform, setActivePlatform] = useState('PHP')
  const [copied, setCopied] = useState(false)
  const [siteUrl, setSiteUrl] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activePlatform]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !siteUrl.trim()) return
    setConnecting(true)
    setConnectionError(null)
    try {
      const res = await fetch(`${apiBaseUrl}/integrations/wordpress/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ siteUrl: siteUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Connection failed')
      setConnectionStatus(data.connection?.status ?? 'connected')
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Connection failed')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-[#172536]">Integrations</h1>
        <p className="text-sm text-[#617184] mt-0.5">Connect your website or application to Mabrixel.</p>
      </div>

      {/* Website connection */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm p-6">
        <h2 className="text-base font-bold text-[#172536] mb-1">Connect Your Website</h2>
        <p className="text-sm text-[#617184] mb-4">Enter your website URL to establish a connection.</p>
        <form onSubmit={handleConnect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://yourwebsite.com"
            className="flex-1 rounded-lg border border-[#E8EAF0] bg-[#FAF9F6] px-4 py-2.5 text-sm text-[#172536] outline-none focus:border-[#F45B16] transition-colors"
          />
          <Button type="submit" disabled={connecting || !token}>
            {connecting ? 'Connecting…' : 'Connect'}
          </Button>
        </form>
        {connectionStatus && (
          <div className="mt-3 flex items-center gap-2 text-sm text-[#16865B]">
            <Check size={15} /> Connected — status: {connectionStatus}
          </div>
        )}
        {connectionError && <p className="mt-3 text-sm text-red-600">{connectionError}</p>}
        {!token && <p className="mt-2 text-xs text-[#617184]">Sign in to connect your website.</p>}
      </div>

      {/* Code examples */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EAF0]">
          <h2 className="text-base font-bold text-[#172536]">Integration Code Examples</h2>
          <p className="text-sm text-[#617184] mt-0.5">Copy the snippet for your platform and replace the placeholder with your API key.</p>
        </div>

        <div className="flex items-center gap-0 border-b border-[#E8EAF0] overflow-x-auto">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                activePlatform === p
                  ? 'text-[#F45B16] border-b-2 border-[#F45B16] bg-[#FFF3E8]'
                  : 'text-[#617184] hover:text-[#172536]'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleCopy}
            className="ml-auto mr-3 flex items-center gap-1.5 text-xs text-[#617184] hover:text-[#F45B16] transition-colors px-2 py-1 rounded"
          >
            {copied ? <Check size={13} className="text-[#16865B]" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="bg-[#172536] p-5 overflow-x-auto">
          <pre className="text-xs text-[#94A3B8] leading-relaxed font-mono whitespace-pre">
            <code>{snippets[activePlatform]}</code>
          </pre>
        </div>

        <div className="px-5 py-4 border-t border-[#E8EAF0] flex items-center justify-between">
          <p className="text-xs text-[#617184]">Never expose your API key in client-side browser code.</p>
          <a href="#docs" className="flex items-center gap-1.5 text-xs font-semibold text-[#F45B16] hover:underline">
            Full API docs <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
