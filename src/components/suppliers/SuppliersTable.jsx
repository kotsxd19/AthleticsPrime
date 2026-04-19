// src/components/suppliers/SuppliersTable.jsx

const fmtDate = (d) => {
  if (!d) return '—';
  const [y, m, da] = d.split('-');
  return `${da}/${m}/${y}`;
};

export default function SuppliersTable({ suppliers, onToggle, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr className="text-left">
              {['Nombre','Nombre contacto','N. Teléfono','Correo','Ubicación','Estado','F. Creado','F. Act.','Acciones'].map(h => (
                <th key={h} className={`px-5 py-3 font-semibold${h === 'Acciones' ? ' text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map(s => (
              <tr key={s.id} className="product-row">
                <td className="px-5 py-4 font-semibold text-slate-900">{s.name}</td>
                <td className="px-5 py-4 text-slate-600">{s.contact}</td>
                <td className="px-5 py-4 text-slate-600">{s.phone || '—'}</td>
                <td className="px-5 py-4 text-slate-500 max-w-[200px]">
                  <div className="truncate" title={s.email}>{s.email || '—'}</div>
                </td>
                <td className="px-5 py-4 text-slate-600 max-w-[160px]">
                  <div className="truncate" title={s.location}>{s.location || '—'}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`status-badge ${s.active ? 'status-active' : 'status-inactive'}`}>
                    <i className="fa-solid fa-circle text-[7px]" />
                    {s.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">{fmtDate(s.createdAt)}</td>
                <td className="px-5 py-4 text-slate-600">{fmtDate(s.updatedAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button title={s.active ? 'Desactivar' : 'Activar'} onClick={() => onToggle(s.id)} className="icon-btn text-slate-600">
                      <i className={`fa-solid fa-${s.active ? 'pause' : 'play'}`} />
                    </button>
                    <button title="Editar" onClick={() => onEdit(s)} className="icon-btn text-indigo-600 hover:bg-indigo-50">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button title="Eliminar" onClick={() => onDelete(s.id)} className="icon-btn text-rose-600 hover:bg-rose-50">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {suppliers.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          <i className="fa-regular fa-folder-open text-3xl mb-3 text-slate-300 block" />
          <p>No hay proveedores que coincidan.</p>
        </div>
      )}
    </section>
  );
}