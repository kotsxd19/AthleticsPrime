// src/components/orders/OrdersFilters.jsx

const chips = [
  { value: 'all',       label: 'Todos',      dot: null               },
  { value: 'delivered', label: 'Entregados', dot: 'text-emerald-500' },
  { value: 'pending',   label: 'Pendientes', dot: 'text-amber-400'   },
];

export default function OrdersFilters({ filter, setFilter, search, setSearch }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {chips.map(({ value, label, dot }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`chip px-4 py-2 rounded-xl text-sm font-medium text-slate-600 ${filter === value ? 'active' : ''}`}
            >
              {dot && <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${dot.replace('text-', 'bg-')}`} />}
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative w-full lg:w-80">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID, cliente o dirección…"
            className="input !pl-9"
          />
        </div>
      </div>
    </section>
  );
}

