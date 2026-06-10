import React, { useState, useEffect } from 'react';

const CustomerForm = ({

    id,
    email,
    setEmail,
    name,
    setName,
    password,
    setPassword,
    status,
    setStatus,
    phone_number,
    setPhoneNumber,
    registered_at,
    setRegisteredAt,
    is_verified,
    setIsVerified,
    address,
    setAddress,
    onSubmit,
    onCancel,
    submitting,
    onClose,
    error,
    message,
}) => {
  return(

     <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
 
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900">
              {client ? 'Editar cliente' : 'Nuevo cliente'}
            </h3>
            <p className="text-xs text-gray-500">Completa los datos del cliente</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
 
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ingresa el nombre"
                required
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ingresa el correo electrónico"
                required
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="text"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                value={form.phone_number}
                onChange={e => set('phone_number', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ingresa el teléfono"
              />
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Ingresa la dirección"
              />
            </div>
 
            <div className="flex gap-6 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={!!form.status}
                  onChange={e => set('status', e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">Cliente activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={!!form.is_verified}
                  onChange={e => set('is_verified', e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">Cliente verificado</span>
              </label>
            </div>
 
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : client ? 'Actualizar cliente' : 'Guardar cliente'}
              </button>
            </div>
          </form>
        </div>
 
      </div>
    </div>
  );
}

export default CustomerForm;