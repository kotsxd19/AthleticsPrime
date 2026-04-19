// src/components/suppliers/SupplierModal.jsx
import { useState, useEffect } from 'react';

const empty = {
  name: '', contact: '', phone: '', email: '',
  location: '', active: true,
};

export default function SupplierModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(supplier ? { ...supplier } : empty);
  }, [supplier]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold tracking-tight">
              {supplier ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h3>
            <p className="text-xs text-slate-500">Completa los datos del proveedor</p>
          </div>
          <button onClick={onClose} className="icon-btn text-slate-500">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-scroll overflow-y-auto p-6 space-y-5">

          {/* Info general */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-truck" /></span>Información general</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Nombre del proveedor *</label>
                <input required className="input" placeholder="Ej. Elite Sports Supply"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Nombre de contacto *</label>
                <input required className="input" placeholder="Ej. Carlos Méndez"
                  value={form.contact} onChange={e => set('contact', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Teléfono</label>
                <input className="input" placeholder="+503 7123 4567"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Correo electrónico</label>
                <input type="email" className="input" placeholder="correo@empresa.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Ubicación</label>
                <input className="input" placeholder="Ej. San Salvador, El Salvador"
                  value={form.location} onChange={e => set('location', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-toggle-on" /></span>Estado</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-indigo-600 rounded"
                checked={form.active} onChange={e => set('active', e.target.checked)} />
              <span className="text-sm text-slate-600">Proveedor activo</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-sm">
              Cancelar
            </button>
            <button type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:brightness-110 text-white font-semibold text-sm">
              <i className="fa-solid fa-check mr-1" /> Guardar proveedor
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}