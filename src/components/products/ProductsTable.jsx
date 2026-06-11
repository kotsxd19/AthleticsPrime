// src/components/products/ProductsTable.jsx
import React from "react";

const qtyClasses = (qty) => {
  if (qty === 0) return "bg-rose-50 text-rose-600 border border-rose-100";
  if (qty <= 5) return "bg-amber-50 text-amber-600 border border-amber-100";
  if (qty >= 20) return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  return "bg-slate-50 text-slate-600 border border-slate-150";
};

const genderStyle = (gender) => {
  const g = (gender || "").toLowerCase();
  if (g.includes("hombre") || g.includes("masculino")) {
    return "bg-blue-50 text-blue-600 border border-blue-100";
  }
  if (g.includes("mujer") || g.includes("femenino")) {
    return "bg-pink-50 text-pink-600 border border-pink-100";
  }
  if (g.includes("unisex")) {
    return "bg-purple-50 text-purple-600 border border-purple-100";
  }
  if (
    g.includes("nino") ||
    g.includes("niño") ||
    g.includes("nina") ||
    g.includes("niña") ||
    g.includes("ninas") ||
    g.includes("ninos")
  ) {
    return "bg-sky-50 text-sky-600 border border-sky-100";
  }
  return "bg-slate-50 text-slate-600 border border-slate-100";
};

const HEADERS = ["Nombre", "Marca", "Género", "Categoría", "Tipo", "Tallas", "Precio", "Stock disponible", "Acciones"];

export default function ProductsTable({ products, onDetail, onEdit, onDelete }) {
  const rows = products || [];

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
                    h === "Precio" || h === "Stock disponible"
                      ? "text-right"
                      : h === "Acciones"
                      ? "text-right pr-6"
                      : "text-left"
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
                    <span>No se encontraron productos en el catálogo.</span>
                  </div>
                </td>
              </tr>
            ) : null}

            {rows.map((p) => (
              <tr key={p.id} className="product-row hover:bg-slate-50/50 transition-colors">
                {/* Nombre */}
                <td className="px-5 py-4 font-semibold text-slate-900 max-w-[200px] break-words">{p.name}</td>
                {/* Marca */}
                <td className="px-5 py-4 font-medium text-slate-700">{p.brand?.toUpperCase()}</td>
                {/* Género */}
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${genderStyle(p.gender)}`}>
                    {p.gender}
                  </span>
                </td>
                {/* Categoría */}
                <td className="px-5 py-4 text-slate-600">{p.cat}</td>
                {/* Tipo */}
                <td className="px-5 py-4 text-slate-500">{p.type}</td>
                {/* Tallas preview */}
                <td className="px-5 py-4 font-medium text-slate-600">{p.size}</td>
                {/* Precio */}
                <td className="px-5 py-4 text-right font-bold text-slate-800">
                  ${p.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {/* Stock total */}
                <td className="px-5 py-4 text-right">
                  <span className={`inline-block min-w-[54px] text-center text-xs font-bold px-2.5 py-1 rounded-lg ${qtyClasses(p.qty)}`}>
                    {p.qty} uds
                  </span>
                </td>
                {/* Acciones */}
                <td className="px-5 py-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="Ver detalles"
                      onClick={() => onDetail && onDetail(p)}
                      className="icon-btn text-blue-600 hover:bg-blue-50 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition"
                    >
                      <i className="fa-solid fa-eye text-sm" />
                    </button>
                    <button
                      title="Editar"
                      onClick={() => onEdit && onEdit(p)}
                      className="icon-btn text-indigo-600 hover:bg-indigo-50 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition"
                    >
                      <i className="fa-solid fa-pen text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(p.id)}
                      className="icon-btn text-rose-600 hover:bg-rose-50 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition"
                      title="Eliminar"
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

      {/* Footer tabla */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50">
        <span>
          Mostrando {rows.length} producto{rows.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-200 bg-white">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold">1</button>
          <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-200 bg-white">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}