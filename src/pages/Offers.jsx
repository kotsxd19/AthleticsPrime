// src/pages/Offers.jsx
import { useOffers } from '../hooks/useOffers';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import OffersStats from '../components/offers/OffersStats';
import OffersFilters from '../components/offers/OffersFilters';
import OffersTable from '../components/offers/OffersTable';
import OfferModal from '../components/offers/OfferModal';

export default function Offers() {
  const {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingOffer,
    toast, openCreate, openEdit,
    closeModal, saveOffer,
    toggleOffer, deleteOffer,
  } = useOffers();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Encabezado + stats */}
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

      <OffersTable
        offers={filtered}
        onToggle={toggleOffer}
        onEdit={openEdit}
        onDelete={deleteOffer}
      />

      {/* FAB */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar oferta"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Modal */}
      {modalOpen && (
        <OfferModal
          offer={editingOffer}
          onClose={closeModal}
          onSave={saveOffer}
        />
      )}

      <Toast message={toast} />

    </main>
  );
}