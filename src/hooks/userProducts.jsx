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
      const response = await fetch(
        isEditing ? `${API_URL}/${formData.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("No se pudo guardar el producto");
      showToast(isEditing ? "Producto actualizado" : "Producto creado");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("¿Deseas eliminar este producto?")) return;
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
        // filtra por categoría: calzado, ropa/prendas, accesorios
        const cat = (p.category ?? "").toLowerCase();
        if (filter === "calzado")    return cat === "calzado";
        if (filter === "prendas")    return cat === "ropa" || cat === "prendas";
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
      // mapea campos de API a los que espera ProductsTable
      .map((p) => ({
        ...p,
        id:     p._id ?? p.id,
        gender: capitalize(p.gender),
        cat:    capitalize(p.category),
        type:   capitalize(p.product_type),
        desc:   p.description,
        price:  Number(p.price ?? 0),
        // talla y qty vienen de variants — toma el primer variant disponible
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

export default useProducts;

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";