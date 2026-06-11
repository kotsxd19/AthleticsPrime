// src/components/news/NewsModal.jsx
import { useState, useEffect } from "react";

const CATEGORIES = [
  { value: "collaboration", label: "Colaboración" },
  { value: "launch", label: "Lanzamiento / Release" },
  { value: "event", label: "Evento" },
  { value: "announcement", label: "Anuncio oficial" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Borrador (Draft)" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
];

const empty = {
  title: "",
  subtitle: "",
  description: "",
  category: "launch",
  status: "draft",
  releaseDate: "",
  isFeatured: false,
  relatedProducts: [],
};

export default function NewsModal({ news, onClose, onSave, submitting }) {
  const isEditing = !!news;

  const [form, setForm] = useState(empty);
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // States for file inputs & previews
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [cardFile, setCardFile] = useState(null);
  const [cardPreview, setCardPreview] = useState("");

  // Load products to populate relationship choices
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("http://localhost:4000/api/products");
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
        }
      } catch (e) {
        console.error("Error loading products for news mapping:", e);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Pre-populate form when editing
  useEffect(() => {
    if (news) {
      setForm({
        id: news.id || news._id,
        title: news.title || "",
        subtitle: news.subtitle || "",
        description: news.description || "",
        category: news.category || "launch",
        status: news.status || "draft",
        releaseDate: news.releaseDate ? news.releaseDate.split("T")[0] : "",
        isFeatured: !!news.isFeatured,
        relatedProducts: (news.relatedProducts || []).map((p) => p._id || p),
      });
      setBannerPreview(news.bannerImage || "");
      setCardPreview(news.cardImage || "");
    } else {
      setForm(empty);
      setBannerPreview("");
      setCardPreview("");
    }
    setBannerFile(null);
    setCardFile(null);
  }, [news]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleProductRelation = (pId) => {
    const current = [...form.relatedProducts];
    if (current.includes(pId)) {
      set("relatedProducts", current.filter((id) => id !== pId));
    } else {
      set("relatedProducts", [...current, pId]);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleCardChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCardFile(file);
      setCardPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("El título es obligatorio.");
      return;
    }
    if (!isEditing && !bannerFile) {
      alert("La imagen de Banner es obligatoria para nuevas publicaciones.");
      return;
    }
    if (!isEditing && !cardFile) {
      alert("La imagen de Tarjeta es obligatoria para nuevas publicaciones.");
      return;
    }

    onSave({
      ...form,
      bannerFile,
      cardFile,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              {isEditing ? "Editar Novedad" : "Crear Nueva Novedad"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gestiona publicaciones, lanzamientos y anuncios importantes en el portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* General info */}
          <div className="space-y-4">
            <div>
              <label className="input-label">Título principal *</label>
              <input
                required
                disabled={submitting}
                type="text"
                className="input"
                placeholder="Ej. Colección de Verano 2026"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>

            <div>
              <label className="input-label">Subtítulo o bajada</label>
              <input
                disabled={submitting}
                type="text"
                className="input"
                placeholder="Ej. Descubre las prendas ideales para entrenamientos de alta temperatura"
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Categoría *</label>
                <select
                  disabled={submitting}
                  className="input"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Estado de Publicación *</label>
                <select
                  disabled={submitting}
                  className="input"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Fecha de Lanzamiento / Evento</label>
                <input
                  disabled={submitting}
                  type="date"
                  className="input"
                  value={form.releaseDate}
                  onChange={(e) => set("releaseDate", e.target.value)}
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    disabled={submitting}
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => set("isFeatured", e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  Marcar como Novedad Destacada (Principal)
                </label>
              </div>
            </div>

            <div>
              <label className="input-label">Descripción detallada</label>
              <textarea
                disabled={submitting}
                className="input min-h-[100px]"
                placeholder="Escribe el cuerpo de la novedad o detalles relevantes..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          {/* Image Uploads */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Carga de Imágenes desde dispositivo
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Banner Image */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="input-label font-bold text-slate-700 block">Imagen de Banner (Horizontal)</span>
                
                <div className="aspect-[2/1] rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center relative">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 text-xs">
                      <i className="fa-regular fa-image text-3xl mb-1 block" />
                      Recomendado: 1200 x 600 px
                    </div>
                  )}
                </div>

                <div>
                  <label className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition">
                    <i className="fa-solid fa-cloud-arrow-up text-slate-400" />
                    {bannerPreview ? "Cambiar Banner" : "Subir Banner"}
                    <input
                      disabled={submitting}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerChange}
                    />
                  </label>
                </div>
              </div>

              {/* Card Image */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="input-label font-bold text-slate-700 block">Imagen de Tarjeta (Cuadrada/Ficha)</span>
                
                <div className="aspect-square w-32 mx-auto rounded-xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center relative">
                  {cardPreview ? (
                    <img src={cardPreview} alt="Card Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 text-[10px]">
                      <i className="fa-regular fa-image text-2xl mb-1 block" />
                      600 x 600 px
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <label className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition">
                    <i className="fa-solid fa-cloud-arrow-up text-slate-400" />
                    {cardPreview ? "Cambiar Tarjeta" : "Subir Tarjeta"}
                    <input
                      disabled={submitting}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCardChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Vincular Productos Relacionados
            </h4>
            {loadingProducts ? (
              <p className="text-xs text-slate-400">Cargando catálogo...</p>
            ) : (
              <div className="max-h-[140px] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50 p-2">
                {productsList.map((p) => {
                  const pId = p._id || p.id;
                  const isChecked = form.relatedProducts.includes(pId);
                  return (
                    <label
                      key={pId}
                      className="flex items-center justify-between p-2 hover:bg-white rounded-lg cursor-pointer transition select-none text-xs"
                    >
                      <span className="font-semibold text-slate-700">{p.name} ({p.brand?.toUpperCase()})</span>
                      <input
                        disabled={submitting}
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProductRelation(pId)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                      />
                    </label>
                  );
                })}
                {productsList.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No hay productos en inventario.</p>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
          <button
            disabled={submitting}
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            disabled={submitting}
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar Novedad"}
          </button>
        </div>
      </div>
    </div>
  );
}
