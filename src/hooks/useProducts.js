// src/hooks/useProducts.js
import { useState, useMemo } from 'react';
import { initialProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts]     = useState(initialProducts);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [toast, setToast]           = useState(null);

  // Filtrado reactivo
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      const matchCat = filter === 'all' || p.category === filter;
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q)  ||
        p.brand.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, filter, search]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Agregar producto
  const addProduct = (data) => {
    setProducts(prev => [{ id: Date.now(), ...data }, ...prev]);
    setModalOpen(false);
    showToast('Producto agregado correctamente');
  };

  return {
    filtered,
    filter, setFilter,
    search, setSearch,
    modalOpen, setModalOpen,
    toast,
    addProduct,
  };
}