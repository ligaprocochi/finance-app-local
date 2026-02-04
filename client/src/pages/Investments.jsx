import { Lock, Sparkles } from 'lucide-react';

function Investments() {
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Investimentos</h1>
        <p className="text-text-secondary">
          Acompanhe seus investimentos em um só lugar
        </p>
      </div>

      {/* Locked Card */}
      <div className="card-locked min-h-[400px] flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-accent-limeMuted rounded-2xl flex items-center justify-center">
            <Lock size={48} className="text-accent-lime" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-chart-secondary rounded-full flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-3">Em Breve! 🚀</h3>
        
        <p className="text-text-secondary text-center max-w-md mb-6">
          O módulo de investimentos está em desenvolvimento. 
          Em breve você poderá acompanhar ações, FIIs, renda fixa e muito mais.
        </p>

        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime"></div>
            <span>Integração com B3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime"></div>
            <span>Acompanhamento de carteira</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-lime"></div>
            <span>Cálculo de rentabilidade</span>
          </div>
        </div>

        <div className="mt-8 px-4 py-2 bg-accent-limeMuted rounded-full">
          <span className="text-xs font-semibold text-accent-lime uppercase tracking-wide">
            Próxima Funcionalidade
          </span>
        </div>
      </div>
    </div>
  );
}

export default Investments;
