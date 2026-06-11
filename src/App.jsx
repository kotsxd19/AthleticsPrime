// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar     from './components/shared/Navbar';
import Dashboard  from './pages/Dashboard';
import Offers     from './pages/Offers';
import Products   from './pages/Products';
import Login      from './pages/Login';
import Suppliers  from './pages/supplier';
import Employees  from './pages/Employees';
import Orders    from './pages/Orders';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Customers from './pages/Customers';
import News from './pages/News';

/*
  Páginas futuras — descomenta cuando estén listas:

  
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

        {/* Rutas de personal (administradores y empleados) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'employee']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/offers"   element={<Offers />}    />
          <Route path="/products" element={<Products />}  />
          <Route path="/news"     element={<News />}      />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/orders"    element={<Orders />}    />
          <Route path="/customers" element={<Customers />}    />
        </Route>

        {/* Rutas exclusivas de administradores */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/employees"   element={<Employees />}   /> 
        </Route>

        {/* Ruta desconocida → login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

    </div>
  );
}