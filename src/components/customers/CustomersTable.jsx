// src/components/clients/ClientsTable.jsx

const fmtDate = (d) => {
  if (!d) return '—';
  const [y, m, da] = d.split('-');
  return `${da}/${m}/${y}`;
};

export default function ClientsTable({ clients, onToggle, onToggleVerified, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr className="text-left">
              {['Nombre','Correo','Contraseña','Estado','N. Teléfono','F. Creado','Dirección','Verificado','Acciones'].map(h => (
                <th key={h} className={`px-5 py-3 font-semibold${h === 'Acciones' ? ' text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(c => (
              <tr key={c.id} className="product-row">
                <td className="px-5 py-4 font-semibold text-slate-900">{c.name}</td>
                <td className="px-5 py-4 text-slate-500 max-w-[180px]">
                  <div className="truncate" title={c.email}>{c.email}</div>
                </td>
                <td className="px-5 py-4 text-slate-500 font-mono text-xs">{c.password}</td>
                <td className="px-5 py-4">
                  <span className={`status-badge ${c.active ? 'status-active' : 'status-inactive'}`}>
                    <i className="fa-solid fa-circle text-[7px]" />
                    {c.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{c.phone || '—'}</td>
                <td className="px-5 py-4 text-slate-600">{fmtDate(c.createdAt)}</td>
                <td className="px-5 py-4 text-slate-600 max-w-[160px]">
                  <div className="truncate" title={c.address}>{c.address || '—'}</div>
                </td>
                <td className="px-5 py-4 text-center">
                  {c.verified
                    ? <i className="fa-solid fa-check text-emerald-500" />
                    : <i className="fa-solid fa-xmark text-rose-500" />}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button title={c.active ? 'Desactivar' : 'Activar'} onClick={() => onToggle(c.id)} className="icon-btn text-slate-600">
                      <i className={`fa-solid fa-${c.active ? 'pause' : 'play'}`} />
                    </button>
                    <button title="Editar" onClick={() => onEdit(c)} className="icon-btn text-indigo-600 hover:bg-indigo-50">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button title="Eliminar" onClick={() => onDelete(c.id)} className="icon-btn text-rose-600 hover:bg-rose-50">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {clients.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          <i className="fa-regular fa-folder-open text-3xl mb-3 text-slate-300 block" />
          <p>No hay clientes que coincidan.</p>
        </div>
      )}
    </section>
  );
}