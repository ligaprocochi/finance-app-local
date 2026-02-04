import { Calendar, Bell, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Topbar() {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <header className="h-16 bg-background-primary border-b border-ui-border flex items-center justify-between px-6">
      {/* Left side - Greeting */}
      <div>
        <h2 className="text-2xl font-semibold">Olá! 👋</h2>
        <p className="text-sm text-text-secondary capitalize">{formattedDate}</p>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <button className="flex items-center gap-2 px-4 py-2 bg-background-card border border-ui-border rounded-lg hover:bg-background-card/80 transition-colors">
          <Calendar size={18} />
          <span className="text-sm font-medium">Este Mês</span>
        </button>

        {/* Notifications */}
        <button className="btn-icon">
          <Bell size={20} />
        </button>

        {/* Settings */}
        <button className="btn-icon">
          <Settings size={20} />
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 bg-accent-limeMuted rounded-lg flex items-center justify-center">
          <span className="text-accent-lime font-semibold text-sm">U</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
