// src/components/news/NewsDetailModal.jsx
import React from "react";

const categoryMap = {
  collaboration: "Colaboración",
  launch: "Lanzamiento / Release",
  event: "Evento",
  announcement: "Anuncio Oficial",
};

const categoryColors = {
  collaboration: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  launch: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  event: "bg-purple-50 text-purple-600 border border-purple-100",
  announcement: "bg-sky-50 text-sky-600 border border-sky-100",
};

export default function NewsDetailModal({ news, onClose }) {
  if (!news) return null;

  const fmtDate = (d) => {
    if (!d) return "—";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d;
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[news.category] || "bg-slate-100 text-slate-500 border border-slate-200"}`}>
              {categoryMap[news.category] || news.category}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 mt-2">
              {news.title}
            </h3>
            {news.subtitle && <p className="text-xs text-slate-400 mt-0.5">{news.subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Body content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Big Banner Image */}
          {news.bannerImage && (
            <div className="aspect-[2.2/1] rounded-2xl border border-slate-150 bg-slate-50 overflow-hidden relative shadow-sm">
              <img
                src={news.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Grid info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card preview */}
            <div className="md:col-span-1 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tarjeta de Portada
              </h4>
              <div className="aspect-square rounded-2xl border border-slate-200/80 bg-slate-50 overflow-hidden shadow-inner flex items-center justify-center">
                {news.cardImage ? (
                  <img
                    src={news.cardImage}
                    alt="Card Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fa-regular fa-image text-slate-300 text-3xl" />
                )}
              </div>
            </div>

            {/* Metadatos */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Información de Publicación
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Fecha</span>
                  <span className="font-bold text-slate-700 block">{fmtDate(news.releaseDate)}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Destacada</span>
                  <span className="font-bold text-slate-700 block">
                    {news.isFeatured ? (
                      <span className="text-amber-600 flex items-center gap-1 font-extrabold">
                        <i className="fa-solid fa-star text-[10px]" /> Sí
                      </span>
                    ) : "No"}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-200/50 pt-2 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Estado</span>
                    <span className="font-bold text-slate-700 block capitalize">{news.status === "draft" ? "Borrador" : news.status === "published" ? "Publicado" : news.status}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Autor</span>
                    <span className="font-bold text-slate-700 block truncate" title={news.createdBy?.name || "Administrador"}>
                      {news.createdBy?.name || "Administrador"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cuerpo / Descripción */}
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Detalles adicionales</h5>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {news.description || "Sin descripción adicional."}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products list */}
          {news.relatedProducts && news.relatedProducts.length > 0 && (
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Productos Relacionados a esta Novedad
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {news.relatedProducts.map((p) => (
                  <div key={p._id || p.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl hover:bg-slate-100/50 transition">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                      {p.variants?.[0]?.images?.[0]?.url ? (
                        <img src={p.variants[0].images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <i className="fa-solid fa-shirt text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate" title={p.name}>{p.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{p.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600">${p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
