import { useEffect, useState, useMemo } from "react";

const API_URL = "http://localhost:4000/api/employees";
const REGISTER_URL = "http://localhost:4000/api/registerEmployees";

const useEmployees = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [dataTest, setDataTest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(true);
  const [phone_number, setPhoneNumber] = useState("");
  const [position, setPosition] = useState("");
  const [hire_date, setHireDate] = useState("");
  const [is_verified, setIsVerified] = useState(false);
  const [address, setAddress] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchDataTest = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("No se pudo obtener la información de empleados");
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
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setId("");
    setName("");
    setEmail("");
    setPassword("");
    setStatus(true);
    setPhoneNumber("");
    setPosition("");
    setHireDate("");
    setIsVerified(false);
    setAddress("");
    setModalOpen(false);
  };

  const openCreateForm = () => {
    resetForm();
    setMessage("");
    setModalOpen(true);
    setActiveTab("form");
  };

  const handleEdit = (item) => {
    setId(item._id || item.id);
    setName(item.name ?? "");
    setEmail(item.email ?? "");
    setPassword(""); // no mostrar contraseña al editar
    setStatus(item.status ?? true);
    setPhoneNumber(item.phoneNumber ?? item.phone_number ?? "");
    setPosition(item.position ?? "");
    setHireDate(item.hireDate ? item.hireDate.split("T")[0] : "");
    setIsVerified(item.isVerified ?? item.is_verified ?? false);
    setAddress(item.address ?? "");
    setMessage("");
    setModalOpen(true);
    setActiveTab("form");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedPosition = position.trim();

    if (!trimmedName) { setError("El nombre es obligatorio"); return; }
    if (!trimmedEmail) { setError("El email es obligatorio"); return; }
    if (!id && !trimmedPassword) { setError("La contraseña es obligatoria"); return; }
    if (!trimmedPosition) { setError("El cargo es obligatorio"); return; }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      // Mapear campos al payload esperado por la API del Backend (camelCase)
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phoneNumber: phone_number,
        address,
        position: trimmedPosition,
        hireDate: hire_date ? new Date(hire_date) : undefined,
        status,
        isVerified: is_verified
      };

      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }

      // Si estamos editando, usamos la URL de actualización. Si es nuevo, registramos.
      const url = id ? `${API_URL}/${id}` : REGISTER_URL;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (id ? "No se pudo actualizar" : "No se pudo registrar"));
      }

      showToast(id ? "Empleado actualizado correctamente" : "Empleado registrado. Correo de verificación enviado.");
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
    const shouldDelete = typeof window === "undefined" ? true : window.confirm("¿Deseas eliminar este empleado?");
    if (!shouldDelete) return;

    try {
      setError("");
      setMessage("");
      const response = await fetch(`${API_URL}/${itemId}`, { method: "DELETE" });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "No se pudo eliminar el empleado");
      
      showToast("Empleado eliminado correctamente");
      await fetchDataTest();
      if (String(id) === String(itemId)) { resetForm(); setActiveTab("list"); }
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar el empleado");
    }
  };

  const toggleEmployee = async (employee) => {
    try {
      const employeeId = employee._id || employee.id;
      const newStatus = !employee.status;
      const response = await fetch(`${API_URL}/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: employee.name,
          email: employee.email,
          position: employee.position,
          phoneNumber: employee.phoneNumber || employee.phone_number,
          isVerified: employee.isVerified || employee.is_verified,
          status: newStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cambiar el estado");
      
      showToast(newStatus ? "Empleado activado correctamente" : "Empleado desactivado correctamente");
      await fetchDataTest();
    } catch (e) {
      setError(e.message || "Error al cambiar estado");
    }
  };

  const toggleVerified = async (employee) => {
    try {
      const employeeId = employee._id || employee.id;
      const newVerified = !(employee.isVerified || employee.is_verified);
      const response = await fetch(`${API_URL}/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: employee.name,
          email: employee.email,
          position: employee.position,
          phoneNumber: employee.phoneNumber || employee.phone_number,
          isVerified: newVerified,
          status: employee.status,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cambiar la verificación");
      
      showToast(newVerified ? "Correo verificado correctamente" : "Verificación de correo eliminada");
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
      verified: list.filter((c) => c.isVerified === true || c.isVerified === "true" || c.is_verified === true).length,
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
          c.position?.toLowerCase().includes(s) ||
          c.address?.toLowerCase().includes(s)
        );
      });
  }, [dataTest, filter, search]);

  return {
    activeTab, setActiveTab,
    dataTest, filtered,
    loading, submitting, error, message,
    modalOpen,
    id, name, setName, email, setEmail, password, setPassword,
    status, setStatus, phone_number, setPhoneNumber,
    position, setPosition, hire_date, setHireDate, is_verified, setIsVerified,
    address, setAddress,
    filter, setFilter, search, setSearch,
    stats,
    fetchDataTest,
    openCreate: openCreateForm,
    openEdit: handleEdit,
    closeModal: resetForm,
    saveEmployee: handleSubmit,
    toggleEmployee,
    toggleVerified,
    deleteEmployee: handleDelete,
    openCreateForm, handleEdit, handleSubmit, handleDelete,
    toast: message,
  };
};

export default useEmployees;
