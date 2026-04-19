// src/components/orders/OrderModal.jsx
import { useState, useEffect } from 'react';

const empty = { client: '', products: '', payment: 'Tarjeta', total: '', address: '', delivered: false };

export default function OrderModal({ order, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    setForm(order
      ? { ...order, products: Array.isArray(order.products) ? order.products.join(', ') : order.products }
      : empty
    );
  }, [order]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      total: Number(form.total),
      products: form.products.split(',').map(p => p.trim()).filter(Boolean),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{order ? 'Editar pedido' : 'Nuevo pedido'}</h3>
            <p className="text-xs text-slate-500">Completa los datos del pedido</p>
          </div>
          <button onClick={onClose} className="icon-btn text-slate-500"><i className="fa-solid fa-xmark" /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-scroll overflow-y-auto p-6 space-y-5">

          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-box" /></span>Información del pedido</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Cliente *</label>
                <input required className="input" placeholder="Ej. Carlos Mendoza"
                  value={form.client} onChange={e => set('client', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Productos (separados por coma) *</label>
                <input required className="input" placeholder="Ej. Air Max 90, Camiseta Dry-Fit"
                  value={form.products} onChange={e => set('products', e.target.value)} />
              </div>
              <div>
                <label className="input-label">Método de pago</label>
                <select className="input" value={form.payment} onChange={e => set('payment', e.target.value)}>
                  <option>Tarjeta</option>
                  <option>Efectivo</option>
                </select>
              </div>
              <div>
                <label className="input-label">Monto final ($) *</label>
                <input required type="number" min="1" className="input" placeholder="0"
                  value={form.total} onChange={e => set('total', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="input-label">Dirección de envío</label>
                <input className="input" placeholder="San Salvador, El Salvador"
                  value={form.address} onChange={e => set('address', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4><span className="icon-box"><i className="fa-solid fa-truck" /></span>Estado de entrega</h4>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-emerald-600"
                checked={form.delivered} onChange={e => set('delivered', e.target.checked)} />
              <span className="text-sm text-slate-600">Pedido entregado</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-medium text-sm">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:brightness-110 text-white font-semibold text-sm">
              <i className="fa-solid fa-check mr-1" /> Guardar pedido
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}