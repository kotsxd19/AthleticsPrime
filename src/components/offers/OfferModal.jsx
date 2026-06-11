// src/components/shared/OfferModal.jsx
import { useState, useEffect, useRef } from "react";

const OFFER_TYPES = [
  { value: "percentage", label: "Porcentaje" },
  { value: "fixed",      label: "Monto fijo" },
  { value: "2x1",        label: "2x1" },
];

const EMPTY = {
  title: "",
  description: "",
  offerType: "percentage",
  promoCode: "",
  startDate: "",
  endDate: "",
  discount: "",
  products: [],   // [{ id, name }]
  bannerUrl: "",  // preview local (objectURL) o URL remota
  bannerFile: null,
  active: true,
};

export default function OfferModal({ onCancel, onSave, initialData = null, availableProducts = [] }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [productSearch, setProductSearch] = useState("");
  const fileRef = useRef();

  // Cerrar con ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  /* ── poblar al editar ── */
  useEffect(() => {
    if (initialData) {
      setForm({
        title:       initialData.title       ?? "",
        description: initialData.description ?? "",
        offerType:   initialData.offerType   ?? "percentage",
        promoCode:   initialData.promoCode   ?? "",
        startDate:   initialData.startDate   ?? "",
        endDate:     initialData.endDate     ?? "",
        discount:    initialData.discount    ?? "",
        products:    initialData.products    ?? [],
        bannerUrl:   initialData.bannerUrl   ?? "",
        bannerFile:  null,
        active:      initialData.active      ?? true,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setProductSearch("");
  }, [initialData]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /* ── banner ── */
  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, bannerUrl: url, bannerFile: file }));
    setErrors((e) => ({ ...e, bannerUrl: undefined }));
  };

  const removeBanner = () => {
    if (form.bannerUrl?.startsWith("blob:")) URL.revokeObjectURL(form.bannerUrl);
    setForm((f) => ({ ...f, bannerUrl: "", bannerFile: null }));
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ── productos ── */
  const addProduct = (p) => {
    if (form.products.find((x) => x.id === p.id)) return;
    set("products", [...form.products, p]);
  };

  const removeProduct = (id) =>
    set("products", form.products.filter((p) => p.id !== id));

  const filteredAvailable = availableProducts.filter(
    (p) =>
      !form.products.find((x) => x.id === p.id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  /* ── validación ── */
  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title = "El título es requerido.";
    if (!form.startDate)       e.startDate = "Requerido.";
    if (!form.endDate)         e.endDate = "Requerido.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = "Debe ser posterior al inicio.";
    if (!form.discount || isNaN(form.discount) || Number(form.discount) <= 0)
      e.discount = "Descuento inválido.";
    if (form.products.length === 0)
      e.products = "Agrega al menos un producto.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEdit ? "Editar oferta" : "Nueva oferta"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEdit ? "Modifica los datos de la promoción." : "Completa los datos de la promoción."}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition shrink-0 ml-4"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">

          {/* 1 · Información general */}
          <Section icon="fa-circle-info" title="Información general">
            <Field label="TÍTULO" required error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ej. Viernes Negro"
                className={inp(errors.title)}
              />
            </Field>

            <Field label="DESCRIPCIÓN">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Detalles de la oferta..."
                rows={3}
                className={inp() + " resize-none"}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="TIPO DE OFERTA">
                <select
                  value={form.offerType}
                  onChange={(e) => set("offerType", e.target.value)}
                  className={inp()}
                >
                  {OFFER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="CÓDIGO PROMOCIONAL">
                <input
                  type="text"
                  value={form.promoCode}
                  onChange={(e) => set("promoCode", e.target.value.toUpperCase())}
                  placeholder="Opcional, ej. BLACK30"
                  className={inp()}
                />
              </Field>
            </div>
          </Section>

          {/* 2 · Banner */}
          <Section icon="fa-image" title="Banner de la oferta">
            {form.bannerUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={form.bannerUrl}
                  alt="Banner"
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
                <div className="absolute bottom-2 left-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-pen text-[10px]" />
                    Cambiar imagen
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 transition"
              >
                <i className="fa-solid fa-cloud-arrow-up text-2xl" />
                <span className="text-xs font-medium">Haz clic para subir una imagen</span>
                <span className="text-[10px] text-slate-300">PNG, JPG, WEBP · máx. 2 MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBanner}
            />
          </Section>

          {/* 3 · Vigencia y descuento */}
          <Section icon="fa-calendar-days" title="Vigencia y descuento">
            <div className="grid grid-cols-3 gap-3">
              <Field label="INICIO" required error={errors.startDate}>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  className={inp(errors.startDate)}
                />
              </Field>
              <Field label="FIN" required error={errors.endDate}>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                  className={inp(errors.endDate)}
                />
              </Field>
              <Field label="DESCUENTO (%)" required error={errors.discount}>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discount}
                  onChange={(e) => set("discount", e.target.value)}
                  placeholder="20"
                  className={inp(errors.discount)}
                />
              </Field>
            </div>
          </Section>

          {/* 4 · Productos */}
          <Section icon="fa-boxes-stacked" title="Productos asociados">

            {/* chips de productos ya agregados */}
            {form.products.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {form.products.map((p) => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold"
                  >
                    {p.name}
                    <button
                      type="button"
                      onClick={() => removeProduct(p.id)}
                      className="text-indigo-400 hover:text-indigo-700 transition leading-none"
                    >
                      <i className="fa-solid fa-xmark text-[10px]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* buscador de productos */}
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar producto para agregar…"
                className={inp() + " !pl-8"}
              />
            </div>

            {/* dropdown de resultados */}
            {productSearch && (
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-36 overflow-y-auto">
                {filteredAvailable.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-slate-400 text-center">Sin resultados.</p>
                ) : (
                  filteredAvailable.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { addProduct(p); setProductSearch(""); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center gap-2 border-b border-slate-100 last:border-0"
                    >
                      <i className="fa-solid fa-plus text-xs text-indigo-400 shrink-0" />
                      {p.name}
                    </button>
                  ))
                )}
              </div>
            )}

            {errors.products && (
              <p className="text-xs text-rose-500">{errors.products}</p>
            )}
            {!errors.products && form.products.length > 0 && (
              <p className="text-xs text-indigo-600 font-medium">
                {form.products.length} producto(s) seleccionado(s).
              </p>
            )}
            {form.products.length === 0 && !productSearch && (
              <p className="text-xs text-slate-400">Usa el buscador para agregar productos.</p>
            )}
          </Section>

          {/* 5 · Estado */}
          <Section icon="fa-toggle-on" title="Estado">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set("active", !form.active)}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${form.active ? "bg-indigo-600" : "bg-slate-300"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${form.active ? "left-5" : "left-1"}`}
                />
              </div>
              <span className="text-sm text-slate-700 font-medium">
                {form.active ? "Activar oferta al guardar" : "Guardar como inactiva"}
              </span>
            </label>
          </Section>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-check" />
            {isEdit ? "Guardar cambios" : "Guardar oferta"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── helpers ── */
function Section({ icon, title, children }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <i className={`fa-solid ${icon} text-white text-xs`} />
        </div>
        <span className="text-sm font-bold text-slate-800">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

function inp(error) {
  return `w-full px-3 py-2 rounded-xl border text-sm bg-white text-slate-800 placeholder-slate-400 outline-none transition
    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
    ${error ? "border-rose-400 bg-rose-50" : "border-slate-200 hover:border-slate-300"}`;
}