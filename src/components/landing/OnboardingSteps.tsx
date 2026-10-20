import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const steps = [
  { n: 1, title: 'Create Your Account', desc: 'Sign up and set up your business profile in minutes.' },
  { n: 2, title: 'Connect Your Website', desc: 'Use our API and documentation to integrate with your existing website or app.' },
  { n: 3, title: 'Manage Your Contacts', desc: 'Upload your contact list or connect your existing database.' },
  { n: 4, title: 'Send Campaigns', desc: 'Create and launch SMS or email campaigns with real-time tracking.' },
]

const codeExamples: Record<string, string> = {
  cURL: `curl -X POST https://api.mabrixel.com/v1/campaigns \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Welcome Campaign",
    "channel": "email",
    "template": "Welcome to our platform!",
    "recipients": ["contact_id_1", "contact_id_2"]
  }'`,
  PHP: `<?php
$client = new \\GuzzleHttp\\Client();
$response = $client->post('https://api.mabrixel.com/v1/campaigns', [
    'headers' => [
        'Authorization' => 'Bearer <YOUR_API_KEY>',
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'name'       => 'Welcome Campaign',
        'channel'    => 'email',
        'template'   => 'Welcome to our platform!',
        'recipients' => ['contact_id_1', 'contact_id_2'],
    ],
]);
$data = json_decode($response->getBody(), true);`,
  JavaScript: `const response = await fetch('https://api.mabrixel.com/v1/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <YOUR_API_KEY>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Welcome Campaign',
    channel: 'email',
    template: 'Welcome to our platform!',
    recipients: ['contact_id_1', 'contact_id_2'],
  }),
})
const data = await response.json()`,
  Python: `import requests

response = requests.post(
    'https://api.mabrixel.com/v1/campaigns',
    headers={
        'Authorization': 'Bearer <YOUR_API_KEY>',
        'Content-Type': 'application/json',
    },
    json={
        'name': 'Welcome Campaign',
        'channel': 'email',
        'template': 'Welcome to our platform!',
        'recipients': ['contact_id_1', 'contact_id_2'],
    }
)
data = response.json()`,
  'Node.js': `const axios = require('axios')

const { data } = await axios.post(
  'https://api.mabrixel.com/v1/campaigns',
  {
    name: 'Welcome Campaign',
    channel: 'email',
    template: 'Welcome to our platform!',
    recipients: ['contact_id_1', 'contact_id_2'],
  },
  {
    headers: { Authorization: 'Bearer <YOUR_API_KEY>' },
  }
)`,
}

const tabs = Object.keys(codeExamples)

export function OnboardingSteps() {
  const [activeTab, setActiveTab] = useState('cURL')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="bg-[#FFF3E8] py-20" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#172536] mb-3">Get Started in 4 Easy Steps</h2>
          <p className="text-[#617184] text-base max-w-xl mx-auto">
            Integrate, configure, and start sending SMS and emails with just a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-5">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#F45B16] text-white flex items-center justify-center text-sm font-bold">
                  {n}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172536] mb-1">{title}</h3>
                  <p className="text-sm text-[#617184] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Code panel */}
          <div className="bg-white rounded-2xl border border-[#E8EAF0] shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-[#E8EAF0] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-[#F45B16] border-b-2 border-[#F45B16] bg-[#FFF3E8]'
                      : 'text-[#617184] hover:text-[#172536]'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={handleCopy}
                className="ml-auto mr-3 flex items-center gap-1.5 text-xs text-[#617184] hover:text-[#F45B16] transition-colors px-2 py-1 rounded"
                aria-label="Copy code"
              >
                {copied ? <Check size={13} className="text-[#16865B]" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {/* Code */}
            <div className="bg-[#172536] p-5 overflow-x-auto">
              <pre className="text-xs text-[#94A3B8] leading-relaxed font-mono whitespace-pre">
                <code>{codeExamples[activeTab]}</code>
              </pre>
            </div>
            {/* Mini icon cards */}
            <div className="flex gap-3 p-4 border-t border-[#E8EAF0]">
              {['Email', 'SMS', 'Analytics'].map((label) => (
                <div key={label} className="flex items-center gap-1.5 rounded-lg bg-[#FFF3E8] border border-[#E8EAF0] px-3 py-1.5 text-xs font-medium text-[#617184]">
                  <div className="w-2 h-2 rounded-full bg-[#F45B16]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
