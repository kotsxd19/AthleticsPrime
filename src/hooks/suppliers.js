// src/hooks/useSuppliers.js
import { useState, useMemo } from 'react';

const initialSuppliers = [
  { id: 1, name: 'Elite Sports Supply',   contact: 'Carlos Méndez',    phone: '+503 7123 4589', email: 'ventas@elitesportsv.com',          location: 'San Salvador, El Salvador', active: false, createdAt: '2026-01-01', updatedAt: null         },
  { id: 2, name: 'ProFit Distribuciones', contact: 'Andrea López',     phone: '+503 7456 9821', email: 'contacto@profitdistribuciones.com', location: 'Santa Ana, El Salvador',    active: true,  createdAt: '2026-02-01', updatedAt: '2026-03-01' },
  { id: 3, name: 'MaxPower Athletics',    contact: 'José Ramírez',     phone: '+503 7890 3345', email: 'info@maxpowerathletics.com',        location: 'San Miguel, El Salvador',   active: false, createdAt: '2026-01-01', updatedAt: null         },
  { id: 4, name: 'ActiveGear Import',     contact: 'Daniela Torres',   phone: '+503 7211 6678', email: 'soporte@activegearimport.com',      location: 'La Libertad, El Salvador',  active: false, createdAt: '2026-01-01', updatedAt: null         },
  { id: 5, name: 'Titan Sports Group',    contact: 'Miguel Hernández', phone: '+503 7564 2290', email: 'ventas@titansportsgroup.com',       location: 'Sonsonate, El Salvador',    active: true,  createdAt: '2026-02-01', updatedAt: '2026-03-01' },
  { id: 6, name: 'Prime Fitness Supply',  contact: 'Valeria Castillo', phone: '+503 7389 1144', email: 'administracion@primefitness.com',   location: 'San Salvador, El Salvador', active: false, createdAt: '2026-02-01', updatedAt: '2026-03-01' },
  { id: 7, name: 'Dynamic Sports Wear',   contact: 'Roberto Cruz',     phone: '+503 7702 5569', email: 'pedidos@dynamicsportswear.com',     location: 'Usulután, El Salvador',     active: true,  createdAt: '2026-01-01', updatedAt: null         },
  { id: 8, name: 'Stronger Equipment',    contact: 'Fernanda Molina',  phone: '+503 7998 4412', email: 'ventas@strongerequipment.com',      location: 'Santa Tecla, El Salvador',  active: true,  createdAt: '2026-02-01', updatedAt: '2026-03-01' },
];

export function useSuppliers() {
  const [suppliers, setSuppliers]             = useState(initialSuppliers);
  const [filter, setFilter]                   = useState('all');
  const [search, setSearch]                   = useState('');
  const [modalOpen, setModalOpen]             = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [toast, setToast]                     = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = useMemo(() => suppliers.filter(s => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'active'   && s.active) ||
      (filter === 'inactive' && !s.active);
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.contact.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }), [suppliers, filter, search]);

  const stats = useMemo(() => ({
    active:   suppliers.filter(s => s.active).length,
    inactive: suppliers.filter(s => !s.active).length,
    total:    suppliers.length,
  }), [suppliers]);

  const openCreate  = ()  => { setEditingSupplier(null); setModalOpen(true); };
  const openEdit    = (s) => { setEditingSupplier(s);    setModalOpen(true); };
  const closeModal  = ()  => { setModalOpen(false); setEditingSupplier(null); };

  const saveSupplier = (data) => {
    const today = new Date().toISOString().split('T')[0];
    if (data.id) {
      setSuppliers(prev => prev.map(s => s.id === data.id ? { ...data, updatedAt: today } : s));
      showToast('Proveedor actualizado');
    } else {
      setSuppliers(prev => [...prev, { ...data, id: Date.now(), createdAt: today, updatedAt: null }]);
      showToast('Proveedor creado');
    }
    closeModal();
  };

  const toggleSupplier = (id) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast('Estado actualizado');
  };

  const deleteSupplier = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    showToast('Proveedor eliminado');
  };

  return {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingSupplier,
    toast, openCreate, openEdit,
    closeModal, saveSupplier,
    toggleSupplier, deleteSupplier,
  };
}