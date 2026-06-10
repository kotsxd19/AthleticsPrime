// src/components/products/ProductsTable.jsx

const qtyClasses = (qty) => {
  if (qty === 0)  return 'bg-rose-50 text-rose-700 border border-rose-200';
  if (qty <= 5)   return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (qty >= 20)  return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  return 'bg-slate-100 text-slate-600 border border-slate-200';
};

const qtyIcon = (qty) => {
  if (qty === 0)  return <i className="fa-solid fa-circle-xmark mr-1 text-rose-400" />;
  if (qty <= 5)   return <i className="fa-solid fa-triangle-exclamation mr-1 text-amber-400" />;
  if (qty >= 20)  return <i className="fa-solid fa-circle-check mr-1 text-emerald-400" />;
  return null;
};

const genderStyle = {
  'Hombres': 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Hombre':  'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Mujeres': 'bg-pink-50 text-pink-700 border border-pink-200',
  'Mujer':   'bg-pink-50 text-pink-700 border border-pink-200',
  'Unisex':  'bg-violet-50 text-violet-700 border border-violet-200',
  'Ninos':   'bg-sky-50 text-sky-700 border border-sky-200',
  'Niño':    'bg-sky-50 text-sky-700 border border-sky-200',
  'Ninas':   'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
  'Niña':    'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
};

const brandStyle = {
  'nike':   'bg-slate-900 text-white',
  'adidas': 'bg-blue-600 text-white',
  'puma':   'bg-red-600 text-white',
};

const brandIcon = {
  'nike':   'fa-solid fa-n',
  'adidas': 'fa-solid fa-a',
  'puma':   'fa-solid fa-p',
};

const categoryStyle = {
  'Ropa':    'bg-orange-50 text-orange-700 border border-orange-200',
  'Zapatos': 'bg-teal-50 text-teal-700 border border-teal-200',
  'Calzado': 'bg-teal-50 text-teal-700 border border-teal-200',
};

const HEADERS = [
  { label: 'Nombre',      align: 'left'  },
  { label: 'Marca',       align: 'left'  },
  { label: 'Género',      align: 'left'  },
  { label: 'Categoría',   align: 'left'  },
  { label: 'Tipo',        align: 'left'  },
  { label: 'Talla',       align: 'left'  },
  { label: 'Descripción', align: 'left'  },
  { label: 'Precio',      align: 'right' },
  { label: 'Cantidad',    align: 'right' },
  { label: 'Acciones',    align: 'right' },
];

export default function ProductsTable({ products, onView, onEdit, onDelete }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">

          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              {HEADERS.map(h => (
                <th
                  key={h.label}
                  className={`font-semibold px-5 py-3 text-${h.align}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                  <i className="fa-solid fa-box-open text-3xl mb-2 block" />
                  Sin productos para mostrar
                </td>
              </tr>
            )}

            {products.map(p => (
              <tr
                key={p.id}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                onClick={() => onView(p)}
              >
                {/* Nombre */}
                <td className="px-5 py-4 font-semibold text-slate-900 whitespace-nowrap">
                  {p.name}
                </td>

                {/* Marca */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      brandStyle[p.brand?.toLowerCase()] ?? 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p.brand}
                  </span>
                </td>

                {/* Género */}
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      genderStyle[p.gender] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {p.gender}
                  </span>
                </td>

                {/* Categoría */}
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryStyle[p.cat] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {p.cat}
                  </span>
                </td>

                {/* Tipo */}
                <td className="px-5 py-4 text-slate-500">{p.type}</td>

                {/* Talla */}
                <td className="px-5 py-4">
                  <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {p.size}
                  </span>
                </td>

                {/* Descripción */}
                <td
                  className="px-5 py-4 text-slate-500 max-w-[220px] truncate"
                  title={p.desc}
                >
                  {p.desc || <span className="text-slate-300 italic">Sin descripción</span>}
                </td>

                {/* Precio */}
                <td className="px-5 py-4 text-right font-semibold text-slate-900 whitespace-nowrap">
                  ${p.price.toFixed(2)}
                </td>

                {/* Cantidad */}
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-flex items-center min-w-[54px] justify-center text-xs font-bold px-2.5 py-1 rounded-full ${qtyClasses(p.qty)}`}
                  >
                    {qtyIcon(p.qty)}
                    {p.qty}
                  </span>
                </td>

                {/* Acciones — detener propagación para que no dispare onView */}
                <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      title="Ver detalle"
                      onClick={() => onView(p)}
                      className="icon-btn text-slate-500 hover:bg-slate-100"
                    >
                      <i className="fa-solid fa-eye" />
                    </button>
                    <button
                      title="Editar"
                      onClick={() => onEdit(p)}
                      className="icon-btn text-indigo-600 hover:bg-indigo-50"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => onDelete(p.id)}
                      className="icon-btn text-rose-600 hover:bg-rose-50"
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

      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
        <span>
          Mostrando <span className="font-semibold text-slate-700">{products.length}</span>{' '}
          producto{products.length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white">1</button>
          <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition">
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}