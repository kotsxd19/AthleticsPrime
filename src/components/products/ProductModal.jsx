// src/components/products/ProductModal.jsx
// Modos: "view" | "edit" | "create"
import { useState, useEffect } from 'react';
import { CATEGORIES, GENDERS, SIZES, TYPES } from '../../data/products';
import ImageUploader  from './ImageUploader';
import SizeGuideModal from './SizeGuideModal';

// ─── Estilos de badges (modo view) ───────────────────────────────────────────
const genderStyle = {
  'Hombres': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Hombre':  'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Mujeres': 'bg-pink-50 text-pink-700 border border-pink-200',
  'Mujer':   'bg-pink-50 text-pink-700 border border-pink-200',
  'Unisex':  'bg-violet-50 text-violet-700 border border-violet-200',
  'Ninos':   'bg-sky-50 text-sky-700 border border-sky-200',
  'Niño':    'bg-sky-50 text-sky-700 border border-sky-200',
  'Ninas':   'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
  'Niña':    'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
};

const brandStyle = {
  'nike':   'bg-slate-900 text-white',
  'adidas': 'bg-blue-600 text-white',
  'puma':   'bg-red-600 text-white',
};

const qtyBadge = (qty) => {
  if (qty === 0)  return 'bg-rose-50 text-rose-700 border border-rose-200';
  if (qty <= 5)   return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (qty >= 20)  return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  return 'bg-slate-100 text-slate-600 border border-slate-200';
};

// ─── Helpers de normalización ─────────────────────────────────────────────────
const catOptions = CATEGORIES.filter(c => c.value !== 'all');

const normCategory = (raw) => {
  if (!raw) return 'calzado';
  const r = raw.toLowerCase();
  if (r === 'zapatos' || r === 'calzado') return 'calzado';
  if (r === 'ropa'    || r === 'prendas') return 'ropa';
  return r;
};

const normGender = (raw) => {
  if (!raw) return 'Hombre';
  const map = {
    hombres: 'Hombre', hombre: 'Hombre',
    mujeres: 'Mujer',  mujer:  'Mujer',
    ninos:   'Niño',   niño:   'Niño',
    ninas:   'Niña',   niña:   'Niña',
    unisex:  'Unisex',
  };
  return map[raw.toLowerCase()] ?? raw;
};

const extractSizes = (product) => {
  if (product.sizes && Array.isArray(product.sizes)) return product.sizes;
  if (product.size && typeof product.size === 'string')
    return product.size.split(',').map(s => s.trim()).filter(Boolean);
  if (product.variants?.length) {
    const s = product.variants.flatMap(v => v.sizes?.map(s => s.size) ?? []);
    return [...new Set(s)];
  }
  return ['M'];
};

const extractTypes = (product) => {
  if (product.types && Array.isArray(product.types)) return product.types;
  if (product.type && typeof product.type === 'string')
    return product.type.split(',').map(t => t.trim()).filter(Boolean);
  return ['Casual'];
};

// ─── Sub-componente: fila de info en modo view ────────────────────────────────
function InfoRow({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
        <i className={`${icon} text-xs`} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
        <div className="text-sm text-slate-800 font-medium">{children}</div>
      </div>
    </div>
  );
}

// ─── Constantes del form ──────────────────────────────────────────────────────
const EMPTY = {
  name: '', brand: '', category: 'calzado', gender: 'Hombre',
  desc: '', price: '', qty: 1, sizes: ['M', 'L'], types: ['Casual'],
};

