import { BarChart2, Home, Key, LayoutGrid, LogOut, Mail, Settings, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { MabrixelLogo } from '../ui/MabrixelLogo'

const navItems = [
  { to: '/app/overview', label: 'Home', icon: Home },
  { to: '/app/campaigns', label: 'Campaigns', icon: Mail },
  { to: '/app/contacts', label: 'Contacts', icon: Users },
  { to: '/app/integrations', label: 'Integrations', icon: LayoutGrid },
  { to: '/app/apikeys', label: 'API Keys', icon: Key },
  { to: '/app/reports', label: 'Reports', icon: BarChart2 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  onLogout: () => void
  onClose?: () => void
  mobile?: boolean
}

export function Sidebar({ onLogout, onClose, mobile }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#E8EAF0]">
        <MabrixelLogo />
        {mobile && (
          <button onClick={onClose} aria-label="Close menu" className="p-1 text-[#617184] hover:text-[#172536]">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/app/overview'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#FFF3E8] text-[#F45B16] border border-[#F45B16]/20'
                  : 'text-[#617184] hover:bg-[#FAF9F6] hover:text-[#172536]'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#E8EAF0]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#617184] hover:bg-[#FAF9F6] hover:text-[#172536] transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </div>
  )
}

export { navItems }
export type { SidebarProps }
