import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/products";

const useProducts = () => {
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState("");

  const fetchDataTest = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener la información");
      const data = await response.json();
      setDataTest(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDataTest(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit   = (p)  => { setEditingProduct(p);    setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditingProduct(null); };

  const saveProduct = async (formData) => {
    try {
      const isEditing = !!formData.id;

      // PUT usa JSON, POST usa FormData (por las imágenes)
      if (isEditing) {
        const payload = {
          name:         formData.name,
          brand:        formData.brand?.toLowerCase(),
          gender:       genderToEnum(formData.gender),
          category:     categoryToEnum(formData.category),
          product_type: formData.types?.[0]?.toLowerCase() ?? formData.type?.toLowerCase(),
          description:  formData.desc ?? formData.description,
          price:        formData.price,
          discount:     formData.discount ?? 0,
          active:       formData.active !== false ? "true" : "false",
          featured:     formData.featured ? "true" : "false",
        };
        const response = await fetch(`${API_URL}/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("No se pudo actualizar el producto");

      } else {
        const fd = new FormData();
        fd.append("name",         formData.name);
        fd.append("brand",        formData.brand?.toLowerCase());
        fd.append("gender",       genderToEnum(formData.gender));
        fd.append("category",     categoryToEnum(formData.category));
        fd.append("product_type", formData.types?.[0]?.toLowerCase() ?? "camiseta");
        fd.append("description",  formData.desc ?? "");
        fd.append("price",        formData.price);
        fd.append("discount",     formData.discount ?? 0);
        fd.append("active",       "true");
        fd.append("featured",     "false");

        // variants básico sin imágenes
        const variants = [{
          color: "default",
          images: [],
          sizes: formData.sizes?.map(s => ({ size: s, stock: formData.qty ?? 1 })) ?? [{ size: "M", stock: 1 }],
        }];
        fd.append("variants", JSON.stringify(variants));

        const response = await fetch(API_URL, { method: "POST", body: fd });
        if (!response.ok) throw new Error("No se pudo crear el producto");
      }

      showToast(isEditing ? "Producto actualizado" : "Producto creado");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el producto");
      showToast("Producto eliminado");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  // ── Derivados ──────────────────────────────────────────
  const filtered = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return list
      .filter((p) => {
        if (filter === "all") return true;
        const cat = (p.category ?? "").toLowerCase();
        if (filter === "calzado")    return cat === "zapatos" || cat === "calzado";
        if (filter === "prendas")    return cat === "ropa"    || cat === "prendas";
        if (filter === "accesorios") return cat === "accesorios";
        return true;
      })
      .filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      })
      .map((p) => ({
        ...p,
        id:     p._id ?? p.id,
        gender: capitalize(p.gender),
        cat:    capitalize(p.category),
        type:   capitalize(p.product_type),
        desc:   p.description,
        price:  Number(p.price ?? 0),
        size:   p.variants?.[0]?.sizes?.[0]?.size ?? "—",
        qty:    p.variants?.reduce(
          (acc, v) => acc + (v.sizes?.reduce((a, s) => a + (s.stock ?? 0), 0) ?? 0), 0
        ) ?? 0,
      }));
  }, [dataTest, filter, search]);

  return {
    filtered,
    filter,    setFilter,
    search,    setSearch,
    loading,
    error,
    modalOpen,
    editingProduct,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveProduct,
    deleteProduct,
    fetchDataTest,
  };
};

// ── Helpers de mapeo ──────────────────────────────────────
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const genderToEnum = (g) => {
  const map = {
    'Hombre': 'hombres', 'hombre': 'hombres',
    'Mujer':  'mujeres', 'mujer':  'mujeres',
    'Niño':   'ninos',   'niño':   'ninos',
    'Niña':   'ninas',   'niña':   'ninas',
    'Unisex': 'unisex',  'unisex': 'unisex',
  };
  return map[g] ?? 'unisex';
};

const categoryToEnum = (c) => {
  const map = {
    'calzado': 'zapatos', 'zapatos': 'zapatos',
    'ropa': 'ropa', 'prendas': 'ropa',
    'accesorios': 'ropa',
  };
  return map[c?.toLowerCase()] ?? 'ropa';
};

export default useProducts;