// src/components/orders/OrdersModal.jsx
import { useState, useEffect } from 'react';

const empty = { shopping_cart_id: '', client: '', products: '', payment: 'Tarjeta', total: '', address: '', delivered: false };

export default function OrderModal({ order, onClose, onSave }) {
  const [form, setForm] = useState(empty);
  const [carts, setCarts] = useState([]);
  const [loadingCarts, setLoadingCarts] = useState(false);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoadingCarts(true);
        const res = await fetch("http://localhost:4000/api/shoppingCart");
        if (res.ok) {
          const data = await res.json();
          setCarts(data);
        }
      } catch (e) {
        console.error("Error fetching carts:", e);
      } finally {
        setLoadingCarts(false);
      }
    };
    fetchCarts();
  }, []);

  useEffect(() => {
    if (order) {
      const productNames = Array.isArray(order.products) 
        ? order.products.map(p => p.name || p).join(', ') 
        : "";
      setForm({
        id: order.id,
        shopping_cart_id: order.shopping_cart_id?._id || order.shopping_cart_id || "",
        client: order.client || "",
        products: productNames,
        payment: order.payment || "Tarjeta",
        total: order.total || "",
        address: order.address || "",
        delivered: order.delivered || false,
      });
    } else {
      setForm(empty);
    }
  }, [order]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCartChange = (cartId) => {
    const selectedCart = carts.find(c => c._id === cartId);
    if (selectedCart) {
      const clientName = selectedCart.customer_id?.name || "Cliente";
      const productNames = selectedCart.items?.map(item => {
        const pName = item.name || item.product_id?.name || "Producto";
        const pQty = item.quantity || 1;
        return `${pName} (x${pQty})`;
      }).join(', ') || "";
      const totalAmount = selectedCart.total_after_discount || selectedCart.total_before_discount || 0;

      setForm(f => ({
        ...f,
        shopping_cart_id: cartId,
        client: clientName,
        products: productNames,
        total: totalAmount
      }));
    } else {
      setForm(f => ({
        ...f,
        shopping_cart_id: "",
        client: "",
        products: "",
        total: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      total: Number(form.total),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-lg max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-800">
              {order ? 'Editar Pedido' : 'Nuevo Pedido'}
            </h3>
            <p className="text-xs text-slate-400">Completa los datos del pedido administrativo</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"><i className="fa-solid fa-xmark text-lg" /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-scroll overflow-y-auto p-6 space-y-5">

          <div className="space-y-4">
            {/* Carrito / Cliente */}
            <div>
              <label className="input-label">Carrito de Compra / Cliente *</label>
              {order ? (
                <input
                  disabled
                  type="text"
                  className="input bg-slate-100 cursor-not-allowed text-slate-500"
                  value={form.client}
                />
              ) : (
                <select
                  required
                  className="input"
                  value={form.shopping_cart_id}
                  onChange={e => handleCartChange(e.target.value)}
                >
                  <option value="">{loadingCarts ? 'Cargando carritos...' : 'Selecciona un carrito / cliente'}</option>
                  {carts.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.customer_id?.name || 'Cliente sin nombre'} - Carrito #{c._id.substring(18)} (${c.total_after_discount || c.total_before_discount})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Productos del Carrito (Read-only) */}
            <div>
              <label className="input-label">Productos en el Carrito</label>
              <input
                disabled
                type="text"
                className="input bg-slate-100 cursor-not-allowed text-slate-500"
                value={form.products || "No hay productos seleccionados"}
                placeholder="Productos del carrito seleccionado"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Método de Pago */}
              <div>
                <label className="input-label">Método de pago</label>
                <select className="input" value={form.payment} onChange={e => set('payment', e.target.value)}>
                  <option>Tarjeta</option>
                  <option>Efectivo</option>
                </select>
              </div>

              {/* Monto Final */}
              <div>
                <label className="input-label">Monto final ($) *</label>
                <input 
                  required 
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  className="input" 
                  placeholder="0.00"
                  value={form.total} 
                  onChange={e => set('total', e.target.value)} 
                />
              </div>
            </div>

            {/* Dirección de Envío */}
            <div>
              <label className="input-label">Dirección de envío</label>
              <input 
                className="input" 
                placeholder="San Salvador, El Salvador"
                value={form.address} 
                onChange={e => set('address', e.target.value)} 
              />
            </div>
          </div>

          {/* Estado de Entrega */}
          <div className="py-2 border-t border-slate-100 mt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                checked={form.delivered} 
                onChange={e => set('delivered', e.target.checked)} 
              />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Pedido Entregado</span>
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            >
              <i className="fa-solid fa-check mr-1" /> Guardar Pedido
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}