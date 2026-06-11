// src/components/news/NewsFilters.jsx
import React from "react";

const FILTER_CHIPS = [
  { value: "all", label: "Todas" },
  { value: "collaboration", label: "Colaboraciones" },
  { value: "launch", label: "Lanzamientos" },
  { value: "event", label: "Eventos" },
  { value: "announcement", label: "Anuncios" },
  { value: "featured", label: "★ Destacadas" },
  { value: "draft", label: "Borradores" },
  { value: "published", label: "Publicadas" },
];

export default function NewsFilters({ filter, setFilter, search, setSearch }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">

        {/* Chips de filtro */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1 pb-1 lg:pb-0 scrollbar-none">
          {FILTER_CHIPS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`chip text-sm font-medium px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                filter === value 
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100" 
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Buscador por texto */}
        <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-full lg:w-72 focus-within:ring-2 focus-within:ring-slate-300 transition">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Buscar novedad..."
            className="bg-transparent outline-none text-sm ml-2 w-full placeholder:text-slate-400 border-0 p-0 focus:ring-0 text-slate-800"
          />
        </div>

      </div>
    </section>
  );
}
