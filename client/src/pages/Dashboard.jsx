import { useEffect, useState } from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Wallet,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import SummaryCard from '../components/SummaryCard';
import RecentTransactions from '../components/RecentTransactions';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      const startDate = format(startOfMonth(today), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(today), 'yyyy-MM-dd');

      const response = await api.get('/stats/summary', {
        params: { startDate, endDate }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-secondary">
          Visão geral das suas finanças neste mês
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SummaryCard
          title="Saldo Total"
          value={formatCurrency(stats.balance)}
          icon={Wallet}
          iconBg="bg-accent-limeMuted"
          iconColor="text-accent-lime"
          badge={{
            label: `${stats.transactionCount} transações`,
            variant: 'neutral'
          }}
          loading={loading}
        />

        <SummaryCard
          title="Receitas do Mês"
          value={formatCurrency(stats.income)}
          icon={ArrowDownCircle}
          iconBg="bg-status-positive/15"
          iconColor="text-status-positive"
          trend={{
            value: '+12.5%',
            direction: 'up'
          }}
          loading={loading}
        />

        <SummaryCard
          title="Despesas do Mês"
          value={formatCurrency(stats.expenses)}
          icon={ArrowUpCircle}
          iconBg="bg-status-negative/15"
          iconColor="text-status-negative"
          trend={{
            value: '+5.2%',
            direction: 'up'
          }}
          loading={loading}
        />
      </div>

      {/* Charts Row - Placeholder for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card min-h-[320px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-2">Fluxo de Caixa</h3>
            <p className="text-sm text-text-secondary">
              Gráfico em desenvolvimento
            </p>
          </div>
        </div>

        <div className="card min-h-[320px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🍩</div>
            <h3 className="text-lg font-semibold mb-2">Despesas por Categoria</h3>
            <p className="text-sm text-text-secondary">
              Gráfico em desenvolvimento
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

export default Dashboard;
