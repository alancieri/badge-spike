import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Badge', icon: ListIcon },
];

function ListIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-gray-200 bg-gray-50/50">
      <div className="sticky top-0 h-screen overflow-y-auto">
        {/* Logo / Title - h-[72px] matches page headers */}
        <div className="px-6 h-[72px] flex items-center border-b border-gray-200">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight leading-tight">
              Badge Spike
            </h1>
            <p className="text-xs text-gray-500">Proof of Concept</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
