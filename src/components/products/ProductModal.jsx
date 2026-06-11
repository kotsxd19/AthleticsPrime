// src/components/products/ProductModal.jsx
import React, { useState } from "react";

const BRAND_OPTIONS = [
  { value: "nike", label: "Nike" },
  { value: "adidas", label: "Adidas" },
  { value: "puma", label: "Puma" }
];

const GENDER_OPTIONS = [
  { value: "hombres", label: "Hombre" },
  { value: "mujeres", label: "Mujer" },
  { value: "ninos", label: "Niño" },
  { value: "ninas", label: "Niña" },
  { value: "unisex", label: "Unisex" }
];

const CATEGORY_OPTIONS = [
  { value: "ropa", label: "Prendas / Ropa" },
  { value: "zapatos", label: "Calzado / Zapatos" }
];

const TYPE_OPTIONS = [
  { value: "camiseta", label: "Camiseta" },
  { value: "pants", label: "Pants" },
  { value: "short", label: "Short" },
  { value: "calcetas", label: "Calcetas" },
  { value: "tenis", label: "Tenis" },
  { value: "sandalias", label: "Sandalias" }
];

const SPORT_OPTIONS = [
  { value: "training", label: "Entrenamiento (Training)" },
  { value: "gym", label: "Gimnasio (Gym)" },
  { value: "running", label: "Correr (Running)" },
  { value: "basketball", label: "Baloncesto (Basketball)" },
  { value: "football_turf", label: "Fútbol Sintético (Turf)" },
  { value: "football_indoor", label: "Fútbol Sala (Indoor)" },
  { value: "volleyball", label: "Vóleibol" },
  { value: "crossfit", label: "Crossfit" },
  { value: "trail_running", label: "Trail Running" }
];

const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["37", "38", "39", "40", "41", "42", "43", "44"];

const normalizeVariant = (variant) => ({
  color: variant?.color || "negro",
  images: Array.isArray(variant?.images) ? variant.images : [],
  sizes: Array.isArray(variant?.sizes) ? variant.sizes : [],
  tempFiles: [],
  previewEntries: Array.isArray(variant?.images)
    ? variant.images.map((img) => ({ url: img?.url || "", file: null, existing: true }))
    : [],
  ...variant,
});

