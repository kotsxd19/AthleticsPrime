// src/components/shared/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/LogoLetras.png";
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Inicio',      to: '/dashboard' },
  { label: 'Ofertas',     to: '/offers'    },
  { label: 'Productos',   to: '/products'  },
  { label: 'Novedades',   to: '/news'      },
  { label: 'Proveedores', to: '/suppliers' },
  { label: 'Empleados',   to: '/employees' },
  { label: 'Clientes',    to: '/customers' },
  { label: 'Pedidos',     to: '/orders'    },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { pathname } = useLocation();
  const { user, logoutUser } = useAuth();

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filtrar enlaces de navegación según el rol del usuario
  const filteredLinks = navLinks.filter(({ to, label }) => {
    if (user?.role === 'employee' && to === '/employees') {
      // Los empleados no deben gestionar a otros empleados
      return false;
    }
    if (label === 'Cliente' && user?.role !== 'admin') {
      // Solo el administrador debe poder ver la opción de Cliente
      return false;
    }
    return true; // Acceso general
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={user?.role === 'customer' ? '/orders' : '/dashboard'} className="flex items-center gap-2">
            <img src={logo} alt="" className='w-45 h-16' />
            <span className="font-bold text-lg tracking-tight">Prime Athletics</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8 text-slate-500 text-sm font-medium">
            {filteredLinks.map(({ label, to, external }) => (
              external ? (
                <a
                  key={to}
                  href={to}
                  className="nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link ${pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              )
            ))}
          </nav>

          {/* Avatar + botón móvil */}
          <div className="flex items-center gap-3">
            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-semibold flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200"
              >
                {getInitials(user?.name)}
              </button>

              {showDropdown && (
                <>
                  {/* Backdrop para cerrar haciendo click afuera */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-pop">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-800 truncate">{user?.name || 'Usuario'}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 cursor-pointer transition-colors duration-200"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Hamburguesa Móvil */}
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              <i className="fa-solid fa-bars text-slate-600" />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-slate-600 font-medium border-t border-slate-100 pt-3">
            {filteredLinks.map(({ label, to, external }) => (
              external ? (
                <a
                  key={to}
                  href={to}
                  className="hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  className="hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </header>
  );
}