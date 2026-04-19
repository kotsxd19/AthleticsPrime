// src/hooks/useOrders.js
import { useState, useMemo } from 'react';

const initialOrders = [
  { id: 34593, products: ['Air Max 90', 'Camiseta Dry-Fit'], client: 'Carlos Mendoza',  payment: 'Tarjeta',  total: 1300, orderedAt: '2026-01-12', address: 'San Salvador, El Salvador', delivered: true  },
  { id: 34594, products: ['Stan Smith'],                      client: 'Andrés Pineda',   payment: 'Efectivo', total: 300,  orderedAt: '2026-01-18', address: 'Santa Ana, El Salvador',    delivered: false },
  { id: 34595, products: ['Hoodie Essential'],                client: 'Marcos Rivera',   payment: 'Tarjeta',  total: 90,   orderedAt: '2026-01-25', address: 'San Miguel, El Salvador',   delivered: true  },
  { id: 34596, products: ['Mochila Urbana', 'Cap Classic'],   client: 'Sandra Torres',   payment: 'Tarjeta',  total: 465,  orderedAt: '2026-02-02', address: 'La Libertad, El Salvador',  delivered: false },
  { id: 34597, products: ['Joggers Tech'],                    client: 'Víctor Castro',   payment: 'Efectivo', total: 50,   orderedAt: '2026-02-05', address: 'Sonsonate, El Salvador',    delivered: true  },
  { id: 34598, products: ['Barricade 12', 'Air Max 90'],      client: 'Javier Blanco',   payment: 'Tarjeta',  total: 1678, orderedAt: '2026-02-10', address: 'San Salvador, El Salvador', delivered: false },
  { id: 34599, products: ['Stan Smith'],                      client: 'Daniel Méndez',   payment: 'Efectivo', total: 105,  orderedAt: '2026-02-15', address: 'Usulután, El Salvador',     delivered: true  },
  { id: 34600, products: ['Cap Classic'],                     client: 'Gloria Campos',   payment: 'Efectivo', total: 120,  orderedAt: '2026-02-20', address: 'Santa Tecla, El Salvador',  delivered: false },
];

export function useOrders() {
  const [orders, setOrders]           = useState(initialOrders);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [toast, setToast]             = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = useMemo(() => orders.filter(o => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'delivered'   && o.delivered) ||
      (filter === 'undelivered' && !o.delivered);
    const q = search.toLowerCase();
    const matchSearch =
      String(o.id).includes(q) ||
      o.client.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.payment.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }), [orders, filter, search]);

  const stats = useMemo(() => ({
    delivered:   orders.filter(o => o.delivered).length,
    undelivered: orders.filter(o => !o.delivered).length,
    total:       orders.length,
    revenue:     orders.reduce((acc, o) => acc + o.total, 0),
  }), [orders]);

  const openCreate  = ()  => { setEditingOrder(null); setModalOpen(true); };
  const openEdit    = (o) => { setEditingOrder(o);    setModalOpen(true); };
  const openDetail  = (o) => setDetailOrder(o);
  const closeModal  = ()  => { setModalOpen(false); setEditingOrder(null); };
  const closeDetail = ()  => setDetailOrder(null);

  const saveOrder = (data) => {
    if (data.id) {
      setOrders(prev => prev.map(o => o.id === data.id ? data : o));
      showToast('Pedido actualizado');
    } else {
      const newId = Math.max(...orders.map(o => o.id)) + 1;
      setOrders(prev => [...prev, { ...data, id: newId, orderedAt: new Date().toISOString().split('T')[0] }]);
      showToast('Pedido creado');
    }
    closeModal();
  };

  const toggleDelivered = (id) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, delivered: !o.delivered } : o));
    showToast('Estado de entrega actualizado');
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Pedido eliminado');
  };

  return {
    filtered, stats,
    filter, setFilter,
    search, setSearch,
    modalOpen, editingOrder,
    detailOrder,
    toast, openCreate, openEdit, openDetail,
    closeModal, closeDetail, saveOrder,
    toggleDelivered, deleteOrder,
  };
}