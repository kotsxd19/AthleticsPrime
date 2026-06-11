import React from "react";

const fmtLong = (iso) => {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OfferDetailModal({ offer, onClose }) {
  if (!offer) return null;

  const productCount = (offer.products || []).length;
  const statusLabel = offer.active ? "Activa" : "Inactiva";
  const statusCls = offer.active
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-rose-50 text-rose-600 border border-rose-200";

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{offer.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-slate-600">{offer.desc}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 uppercase font-bold">Descuento</p>
              <p className="text-2xl font-bold text-violet-600">{offer.disc}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 uppercase font-bold">Estado</p>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusCls}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Sección de Productos Eliminada para mantener la limpieza */}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}