// src/pages/supplier.jsx
import React from 'react';
import useSuppliers from '../hooks/useSuppliers';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import SuppliersStats from '../components/suppliers/SuppliersStats';
import SuppliersFilters from '../components/suppliers/SuppliersFilters';
import SuppliersTable from '../components/suppliers/SuppliersTable';
import SupplierModal from '../components/suppliers/SuppliersModal';
import SupplierDetailModal from '../components/suppliers/SupplierDetailModal';

export default function Suppliers() {
  const {
    filtered,
    stats,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    modalOpen,
    editingSupplier,
    detailSupplier,
    setDetailSupplier,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveSupplier,
    toggleSupplier,
    refetch,
  } = useSuppliers();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Proveedores"
          subtitle="Gestiona tus proveedores, contactos y estados"
          badge="En tiempo real"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 shadow-sm cursor-pointer"
            title="Actualizar listado de proveedores"
          >
            <i className="fa-solid fa-arrows-rotate" />
            Actualizar
          </button>
          <SuppliersStats stats={stats} />
        </div>
      </div>

      <SuppliersFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Cargando proveedores...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600" />
          <h3 className="font-bold text-red-800">Error al cargar proveedores</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <SuppliersTable
          suppliers={filtered}
          onToggle={toggleSupplier}
          onEdit={openEdit}
          onDetail={setDetailSupplier}
        />
      )}

      {/* FAB - Agregar Proveedor */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30 shadow-lg shadow-indigo-300 hover:scale-105 transition cursor-pointer"
        aria-label="Agregar proveedor"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Form Modal */}
      {modalOpen && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={closeModal}
          onSave={saveSupplier}
        />
      )}

      {/* Detail Modal */}
      {detailSupplier && (
        <SupplierDetailModal
          supplier={detailSupplier}
          onClose={() => setDetailSupplier(null)}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}