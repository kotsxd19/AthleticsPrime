import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/customers";

const useCustomer = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [registered_at, setRegisteredAt] = useState("");
  const [is_verified, setIsVerified] = useState("");
  const [address, setAddress] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const resetForm = () => {
    setId("");
    setName("");
    setEmail("");
    setPassword("");
    setStatus("");
    setPhoneNumber("");
    setRegisteredAt("");
    setIsVerified("");
    setAddress("");
  };

  const openCreateForm = () => {
    resetForm();
    setMessage("");
    setActiveTab("form");
  };

  const handleEdit = (item) => {
    setId(item.id);
    setName(item.name ?? "");
    setEmail(item.email ?? "");
    setPassword(item.password ?? "");
    setStatus(item.status ?? "");
    setPhoneNumber(item.phone_number ?? "");
    setRegisteredAt(item.registered_at ?? "");
    setIsVerified(item.is_verified ?? "");
    setAddress(item.address ?? "");
    setMessage("");
    setActiveTab("form");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) { setError("El nombre es obligatorio"); return; }
    if (!trimmedEmail) { setError("El email es obligatorio"); return; }
    if (!trimmedPassword) { setError("La contraseña es obligatoria"); return; }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = { name: trimmedName, email: trimmedEmail, password: trimmedPassword, phone_number, address, status, is_verified };

      const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(id ? "No se pudo actualizar" : "No se pudo crear");

      setMessage(id ? "Registro actualizado correctamente" : "Registro creado correctamente");
      resetForm();
      setActiveTab("list");
      fetchDataTest();
    } catch (submitError) {
      setError(submitError.message || "Error al guardar el registro");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    const shouldDelete = typeof window === "undefined" ? true : window.confirm("¿Deseas eliminar este cliente?");
    if (!shouldDelete) return;

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${itemId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el cliente");
      setMessage("Cliente eliminado correctamente");
      await fetchDataTest();
      if (String(id) === String(itemId)) { resetForm(); setActiveTab("list"); }
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar el cliente");
    }
  };

  const toggleClient = async (client) => {
    try {
      const response = await fetch(`${API_URL}/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, status: !client.status }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar el estado");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al cambiar estado");
    }
  };

  const toggleVerified = async (client) => {
    try {
      const response = await fetch(`${API_URL}/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...client, is_verified: !client.is_verified }),
      });
      if (!response.ok) throw new Error("No se pudo cambiar la verificación");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al cambiar verificación");
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return {
      active:   list.filter((c) => c.status === true  || c.status === "true").length,
      inactive: list.filter((c) => c.status === false || c.status === "false").length,
      verified: list.filter((c) => c.is_verified === true || c.is_verified === "true").length,
      total:    list.length,
    };
  }, [dataTest]);

  const filtered = useMemo(() => {
    const list = Array.isArray(dataTest) ? dataTest : [];
    return list
      .filter((c) => {
        if (filter === "active")   return c.status === true  || c.status === "true";
        if (filter === "inactive") return c.status === false || c.status === "false";
        return true;
      })
      .filter((c) => {
        if (!search.trim()) return true;
        const s = search.toLowerCase();
        return (
          c.name?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s) ||
          c.address?.toLowerCase().includes(s)
        );
      });
  }, [dataTest, filter, search]);

  return {
    activeTab, setActiveTab,
    dataTest, filtered,
    loading, submitting, error, message,
    id, name, setName, email, setEmail, password, setPassword,
    status, setStatus, phone_number, setPhoneNumber,
    registered_at, setRegisteredAt, is_verified, setIsVerified,
    address, setAddress,
    filter, setFilter, search, setSearch,
    stats,
    fetchDataTest,
    openCreate: openCreateForm,
    openEdit: handleEdit,
    closeModal: resetForm,
    saveClient: handleSubmit,
    toggleClient,
    toggleVerified,
    deleteClient: handleDelete,
    openCreateForm, handleEdit, handleSubmit, handleDelete,
    toast: message,
  };
};

export default useCustomer;