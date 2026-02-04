import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as Icons from 'lucide-react';
import api from '../services/api';

function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions', {
        params: { limit: 5 }
      });

      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
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

  const getIcon = (iconName) => {
    const Icon = Icons[iconName] || Icons.Circle;
    return Icon;
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Transações Recentes</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-10 h-10 bg-background-tertiary rounded-lg"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-background-tertiary rounded mb-2"></div>
                <div className="w-24 h-3 bg-background-tertiary rounded"></div>
              </div>
              <div className="w-20 h-4 bg-background-tertiary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma transação ainda</h3>
        <p className="text-sm text-text-secondary mb-4">
          Comece adicionando sua primeira transação
        </p>
        <button className="btn btn-primary">
          Adicionar Transação
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transações Recentes</h3>
        <button className="text-sm text-accent-lime hover:text-accent-limeHover font-medium">
          Ver todas →
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => {
          const Icon = getIcon(transaction.category_icon);
          const isExpense = transaction.type === 'expense';

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-tertiary transition-colors"
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: `${transaction.category_color}20`,
                  color: transaction.category_color 
                }}
              >
                <Icon size={20} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{transaction.description}</p>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{transaction.category_name}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {format(new Date(transaction.date), "d 'de' MMM", { locale: ptBR })}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className={`value-financial ${
                isExpense ? 'text-status-negative' : 'text-status-positive'
              }`}>
                {isExpense ? '- ' : '+ '}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentTransactions;
