// src/components/suppliers/SuppliersModal.jsx
import React, { useState, useEffect } from "react";

const empty = {
  name: "",
  contactName: "",
  phoneNumber: "",
  email: "",
  location: "",
  status: true,
};

export default function SuppliersModal({ supplier, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (supplier) {
      setForm({
        id: supplier._id || supplier.id,
        name: supplier.name || "",
        contactName: supplier.contactName || supplier.contact || "",
        phoneNumber: supplier.phoneNumber || supplier.phone || "",
        email: supplier.email || "",
        location: supplier.location || "",
        status: supplier.status !== undefined ? supplier.status : supplier.active !== false,
      });
    } else {
      setForm(empty);
    }
  }, [supplier]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contactName.trim() || !form.phoneNumber.trim() || !form.email.trim() || !form.location.trim()) {
      alert("Por favor completa todos los campos obligatorios (*).");
      return;
    }
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel bg-white w-full max-w-lg max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-800">
              {supplier ? "Editar proveedor" : "Nuevo proveedor"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Completa los datos obligatorios del proveedor
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-slate-600" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Info section */}
          <div className="form-section space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i className="fa-solid fa-truck" /> Información del proveedor
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="input-label">Nombre del proveedor *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Ej. Elite Sports Supply"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Nombre de contacto *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Ej. Carlos Méndez"
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">N. Teléfono *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Ej. +503 7123 4589"
                  value={form.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Correo electrónico *</label>
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="Ej. ventas@empresa.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Ubicación *</label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Ej. San Salvador, El Salvador"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status section */}
          <div className="form-section pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
              <i className="fa-solid fa-toggle-on" /> Estado
            </h4>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                checked={form.status}
                onChange={(e) => set("status", e.target.checked)}
              />
              <span className="text-sm font-semibold text-slate-700">Proveedor activo</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-medium border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-check" /> Guardar proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}