// src/components/orders/OrdersTable.jsx

const fmtDate = (d) => {
  if (!d) return '—';
  const [y, m, da] = d.split('-');
  return `${da}/${m}/${y}`;
};

export default function OrdersTable({ orders, onToggleDelivered, onDetail, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr className="text-left">
              {['ID','Productos','Pago','Monto final','F. Pedido','Dirección de envío','Entregado','Acciones'].map(h => (
                <th key={h} className={`px-5 py-3 font-semibold${h === 'Acciones' ? ' text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(o => (
              <tr key={o.id} className="product-row">
                <td className="px-5 py-4 font-semibold text-slate-900">{o.id}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onDetail(o)}
                    className="text-indigo-600 hover:underline text-sm font-medium"
                  >
                    Detalles
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-medium ${o.payment === 'Tarjeta' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                    {o.payment}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-slate-800">${o.total.toLocaleString()}</td>
                <td className="px-5 py-4 text-slate-600">{fmtDate(o.orderedAt)}</td>
                <td className="px-5 py-4 text-slate-600 max-w-[160px]">
                  <div className="truncate" title={o.address}>{o.address}</div>
                </td>
                <td className="px-5 py-4 text-center">
                  {o.delivered
                    ? <i className="fa-solid fa-check text-emerald-500" />
                    : <i className="fa-solid fa-xmark text-rose-500" />}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button title={o.delivered ? 'Marcar pendiente' : 'Marcar entregado'} onClick={() => onToggleDelivered(o.id)} className="icon-btn text-slate-600">
                      <i className={`fa-solid fa-${o.delivered ? 'rotate-left' : 'check'}`} />
                    </button>
                    <button title="Editar" onClick={() => onEdit(o)} className="icon-btn text-indigo-600 hover:bg-indigo-50">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button title="Eliminar" onClick={() => onDelete(o.id)} className="icon-btn text-rose-600 hover:bg-rose-50">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          <i className="fa-regular fa-folder-open text-3xl mb-3 text-slate-300 block" />
          <p>No hay pedidos que coincidan.</p>
        </div>
      )}
    </section>
  );
}