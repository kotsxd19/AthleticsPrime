// src/pages/Products.jsx
import { useProducts }    from '../hooks/useProducts';
import PageHeader         from '../components/shared/PageHeader';
import Toast              from '../components/shared/Toast';
import ProductsFilters    from '../components/products/ProductsFilters';
import ProductsTable      from '../components/products/ProductsTable';
import ProductModal       from '../components/products/ProductModal';

export default function Products() {
  const {
    filtered,
    filter, setFilter,
    search, setSearch,
    modalOpen, setModalOpen,
    toast, addProduct,
  } = useProducts();

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

      <ProductsTable products={filtered} />

      {/* FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar producto"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {modalOpen && (
        <ProductModal
          onClose={() => setModalOpen(false)}
          onSave={addProduct}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}