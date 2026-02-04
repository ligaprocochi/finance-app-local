import { Plus, Filter, Search } from 'lucide-react';

function Transactions() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transações</h1>
          <p className="text-text-secondary">
            Gerencie todas as suas entradas e saídas
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder="Buscar transações..."
              className="input w-full pl-10"
            />
          </div>
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Content */}
      <div className="card text-center py-16">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold mb-2">Em Desenvolvimento</h3>
        <p className="text-text-secondary max-w-md mx-auto">
          A lista completa de transações, filtros avançados e funcionalidades de edição 
          estão sendo desenvolvidos.
        </p>
      </div>
    </div>
  );
}

export default Transactions;
