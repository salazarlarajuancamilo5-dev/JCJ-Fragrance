/* ==========================================================================
   JCJ Fragrance — Catálogo y configuración
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas editar para:
   - Cambiar precios (COP, sin puntos: 42000)
   - Agregar / quitar fragancias
   - Marcar disponibilidad (stock: true / false)
   - Cambiar WhatsApp, Instagram o TikTok
   - Reemplazar las ilustraciones por fotos reales (campo `images`)
   ========================================================================== */

window.JCJ_CONFIG = {
  brand: "JCJ Fragrance",
  tagline: "The Art of Presence",
  concept: "Una presencia que permanece",
  whatsapp: "573206506648",            // Formato internacional sin "+" ni espacios
  whatsappDisplay: "+57 320 650 6648",
  instagram: "jcj_fragrance",
  tiktok: "jcj.fragrance",
  email: "hola@jcjfragrance.com",       // TODO: confirmar correo corporativo
  city: "Colombia",
  currency: "COP",
  sizes: [5, 10, 30],
  // Si quieres envío gratis desde cierto monto, pon el valor (ej. 150000). 0 = desactivado.
  freeShippingFrom: 0,
};

/*
  Estructura de cada fragancia:
  - slug:        identificador para la URL (producto.html?p=slug)
  - name:        nombre comercial de la fragancia
  - house:       casa perfumista (marca de referencia, sin sugerir afiliación)
  - concentration, year, gender, family
  - tint:        color sutil del líquido en la ilustración
  - prices:      precio por tamaño en COP
  - stock:       disponibilidad por tamaño
  - condition:   condición informada del producto (ver Manual §02 y §13)
  - notes:       pirámide olfativa según información del fabricante
  - images:      [] = usa ilustración JCJ. Para fotos reales: ["assets/img/products/khamrah-1.jpg", ...]
*/
window.JCJ_PRODUCTS = [
  {
    slug: "khamrah",
    name: "Khamrah",
    house: "Lattafa",
    concentration: "Eau de Parfum",
    year: 2022,
    gender: "Unisex",
    family: "Ámbar especiado",
    tint: ["#c98a3c", "#7a4417"],
    featured: true,
    badge: "Más pedido",
    short: "Dátil, canela y vainilla en un ámbar cálido y envolvente.",
    description:
      "Una apertura especiada de canela y nuez moscada que se funde con dátiles, praliné y tuberosa. Su fondo de vainilla, haba tonka y maderas ambaradas deja una estela cálida y gourmand, pensada para noches frías y ocasiones especiales.",
    notes: {
      salida: ["Canela", "Nuez moscada", "Bergamota"],
      corazon: ["Dátiles", "Praliné", "Tuberosa", "Mahonia"],
      fondo: ["Vainilla", "Haba tonka", "Benjuí", "Mirra", "Ámbar", "Maderas"],
    },
    moments: ["Noche", "Clima frío", "Ocasiones especiales"],
    prices: { 5: 25000, 10: 42000, 30: 95000 },
    stock: { 5: true, 10: true, 30: true },
    condition: "Fraccionado a partir de un frasco identificado. Origen y condición informados al confirmar el pedido.",
    images: [],
  },
  {
    slug: "212-vip-black",
    name: "212 VIP Black",
    house: "Carolina Herrera",
    concentration: "Eau de Parfum",
    year: 2017,
    gender: "Masculino",
    family: "Aromático fougère",
    tint: ["#3a3a3a", "#0d0d0d"],
    featured: true,
    badge: "Nocturno",
    short: "Absenta, anís y lavanda sobre un fondo de almizcle negro.",
    description:
      "Una fragancia de carácter nocturno: la absenta y el anís abren con frescura especiada, la lavanda aporta elegancia aromática y el almizcle negro con vainilla deja un rastro intenso y seductor.",
    notes: {
      salida: ["Absenta", "Anís", "Hinojo"],
      corazon: ["Lavanda"],
      fondo: ["Almizcle negro", "Vainilla"],
    },
    moments: ["Noche", "Salidas", "Eventos"],
    prices: { 5: 35000, 10: 60000, 30: 150000 },
    stock: { 5: true, 10: true, 30: true },
    condition: "Fraccionado a partir de un frasco identificado. Origen y condición informados al confirmar el pedido.",
    images: [],
  },
  {
    slug: "le-male-elixir",
    name: "Le Male Elixir",
    house: "Jean Paul Gaultier",
    concentration: "Parfum",
    year: 2023,
    gender: "Masculino",
    family: "Ámbar fougère",
    tint: ["#d9a441", "#8a5a12"],
    featured: true,
    badge: "Intenso",
    short: "Lavanda y menta envueltas en miel, tabaco y haba tonka.",
    description:
      "La frescura de la lavanda y la menta se vuelve profunda con vainilla y benjuí. Un fondo de miel, tabaco y haba tonka le da una intensidad dulce y ambarada con gran presencia.",
    notes: {
      salida: ["Lavanda", "Menta"],
      corazon: ["Vainilla", "Benjuí"],
      fondo: ["Miel", "Haba tonka", "Tabaco"],
    },
    moments: ["Noche", "Clima frío", "Citas"],
    prices: { 5: 45000, 10: 80000, 30: 195000 },
    stock: { 5: true, 10: true, 30: true },
    condition: "Fraccionado a partir de un frasco identificado. Origen y condición informados al confirmar el pedido.",
    images: [],
  },
];
