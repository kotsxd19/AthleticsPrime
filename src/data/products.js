// src/data/products.js

export const CATEGORIES = [
  { value: 'all',        label: 'Todo'       },
  { value: 'calzado',    label: 'Calzado'    },
  { value: 'prendas',    label: 'Prendas'    },
  { value: 'accesorios', label: 'Accesorios' },
];

export const GENDERS    = ['Hombre', 'Mujer', 'Unisex', 'Niño'];
export const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const TYPES      = ['Casual', 'Deportivo', 'Formal', 'Urbano', 'Outdoor'];

export const SIZE_GUIDE = [
  { size: 'XS',  pecho: '82–86',  cintura: '62–66', cadera: '88–92'  },
  { size: 'S',   pecho: '87–91',  cintura: '67–71', cadera: '93–97'  },
  { size: 'M',   pecho: '92–96',  cintura: '72–76', cadera: '98–102' },
  { size: 'L',   pecho: '97–102', cintura: '77–82', cadera: '103–108'},
  { size: 'XL',  pecho: '103–108',cintura: '83–88', cadera: '109–114'},
  { size: 'XXL', pecho: '109–115',cintura: '89–95', cadera: '115–121'},
];

export const initialProducts = [
  { id:1,  name:'Air Max 90',      brand:'Nike',         gender:'Hombre', category:'calzado',    cat:'Calzado',    type:'Deportivo', size:'42',    desc:'Zapatilla clásica con amortiguación visible.',          price:129.90, qty:24 },
  { id:2,  name:'Stan Smith',       brand:'Adidas',        gender:'Unisex', category:'calzado',    cat:'Calzado',    type:'Casual',   size:'40',    desc:'Sneakers minimalistas de cuero blanco.',                 price:89.50,  qty:5  },
  { id:3,  name:'Hoodie Essential',  brand:'Puma',          gender:'Mujer',  category:'prendas',    cat:'Prendas',    type:'Casual',   size:'M',     desc:'Sudadera con capucha de algodón suave.',                 price:49.99,  qty:0  },
  { id:4,  name:'Cap Classic',       brand:'New Era',       gender:'Unisex', category:'accesorios', cat:'Accesorios', type:'Urbano',   size:'Única', desc:'Gorra ajustable con bordado frontal.',                  price:24.00,  qty:60 },
  { id:5,  name:'Camiseta Dry-Fit',  brand:'Nike',         gender:'Hombre', category:'prendas',    cat:'Prendas',    type:'Deportivo', size:'L',     desc:'Camiseta transpirable para entrenamientos.',              price:34.90,  qty:12 },
  { id:6,  name:'Mochila Urbana',    brand:'JanSport',      gender:'Unisex', category:'accesorios', cat:'Accesorios', type:'Urbano',   size:'30L',   desc:'Mochila resistente al agua con compartimento laptop.',    price:69.00,  qty:8  },
  { id:7,  name:'Barricade 12',      brand:'Adidas',        gender:'Hombre', category:'calzado',    cat:'Calzado',    type:'Deportivo', size:'43',    desc:'Estabilidad y soporte lateral para tenis.',               price:67.10,  qty:3  },
  { id:8,  name:'Joggers Tech',      brand:'Under Armour',  gender:'Mujer',  category:'prendas',    cat:'Prendas',    type:'Deportivo', size:'S',     desc:'Pantalón ligero con bolsillos laterales.',                price:55.00,  qty:18 },
];