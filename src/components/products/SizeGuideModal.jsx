// src/components/products/SizeGuideModal.jsx
import { SIZE_GUIDE } from '../../data/products';

export default function SizeGuideModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-ruler text-indigo-600" /> Guía de tallas
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">
            Medidas en centímetros (cm). Usa una cinta métrica sobre el cuerpo sin apretar.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {['Talla', 'Pecho', 'Cintura', 'Cadera'].map(h => (
                    <th key={h} className={`px-4 py-3 font-semibold ${h === 'Talla' ? 'text-left' : 'text-center'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {SIZE_GUIDE.map(row => (
                  <tr key={row.size} className="hover:bg-indigo-50/40 transition">
                    <td className="px-4 py-2.5 font-semibold text-indigo-600">{row.size}</td>
                    <td className="text-center">{row.pecho}</td>
                    <td className="text-center">{row.cintura}</td>
                    <td className="text-center">{row.cadera}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition">
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}