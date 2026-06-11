// src/components/suppliers/SuppliersTable.jsx
import React from "react";

const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, da] = d.split("-");
  return `${da}/${m}/${y}`;
};

const HEADERS = [
  "Nombre",
  "Nombre contacto",
  "N. Teléfono",
  "Correo",
  "Ubicación",
  "Estado",
  "F. Creado",
  "F. Act.",
  "Acciones",
];

export default function SuppliersTable({ suppliers, onToggle, onEdit, onDetail }) {
  const rows = suppliers || [];

  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr className="text-left">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 font-semibold ${
                    h === "Acciones" ? "text-right pr-6" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="px-5 py-8 text-center text-slate-400 bg-slate-50/50">
                  <div className="flex flex-col items-center gap-2">
                    <i className="fa-solid fa-folder-open text-2xl text-slate-300" />
                    <span>No se encontraron proveedores registrados.</span>
                  </div>
                </td>
              </tr>
            ) : null}

            {rows.map((s) => (
              <tr key={s.id} className="product-row hover:bg-slate-50/50 transition-colors">
                {/* Nombre */}
                <td className="px-5 py-4 font-semibold text-slate-900">{s.name}</td>
                {/* Contacto */}
                <td className="px-5 py-4 text-slate-600 font-medium">{s.contact}</td>
                {/* Teléfono */}
                <td className="px-5 py-4 text-slate-600">{s.phone || "—"}</td>
                {/* Correo */}
                <td className="px-5 py-4 text-slate-500 max-w-[200px]">
                  <div className="truncate" title={s.email}>
                    {s.email || "—"}
                  </div>
                </td>
                {/* Ubicación */}
                <td className="px-5 py-4 text-slate-600 max-w-[160px]">
                  <div className="truncate" title={s.location}>
                    {s.location || "—"}
                  </div>
                </td>
                {/* Estado clickeable */}
                <td className="px-5 py-4">
                  <button
                    onClick={() => onToggle && onToggle(s.id)}
                    title={s.active ? "Haz clic para desactivar" : "Haz clic para activar"}
                    className="cursor-pointer hover:opacity-85 active:scale-95 transition-all focus:outline-none"
                  >
                    <span className={`status-badge ${s.active ? "status-active" : "status-inactive"}`}>
                      <i className="fa-solid fa-circle text-[7px]" />
                      {s.active ? "Activo" : "Inactivo"}
                    </span>
                  </button>
                </td>
                {/* Fechas */}
                <td className="px-5 py-4 text-slate-500">{fmtDate(s.createdAt)}</td>
                <td className="px-5 py-4 text-slate-500">{fmtDate(s.updatedAt)}</td>
                {/* Acciones */}
                <td className="px-5 py-4 text-right pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="Ver detalles"
                      onClick={() => onDetail && onDetail(s)}
                      className="icon-btn text-blue-600 hover:bg-blue-50 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition"
                    >
                      <i className="fa-solid fa-eye text-sm" />
                    </button>
                    <button
                      title="Editar"
                      onClick={() => onEdit && onEdit(s)}
                      className="icon-btn text-indigo-600 hover:bg-indigo-50 cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center transition"
                    >
                      <i className="fa-solid fa-pen text-sm" />
                    </button>
                    <button
                      title={s.active ? "Desactivar" : "Activar"}
                      onClick={() => onToggle && onToggle(s.id)}
                      className={`icon-btn w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        s.active
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <i className={`fa-solid fa-${s.active ? "pause" : "play"} text-sm`} />
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