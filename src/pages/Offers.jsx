import { useState } from 'react';
import useOffers from '../hooks/useOfferts'; 
import { useProducts } from '../hooks/useProducts';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import OffersStats from '../components/offers/OffersStats';
import OffersFilters from '../components/offers/OffersFilters';
import OffersTable from '../components/offers/OffersTable';
import OfferModal from '../components/offers/OfferModal';
import OfferDetailModal from '../components/offers/OfferDetailModal'; // Ajusté la mayúscula aquí por convención
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal';

export default function Offers() {
  const {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    loading, error,
    modalOpen, editingOffer,
    toast,
    openCreate, openEdit,
    closeModal, saveOffer,
    toggleOffer, deleteOffer,
  } = useOffers();

  // Productos reales para el buscador del modal
  const { filtered: allProducts } = useProducts();
  const availableProducts = allProducts.map(p => ({ id: p.id ?? p._id, name: p.name }));

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);

  // Normaliza editingOffer al formato que espera OfferModal
  const modalInitialData = editingOffer ? {
    id:          editingOffer.id          ?? editingOffer._id,
    title:       editingOffer.title       ?? editingOffer.name        ?? "",
    description: editingOffer.desc        ?? editingOffer.description ?? "",
    offerType:   editingOffer.offerType   ?? "percentage",
    promoCode:   editingOffer.promoCode   ?? editingOffer.promo_code  ?? "",
    startDate:   editingOffer.start       ?? editingOffer.start_date  ?? "",
    endDate:     editingOffer.end         ?? editingOffer.end_date    ?? "",
    discount:    editingOffer.disc        ?? editingOffer.discount_percentage ?? "",
    // productos: si vienen como strings (IDs), los buscamos en availableProducts
    products: (editingOffer.products ?? []).map(p => {
      if (typeof p === 'object' && p !== null) return { id: p._id ?? p.id, name: p.name ?? p._id };
      const found = availableProducts.find(ap => ap.id === p);
      return found ?? { id: p, name: p };
    }),
    bannerUrl:   editingOffer.bannerUrl   ?? editingOffer.banner?.url ?? "",
    active:      editingOffer.active      ?? true,
  } : null;

  // Traduce formData del modal → formato del hook
  const handleSave = (formData) => {
    saveOffer({
      ...(editingOffer ? { id: editingOffer.id ?? editingOffer._id } : {}),
      name:                formData.title,
      description:         formData.description,
      discount_percentage: Number(formData.discount),
      start_date:          formData.startDate,
      end_date:            formData.endDate,
      active:              formData.active,
      applicable_products: formData.products.map(p => p.id),
      bannerUrl:           formData.bannerUrl ?? "",
      bannerFile:          formData.bannerFile ?? null,
    });
  };

  const handleDeleteConfirm = () => {
    deleteOffer(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Ofertas"
          subtitle="Gestiona promociones, descuentos y campañas activas"
        />
        <OffersStats stats={stats} />
      </div>

      <OffersFilters
        filter={filter} setFilter={setFilter}
        search={search} setSearch={setSearch}
      />

      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <i className="fa-solid fa-circle-notch fa-spin text-xl" />
          <span className="text-sm">Cargando ofertas…</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-5 py-4 text-sm">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      {!loading && !error && (
        <OffersTable
          offers={filtered}
          onToggle={toggleOffer}
          onEdit={openEdit}
          onDelete={(id) => setDeleteTarget(filtered.find(o => o.id === id))}
          onDetail={(o) => setSelectedOffer(o)}
        />
      )}

      {/* FAB - Botón flotante para agregar */}
      <button
        onClick={openCreate}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center z-40"
      >
        <i className="fa-solid fa-plus text-xl" />
      </button>

      {/* ── AQUÍ ESTABAN FALTANDO LOS MODALES ── */}
      {modalOpen && (
        <OfferModal
          initialData={modalInitialData}
          availableProducts={availableProducts}
          onSave={handleSave}
          onCancel={closeModal}
        />
      )}

      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Eliminar oferta"
          message={`¿Estás seguro de que deseas eliminar la oferta "${deleteTarget.title}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </main>
  );
}