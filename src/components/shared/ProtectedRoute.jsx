import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-semibold animate-pulse">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb] p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-rose-100 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Acceso Denegado</h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              No tienes los permisos necesarios para acceder a esta sección. Esta área está restringida a personal autorizado.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-semibold shadow-md transition duration-200"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // If role is authorized or no specific roles are set, render nested routes
  return <Outlet />;
}
