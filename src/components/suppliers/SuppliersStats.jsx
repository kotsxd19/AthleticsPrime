// src/components/suppliers/SuppliersStats.jsx

const statItems = [
  { key: 'active',   label: 'Activos',   icon: 'fa-check',   bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { key: 'inactive', label: 'Inactivos', icon: 'fa-pause',   bg: 'bg-rose-50',    color: 'text-rose-500'    },
  { key: 'total',    label: 'Total',     icon: 'fa-truck',   bg: 'bg-indigo-50',  color: 'text-indigo-500'  },
];

export default function SuppliersStats({ stats }) {
  return (
    <div className="flex items-center gap-2">
      {statItems.map(({ key, label, icon, bg, color }) => (
        <div key={key} className="card px-4 py-2.5 flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg grid place-items-center text-sm ${bg} ${color}`}>
            <i className={`fa-solid ${icon}`} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</div>
            <div className="font-bold text-slate-800 text-sm">{stats[key]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}