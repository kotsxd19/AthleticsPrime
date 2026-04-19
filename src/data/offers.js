// src/data/offers.js

export const PRODUCTS = [
  'Camiseta Oversize', 'Hoodie Classic', 'Jeans Slim',
  'Sneakers Run', 'Gorra Snap', 'Mochila Urban',
  'Reloj Sport', 'Lentes Sun',
];

export const OFFER_TYPES = [
  'Porcentaje', 'Monto fijo', '2x1', 'Envío gratis',
];

export const initialOffers = [
  {
    id: 1,
    title: 'Black Friday',
    desc: 'Descuento general en toda la tienda',
    start: '2025-11-25', end: '2025-11-30',
    disc: 30, type: 'Porcentaje', code: 'BLACK30',
    products: ['Camiseta Oversize', 'Hoodie Classic', 'Sneakers Run'],
    active: true,
  },
  {
    id: 2,
    title: '2x1 en camisetas',
    desc: 'Lleva dos y paga una',
    start: '2025-10-01', end: '2025-10-15',
    disc: 50, type: '2x1', code: '',
    products: ['Camiseta Oversize'],
    active: true,
  },
  {
    id: 3,
    title: 'Envío gratis fin de semana',
    desc: 'Para compras > $50',
    start: '2025-09-20', end: '2025-09-22',
    disc: 100, type: 'Envío gratis', code: 'FREESHIP',
    products: ['Mochila Urban', 'Gorra Snap'],
    active: false,
  },
  {
    id: 4,
    title: 'Descuento estudiantes',
    desc: 'Aplica con código',
    start: '2025-08-01', end: '2025-12-31',
    disc: 15, type: 'Porcentaje', code: 'STUDENT15',
    products: ['Hoodie Classic', 'Jeans Slim'],
    active: true,
  },
];