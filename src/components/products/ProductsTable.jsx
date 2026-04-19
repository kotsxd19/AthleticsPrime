// src/components/products/ProductsTable.jsx

const qtyClasses = (qty) => {
  if (qty === 0)   return 'bg-rose-50 text-rose-600';
  if (qty <= 5)   return 'bg-amber-50 text-amber-600';
  if (qty >= 20)  return 'bg-emerald-50 text-emerald-600';
  return 'bg-slate-100 text-slate-600';
};

const genderColors = {
  'Hombre': 'bg-indigo-50 text-indigo-600',
  'Mujer':  'bg-pink-50 text-pink-600',
  'Unisex': 'bg-violet-50 text-violet-600',
  'Niño':   'bg-sky-50 text-sky-600',
};

const HEADERS = ['Nombre', 'Marca', 'Género', 'Categoría', 'Tipo', 'Talla', 'Descripción', 'Precio', 'Cantidad'];

export default function ProductsTable({ products }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm shadow-slate-200/60 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">

          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              {HEADERS.map(h => (
                <th key={h}
                  className={`font-semibold px-5 py-3 ${
                    h === 'Precio' || h === 'Cantidad'
                      ? 'text-right' : 'text-left'
                  }`}
                >{h}</th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.map(p => (
              <tr key={p.id} className="product-row">
                <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                <td className="px-5 py-4">{p.brand}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${genderColors[p.gender] || 'bg-slate-100 text-slate-600'}`}>
                    {p.gender}
                  </span>
                </td>
                <td className="px-5 py-4">{p.cat}</td>
                <td className="px-5 py-4 text-slate-500">{p.type}</td>
                <td className="px-5 py-4 font-medium">{p.size}</td>
                <td className="px-5 py-4 text-slate-500 max-w-[260px] truncate" title={p.desc}>{p.desc}</td>
                <td className="px-5 py-4 text-right font-semibold">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className={`inline-block min-w-[48px] text-center text-xs font-bold px-2.5 py-1 rounded-full ${qtyClasses(p.qty)}`}>
                    {p.qty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer tabla */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
        <span>
          Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
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