export const featureCards = [
  {
    title: 'Unified contact management',
    description:
      'Keep customer details, consent, service history, and renewal status in one secure workspace.',
  },
  {
    title: 'Bulk SMS and email campaigns',
    description:
      'Send segmented campaigns with personalization, testing, scheduling, and provider-aware reporting.',
  },
  {
    title: 'Renewal reminders that actually run on time',
    description:
      'Queue reminders from the backend, respect timezone rules, and prevent duplicates after reschedules.',
  },
  {
    title: 'WordPress-ready integrations',
    description:
      'Connect client websites via secure pairing, sync approved records, and monitor sync health from one place.',
  },
]

export const workflowSteps = [
  'Connect your site or import contacts',
  'Set preferred messaging channels and rules',
  'Launch campaigns and automated renewal reminders',
  'Monitor delivery, opt-outs, and upcoming renewals',
]

export const faqs = [
  {
    question: 'Can I connect an existing WordPress site?',
    answer:
      'Yes. The platform is designed around a secure WordPress plugin flow that pairs a site to a specific tenant and syncs approved customer and renewal information.',
  },
  {
    question: 'Do messages send from the browser?',
    answer:
      'No. Sending is handled through backend services and durable queued jobs so the browser session is not required for delivery or reminders.',
  },
  {
    question: 'How is tenant data isolated?',
    answer:
      'Every protected resource is scoped by tenant and validated on the server, with authorization checks on every data operation.',
  },
  {
    question: 'Can I import contacts from CSV?',
    answer:
      'Yes. The platform supports validated CSV imports with duplicate detection, preview, and retryable jobs for larger datasets.',
  },
]
