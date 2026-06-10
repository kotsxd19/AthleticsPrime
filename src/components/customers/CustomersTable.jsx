import React from "react";

const CustomersTable = ({
  dataTest,
  clients,
  loading,
  error,
  onEdit,
  onDelete,
}) => {
  const rows = dataTest ?? clients ?? [];
  
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-600">
          Cargando datos...
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-gray-600">
          No hay clientes disponibles.
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold">Correo</th>
                <th className="px-5 py-3 font-semibold">Nombre</th>
                <th className="px-5 py-3 font-semibold">Contraseña</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">N. Teléfono</th>
                <th className="px-5 py-3 font-semibold">F. Creado</th>
                <th className="px-5 py-3 font-semibold">Dirección</th>
                <th className="px-5 py-3 font-semibold">Verificado</th>
                <th className="px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.id} className="product-row">
                  <td className="px-5 py-4 font-semibold text-slate-900 max-w-[180px] break-all">{c.email}</td>
                  <td className="px-5 py-4 text-slate-500 max-w-[180px]"> {c.name} </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-xs max-w-[120px] truncate">{c.password}</td>
                  <td className="px-5 py-4">
                    <span className={`status-badge ${c.status ? 'status-active' : 'status-inactive'}`}>
                      <i className="fa-solid fa-circle text-[7px]" />
                      {c.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{c.phone_number || '—'}</td>
                  <td className="px-5 py-4 text-slate-600 truncate max-w-[135px]">{c.registered_at || '—'}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-[160px]">
                    <div className="truncate" title={c.address}>{c.address || '—'}</div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {c.is_verified
                      ? <i className="fa-solid fa-check text-emerald-500" />
                      : <i className="fa-solid fa-xmark text-rose-500" />}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button title={c.status ? 'Desactivar' : 'Activar'} onClick={() => onEdit(c)} className="icon-btn text-slate-600">
                        <i className={`fa-solid fa-${c.status ? 'pause' : 'play'}`} />
                      </button>
                      <button title="Editar" onClick={() => onEdit(c)} className="icon-btn text-indigo-600 hover:bg-indigo-50">
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button 
                      type="button" 
                      onClick={() => onDelete(c.id)} 
                      className="icon-btn text-rose-600 hover:bg-rose-50">
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





export default CustomersTable;