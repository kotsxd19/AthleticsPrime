// src/components/offers/OffersTable.jsx

const fmtDate = (d) => {
  if (!d) return '\u2014';
  const [y, m, da] = d.split('-');
  return `${da}/${m}/${y}`;
};

export default function OffersTable({ offers, onToggle, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr className="text-left">
              {['Título','Descripción','Inicio','Fin','Descuento','Productos','Estado','Acciones'].map(h => {
                const thClass = 'px-5 py-3 font-semibold' + (h === 'Acciones' ? ' text-right' : '');
                return <th key={h} className={thClass}>{h}</th>;
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {offers.map(o => (
              <tr key={o.id} className="product-row">

                {/* Título + código */}
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-900">{o.title}</div>
                </td>

                {/* Descripción + tipo */}
                <td className="px-5 py-4 text-slate-600 max-w-[220px]">
                  <div className="truncate" title={o.desc}>{o.desc || '\u2014'}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{o.type}</div>
                </td>

                <td className="px-5 py-4 text-slate-600">{fmtDate(o.start)}</td>
                <td className="px-5 py-4 text-slate-600">{fmtDate(o.end)}</td>
                <td className="px-5 py-4">
                  <span className="font-bold text-indigo-600">{o.disc}%</span>
                </td>

                {/* Productos tags */}
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {(o.products || []).slice(0, 2).map(p => (
                      <span key={p} className="prod-tag">{p}</span>
                    ))}
                    {(o.products || []).length > 2 && (
                      <span className="prod-tag">+{o.products.length - 2}</span>
                    )}
                  </div>
                </td>

                {/* Estado */}
                <td className="px-5 py-4">
                  <span className={`status-badge ${o.active ? 'status-active' : 'status-inactive'}`}>
                    <i className="fa-solid fa-circle text-[7px]" />
                    {o.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title={o.active ? 'Desactivar' : 'Activar'}
                      onClick={() => onToggle(o.id)}
                      className="icon-btn text-slate-600"
                    >
                      <i className={`fa-solid fa-${o.active ? 'pause' : 'play'}`} />
                    </button>
                    <button title="Editar" onClick={() => onEdit(o)} className="icon-btn text-indigo-600 hover:bg-indigo-50">
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button title="Eliminar" onClick={() => onDelete(o.id)} className="icon-btn text-rose-600 hover:bg-rose-50">
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {offers.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          <i className="fa-regular fa-folder-open text-3xl mb-3 text-slate-300 block" />
          <p>No hay ofertas que coincidan.</p>
        </div>
      )}
    </section>
  );
}