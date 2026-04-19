// src/components/orders/OrdersStats.jsx

export default function OrdersStats({ stats }) {
  const items = [
    { label: 'Entregados',    value: stats.delivered,              icon: 'fa-check',        bg: 'bg-emerald-50', color: 'text-emerald-600' },
    { label: 'Pendientes',    value: stats.undelivered,            icon: 'fa-clock',        bg: 'bg-amber-50',   color: 'text-amber-500'   },
    { label: 'Total pedidos', value: stats.total,                  icon: 'fa-box',          bg: 'bg-indigo-50',  color: 'text-indigo-500'  },
    { label: 'Ingresos',      value: `$${stats.revenue.toLocaleString()}`, icon: 'fa-dollar-sign', bg: 'bg-violet-50',  color: 'text-violet-500'  },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.map(({ label, value, icon, bg, color }) => (
        <div key={label} className="card px-4 py-2.5 flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg grid place-items-center text-sm ${bg} ${color}`}>
            <i className={`fa-solid ${icon}`} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</div>
            <div className="font-bold text-slate-800 text-sm">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}