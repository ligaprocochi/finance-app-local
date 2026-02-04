import { Plus, Grid, List } from 'lucide-react';

function Categories() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categorias</h1>
          <p className="text-text-secondary">
            Organize suas transações por categorias personalizadas
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button className="btn-icon bg-accent-limeMuted text-accent-lime">
          <Grid size={20} />
        </button>
        <button className="btn-icon">
          <List size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="card text-center py-16">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold mb-2">Em Desenvolvimento</h3>
        <p className="text-text-secondary max-w-md mx-auto">
          Criação, edição e gestão de categorias personalizadas está sendo desenvolvida.
        </p>
      </div>
    </div>
  );
}

export default Categories;
