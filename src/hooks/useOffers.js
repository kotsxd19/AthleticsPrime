// src/hooks/useOffers.js
import { useState, useMemo } from 'react';
import { initialOffers } from '../data/offers';

export function useOffers() {
  const [offers, setOffers]           = useState(initialOffers);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [toast, setToast]             = useState(null);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    return offers.filter(o => {
      if (filter === 'active'   && !o.active) return false;
      if (filter === 'inactive' &&  o.active) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.desc.toLowerCase().includes(q)  ||
          (o.code || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [offers, filter, search]);

  // Stats
  const stats = useMemo(() => ({
    active:   offers.filter(o =>  o.active).length,
    inactive: offers.filter(o => !o.active).length,
    total:    offers.length,
  }), [offers]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // CRUD
  const toggleOffer = (id) => {
    setOffers(prev => prev.map(o =>
      o.id === id ? { ...o, active: !o.active } : o
    ));
    const o = offers.find(x => x.id === id);
    showToast(o.active ? 'Oferta desactivada' : 'Oferta activada');
  };

  const deleteOffer = (id) => {
    if (!confirm('¿Eliminar esta oferta?')) return;
    setOffers(prev => prev.filter(o => o.id !== id));
    showToast('Oferta eliminada');
  };

  const openCreate = () => { setEditingOffer(null); setModalOpen(true); };
  const openEdit   = (o) => { setEditingOffer(o);    setModalOpen(true); };
  const closeModal = ()  => { setModalOpen(false); setEditingOffer(null); };

  const saveOffer = (data) => {
    if (editingOffer) {
      setOffers(prev => prev.map(o =>
        o.id === editingOffer.id ? { ...o, ...data } : o
      ));
      showToast('Oferta actualizada');
    } else {
      setOffers(prev => [{ id: Date.now(), ...data }, ...prev]);
      showToast('Oferta creada');
    }
    closeModal();
  };

  return {
    filtered, stats, filter, setFilter,
    search, setSearch, modalOpen, editingOffer,
    toast, openCreate, openEdit, closeModal, saveOffer,
    toggleOffer, deleteOffer,
  };
}