export default function ProductModal({ product, onClose, onSave }) {
  const isEditing = !!product;

  const [form, setForm] = useState({
    id: product?._id || product?.id || "",
    name: product?.name || "",
    brand: product?.brand || "nike",
    category: product?.category || "ropa",
    gender: product?.gender || "unisex",
    product_type: product?.product_type || "camiseta",
    sport: product?.sport || "training",
    description: product?.description || "",
    price: product?.price || "",
    discount: product?.discount || 0,
    featured: product?.featured || false,
    active: product?.active !== false,
  });

  const [variants, setVariants] = useState(
    (product?.variants || [{ color: "negro", images: [], sizes: [] }]).map(normalizeVariant)
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Helper for size list depending on selected category
  const activeSizesList = form.category === "ropa" ? CLOTHING_SIZES : SHOE_SIZES;

  const handleCategoryChange = (val) => {
    set("category", val);
    // Reset variants sizes to match the new category size list type
    const resetVariants = variants.map((v) => ({ ...v, sizes: [] }));
    setVariants(resetVariants);
  };

  // Add color variant
  const addVariant = () => {
    setVariants([
      ...variants,
      normalizeVariant({ color: "nuevo", images: [], sizes: [] }),
    ]);
  };

  // Remove color variant
  const removeVariant = (idx) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((_, i) => i !== idx));
  };

  // Update variant field
  const updateVariantField = (idx, field, value) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], [field]: value };
    setVariants(updated);
  };

  const handleVariantImageUpload = (idx, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const updated = [...variants];
    const current = updated[idx] || {};

    updated[idx] = {
      ...current,
      tempFiles: [...(current.tempFiles || []), ...files],
      previewEntries: [
        ...(current.previewEntries || []),
        ...files.map((file) => ({ url: URL.createObjectURL(file), file, existing: false })),
      ],
    };

    setVariants(updated);
    event.target.value = "";
  };

  // Get size stock value
  const getSizeStock = (variant, sizeName) => {
    const found = variant.sizes?.find((s) => s.size === sizeName);
    return found ? found.stock : "";
  };

  // Update size stock value
  const updateSizeStock = (variantIdx, sizeName, stockStr) => {
    const parsed = parseInt(stockStr, 10);
    const stockVal = isNaN(parsed) ? 0 : parsed;

    const updated = [...variants];
    const variant = updated[variantIdx];
    if (!variant.sizes) variant.sizes = [];

    const sizeIdx = variant.sizes.findIndex((s) => s.size === sizeName);
    if (sizeIdx >= 0) {
      variant.sizes[sizeIdx] = { ...variant.sizes[sizeIdx], stock: stockVal };
    } else {
      variant.sizes.push({ size: sizeName, stock: stockVal });
    }
    setVariants(updated);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!form.name.trim() || !form.brand || !form.category || !form.gender || !form.price) {
      alert("Por favor completa todos los campos requeridos (*).");
      return;
    }

    // Filter out sizes with 0 stock to keep database clean
    const cleanVariants = variants.map((v) => ({
      ...v,
      color: v.color.trim() || "negro",
      sizes: (v.sizes || []).filter((s) => s.stock > 0),
    }));

    onSave({
      ...form,
      variants: cleanVariants,
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
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              {isEditing ? "Editar producto" : "Agregar nuevo producto"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? "Modifica los detalles del producto en el catálogo" : "Completa la información para registrar el producto"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Info general */}
          <div className="form-section space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-circle-info" /> Información general
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Nombre del producto *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ej. Nike Dri-FIT Academy"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input-label">Marca *</label>
                <select
                  className="input"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                >
                  {BRAND_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Categoría *</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Género *</label>
                <select
                  className="input"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Tipo de Prenda/Calzado *</label>
                <select
                  className="input"
                  value={form.product_type}
                  onChange={(e) => set("product_type", e.target.value)}
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Deporte</label>
                <select
                  className="input"
                  value={form.sport}
                  onChange={(e) => set("sport", e.target.value)}
                >
                  {SPORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Descripción</label>
                <textarea
                  className="input min-h-[80px]"
                  placeholder="Escribe características clave como tela, ajuste, etc..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Precio y opciones */}
          <div className="form-section space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-tag" /> Precio y Opciones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Precio base ($) *</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input-label">Descuento (%)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) => set("discount", parseInt(e.target.value, 10) || 0)}
                />
              </div>
              <div className="flex items-center gap-6 sm:col-span-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  Producto destacado (Destacado en Tienda)
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => set("active", e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  Producto activo (Visible en catálogo)
                </label>
              </div>
            </div>
          </div>

          {/* Variantes y stock */}
          <div className="form-section space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-boxes-stacked" /> Variantes de Color y Stock
              </h4>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-plus" /> Agregar variante
              </button>
            </div>

            <div className="space-y-6">
              {variants.map((v, vIdx) => (
                <div key={vIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative space-y-4">
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(vIdx)}
                      className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-100 transition cursor-pointer"
                      title="Eliminar esta variante"
                    >
                      <i className="fa-solid fa-trash text-xs" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Color de variante *</label>
                      <input
                        type="text"
                        className="input bg-white"
                        placeholder="Ej. Negro, Azul, Blanco/Rojo"
                        value={v.color}
                        onChange={(e) => updateVariantField(vIdx, "color", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Imágenes de la variante</label>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-wrap gap-2 w-24 shrink-0">
                          {(v.previewEntries || []).length > 0 ? (
                            (v.previewEntries || []).map((entry, imgIdx) => (
                              <div key={`${vIdx}-${imgIdx}`} className="w-10 h-10 rounded-lg border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                                <img src={entry.url} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            ))
                          ) : (
                            <div className="w-10 h-10 rounded-lg border border-dashed border-slate-200 bg-white flex items-center justify-center text-slate-300">
                              <i className="fa-regular fa-image text-base" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition">
                            <i className="fa-solid fa-cloud-arrow-up text-slate-400" />
                            Agregar imágenes
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => handleVariantImageUpload(vIdx, e)}
                            />
                          </label>
                          <p className="text-[10px] text-slate-400 mt-1">Puedes seleccionar varias imágenes por variante.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock Grid */}
                  <div>
                    <span className="input-label block mb-2">Stock disponible por Talla</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {activeSizesList.map((sizeName) => (
                        <div key={sizeName} className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col items-center">
                          <span className="text-xs font-bold text-slate-500 mb-1">{sizeName}</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-full text-center border-0 p-0 text-sm font-bold focus:ring-0 text-slate-800"
                            value={getSizeStock(v, sizeName)}
                            onChange={(e) => updateSizeStock(vIdx, sizeName, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Submit Button to support Enter key */}
          <button type="submit" className="hidden" />
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer"
          >
            {isEditing ? "Guardar cambios" : "Agregar producto"}
          </button>
        </div>
      </div>
    </div>
  );
}