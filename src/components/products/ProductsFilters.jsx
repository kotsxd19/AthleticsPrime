// src/components/products/ProductsFilters.jsx
import { CATEGORIES } from '../../data/products';

export default function ProductsFilters({ filter, setFilter, search, setSearch }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        {/* Chips de categoría */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`chip text-sm font-medium px-4 py-2 rounded-xl text-slate-600 whitespace-nowrap ${filter === value ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-full lg:w-72 focus-within:ring-2 focus-within:ring-slate-300 transition">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder="Buscar producto..."
            className="bg-transparent outline-none text-sm ml-2 w-full placeholder:text-slate-400"
          />
        </div>

      </div>
    </section>
  );
}