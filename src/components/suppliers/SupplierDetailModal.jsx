// src/components/suppliers/SupplierDetailModal.jsx
import React from "react";

const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, da] = d.split("-");
  return `${da}/${m}/${y}`;
};

export default function SupplierDetailModal({ supplier, onClose }) {
  if (!supplier) return null;

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              Detalles del Proveedor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Información registrada en el sistema
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Nombre y Badge */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-indigo-100">
              <i className="fa-solid fa-truck-field" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-800 tracking-tight">
              {supplier.name}
            </h4>
            <div className="inline-block">
              {supplier.active ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                  <i className="fa-solid fa-circle text-[5px]" /> Activo
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-1">
                  <i className="fa-solid fa-circle text-[5px]" /> Inactivo
                </span>
              )}
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4 border-t border-b border-slate-100 py-5">
            {/* Contact Name */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <i className="fa-solid fa-user-tie text-sm" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Persona de Contacto</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{supplier.contact || "—"}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <i className="fa-solid fa-phone text-sm" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Número de Teléfono</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{supplier.phone || "—"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <i className="fa-solid fa-envelope text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Correo Electrónico</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5 break-all">{supplier.email || "—"}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <i className="fa-solid fa-location-dot text-sm" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ubicación / Dirección</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{supplier.location || "—"}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Fecha de Registro</p>
              <p className="font-semibold text-slate-600 mt-0.5">{fmtDate(supplier.createdAt)}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Última Actualización</p>
              <p className="font-semibold text-slate-600 mt-0.5">{fmtDate(supplier.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
