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
          className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
          onClick={closeDetail}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Pedido #{detailOrder.id}</h3>
              <button onClick={closeDetail} className="icon-btn text-slate-500"><i className="fa-solid fa-xmark" /></button>
            </div>
            <ul className="space-y-2">
              {detailOrder.products.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <i className="fa-solid fa-box text-indigo-400 text-xs" /> {p}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">{detailOrder.products.length} producto(s)</p>
          </div>
        </div>
      )}

      <Toast message={toast} />

    </main>
  );
}