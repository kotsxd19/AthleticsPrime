import { useEffect, useState, useMemo, useCallback } from "react";

const API_URL = "http://localhost:4000/api/products";

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const genderMap = {
  hombres: "Hombre",
  mujeres: "Mujer",
  ninos: "Niño",
  ninas: "Niña",
  unisex: "Unisex",
};

export function useProducts() {
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [toast, setToast] = useState("");

  const fetchDataTest = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener la información de productos");
      const data = await response.json();
      setDataTest(data);
    } catch (fetchError) {
      console.error("Error loading products:", fetchError);
      setError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataTest();
  }, [fetchDataTest]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    // Find the original product in database list to get raw values for modal form
    const original = dataTest.find((item) => (item._id ?? item.id) === p.id);
    setEditingProduct(original || p);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const saveProduct = async (formData) => {
    try {
      const isEditing = !!formData.id;

      // 1. Subir archivos locales de imágenes si existen
      const updatedVariants = [...(formData.variants || [])];
      for (let i = 0; i < updatedVariants.length; i++) {
        const variant = updatedVariants[i];
        if (variant.tempFile) {
          const uploadData = new FormData();
          uploadData.append("image", variant.tempFile);

          const uploadRes = await fetch("http://localhost:4000/api/products/upload-image", {
            method: "POST",
            body: uploadData,
          });

          if (!uploadRes.ok) {
            throw new Error(`Error al subir la imagen para la variante de color: ${variant.color}`);
          }

          const uploadResult = await uploadRes.json();
          variant.images = [
            {
              url: uploadResult.url,
              public_id: uploadResult.public_id,
            },
          ];

          delete variant.tempFile;
          delete variant.previewUrl;
        }
      }

      // Format payload to match the Mongoose schema enums and expectations
      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.toLowerCase(),
        gender: formData.gender.toLowerCase(),
        category: formData.category.toLowerCase(),
        product_type: formData.product_type.toLowerCase(),
        sport: formData.sport ? formData.sport.toLowerCase() : "training",
        description: formData.description?.trim() || "",
        price: Number(formData.price || 0),
        discount: Number(formData.discount || 0),
        // Backend expects featured and active as "true" / "false" strings
        featured: formData.featured ? "true" : "false",
        active: formData.active ? "true" : "false",
        // Backend parses variants from JSON string
        variants: JSON.stringify(updatedVariants),
      };

      const response = await fetch(
        isEditing ? `${API_URL}/${formData.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "No se pudo guardar el producto");
      }

      showToast(isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      console.error("Error saving product:", e);
      alert(e.message || "Error al guardar el producto");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("¿Deseas eliminar este producto por completo del catálogo?")) return;
    try {
      const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "No se pudo eliminar el producto");
      }
      showToast("Producto eliminado correctamente");
      // If the deleted product was open in detail, close it
      if (detailProduct && (detailProduct._id === productId || detailProduct.id === productId)) {
        setDetailProduct(null);
      }
      await fetchDataTest();
    } catch (e) {
      console.error("Error deleting product:", e);
      alert(e.message || "Error al eliminar");
    }
  };

  // Reactively filter and format products
  const filtered = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return list
      .filter((p) => {
        if (filter === "all") return true;
        const cat = (p.category ?? "").toLowerCase();
        if (filter === "calzado") return cat === "zapatos" || cat === "calzado";
        if (filter === "prendas") return cat === "ropa" || cat === "prendas";
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
      .map((p) => {
        const mappedGender = genderMap[p.gender?.toLowerCase()] || capitalize(p.gender);
        const mappedCategory = p.category === "zapatos" ? "Calzado" : p.category === "ropa" ? "Prendas" : capitalize(p.category);
        
        // Sum total quantities across all variants and sizes
        const totalQty = p.variants?.reduce(
          (acc, v) => acc + (v.sizes?.reduce((a, s) => a + Number(s.stock || 0), 0) ?? 0), 0
        ) ?? 0;

        // Size listing (joins first sizes for visual hint)
        const sizePreview = p.variants?.[0]?.sizes?.map(s => s.size).slice(0, 3).join(", ") || "—";

        return {
          ...p,
          id: p._id ?? p.id,
          gender: mappedGender,
          cat: mappedCategory,
          type: capitalize(p.product_type),
          desc: p.description,
          price: Number(p.price ?? 0),
          size: sizePreview,
          qty: totalQty,
        };
      });
  }, [dataTest, filter, search]);

  return {
    filtered,
    filter,
    setFilter,
    search,
    setSearch,
    loading,
    error,
    modalOpen,
    editingProduct,
    detailProduct,
    setDetailProduct,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveProduct,
    deleteProduct,
    refetch: fetchDataTest,
  };
}