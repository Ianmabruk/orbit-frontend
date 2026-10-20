import { Code, Mail, MessageSquare } from 'lucide-react'

const cards = [
  {
    icon: Mail,
    title: 'Bulk Email Campaigns',
    description: 'Send professional emails to your audience with high deliverability and real-time tracking.',
    href: '#features',
  },
  {
    icon: MessageSquare,
    title: 'Bulk SMS Campaigns',
    description: 'Reach your customers instantly with reliable SMS delivery worldwide.',
    href: '#features',
  },
  {
    icon: Code,
    title: 'Easy Integration',
    description: 'Connect with any website or application using our simple REST APIs.',
    href: '#docs',
  },
]

export function FeatureCards() {
  return (
    <section className="relative z-10 -mt-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, title, description, href }) => (
          <a
            key={title}
            href={href}
            className="group bg-white rounded-2xl border border-[#E8EAF0] p-6 shadow-md hover:shadow-lg hover:border-[#F45B16]/30 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FFF3E8] flex items-center justify-center mb-4 group-hover:bg-[#F45B16]/10 transition-colors">
              <Icon size={20} className="text-[#F45B16]" />
            </div>
            <h3 className="text-base font-bold text-[#172536] mb-2">{title}</h3>
            <p className="text-sm text-[#617184] leading-relaxed">{description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
