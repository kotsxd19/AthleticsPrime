import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/orders";

const useOrders = () => {
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
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

  const openCreate  = ()  => { setEditingOrder(null); setModalOpen(true); };
  const openEdit    = (o) => { setEditingOrder(o);    setModalOpen(true); };
  const closeModal  = ()  => { setModalOpen(false); setEditingOrder(null); };
  const openDetail  = (o) => setDetailOrder(o);
  const closeDetail = ()  => setDetailOrder(null);

  const saveOrder = async (formData) => {
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
      if (!response.ok) throw new Error("No se pudo guardar el pedido");
      showToast(isEditing ? "Pedido actualizado" : "Pedido creado");
      closeModal();
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al guardar");
    }
  };

  const toggleDelivered = async (orderId) => {
    const order = dataTest.find((o) => o._id === orderId || o.id === orderId);
    if (!order) return;
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, order_status: !order.order_status }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar el estado");
      showToast(order.order_status ? "Marcado como entregado" : "Marcado como pendiente");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al cambiar estado");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("¿Deseas eliminar este pedido?")) return;
    try {
      const response = await fetch(`${API_URL}/${orderId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el pedido");
      showToast("Pedido eliminado");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al eliminar");
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return {
      delivered: list.filter((o) => o.order_status === true).length,
      pending:   list.filter((o) => o.order_status === false).length,
      total:     list.length,
      revenue:   list.reduce((acc, o) => acc + Number(o.total_amount ?? 0), 0),
    };
  }, [dataTest]);

  const filtered = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return list
      .filter((o) => {
        if (filter === "delivered") return o.order_status === true;
        if (filter === "pending")   return o.order_status === false;
        return true;
      })
      .filter((o) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          o.tracking_number?.toLowerCase().includes(q) ||
          o.delivery_address?.toLowerCase().includes(q)
        );
      })
      .map((o) => ({
        ...o,
        id:        o._id ?? o.id,
        client:    o.client_name ?? o.shopping_cart_id ?? "—",
        payment:   o.payment_method,
        total:     Number(o.total_amount ?? 0),
        orderedAt: o.ordered_at?.split("T")[0],
        address:   o.delivery_address,
        delivered: o.order_status === true,
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
    editingOrder,
    detailOrder,
    toast,
    openCreate,
    openEdit,
    closeModal,
    openDetail,
    closeDetail,
    saveOrder,
    toggleDelivered,
    deleteOrder,
    fetchDataTest,
  };
};

export default useOrders;