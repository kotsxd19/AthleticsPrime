import { useState, useEffect } from 'react';
import { CATEGORIES, GENDERS, SIZES, TYPES } from '../../data/products';
import ImageUploader  from './ImageUploader';
import SizeGuideModal from './SizeGuideModal';

const catOptions = CATEGORIES.filter(c => c.value !== 'all');

const empty = {
  name:'', brand:'', category:'calzado', gender:'Hombre',
  desc:'', price:'', qty:1, sizes:['M','L'], types:['Casual'],
};

export default function ProductModal({ product, onClose, onSave }) {
  const [form, setForm]           = useState(empty);
  const [sizeGuide, setSizeGuide] = useState(false);

  // Si viene un producto, carga sus datos en el form
  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        desc:     product.desc  ?? product.description ?? '',
        price:    product.price ?? '',
        qty:      product.qty   ?? 1,
        category: product.category ?? 'calzado',
        gender:   product.gender   ?? 'Hombre',
        sizes:    product.sizes ?? (product.size ? product.size.split(', ') : ['M']),
        types:    product.types ?? (product.type ? product.type.split(', ') : ['Casual']),
      });
    } else {
      setForm(empty);
    }
  }, [product]);

  const set        = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleChip = (key, val) =>
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  const stepQty = (d) => set('qty', Math.max(0, form.qty + d));

  const handleSubmit = () => {
    const cat = catOptions.find(c => c.value === form.category);
    onSave({
      ...form,
      id:    product?.id ?? product?._id,
      cat:   cat?.label || form.category,
      price: parseFloat(form.price) || 0,
      size:  form.sizes.join(', ') || '—',
      type:  form.types.join(', ') || '—',
    });
  };

  const isEditing = !!product;

  return (
    <>
      <div
        className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-panel bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                {isEditing ? 'Editar producto' : 'Agregar nuevo producto'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Completa los detalles del producto</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">
              <i className="fa-solid fa-xmark text-slate-600" />
            </button>
          </div>

          {/* Body */}
          <div className="modal-scroll px-6 py-5 max-h-[70vh] overflow-y-auto space-y-5">

            <div className="form-section">
              <h4><span className="icon-box"><i className="fa-solid fa-circle-info" /></span>Información general</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Nombre</label>
                  <input className="input" placeholder="Ej. Air Max 90"
                    value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Marca</label>
                  <input className="input" placeholder="Ej. Nike"
                    value={form.brand} onChange={e => set('brand', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Categoría</label>
                  <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                    {catOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Género</label>
                  <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)}>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="input-label">Descripción</label>
                  <textarea className="input" rows="3" placeholder="Describe las características principales..."
                    value={form.desc} onChange={e => set('desc', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4><span className="icon-box"><i className="fa-solid fa-tag" /></span>Precio y stock</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Precio</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input className="input pl-8" type="number" placeholder="0.00" min="0" step="0.01"
                      value={form.price} onChange={e => set('price', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="input-label">Cantidad</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => stepQty(-1)} className="stepper-btn">
                      <i className="fa-solid fa-minus text-xs" />
                    </button>
                    <input className="input text-center" type="number" min="0"
                      value={form.qty} onChange={e => set('qty', parseInt(e.target.value) || 0)} />
                    <button type="button" onClick={() => stepQty(1)} className="stepper-btn">
                      <i className="fa-solid fa-plus text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>
                <span className="icon-box"><i className="fa-regular fa-image" /></span>
                Imágenes <span className="text-xs font-normal text-slate-400 ml-1">(hasta 15)</span>
              </h4>
              <ImageUploader />
            </div>

            <div className="form-section">
              <h4><span className="icon-box"><i className="fa-solid fa-ruler-combined" /></span>Tallas y tipos</h4>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="input-label !mb-0">Tallas disponibles</span>
                  <button type="button" onClick={() => setSizeGuide(true)}
                    className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition flex items-center justify-center text-xs font-bold">
                    <i className="fa-solid fa-question" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <span key={s} onClick={() => toggleChip('sizes', s)}
                      className={`size-chip ${form.sizes.includes(s) ? 'active' : ''}`}>{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="input-label">Tipo</span>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map(t => (
                    <span key={t} onClick={() => toggleChip('types', t)}
                      className={`size-chip ${form.types.includes(t) ? 'active' : ''}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition">
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition">
              <i className={`fa-solid ${isEditing ? 'fa-floppy-disk' : 'fa-plus'} mr-1`} />
              {isEditing ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>
        </div>
      </div>
      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}
    </>
  );
}