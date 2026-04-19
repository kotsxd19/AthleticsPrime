// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/LogoLetras.png";
import LogoLetras from "../../assets/LogoLetras.png"

const navLinks = [
  { label: 'Inicio',      to: '/dashboard' },
  { label: 'Ofertas',     to: '/offers'    },
  { label: 'Productos',   to: '/products'  },
  { label: 'Proveedores', to: '/suppliers' },
  { label: 'Clientes',    to: '/clients'   },
  { label: 'Pedidos',     to: '/orders'    },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="" className='w-45 h-16' />
            <span className="font-bold text-lg tracking-tight">Prime Athletics</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8 text-slate-500 text-sm font-medium">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Avatar + botón móvil */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-semibold flex items-center justify-center">
              JD
            </div>
            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <i className="fa-solid fa-bars text-slate-600" />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-slate-600 font-medium">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}