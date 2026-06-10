// src/components/shared/DeleteConfirmModal.jsx

export default function DeleteConfirmModal({ onCancel, onConfirm, productName }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">

        {/* Ícono */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center">
              <i className="fa-solid fa-trash text-rose-500 text-2xl" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
              <i className="fa-solid fa-exclamation text-rose-600 text-xs font-black" />
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">¿Eliminar producto?</h3>
          {productName ? (
            <p className="text-sm text-slate-500 leading-relaxed">
              Estás a punto de eliminar{' '}
              <span className="font-semibold text-slate-700">"{productName}"</span>.
              Esta acción no se puede deshacer.
            </p>
          ) : (
            <p className="text-sm text-slate-500 leading-relaxed">
              Esta acción eliminará el registro seleccionado y no podrá deshacerse.
            </p>
          )}
        </div>

        {/* Aviso */}
        <div className="mx-6 mb-5 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
          <i className="fa-solid fa-shield-halved text-rose-500 text-sm shrink-0" />
          <span className="text-xs font-semibold text-rose-700">Esta acción es permanente.</span>
        </div>

        {/* Botones */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 active:scale-[0.98] transition shadow-lg shadow-rose-200"
          >
            <i className="fa-solid fa-trash mr-1.5" />
            Eliminar
          </button>
        </div>

      </div>
    </div>
  );
}