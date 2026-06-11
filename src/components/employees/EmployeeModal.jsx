// src/components/employees/EmployeeModal.jsx
import React from 'react';

export default function EmployeeModal({
  id,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  phone_number,
  setPhoneNumber,
  position,
  setPosition,
  hire_date,
  setHireDate,
  address,
  setAddress,
  status,
  setStatus,
  is_verified,
  setIsVerified,
  onSubmit,
  onClose,
  submitting,
  error,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] modal-panel border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-base font-bold tracking-tight text-slate-800">
              {id ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>
            <p className="text-xs text-slate-400">Completa los datos del personal interno</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto modal-scroll space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="input-label">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Nombre del empleado"
                required
                disabled={submitting}
              />
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="correo@empresa.com"
                required
                disabled={submitting}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="input-label">
                Contraseña {id && <span className="text-[10px] text-slate-400 font-normal">(Vacío para no cambiar)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required={!id}
                disabled={submitting}
              />
            </div>

            {/* Teléfono y Cargo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Teléfono</label>
                <input
                  type="text"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input"
                  placeholder="+503 7777-7777"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="input-label">Cargo</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="input"
                  placeholder="Ej. Gerente, Vendedor"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Fecha Contratación */}
            <div>
              <label className="input-label">Fecha de Contratación</label>
              <input
                type="date"
                value={hire_date}
                onChange={(e) => setHireDate(e.target.value)}
                className="input"
                disabled={submitting}
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="input-label">Dirección</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input"
                placeholder="Dirección residencial"
                disabled={submitting}
              />
            </div>

            {/* Checkboxes de Estado y Verificación */}
            <div className="flex gap-6 py-2 border-t border-slate-100 mt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  disabled={submitting}
                />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Empleado Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  checked={is_verified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  disabled={submitting}
                />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Correo Verificado</span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-medium transition-colors cursor-pointer"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Guardando...' : id ? 'Actualizar' : 'Guardar Empleado'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
