// src/components/products/ProductDetailModal.jsx
import React, { useState } from "react";

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const genderColors = {
  'Hombre': 'bg-blue-50 text-blue-600 border border-blue-100',
  'Mujer':  'bg-pink-50 text-pink-600 border border-pink-100',
  'Unisex': 'bg-violet-50 text-violet-600 border border-violet-100',
  'Niño':   'bg-sky-50 text-sky-600 border border-sky-100',
  'Niña':   'bg-rose-50 text-rose-600 border border-rose-100',
};

export default function ProductDetailModal({ product, onClose }) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);

  if (!product) return null;

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIdx] || null;
  const images = activeVariant?.images || [];
  const sizes = activeVariant?.sizes || [];

  // Mapear género para visualización de badges
  const displayGender = product.gender || "Unisex";

  // Calcular precio con descuento
  const discountPercent = parseFloat(product.discount) || 0;
  const originalPrice = Number(product.price || 0);
  const finalPrice = discountPercent > 0 
    ? originalPrice - (originalPrice * (discountPercent / 100))
    : originalPrice;

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              {product.brand?.toUpperCase()}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 mt-2">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Variant & Images */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Imágenes y Variantes
              </h4>

              {/* Selector de variantes */}
              {variants.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer flex items-center gap-2 ${
                        selectedVariantIdx === idx
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0"
                        style={{
                          backgroundColor:
                            v.color === "azul"
                              ? "#3b82f6"
                              : v.color === "rojo"
                              ? "#ef4444"
                              : v.color === "negro"
                              ? "#111827"
                              : v.color === "blanco"
                              ? "#f9fafb"
                              : v.color === "gris"
                              ? "#9ca3af"
                              : v.color === "verde"
                              ? "#22c55e"
                              : v.color === "amarillo"
                              ? "#eab308"
                              : v.color === "rosa" || v.color === "rosado"
                              ? "#ec4899"
                              : v.color === "morado"
                              ? "#a855f7"
                              : "#e2e8f0",
                        }}
                      />
                      {v.color}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No hay variantes cargadas.</p>
              )}

              {/* Imagen principal de la variante seleccionada */}
              <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-slate-300 space-y-2">
                    <i className="fa-regular fa-image text-5xl" />
                    <p className="text-xs">Sin imágenes para esta variante</p>
                  </div>
                )}
              </div>

              {/* Miniaturas de imágenes secundarias si las hay */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square border border-slate-100 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center"
                    >
                      <img
                        src={img.url}
                        alt="miniature"
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information Details */}
            <div className="space-y-6">
              {/* Precios y Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      genderColors[displayGender] ||
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {displayGender}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {product.category === "ropa" ? "Prendas" : product.category === "zapatos" ? "Calzado" : capitalize(product.category)}
                  </span>
                  {product.active !== false ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                      <i className="fa-solid fa-circle text-[6px]" /> Activo
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center gap-1">
                      <i className="fa-solid fa-circle text-[6px]" /> Inactivo
                    </span>
                  )}
                  {product.featured && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center gap-1">
                      <i className="fa-solid fa-star text-[10px]" /> Destacado
                    </span>
                  )}
                </div>

                {/* Precios */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-800">
                    ${finalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  {discountPercent > 0 && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        ${originalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                        -{discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Detalles Básicos */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Tipo de Producto</p>
                  <p className="font-bold text-slate-700 mt-0.5">{capitalize(product.product_type)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Deporte</p>
                  <p className="font-bold text-slate-700 mt-0.5">{capitalize(product.sport || "Training")}</p>
                </div>
              </div>

              {/* Tallas y Stock para la variante seleccionada */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Stock por Talla ({activeVariant?.color || "Variante"})
                </h4>
                {sizes.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {sizes.map((s, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center ${
                          s.stock > 0
                            ? "bg-white border-slate-200 text-slate-700"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}
                      >
                        <p className="text-xs font-semibold">{s.size}</p>
                        <p className="text-sm font-bold mt-1">
                          {s.stock > 0 ? `${s.stock} uds` : "Sin stock"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No hay tallas definidas para esta variante.</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Descripción
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {product.description || "Sin descripción disponible."}
                </p>
              </div>
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
