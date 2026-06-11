// src/components/employees/EmployeesTable.jsx
import React from "react";

export default function EmployeesTable({
  employees,
  loading,
  error,
  onEdit,
  onDelete,
  onToggle,
  onToggleVerified,
}) {
  const rows = employees || [];
  
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-600 m-4">
          Cargando datos...
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 m-4">
          {error}
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-slate-600 m-4">
          No hay empleados disponibles.
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Cargo</th>
                <th className="px-5 py-3 font-semibold">Teléfono</th>
                <th className="px-5 py-3 font-semibold">F. Contratación</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Verificado</th>
                <th className="px-5 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((emp) => (
                <tr key={emp._id || emp.id} className="product-row">
                  <td className="px-5 py-4 font-semibold text-slate-900 max-w-[180px] break-words">{emp.name}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-[180px] break-all">{emp.email}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {emp.position || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{emp.phoneNumber || emp.phone_number || '—'}</td>
                  <td className="px-5 py-4 text-slate-600 truncate max-w-[135px]">
                    {emp.hireDate ? emp.hireDate.split("T")[0] : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onToggle(emp)}
                      title={emp.status ? 'Desactivar empleado' : 'Activar empleado'}
                      className="cursor-pointer"
                    >
                      <span className={`status-badge ${emp.status ? 'status-active' : 'status-inactive'}`}>
                        <i className="fa-solid fa-circle text-[7px]" />
                        {emp.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => onToggleVerified(emp)}
                      title={(emp.isVerified || emp.is_verified) ? 'Desmarcar verificado' : 'Marcar verificado'}
                      className="cursor-pointer text-base"
                    >
                      {(emp.isVerified || emp.is_verified)
                        ? <i className="fa-solid fa-circle-check text-emerald-500 hover:text-emerald-600" />
                        : <i className="fa-solid fa-circle-xmark text-rose-400 hover:text-rose-500" />}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Editar" onClick={() => onEdit(emp)} className="icon-btn text-indigo-600 hover:bg-indigo-50 cursor-pointer">
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onDelete(emp._id || emp.id)} 
                        className="icon-btn text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Eliminar"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
