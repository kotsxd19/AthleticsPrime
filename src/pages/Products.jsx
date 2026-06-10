// src/pages/Products.jsx
import { useState } from 'react';
import useProducts        from '../hooks/userProducts';
import PageHeader         from '../components/shared/PageHeader';
import Toast              from '../components/shared/Toast';
import ProductsFilters    from '../components/products/ProductsFilters';
import ProductsTable      from '../components/products/ProductsTable';
import ProductModal       from '../components/products/ProductModal';   // único modal
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';

// modal = null | { mode: "view"|"edit"|"create", product?: {} }
export default function Products() {
  const {
    filtered, filter, setFilter,
    search,   setSearch,
    saveProduct, deleteProduct,
    toast,
  } = useProducts();

  const [modal,        setModal]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }

  // Abrir modal en el modo indicado
  const openCreate = ()  => setModal({ mode: 'create' });
  const openView   = (p) => setModal({ mode: 'view',   product: p });
  const openEdit   = (p) => setModal({ mode: 'edit',   product: p });
  const closeModal = ()  => setModal(null);

  const handleSave = async (formData) => {
    await saveProduct(formData);
    closeModal();
  };

  const handleDeleteClick   = (id) => {
    const prod = filtered.find(p => p.id === id);
    setDeleteTarget({ id, name: prod?.name });
  };
  const handleDeleteConfirm = () => {
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <PageHeader
        title="Productos"
        subtitle="Gestiona tu inventario, categorías y stock disponible"
        badge="Actualizado hoy"
      />

      <ProductsFilters
        filter={filter} setFilter={setFilter}
        search={search} setSearch={setSearch}
      />

      <ProductsTable
        products={filtered}
        onView={openView}
        onEdit={openEdit}
        onDelete={handleDeleteClick}
      />

      {/* FAB */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar producto"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Modal unificado (view / edit / create) */}
      {modal && (
        <ProductModal
          mode={modal.mode}
          product={modal.product}
          onClose={closeModal}
          onSave={handleSave}
          onEdit={openEdit}         // para el botón "Editar" dentro del modo view
        />
      )}

      {/* Confirmación de borrado */}
      {deleteTarget && (
        <DeleteConfirmModal
          productName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}