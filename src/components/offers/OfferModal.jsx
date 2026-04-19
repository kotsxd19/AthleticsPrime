// src/components/offers/OfferModal.jsx
import { useState, useEffect } from 'react';
import { PRODUCTS, OFFER_TYPES } from '../../data/offers';

const empty = { title:'', desc:'', type:'Porcentaje', code:'', start:'', end:'', disc:'', active:true, products:[] };

export default function OfferModal({ offer, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(offer ? { ...offer } : empty);
    setError('');
  }, [offer]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleProduct = (p) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(p)
        ? f.products.filter(x => x !== p)
        : [...f.products, p],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(form.end) < new Date(form.start)) {
      setError('La fecha de fin debe ser posterior al inicio.');
      return;
    }
    onSave({ ...form, disc: Number(form.disc), code: form.code.toUpperCase() });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              {offer ? 'Editar oferta' : 'Nueva oferta'}
            </h3>
            <p className="text-xs text-slate-500">Completa los datos de la promoción</p>
          </div>
          <button onClick={onClose} className="icon-btn text-slate-500">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-scroll overflow-y-auto p-6 space-y-5">

          {/* Sección: Info general */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-circle-info" /></span>Información general</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Título *</label>
                <input required className="input" placeholder="Ej. Black Friday"
                  value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Descripción</label>
                <textarea rows="2" className="input" placeholder="Detalles de la oferta…"
                  value={form.desc} onChange={e => set('desc', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Tipo de oferta</label>
                <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                  {OFFER_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Código promocional</label>
                <input className="input uppercase" placeholder="Opcional, ej. BLACK30"
                  value={form.code} onChange={e => set('code', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Sección: Vigencia */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-calendar" /></span>Vigencia y descuento</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="input-label">Inicio *</label>
                <input required type="date" className="input"
                  value={form.start} onChange={e => set('start', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Fin *</label>
                <input required type="date" className="input"
                  value={form.end} onChange={e => set('end', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Descuento (%) *</label>
                <input required type="number" min="1" max="100" className="input" placeholder="20"
                  value={form.disc} onChange={e => set('disc', e.target.value)} />
              </div>
            </div>
            {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}
          </div>

          {/* Sección: Productos */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-box" /></span>Productos asociados</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRODUCTS.map(p => (
                <label key={p} className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-xl cursor-pointer hover:bg-slate-50 text-sm">
                  <input type="checkbox" className="accent-indigo-600"
                    checked={form.products.includes(p)}
                    onChange={() => toggleProduct(p)} />
                  <span>{p}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Selecciona uno o varios productos.</p>
          </div>

          {/* Sección: Estado */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-toggle-on" /></span>Estado</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-indigo-600 rounded"
                checked={form.active} onChange={e => set('active', e.target.checked)} />
              <span className="text-sm text-slate-600">Activar oferta al guardar</span>
            </label>
          </div>

          {/* Footer botones */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-sm">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:brightness-110 text-white font-semibold text-sm">
              <i className="fa-solid fa-check mr-1" /> Guardar oferta
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}