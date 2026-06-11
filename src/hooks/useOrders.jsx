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
      const originalOrder = dataTest.find(o => (o._id || o.id) === formData.id);

      const payload = {
        shopping_cart_id: formData.shopping_cart_id?._id || formData.shopping_cart_id || originalOrder?.shopping_cart_id?._id || originalOrder?.shopping_cart_id || "60d5ec4b1234567890abcdef",
        payment_method: formData.payment || "Tarjeta",
        payment_status: formData.payment_status ?? originalOrder?.payment_status ?? false,
        order_status: formData.delivered ?? false,
        tracking_number: formData.tracking_number || originalOrder?.tracking_number || `TRK${Math.floor(100000 + Math.random() * 900000)}`,
        delivery_address: formData.address || "",
        total_amount: Number(formData.total || 0),
        shipment: formData.shipment || originalOrder?.shipment || 0,
        delivery_date: formData.delivery_date || originalOrder?.delivery_date || new Date(Date.now() + 7*24*60*60*1000)
      };

      const response = await fetch(
        isEditing ? `${API_URL}/${formData.id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
    const order = dataTest.find((o) => (o._id || o.id) === orderId);
    if (!order) return;
    try {
      const newStatus = !order.order_status;
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          shopping_cart_id: order.shopping_cart_id?._id || order.shopping_cart_id,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          order_status: newStatus,
          tracking_number: order.tracking_number,
          delivery_address: order.delivery_address,
          total_amount: order.total_amount,
          shipment: order.shipment,
          delivery_date: order.delivery_date
        }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar el estado");
      showToast(newStatus ? "Marcado como entregado" : "Marcado como pendiente");
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
      .map((o) => {
        const productDetails = o.shopping_cart_id?.items?.map((item) => {
          const pName = item.name || item.product_id?.name || "Producto";
          const pQty = item.quantity || 1;
          const pPrice = item.unit_price || item.product_id?.price || 0;
          const pSubtotal = item.subtotal || (pPrice * pQty);
          const pSize = item.size || "—";
          const pColor = item.color || "—";

          let pImage = "";
          const productObj = item.product_id;
          if (productObj && Array.isArray(productObj.variants)) {
            const variant = productObj.variants.find(
              (v) => v.color?.toLowerCase() === pColor.toLowerCase()
            ) || productObj.variants[0];
            if (variant && Array.isArray(variant.images) && variant.images[0]) {
              pImage = variant.images[0].url || "";
            }
          }

          return {
            name: pName,
            quantity: pQty,
            price: pPrice,
            subtotal: pSubtotal,
            size: pSize,
            color: pColor,
            image: pImage,
          };
        }) || [];

        return {
          ...o,
          id:        o._id ?? o.id,
          client:    o.shopping_cart_id?.customer_id?.name || o.client_name || "Cliente",
          payment:   o.payment_method,
          total:     Number(o.total_amount ?? 0),
          orderedAt: o.ordered_at?.split("T")[0],
          address:   o.delivery_address,
          delivered: o.order_status === true,
          products:  productDetails,
        };
      });
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