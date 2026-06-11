// src/hooks/useNews.jsx
import { useEffect, useState, useMemo, useCallback } from "react";

const API_URL = "http://localhost:4000/api/news";

const categoryMap = {
  collaboration: "Colaboración",
  launch: "Lanzamiento",
  event: "Evento",
  announcement: "Anuncio",
};

const statusMap = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export function useNews() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [detailNews, setDetailNews] = useState(null);
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener el listado de novedades");
      const resJSON = await response.json();
      setData(resJSON.data || []);
    } catch (e) {
      console.error("Error loading news:", e);
      setError(e.message || "Error al cargar las novedades");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openCreate = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingNews(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNews(null);
  };

  const saveNews = async (formData) => {
    try {
      setSubmitting(true);
      const isEditing = !!formData.id;

      // Usar FormData para enviar archivos reales al backend
      const uploadData = new FormData();
      uploadData.append("title", formData.title.trim());
      uploadData.append("subtitle", formData.subtitle?.trim() || "");
      uploadData.append("description", formData.description?.trim() || "");
      uploadData.append("category", formData.category);
      uploadData.append("status", formData.status || "draft");
      uploadData.append("isFeatured", formData.isFeatured ? "true" : "false");
      
      if (formData.releaseDate) {
        uploadData.append("releaseDate", formData.releaseDate);
      }
      if (formData.relatedProducts) {
        uploadData.append("relatedProducts", JSON.stringify(formData.relatedProducts));
      }

      // Añadir imágenes si fueron seleccionadas
      if (formData.bannerFile) {
        uploadData.append("banner", formData.bannerFile);
      }
      if (formData.cardFile) {
        uploadData.append("card", formData.cardFile);
      }

      const response = await fetch(
        isEditing ? `${API_URL}/${formData.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          body: uploadData,
          // NOTA: No especificar Content-Type para que el navegador configure automáticamente multipart/form-data y sus boundaries
        }
      );

      const resJSON = await response.json();
      if (!response.ok) {
        throw new Error(resJSON.message || "No se pudo guardar la novedad");
      }

      showToast(isEditing ? "Novedad actualizada correctamente" : "Novedad creada correctamente");
      closeModal();
      await fetchNews();
    } catch (e) {
      console.error("Error saving news:", e);
      alert(e.message || "Error al guardar la novedad");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (newsId, currentStatus) => {
    try {
      let nextStatus = "published";
      if (currentStatus === "published") nextStatus = "draft";
      else if (currentStatus === "draft") nextStatus = "published";

      const response = await fetch(`${API_URL}/${newsId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const resJSON = await response.json();
      if (!response.ok) {
        throw new Error(resJSON.message || "No se pudo cambiar el estado");
      }

      showToast(`Novedad marcada como: ${statusMap[nextStatus]}`);
      await fetchNews();
    } catch (e) {
      console.error("Error toggling news status:", e);
      alert(e.message || "Error al cambiar de estado");
    }
  };

  const deleteNews = async (newsId) => {
    if (!window.confirm("¿Deseas eliminar esta novedad por completo?")) return;
    try {
      const response = await fetch(`${API_URL}/${newsId}`, { method: "DELETE" });
      const resJSON = await response.json();
      if (!response.ok) {
        throw new Error(resJSON.message || "No se pudo eliminar la novedad");
      }
      showToast("Novedad eliminada correctamente");
      if (detailNews && (detailNews._id === newsId || detailNews.id === newsId)) {
        setDetailNews(null);
      }
      await fetchNews();
    } catch (e) {
      console.error("Error deleting news:", e);
      alert(e.message || "Error al eliminar la novedad");
    }
  };

  const filtered = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list
      .filter((item) => {
        if (filter === "all") return true;
        if (filter === "collaboration") return item.category === "collaboration";
        if (filter === "launch")        return item.category === "launch";
        if (filter === "event")         return item.category === "event";
        if (filter === "announcement")  return item.category === "announcement";
        if (filter === "featured")      return item.isFeatured === true;
        if (filter === "draft")         return item.status === "draft";
        if (filter === "published")     return item.status === "published";
        return true;
      })
      .filter((item) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      })
      .map((item) => ({
        ...item,
        id: item._id ?? item.id,
        categoryLabel: categoryMap[item.category] || item.category,
        statusLabel: statusMap[item.status] || item.status,
      }));
  }, [data, filter, search]);

  const stats = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return {
      total: list.length,
      published: list.filter((item) => item.status === "published").length,
      drafts: list.filter((item) => item.status === "draft").length,
      featured: list.filter((item) => item.isFeatured).length,
    };
  }, [data]);

  return {
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
    refetch: fetchNews,
  };
}
