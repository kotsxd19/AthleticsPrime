// src/components/employees/EmployeesFilters.jsx
import React from 'react';

const chips = [
  { value: 'all',      label: 'Todos',     dot: null               },
  { value: 'active',   label: 'Activos',   dot: 'text-emerald-500' },
  { value: 'inactive', label: 'Inactivos', dot: 'text-slate-400'   },
];

export default function EmployeesFilters({ filter, setFilter, search, setSearch }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {chips.map(({ value, label, dot }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`chip px-4 py-2 rounded-xl text-sm font-medium text-slate-600 cursor-pointer ${filter === value ? 'active' : ''}`}
            >
              {dot && <i className={`fa-solid fa-circle text-[7px] mr-1.5 ${dot}`} />}
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 w-full lg:w-80 border border-slate-200 rounded-xl bg-slate-50 px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-400 transition-all">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar empleado, correo o cargo…"
            className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
          />
        </div>
      </div>
    </section>
  );
}
