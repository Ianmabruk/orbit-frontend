const techs = [
  { label: 'WordPress', icon: 'WP' },
  { label: 'React', icon: 'Re' },
  { label: 'Laravel', icon: 'La' },
  { label: 'Node.js', icon: 'No' },
  { label: 'Python', icon: 'Py' },
  { label: 'PHP', icon: 'PH' },
  { label: 'Django', icon: 'Dj' },
]

export function TrustStrip() {
  return (
    <section className="py-14 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm font-semibold text-[#617184] mb-8">
        Trusted by businesses, developers and organizations worldwide
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
        {techs.map(({ label, icon }) => (
          <div key={label} className="flex items-center gap-2 text-[#617184] hover:text-[#172536] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#E8EAF0] flex items-center justify-center text-[10px] font-bold text-[#617184]">
              {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
