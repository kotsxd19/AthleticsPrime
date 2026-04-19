// src/components/shared/Toast.jsx

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm flex items-center gap-2">
        <i className="fa-solid fa-circle-check text-emerald-400" />
        <span>{message}</span>
      </div>
    </div>
  );
}