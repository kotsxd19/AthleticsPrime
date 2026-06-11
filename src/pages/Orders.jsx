// src/pages/Orders.jsx
import useOrders from '../hooks/useOrders';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import OrdersStats from '../components/orders/OrdersStats';
import OrdersFilters from '../components/orders/OrdersFilters';
import OrdersTable from '../components/orders/OrdersTable'
import OrderModal from '../components/orders/OrdersModal';

export default function Orders() {
  const {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingOrder,
    detailOrder,
    toast, openCreate, openEdit, openDetail,
    closeModal, closeDetail, saveOrder,
    toggleDelivered, deleteOrder,
  } = useOrders();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Pedidos"
          subtitle="Gestiona los pedidos, pagos y estados de entrega"
        />
        <OrdersStats stats={stats} />
      </div>

      <OrdersFilters
        filter={filter} setFilter={setFilter}
        search={search} setSearch={setSearch}
      />

      <OrdersTable
        orders={filtered}
        onToggleDelivered={toggleDelivered}
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={deleteOrder}
      />

      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar pedido"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {modalOpen && (
        <OrderModal
          order={editingOrder}
          onClose={closeModal}
          onSave={saveOrder}
        />
      )}

      {detailOrder && (
        <div
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div 
            className="modal-panel bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-100" 
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-base font-bold tracking-tight text-slate-800">
                  Detalles del Pedido
                </h3>
                <p className="text-xs text-slate-400">ID del Registro: #{detailOrder.id}</p>
              </div>
              <button 
                onClick={closeDetail} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Artículos Comprados
                </div>
                <div className="space-y-3.5">
                  {(detailOrder.products || []).map((p, i) => (
                    <div key={i} className="flex items-center gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                      {/* Product Image */}
                      <div className="w-12 h-12 rounded-lg border border-slate-200/60 bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <i className="fa-solid fa-shirt text-lg" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-800 truncate" title={p.name}>
                          {p.name}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          {p.size && p.size !== '—' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-500 border border-slate-200/50">
                              Talla: {p.size}
                            </span>
                          )}
                          {p.color && p.color !== '—' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-500 border border-slate-200/50">
                              Color: {p.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Prices */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-slate-400">
                          {p.quantity} x ${Number(p.price).toFixed(2)}
                        </div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5">
                          ${Number(p.subtotal).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extras / Summary */}
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Cliente</span>
                  <span className="font-semibold text-slate-700 block truncate" title={detailOrder.client}>
                    {detailOrder.client || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Método de Pago</span>
                  <span className="font-semibold text-slate-700 block">
                    {detailOrder.payment || '—'}
                  </span>
                </div>
                <div className="col-span-2 border-t border-slate-200/60 pt-2.5 mt-0.5 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Dirección de Envío</span>
                    <span className="font-semibold text-slate-700 block truncate" title={detailOrder.address}>
                      {detailOrder.address || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px] mb-0.5">Total del Pedido</span>
                    <span className="font-bold text-indigo-600 block text-sm">
                      ${Number(detailOrder.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={closeDetail}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />

    </main>
  );
}