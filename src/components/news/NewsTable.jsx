// src/components/news/NewsTable.jsx
import React from "react";

const categoryColors = {
  collaboration: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  launch: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  event: "bg-purple-50 text-purple-600 border border-purple-100",
  announcement: "bg-sky-50 text-sky-600 border border-sky-100",
};

const statusClasses = (status) => {
  if (status === "published") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  if (status === "draft") return "bg-amber-50 text-amber-600 border border-amber-100";
  return "bg-slate-50 text-slate-400 border border-slate-200";
};

const HEADERS = ["Miniatura", "Título", "Categoría", "F. Publicación", "Destacada", "Estado", "Acciones"];

export default function NewsTable({ news, onDetail, onEdit, onDelete, onToggleStatus }) {
  const rows = news || [];

  const fmtDate = (d) => {
    if (!d) return "—";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d;
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className={`font-semibold px-5 py-3.5 ${
                    h === "Acciones" ? "text-right pr-6" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-5 py-8 text-center text-slate-400 bg-slate-50/50">
                  <div className="flex flex-col items-center gap-2">
                    <i className="fa-solid fa-folder-open text-2xl text-slate-300" />
                    <span>No se encontraron novedades registradas.</span>
                  </div>
                </td>
              </tr>
            ) : null}

            {rows.map((n) => (
              <tr key={n.id} className="product-row hover:bg-slate-50/50 transition-colors">
                {/* Miniatura */}
                <td className="px-5 py-3">
                  <div className="w-12 h-12 rounded-lg border border-slate-200/60 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                    {n.cardImage ? (
                      <img src={n.cardImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-regular fa-image text-slate-300 text-lg" />
                    )}
                  </div>
                </td>

                {/* Título */}
                <td className="px-5 py-4 font-semibold text-slate-900 max-w-[220px]">
                  <div className="truncate" title={n.title}>
                    {n.title}
                  </div>
                  {n.subtitle && (
                    <div className="text-xs text-slate-400 truncate max-w-[200px]" title={n.subtitle}>
                      {n.subtitle}
                    </div>
                  )}
                </td>

                {/* Categoría */}
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${categoryColors[n.category] || 'bg-slate-50 text-slate-500'}`}>
                    {n.categoryLabel}
                  </span>
                </td>

                {/* F. Publicación */}
                <td className="px-5 py-4 font-medium text-slate-500">
                  {fmtDate(n.releaseDate)}
                </td>

                {/* Destacada */}
                <td className="px-5 py-4">
                  {n.isFeatured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                      <i className="fa-solid fa-star text-[10px]" /> Sí
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">No</span>
                  )}
                </td>

                {/* Estado */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggleStatus(n.id, n.status)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer select-none hover:opacity-85 transition-opacity ${statusClasses(n.status)}`}
                    title="Haz clic para cambiar estado (Borrador ↔ Publicado)"
                  >
                    <i className="fa-solid fa-circle text-[6px]" />
                    {n.statusLabel}
                  </button>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="Ver Detalles"
                      onClick={() => onDetail(n)}
                      className="icon-btn text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      <i className="fa-solid fa-eye text-sm" />
                    </button>
                    <button
                      title="Editar"
                      onClick={() => onEdit(n)}
                      className="icon-btn text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                    >
                      <i className="fa-solid fa-pen text-sm" />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => onDelete(n.id)}
                      className="icon-btn text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