// ─── Componente principal ─────────────────────────────────────────────────────
// Props:
//   mode     → "view" | "edit" | "create"
//   product  → objeto producto (requerido en "view" y "edit")
//   onClose  → cierra el modal
//   onSave   → callback al guardar (solo en "edit" / "create")
//   onEdit   → callback para pasar a modo edición desde la vista (solo en "view")
export default function ProductModal({ mode = 'create', product, onClose, onSave, onEdit }) {
  const [form, setForm]           = useState(EMPTY);
  const [sizeGuide, setSizeGuide] = useState(false);

  const isView   = mode === 'view';
  const isEdit   = mode === 'edit';
  const isCreate = mode === 'create';

  // Pre-carga datos en modo edición
  useEffect(() => {
    if ((isEdit || isView) && product) {
      setForm({
        name:     product.name     ?? '',
        brand:    product.brand    ?? '',
        category: normCategory(product.category),
        gender:   normGender(product.gender),
        desc:     product.desc ?? product.description ?? '',
        price:    product.price ?? '',
        qty:      product.qty  ?? 1,
        sizes:    extractSizes(product),
        types:    extractTypes(product),
      });
    } else {
      setForm(EMPTY);
    }
  }, [product, mode]);

  const set        = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleChip = (key, val) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val)
        ? f[key].filter(x => x !== val)
        : [...f[key], val],
    }));
  const stepQty = (d) => set('qty', Math.max(0, form.qty + d));

  const handleSubmit = () => {
    const cat = catOptions.find(c => c.value === form.category);
    onSave({
      ...form,
      id:    product?.id ?? product?._id,
      cat:   cat?.label ?? form.category,
      price: parseFloat(form.price) || 0,
      size:  form.sizes.join(', ') || '—',
      type:  form.types.join(', ') || '—',
    });
  };

  // Datos para modo view
  const totalStock = product?.variants?.reduce(
    (acc, v) => acc + (v.sizes?.reduce((a, s) => a + (s.stock ?? 0), 0) ?? 0), 0
  ) ?? product?.qty ?? 0;

  const allImages = product?.variants?.flatMap(v => v.images ?? []) ?? [];
  const allSizes  = product?.variants?.flatMap(v =>
    v.sizes?.map(s => ({ size: s.size, color: v.color, stock: s.stock })) ?? []
  ) ?? [];

  // Título e ícono del header según modo
  const headerIcon  = isView ? 'fa-eye text-slate-500'
                    : isEdit ? 'fa-pen text-indigo-500'
                    :          'fa-plus text-violet-500';
  const headerBg    = isView ? 'bg-slate-100'
                    : isEdit ? 'bg-indigo-50'
                    :          'bg-violet-50';
  const headerTitle = isView ? product?.name
                    : isEdit ? 'Editar producto'
                    :          'Agregar nuevo producto';
  const headerSub   = isView ? 'Detalle del producto'
                    : isEdit ? `Modificando: ${product?.name}`
                    :          'Completa los detalles del producto';

  return (
    <>
      <div
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className={`modal-panel bg-white w-full rounded-3xl shadow-2xl overflow-hidden ${isView ? 'max-w-2xl' : 'max-w-3xl'}`}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${headerBg}`}>
                <i className={`fa-solid ${headerIcon}`} />
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">{headerTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{headerSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Botón "Editar" solo en modo view */}
              {isView && onEdit && (
                <button
                  onClick={() => { onClose(); onEdit(product); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition"
                >
                  <i className="fa-solid fa-pen text-xs" />
                  Editar
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-slate-600" />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              MODO VIEW
          ══════════════════════════════════════════ */}
          {isView && (
            <>
              {/* Imágenes */}
              {allImages.length > 0 && (
                <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`Imagen ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0"
                    />
                  ))}
                </div>
              )}

              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-4">

                {/* Precio + stock */}
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl px-5 py-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Precio</p>
                    <p className="text-3xl font-bold text-slate-900">${Number(product.price).toFixed(2)}</p>
                    {product.discount > 0 && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {product.discount}% descuento
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Stock total</p>
                    <span className={`inline-block text-sm font-bold px-3 py-1.5 rounded-full ${qtyBadge(totalStock)}`}>
                      {totalStock} unidades
                    </span>
                  </div>
                </div>

                {/* Filas de info */}
                <div className="rounded-2xl border border-slate-100 px-4 divide-y divide-slate-100">
                  <InfoRow icon="fa-solid fa-tag" label="Marca">
                    <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full ${brandStyle[product.brand?.toLowerCase()] ?? 'bg-slate-200 text-slate-700'}`}>
                      {product.brand}
                    </span>
                  </InfoRow>
                  <InfoRow icon="fa-solid fa-venus-mars" label="Género">
                    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${genderStyle[product.gender] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {product.gender}
                    </span>
                  </InfoRow>
                  <InfoRow icon="fa-solid fa-layer-group" label="Categoría">
                    <span className="text-slate-700">{product.cat ?? product.category}</span>
                  </InfoRow>
                  <InfoRow icon="fa-solid fa-shapes" label="Tipo">
                    <span className="text-slate-700">{product.type ?? product.product_type}</span>
                  </InfoRow>
                  {product.sport && (
                    <InfoRow icon="fa-solid fa-dumbbell" label="Deporte">
                      <span className="text-slate-700 capitalize">{product.sport}</span>
                    </InfoRow>
                  )}
                  <InfoRow icon="fa-solid fa-align-left" label="Descripción">
                    <span className="text-slate-600 font-normal leading-relaxed">
                      {product.desc || product.description || (
                        <span className="text-slate-300 italic">Sin descripción</span>
                      )}
                    </span>
                  </InfoRow>
                </div>

                {/* Tallas con stock */}
                {allSizes.length > 0 && (
                  <div className="rounded-2xl border border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-3">
                      <i className="fa-solid fa-ruler-combined mr-1" /> Tallas y stock por variante
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((s, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                          <span className="font-mono text-xs font-bold text-slate-700">{s.size}</span>
                          {s.color && s.color !== 'default' && (
                            <span className="text-xs text-slate-400">· {s.color}</span>
                          )}
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${qtyBadge(s.stock)}`}>
                            {s.stock}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estado */}
                <div className="flex gap-3">
                  <div className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 ${product.active !== false ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
                    <i className={`fa-solid ${product.active !== false ? 'fa-circle-check text-emerald-500' : 'fa-circle-xmark text-slate-400'} text-sm`} />
                    <span className={`text-sm font-semibold ${product.active !== false ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {product.active !== false ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 ${product.featured ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 border border-slate-200'}`}>
                    <i className={`fa-solid fa-star ${product.featured ? 'text-amber-500' : 'text-slate-300'} text-sm`} />
                    <span className={`text-sm font-semibold ${product.featured ? 'text-amber-700' : 'text-slate-400'}`}>
                      {product.featured ? 'Destacado' : 'No destacado'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer view */}
              <div className="flex items-center justify-end px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition"
                >
                  Cerrar
                </button>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════
              MODOS EDIT / CREATE
          ══════════════════════════════════════════ */}
          {!isView && (
            <>
              <div className="modal-scroll px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">

                {/* Información general */}
                <div className="form-section">
                  <h4>
                    <span className="icon-box"><i className="fa-solid fa-circle-info" /></span>
                    Información general
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Nombre</label>
                      <input
                        className="input"
                        placeholder="Ej. Air Max 90"
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Marca</label>
                      <input
                        className="input"
                        placeholder="Ej. Nike"
                        value={form.brand}
                        onChange={e => set('brand', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Categoría</label>
                      <select
                        className="input"
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                      >
                        {catOptions.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Género</label>
                      <select
                        className="input"
                        value={form.gender}
                        onChange={e => set('gender', e.target.value)}
                      >
                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="input-label">Descripción</label>
                      <textarea
                        className="input"
                        rows="3"
                        placeholder="Describe las características principales..."
                        value={form.desc}
                        onChange={e => set('desc', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Precio y stock */}
                <div className="form-section">
                  <h4>
                    <span className="icon-box"><i className="fa-solid fa-tag" /></span>
                    Precio y stock
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Precio</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          className="input pl-8"
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={e => set('price', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Cantidad</label>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => stepQty(-1)} className="stepper-btn">
                          <i className="fa-solid fa-minus text-xs" />
                        </button>
                        <input
                          className="input text-center"
                          type="number"
                          min="0"
                          value={form.qty}
                          onChange={e => set('qty', parseInt(e.target.value) || 0)}
                        />
                        <button type="button" onClick={() => stepQty(1)} className="stepper-btn">
                          <i className="fa-solid fa-plus text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Imágenes */}
                <div className="form-section">
                  <h4>
                    <span className="icon-box"><i className="fa-regular fa-image" /></span>
                    Imágenes <span className="text-xs font-normal text-slate-400 ml-1">(hasta 15)</span>
                  </h4>
                  <ImageUploader />
                </div>

                {/* Tallas y tipos */}
                <div className="form-section">
                  <h4>
                    <span className="icon-box"><i className="fa-solid fa-ruler-combined" /></span>
                    Tallas y tipos
                  </h4>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="input-label !mb-0">Tallas disponibles</span>
                      <button
                        type="button"
                        onClick={() => setSizeGuide(true)}
                        className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center justify-center text-xs font-bold"
                        title="Guía de tallas"
                      >
                        <i className="fa-solid fa-question" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(s => (
                        <span
                          key={s}
                          onClick={() => toggleChip('sizes', s)}
                          className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="input-label">Tipo</span>
                    <div className="flex flex-wrap gap-2">
                      {TYPES.map(t => (
                        <span
                          key={t}
                          onClick={() => toggleChip('types', t)}
                          className={`size-chip ${form.types.includes(t) ? 'active' : ''}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer edit/create */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition"
                >
                  <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-plus'} mr-1.5`} />
                  {isEdit ? 'Guardar cambios' : 'Agregar producto'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>

      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}
    </>
  );
}