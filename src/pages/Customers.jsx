// src/pages/Clients.jsx
import useCustomer from '../hooks/useCustomer';
import PageHeader from '../components/shared/PageHeader';
import Toast from '../components/shared/Toast';
import ClientsStats from '../components/customers/CustomersStats';
import ClientsFilters from '../components/customers/CustomersFilters';
import ClientsTable from '../components/customers/CustomersTable';
{/*import ClientModal from '../components/customers/CustomersModal'; */}

export default function Clients() {
  const {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    loading, error,
    modalOpen, editingClient,
    toast, openCreate, openEdit,
    closeModal, saveClient,
    toggleClient, toggleVerified, deleteClient,
  } = useCustomer();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Clientes"
          subtitle="Gestiona tus clientes, estados y verificaciones"
        />
        <ClientsStats stats={stats} />
      </div>

      <ClientsFilters
        filter={filter} setFilter={setFilter}
        search={search} setSearch={setSearch}
      />

      <ClientsTable
        clients={filtered}
        loading={loading}
        error={error}
        onToggle={toggleClient}
        onToggleVerified={toggleVerified}
        onEdit={openEdit}
        onDelete={deleteClient}
      />

      {/*{modalOpen && (
        <ClientModal
          client={editingClient}
          onClose={closeModal}
          onSave={saveClient}
        />
      )}*/}

      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30"
        aria-label="Agregar cliente"
      >
        <i className="fa-solid fa-plus" />
      </button>

      
      <Toast message={toast} />

    </main>
  );
}