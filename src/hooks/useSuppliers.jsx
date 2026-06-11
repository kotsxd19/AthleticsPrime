import { useEffect, useState, useMemo, useCallback } from "react";

const API_URL = "http://localhost:4000/api/suppliers";

const useSuppliers = () => {
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [detailSupplier, setDetailSupplier] = useState(null);
  const [toast, setToast] = useState("");

  const fetchDataTest = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener la información de proveedores");
      const data = await response.json();
      setDataTest(data);
    } catch (fetchError) {
      console.error("Error loading suppliers:", fetchError);
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
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const openEdit = (supplier) => {
    // Locate original supplier from state to get original keys
    const original = dataTest.find((s) => (s._id ?? s.id) === supplier.id);
    setEditingSupplier(original || supplier);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
  };

  const saveSupplier = async (formData) => {
    try {
      const isEditing = !!formData.id || !!formData._id;
      const supplierId = formData.id || formData._id;

      // Map keys to match the Mongoose schema camelCase exactly
      const payload = {
        name:         formData.name?.trim(),
        contactName:  (formData.contactName || formData.contact)?.trim(),
        phoneNumber:  (formData.phoneNumber || formData.phone)?.trim(),
        email:        formData.email?.trim(),
        location:     formData.location?.trim(),
        status:       formData.status !== undefined ? formData.status : formData.active,
      };

      if (!payload.name || !payload.contactName || !payload.phoneNumber || !payload.email || !payload.location) {
        throw new Error("Faltan campos requeridos");
      }

      const response = await fetch(
        isEditing ? `${API_URL}/${supplierId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "No se pudo guardar el proveedor");
      }

      showToast(isEditing ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      console.error("Error saving supplier:", e);
      alert(e.message || "Error al guardar");
    }
  };

  const toggleSupplier = async (supplierId) => {
    const supplier = dataTest.find((s) => s.id === supplierId || s._id === supplierId);
    if (!supplier) return;
    try {
      // Replicamos el patrón de desestructuración de Pedidos ({ ...objeto, status: !status })
      // y resolvemos las propiedades requeridas para pasar la validación del backend
      const payload = {
        ...supplier,
        contactName:  supplier.contactName || supplier.contact_name || supplier.contact || "",
        phoneNumber:  supplier.phoneNumber || supplier.phone_number || supplier.phone || "",
        status:       !supplier.status,
      };

      const response = await fetch(`${API_URL}/${supplierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "No se pudo cambiar el estado");
      }

      showToast(supplier.status ? "Proveedor desactivado correctamente" : "Proveedor activado correctamente");
      await fetchDataTest();
    } catch (e) {
      console.error("Error toggling supplier status:", e);
      alert(e.message || "Error al cambiar estado");
    }
  };

  const deleteSupplier = async (supplierId) => {
    const shouldDelete = window.confirm("¿Deseas eliminar este proveedor?");
    if (!shouldDelete) return;
    try {
      const response = await fetch(`${API_URL}/${supplierId}`, { method: "DELETE" });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "No se pudo eliminar el proveedor");
      }
      showToast("Proveedor eliminado");
      await fetchDataTest();
    } catch (e) {
      console.error("Error deleting supplier:", e);
      alert(e.message || "Error al eliminar");
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
          s.contactName?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q)
        );
      })
      .map((s) => ({
        ...s,
        id:        s._id ?? s.id,
        contact:   s.contactName || s.contact_name || "",
        phone:     s.phoneNumber || s.phone_number || "",
        active:    s.status === true || s.status === "true",
        createdAt: (s.createdAt || s.created_at)?.split("T")[0],
        updatedAt: (s.updatedAt || s.updated_at)?.split("T")[0],
      }));
  }, [dataTest, filter, search]);

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
    editingSupplier,
    detailSupplier,
    setDetailSupplier,
    toast,
    openCreate,
    openEdit,
    closeModal,
    saveSupplier,
    toggleSupplier,
    deleteSupplier,
    refetch: fetchDataTest,
  };
};

export default useSuppliers;