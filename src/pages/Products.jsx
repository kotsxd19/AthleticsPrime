// src/pages/Products.jsx
import React from 'react';
import { useProducts } from '../hooks/useProducts';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import ProductsFilters from '../components/products/ProductsFilters';
import ProductsTable from '../components/products/ProductsTable';
import ProductModal from '../components/products/ProductModal';
import ProductDetailModal from '../components/products/ProductDetailModal';

export default function Products() {
  const {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    modalOpen,
    editingProduct,
    detailProduct,
    setDetailProduct,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveProduct,
    deleteProduct,
    refetch,
  } = useProducts();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Productos"
          subtitle="Gestiona tu inventario, categorías y stock disponible"
          badge="En tiempo real"
        />
        <button
          onClick={refetch}
          className="self-start sm:self-auto px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 shadow-sm cursor-pointer"
          title="Recargar catálogo de productos"
        >
          <i className="fa-solid fa-arrows-rotate" />
          Actualizar
        </button>
      </div>

      <ProductsFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Cargando catálogo de productos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600" />
          <h3 className="font-bold text-red-800">Error al cargar productos</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <ProductsTable
          products={filtered}
          onDetail={setDetailProduct}
          onEdit={openEdit}
          onDelete={deleteProduct}
        />
      )}

      {/* FAB - Agregar nuevo producto */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30 shadow-lg shadow-indigo-300 hover:scale-105 transition cursor-pointer"
        aria-label="Agregar producto"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Modal de Formulario (Creación y Edición) */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={closeModal}
          onSave={saveProduct}
        />
      )}

      {/* Modal de Detalles */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}