import { ArrowRight, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden min-h-[520px] flex items-center">
      {/* Background: warm sunset gradient with city silhouette feel */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, #FAF9F6 0%, #FFF3E8 35%, #FFD9B8 60%, #F4956A 80%, #F45B16 100%)',
        }}
      />
      {/* Mountain / city silhouette layer */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMax slice"
          className="absolute bottom-0 w-full"
          aria-hidden="true"
        >
          {/* Far mountains */}
          <path d="M0 380 L120 260 L240 320 L360 200 L480 280 L600 180 L720 260 L840 160 L960 240 L1080 140 L1200 220 L1320 180 L1440 260 L1440 520 L0 520Z" fill="rgba(244,91,22,0.18)" />
          {/* Mid mountains */}
          <path d="M0 420 L80 340 L180 380 L300 300 L420 360 L540 280 L660 340 L780 260 L900 320 L1020 240 L1140 300 L1260 260 L1380 310 L1440 290 L1440 520 L0 520Z" fill="rgba(244,91,22,0.28)" />
          {/* City skyline */}
          <path d="M800 520 L800 380 L820 380 L820 360 L840 360 L840 340 L860 340 L860 360 L880 360 L880 320 L900 320 L900 300 L910 300 L910 280 L920 280 L920 300 L930 300 L930 320 L950 320 L950 360 L960 360 L960 340 L980 340 L980 360 L1000 360 L1000 380 L1020 380 L1020 350 L1040 350 L1040 330 L1060 330 L1060 310 L1080 310 L1080 330 L1100 330 L1100 350 L1120 350 L1120 370 L1140 370 L1140 340 L1160 340 L1160 360 L1180 360 L1180 380 L1200 380 L1200 360 L1220 360 L1220 340 L1240 340 L1240 360 L1260 360 L1260 380 L1280 380 L1280 400 L1300 400 L1300 380 L1320 380 L1320 360 L1340 360 L1340 380 L1360 380 L1360 400 L1380 400 L1380 420 L1440 420 L1440 520Z" fill="rgba(23,37,54,0.55)" />
          {/* Foreground hills */}
          <path d="M0 480 Q200 440 400 460 Q600 480 800 460 Q1000 440 1200 460 Q1350 470 1440 455 L1440 520 L0 520Z" fill="rgba(23,37,54,0.35)" />
        </svg>
        {/* Sun glow */}
        <div className="absolute right-[15%] top-[20%] w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,200,100,0.55) 0%, rgba(244,91,22,0.25) 50%, transparent 75%)' }} />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F45B16] mb-4">
            CONNECT &nbsp;•&nbsp; SEND &nbsp;•&nbsp; GROW
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#172536] leading-tight mb-5">
            Powerful SMS &amp; Email<br />
            Services for Your Business
          </h1>

          <p className="text-base text-[#617184] leading-relaxed mb-8 max-w-md">
            Connect your website or application with our platform and send bulk SMS and emails in minutes. Fast, secure, and reliable — built for businesses of all sizes.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/register')} className="px-6 py-3 text-sm">
              Get Started <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" onClick={() => { const el = document.getElementById('docs'); el?.scrollIntoView({ behavior: 'smooth' }) }} className="px-6 py-3 text-sm">
              <FileText size={16} /> View Documentation
            </Button>
          </div>
        </div>

        {/* Decorative handwritten-style text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block text-right">
          <p className="text-[#172536] font-semibold text-lg leading-relaxed opacity-80" style={{ fontStyle: 'italic' }}>
            Your message.<br />
            Our platform.<br />
            Greater reach.
          </p>
          <svg viewBox="0 0 120 20" className="mt-2 ml-auto w-28" fill="none" aria-hidden="true">
            <path d="M5 14 Q30 4 60 10 Q90 16 115 8" stroke="#F45B16" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M110 5 L115 8 L109 11" stroke="#F45B16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </div>
    </section>
  )
}
