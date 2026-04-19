// src/hooks/useClients.js
import { useState, useMemo } from 'react';

const initialClients = [
  { id: 1, name: 'Luis Martínez',    email: 'lmartinez@gmail.com',    password: 'Lm2026#sv',  phone: '+503 7123 4567', createdAt: '2026-01-12', address: 'San Salvador, El Salvador', verified: true,  active: false },
  { id: 2, name: 'María Gómez',      email: 'maria.gomez@gmail.com',  password: 'MgFit@26',   phone: '+503 7345 8899', createdAt: '2026-01-18', address: 'Santa Ana, El Salvador',    verified: false, active: true  },
  { id: 3, name: 'Kevin López',      email: 'kevinlopez@hotmail.com', password: 'KL_2026!',   phone: '+503 7456 1122', createdAt: '2026-01-25', address: 'San Miguel, El Salvador',   verified: true,  active: false },
  { id: 4, name: 'Daniela Reyes',    email: 'danireyes@gmail.com',    password: 'DrGym#26',   phone: '+503 7567 3344', createdAt: '2026-02-02', address: 'La Libertad, El Salvador',  verified: false, active: false },
  { id: 5, name: 'Jorge Castillo',   email: 'jcastillo@yahoo.com',    password: 'JcPower26*', phone: '+503 7678 5566', createdAt: '2026-02-05', address: 'Sonsonate, El Salvador',    verified: true,  active: true  },
  { id: 6, name: 'Fernanda Cruz',    email: 'fernandacruz@gmail.com', password: 'FcSport@1',  phone: '+503 7789 7788', createdAt: '2026-02-10', address: 'San Salvador, El Salvador', verified: false, active: false },
  { id: 7, name: 'Ricardo Méndez',   email: 'ricardom@gmail.com',     password: 'RmAthl3te',  phone: '+503 7890 9900', createdAt: '2026-02-15', address: 'Usulután, El Salvador',     verified: true,  active: true  },
  { id: 8, name: 'Valeria Torres',   email: 'valeriatorresg@gmail.com',password: 'VtRun#26',  phone: '+503 7901 2233', createdAt: '2026-02-20', address: 'Santa Tecla, El Salvador',  verified: false, active: true  },
];

export function useClients() {
  const [clients, setClients]             = useState(initialClients);
  const [filter, setFilter]               = useState('all');
  const [search, setSearch]               = useState('');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [toast, setToast]                 = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = useMemo(() => clients.filter(c => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'active'   && c.active) ||
      (filter === 'inactive' && !c.active);
    const q = search.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }), [clients, filter, search]);

  const stats = useMemo(() => ({
    active:   clients.filter(c => c.active).length,
    inactive: clients.filter(c => !c.active).length,
    verified: clients.filter(c => c.verified).length,
    total:    clients.length,
  }), [clients]);

  const openCreate = ()  => { setEditingClient(null); setModalOpen(true); };
  const openEdit   = (c) => { setEditingClient(c);    setModalOpen(true); };
  const closeModal = ()  => { setModalOpen(false); setEditingClient(null); };

  const saveClient = (data) => {
    if (data.id) {
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
      showToast('Cliente actualizado');
    } else {
      setClients(prev => [...prev, { ...data, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
      showToast('Cliente creado');
    }
    closeModal();
  };

  const toggleClient = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
    showToast('Estado actualizado');
  };

  const toggleVerified = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
    showToast('Verificación actualizada');
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
    showToast('Cliente eliminado');
  };

  return {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingClient,
    toast, openCreate, openEdit,
    closeModal, saveClient,
    toggleClient, toggleVerified, deleteClient,
  };
}