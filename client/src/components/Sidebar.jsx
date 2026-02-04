import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  FolderKanban, 
  TrendingUp,
  Lock
} from 'lucide-react';

const navigation = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Transações', icon: Receipt, path: '/transactions' },
      { name: 'Categorias', icon: FolderKanban, path: '/categories' },
    ]
  },
  {
    title: 'Futuros',
    items: [
      { name: 'Investimentos', icon: TrendingUp, path: '/investments', locked: true },
    ]
  }
];

function Sidebar() {
  return (
    <aside className="w-60 bg-background-primary border-r border-ui-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-ui-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-lime rounded-lg flex items-center justify-center">
            <span className="text-background-primary font-bold text-lg">F</span>
          </div>
          <span className="text-xl font-semibold">Finance App</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {navigation.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-accent-limeMuted text-accent-lime'
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    } ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}`
                  }
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {item.locked && <Lock size={14} className="ml-auto" />}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-ui-border">
        <div className="text-xs text-text-muted text-center">
          Finance App v1.0
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
