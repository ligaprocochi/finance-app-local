import { TrendingUp, TrendingDown } from 'lucide-react';

function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBg, 
  iconColor, 
  badge, 
  trend,
  loading 
}) {
  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-background-tertiary rounded-lg"></div>
          <div className="w-16 h-5 bg-background-tertiary rounded-full"></div>
        </div>
        <div className="w-32 h-8 bg-background-tertiary rounded mb-2"></div>
        <div className="w-24 h-4 bg-background-tertiary rounded"></div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon size={22} />
        </div>
        
        {badge && (
          <span className={`badge badge-${badge.variant}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="value-large mb-1">
        {value}
      </div>

      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{title}</span>
        
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            trend.direction === 'up' ? 'text-status-positive' : 'text-status-negative'
          }`}>
            {trend.direction === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;
