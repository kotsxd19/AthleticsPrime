// src/components/clients/ClientModal.jsx
import { useState, useEffect } from 'react';

const empty = { name: '', email: '', password: '', phone: '', address: '', verified: false, active: true };

export default function ClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => { setForm(client ? { ...client } : empty); }, [client]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{client ? 'Editar cliente' : 'Nuevo cliente'}</h3>
            <p className="text-xs text-slate-500">Completa los datos del cliente</p>
          </div>
          <button onClick={onClose} className="icon-btn text-slate-500"><i className="fa-solid fa-xmark" /></button>
        </div>

        <form onSubmit={e => { e.preventDefault(); onSave({ ...form }); }} className="modal-scroll overflow-y-auto p-6 space-y-5">

          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-user" /></span>Información personal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Nombre completo *</label>
                <input required className="input" placeholder="Ej. Luis Martínez"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Correo electrónico *</label>
                <input required type="email" className="input" placeholder="correo@gmail.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Contraseña *</label>
                <input required className="input" placeholder="Ej. Pass#2026"
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Teléfono</label>
                <input className="input" placeholder="+503 7123 4567"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Dirección</label>
                <input className="input" placeholder="San Salvador, El Salvador"
                  value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-toggle-on" /></span>Estado</h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-indigo-600"
                  checked={form.active} onChange={e => set('active', e.target.checked)} />
                <span className="text-sm text-slate-600">Cliente activo</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 accent-emerald-600"
                  checked={form.verified} onChange={e => set('verified', e.target.checked)} />
                <span className="text-sm text-slate-600">Cliente verificado</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-sm">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:brightness-110 text-white font-semibold text-sm">
              <i className="fa-solid fa-check mr-1" /> Guardar cliente
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}