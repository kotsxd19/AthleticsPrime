import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/offers";

const useOffers = () => {
  const [dataRaw, setDataRaw]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filter, setFilter]             = useState("all");
  const [search, setSearch]             = useState("");
  
  // Estado para el modal de Creación/Edición
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  
  // NUEVO: Estado para el modal de Ver Detalle
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewingOffer, setViewingOffer]       = useState(null);

  const [toast, setToast]               = useState("");

  /* ── Fetch ── */
  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("No se pudo obtener las ofertas");
      const data = await res.json();
      setDataRaw(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error al cargar las ofertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Modales de Crear / Editar ── */
  const openCreate = ()  => { setEditingOffer(null); setModalOpen(true); };
  const openEdit   = (o) => { setEditingOffer(o);    setModalOpen(true); };
  const closeModal = ()  => { setModalOpen(false); setEditingOffer(null); };

  /* ── NUEVO: Modal de Ver Detalle ── */
  const openDetail = (o) => { setViewingOffer(o); setDetailModalOpen(true); };
  const closeDetailModal = () => { setDetailModalOpen(false); setViewingOffer(null); };

  /* ── Save ── */
  const saveOffer = async (formData) => {
    try {
      const id = formData.id;
      const isEditing = !!id;

      const payload = {
        name:                formData.name        || formData.title       || "",
        description:         formData.description || formData.desc        || "",
        discount_percentage: Number(formData.discount_percentage ?? formData.disc ?? 0),
        start_date:          formData.start_date  || formData.start       || formData.startDate || "",
        end_date:            formData.end_date    || formData.end         || formData.endDate   || "",
        active:              formData.active ?? true,
        applicable_products: (formData.applicable_products || formData.products || []).map(p =>
          typeof p === 'object' ? (p.id ?? p._id) : p
        ),
        ...(formData.bannerUrl ? { banner: { url: formData.bannerUrl } } : {}),
      };

      const res = await fetch(
        isEditing ? `${API_URL}/${id}` : API_URL,
        {
          method:  isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("No se pudo guardar la oferta");
      showToast(isEditing ? "Oferta actualizada" : "Oferta creada");
      closeModal();
      await fetchOffers();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  };

  /* ── Toggle activo/inactivo ── */
  const toggleOffer = async (offerId) => {
    const offer = dataRaw.find(o => (o._id ?? o.id) === offerId);
    if (!offer) return;
    try {
      const productsIds = (offer.applicable_products || []).map(p => 
        typeof p === 'object' ? (p._id || p.id) : p
      );

      const res = await fetch(`${API_URL}/${offerId}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:                offer.name,
          description:         offer.description,
          discount_percentage: offer.discount_percentage,
          start_date:          offer.start_date,
          end_date:            offer.end_date,
          active:              !offer.active,
          applicable_products: productsIds,
        }),
      });
      if (!res.ok) throw new Error("No se pudo cambiar el estado");
      showToast(!offer.active ? "Oferta activada" : "Oferta desactivada");
      await fetchOffers();
    } catch (e) {
      setError(e.message || "Error al cambiar estado");
    }
  };

  /* ── Delete ── */
  const deleteOffer = async (offerId) => {
    try {
      const res = await fetch(`${API_URL}/${offerId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar la oferta");
      showToast("Oferta eliminada");
      await fetchOffers();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  /* ── Stats ── */
  const stats = useMemo(() => {
    const list = Array.isArray(dataRaw) ? dataRaw : [];
    return {
      active:   list.filter(o => o.active === true).length,
      inactive: list.filter(o => o.active === false).length,
      total:    list.length,
    };
  }, [dataRaw]);

  /* ── Filtered + normalizado para la tabla ── */
  const filtered = useMemo(() => {
    const list = Array.isArray(dataRaw) ? dataRaw : [];
    return list
      .filter(o => {
        if (filter === "active")   return o.active === true;
        if (filter === "inactive") return o.active === false;
        return true;
      })
      .filter(o => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          o.name?.toLowerCase().includes(q) ||
          o.description?.toLowerCase().includes(q)
        );
      })
      .map(o => ({
        id:        o._id ?? o.id,
        title:     o.name,
        desc:      o.description,
        disc:      o.discount_percentage,
        start:     o.start_date ? o.start_date.split("T")[0] : "",
        end:       o.end_date   ? o.end_date.split("T")[0]   : "",
        active:    o.active,
        bannerUrl: o.banner?.url || null,
        products:  o.applicable_products || [],
        _raw:      o,
      }));
  }, [dataRaw, filter, search]);

  return {
    filtered, stats,
    filter,  setFilter,
    search,  setSearch,
    loading, error,
    modalOpen, editingOffer,
    // NUEVAS VARIABLES EXPORTADAS:
    detailModalOpen, viewingOffer,
    openDetail, closeDetailModal,
    toast,
    openCreate, openEdit,
    closeModal, saveOffer,
    toggleOffer, deleteOffer,
    fetchOffers,
  };
};

export default useOffers;