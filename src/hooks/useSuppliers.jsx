import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/suppliers";

const useSuppliers = () => {
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
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

  useEffect(() => {
    fetchDataTest();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openCreate = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
  };

  const saveSupplier = async (formData) => {
    try {
      const isEditing = !!formData.id;
      // mapea los campos del modal (contact, phone, active) a los de la API
      const payload = {
        name:         formData.name,
        contact_name: formData.contact,
        phone_number: formData.phone,
        email:        formData.email,
        location:     formData.location,
        status:       formData.active,
      };
      const response = await fetch(
        isEditing ? `${API_URL}/${formData.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("No se pudo guardar el proveedor");
      showToast(isEditing ? "Proveedor actualizado" : "Proveedor creado");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  };

  const toggleSupplier = async (supplierId) => {
    const supplier = dataTest.find((s) => s.id === supplierId || s._id === supplierId);
    if (!supplier) return;
    try {
      const response = await fetch(`${API_URL}/${supplierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...supplier, status: !supplier.status }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar el estado");
      showToast(supplier.status ? "Proveedor desactivado" : "Proveedor activado");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al cambiar estado");
    }
  };

  const deleteSupplier = async (supplierId) => {
    const shouldDelete = window.confirm("¿Deseas eliminar este proveedor?");
    if (!shouldDelete) return;
    try {
      const response = await fetch(`${API_URL}/${supplierId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el proveedor");
      showToast("Proveedor eliminado");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  // ── Derivados ──────────────────────────────────────────
  const stats = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return {
      active:   list.filter((s) => s.status === true || s.status === "true").length,
      inactive: list.filter((s) => s.status === false || s.status === "false").length,
      total:    list.length,
    };
  }, [dataTest]);

  const filtered = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return list
      .filter((s) => {
        if (filter === "active")   return s.status === true  || s.status === "true";
        if (filter === "inactive") return s.status === false || s.status === "false";
        return true;
      })
      .filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          s.name?.toLowerCase().includes(q) ||
          s.contact_name?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q)
        );
      })
      // mapea campos de API a los que espera SuppliersTable
      .map((s) => ({
        ...s,
        id:        s._id ?? s.id,
        contact:   s.contact_name,
        phone:     s.phone_number,
        active:    s.status === true || s.status === "true",
        createdAt: s.created_at?.split("T")[0],
        updatedAt: s.updated_at?.split("T")[0],
      }));
  }, [dataTest, filter, search]);

  return {
    filtered,
    stats,
    filter,    setFilter,
    search,    setSearch,
    loading,
    error,
    modalOpen,
    editingSupplier,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveSupplier,
    toggleSupplier,
    deleteSupplier,
  };
};

export default useSuppliers;