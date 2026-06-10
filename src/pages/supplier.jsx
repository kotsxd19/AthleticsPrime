// src/pages/Suppliers.jsx
import useSuppliers from '../hooks/useSuppliers';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import SuppliersStats from '../components/suppliers/SuppliersStats';
import SuppliersFilters from '../components/suppliers/SuppliersFilters';
import SuppliersTable from '../components/suppliers/SuppliersTable';
import SupplierModal from '../components/suppliers/SuppliersModal';

export default function Suppliers() {
  const {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingSupplier,
    toast, openCreate, openEdit,
    closeModal, saveSupplier,
    toggleSupplier, deleteSupplier,
  } = useSuppliers();

  

  return (

    
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Proveedores"
          subtitle="Gestiona tus proveedores, contactos y estados"
        />
        <SuppliersStats stats={stats} />
      </div>

      <SuppliersFilters
        filter={filter} setFilter={setFilter}
        search={search} setSearch={setSearch}
      />

      <SuppliersTable
        suppliers={filtered}
        onToggle={toggleSupplier}
        onEdit={openEdit}
        onDelete={deleteSupplier}
      />

      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar proveedor"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {modalOpen && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={closeModal}
          onSave={saveSupplier}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}