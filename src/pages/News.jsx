// src/pages/News.jsx
import React from "react";
import { useNews } from "../hooks/useNews";
import PageHeader from "../components/shared/PageHeader";
import Toast from "../components/shared/Toast";
import NewsFilters from "../components/news/NewsFilters";
import NewsTable from "../components/news/NewsTable";
import NewsModal from "../components/news/NewsModal";
import NewsDetailModal from "../components/news/NewsDetailModal";

export default function News() {
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
    editingNews,
    detailNews,
    setDetailNews,
    toast,
    submitting,
    openCreate,
    openEdit,
    closeModal,
    saveNews,
    toggleStatus,
    deleteNews,
    refetch,
  } = useNews();

  const statsItems = [
    { label: "Publicadas", value: stats.published, icon: "fa-circle-check", bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Borradores", value: stats.drafts, icon: "fa-pen-to-square", bg: "bg-amber-50", color: "text-amber-500" },
    { label: "Destacadas", value: stats.featured, icon: "fa-star", bg: "bg-violet-50", color: "text-violet-500" },
    { label: "Total Novedades", value: stats.total, icon: "fa-newspaper", bg: "bg-indigo-50", color: "text-indigo-500" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Novedades"
          subtitle="Publicaciones, lanzamientos de productos y anuncios importantes"
        />
        
        {/* Stats horizontal row */}
        <div className="flex items-center gap-2 flex-wrap">
          {statsItems.map(({ label, value, icon, bg, color }) => (
            <div key={label} className="card px-4 py-2.5 flex items-center gap-2.5 bg-white rounded-xl border border-slate-100 shadow-sm shadow-slate-200/40">
              <div className={`w-8 h-8 rounded-lg grid place-items-center text-sm ${bg} ${color}`}>
                <i className={`fa-solid ${icon}`} />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 leading-none mb-0.5">{label}</div>
                <div className="font-bold text-slate-800 text-sm">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <NewsFilters
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center flex flex-col items-center justify-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600" />
          <p className="text-slate-500 font-medium animate-pulse">Cargando novedades...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-600" />
          <h3 className="font-bold text-red-800">Error al cargar novedades</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <NewsTable
          news={filtered}
          onDetail={setDetailNews}
          onEdit={openEdit}
          onDelete={deleteNews}
          onToggleStatus={toggleStatus}
        />
      )}

      {/* Floating Action Button (FAB) - Agregar Novedad */}
      <button
        onClick={openCreate}
        className="fab fixed bottom-8 right-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl z-30 shadow-lg shadow-indigo-300 hover:scale-105 transition cursor-pointer"
        aria-label="Agregar novedad"
      >
        <i className="fa-solid fa-plus" />
      </button>

      {/* Creation/Editing Modal */}
      {modalOpen && (
        <NewsModal
          news={editingNews}
          onClose={closeModal}
          onSave={saveNews}
          submitting={submitting}
        />
      )}

      {/* Details Modal */}
      {detailNews && (
        <NewsDetailModal
          news={detailNews}
          onClose={() => setDetailNews(null)}
        />
      )}

      {/* Toast notifications */}
      <Toast message={toast} />

    </main>
  );
}
