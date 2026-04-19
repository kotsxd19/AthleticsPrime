// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar     from './components/shared/Navbar';
import Dashboard  from './pages/Dashboard';
import Offers     from './pages/Offers';
import Products   from './pages/Products';
import Login      from './pages/Login';

/*
  Páginas futuras — descomenta cuando estén listas:
  import Suppliers from './pages/Suppliers';
  import Clients   from './pages/Clients';
  import Orders    from './pages/Orders';
*/

export default function App() {
  const { pathname } = useLocation();

  // Rutas donde NO se muestra el Navbar
  const hideNavbar = ['/login'].includes(pathname);

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-[#0f172a]">

      {/* Navbar — oculto en /login */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />}     />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offers"   element={<Offers />}    />
        <Route path="/products" element={<Products />}  />

        {/* Futuras rutas */}
        {/* <Route path="/suppliers" element={<Suppliers />} /> */}
        {/* <Route path="/clients"   element={<Clients />}   /> */}
        {/* <Route path="/orders"    element={<Orders />}    /> */}

        {/* Ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </div>
  );
}