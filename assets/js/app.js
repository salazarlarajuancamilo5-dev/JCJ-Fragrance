/* ==========================================================================
   JCJ Fragrance — App
   Carrito, header/footer, catálogo, ficha de producto y pedido por WhatsApp.
   Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.JCJ_CONFIG;
  const P = window.JCJ_PRODUCTS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Utilidades ---------- */
  const fmt = (n) => "$" + Math.round(n).toLocaleString("es-CO");
  const bySlug = (s) => P.find((p) => p.slug === s);
  const minPrice = (p) => Math.min(...C.sizes.map((s) => p.prices[s]).filter(Boolean));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (text) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
  const igLink = `https://www.instagram.com/${C.instagram}/`;
  const ttLink = `https://www.tiktok.com/@${C.tiktok}`;

  /* ---------- Iconos (línea 1.5px) ---------- */
  const I = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.4 5 4.6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" class="fill"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/></svg>',
  };

  /* ---------- Ilustración de decant (SVG) ----------
     Placeholder editorial mientras llegan las fotos reales.
     Proporciones relativas entre 5, 10 y 30 ml. */
  let svgId = 0;
  function decantSVG(p, ml, opts = {}) {
    const id = "d" + ++svgId;
    const dims = { 5: { w: 34, h: 118 }, 10: { w: 42, h: 160 }, 30: { w: 64, h: 196 } }[ml] || { w: 42, h: 160 };
    const VB_W = 200, VB_H = 340, ground = 316;
    const x = (VB_W - dims.w) / 2;
    const bodyTop = ground - dims.h;
    const collarH = 12, capH = Math.round(dims.h * 0.3);
    const capW = dims.w * 0.74, capX = (VB_W - capW) / 2;
    const collarW = dims.w * 0.56, collarX = (VB_W - collarW) / 2;
    const liquidTop = bodyTop + dims.h * 0.16;
    const labelH = Math.min(dims.h * 0.42, 74), labelY = bodyTop + dims.h * 0.36;
    const labelW = dims.w - 8, labelX = x + 4;
    const [t1, t2] = p.tint;
    const small = ml === 5;
    const mono = Math.max(7, dims.w * 0.2);
    return `
<svg class="decant-svg" viewBox="${opts.fit ? `${(VB_W - dims.w * 2.2) / 2} ${bodyTop - collarH - capH - 8} ${dims.w * 2.2} ${ground - bodyTop + collarH + capH + 20}` : `0 0 ${VB_W} ${VB_H}`}" role="img" aria-label="Decant de ${esc(p.name)} ${ml} ml — ilustración">
  <defs>
    <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".18" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient>
    <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t1}" stop-opacity=".82"/><stop offset="1" stop-color="${t2}" stop-opacity=".95"/></linearGradient>
    <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="#2a2a2a"/><stop offset=".35" stop-color="#4a4a4a"/><stop offset=".6" stop-color="#111"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#8d8d8d"/><stop offset=".4" stop-color="#e6e6e6"/><stop offset=".7" stop-color="#9a9a9a"/><stop offset="1" stop-color="#6d6d6d"/></linearGradient>
    <radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="${VB_W / 2}" cy="${ground + 4}" rx="${dims.w * 0.95}" ry="6" fill="url(#${id}s)"/>
  <rect x="${capX}" y="${bodyTop - collarH - capH}" width="${capW}" height="${capH}" rx="3" fill="url(#${id}c)"/>
  <rect x="${capX + capW * 0.16}" y="${bodyTop - collarH - capH + 4}" width="1.4" height="${capH - 8}" fill="#fff" opacity=".18"/>
  <rect x="${collarX}" y="${bodyTop - collarH}" width="${collarW}" height="${collarH}" fill="url(#${id}m)"/>
  <rect x="${x}" y="${bodyTop}" width="${dims.w}" height="${dims.h}" rx="${small ? 5 : 7}" fill="#f4f4f2" fill-opacity=".35" stroke="#1a1a1a" stroke-opacity=".22"/>
  <rect x="${x + 2}" y="${liquidTop}" width="${dims.w - 4}" height="${ground - liquidTop - 2}" rx="${small ? 4 : 6}" fill="url(#${id}l)"/>
  <rect x="${labelX}" y="${labelY}" width="${labelW}" height="${labelH}" fill="#fff"/>
  <rect x="${labelX + 2.5}" y="${labelY + 2.5}" width="${labelW - 5}" height="${labelH - 5}" fill="none" stroke="#000" stroke-width=".5"/>
  <text x="${VB_W / 2}" y="${labelY + labelH * 0.36}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="${mono}" fill="#000">JCJ</text>
  ${small ? "" : `<text x="${VB_W / 2}" y="${labelY + labelH * 0.52}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="${Math.max(3.2, dims.w * 0.065)}" letter-spacing="0.6" fill="#000">FRAGRANCE</text>`}
  ${small ? "" : `<text x="${VB_W / 2}" y="${labelY + labelH * 0.72}" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="${Math.max(4.2, dims.w * 0.095)}" fill="#000">${esc(p.name.length > 14 ? p.name.slice(0, 13) + "…" : p.name)}</text>`}
  <text x="${VB_W / 2}" y="${labelY + labelH * (small ? 0.72 : 0.88)}" text-anchor="middle" font-family="Manrope, sans-serif" font-size="${Math.max(4, dims.w * 0.08)}" fill="#404040">${ml} ml</text>
  <rect x="${x}" y="${bodyTop}" width="${dims.w}" height="${dims.h}" rx="${small ? 5 : 7}" fill="url(#${id}g)"/>
</svg>`;
  }

  function trioSVG(p) {
    return `<div class="trio">${C.sizes.map((s) => `<div class="trio-item">${decantSVG(p, s)}</div>`).join("")}</div>`;
  }

  const photo = (p, ml) => (p.images && p.images[ml]) || "";
  const img = (src, alt, eager) => `<img class="photo" src="${esc(src)}" alt="${esc(alt)}" width="960" height="1200" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  function media(p, ml, eager = false) {
    const src = photo(p, ml);
    if (src) return img(src, `Decant ${p.name} de ${ml} ml — JCJ Fragrance`, eager);
    return decantSVG(p, ml, { fit: true });
  }
  function altMedia(p) {
    const g = p.gallery && p.gallery[0];
    return g ? `<img class="photo photo-wide" src="${esc(g)}" alt="" loading="lazy" decoding="async">` : trioSVG(p);
  }

  /* ---------- Carrito ---------- */
  const CART_KEY = "jcj_cart_v1";
  const INFO_KEY = "jcj_customer_v1";
  const Cart = {
    items: [],
    load() {
      try { this.items = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { this.items = []; }
      this.items = this.items.filter((it) => bySlug(it.slug) && bySlug(it.slug).prices[it.ml]);
    },
    save() { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); renderCart(); },
    add(slug, ml, qty = 1) {
      const it = this.items.find((i) => i.slug === slug && i.ml === ml);
      if (it) it.qty = Math.min(it.qty + qty, 20); else this.items.push({ slug, ml, qty });
      this.save();
    },
    set(slug, ml, qty) {
      const it = this.items.find((i) => i.slug === slug && i.ml === ml);
      if (!it) return;
      if (qty <= 0) this.items = this.items.filter((i) => i !== it); else it.qty = Math.min(qty, 20);
      this.save();
    },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    total() { return this.items.reduce((a, i) => a + bySlug(i.slug).prices[i.ml] * i.qty, 0); },
    clear() { this.items = []; this.save(); },
  };

  function orderMessage() {
    const info = getInfo();
    const lines = Cart.items.map((i) => {
      const p = bySlug(i.slug);
      return `- ${p.name} (${p.house}), ${i.ml} ml x ${i.qty}: ${fmt(p.prices[i.ml] * i.qty)}`;
    });
    let msg = `Hola JCJ Fragrance, quiero hacer este pedido:\n\n${lines.join("\n")}\n\nSubtotal: ${fmt(Cart.total())} COP`;
    if (info.name) msg += `\nNombre: ${info.name}`;
    if (info.city) msg += `\nCiudad: ${info.city}`;
    msg += `\n\n¿Me confirman disponibilidad, costo de envío y medios de pago?`;
    return msg;
  }
  const getInfo = () => { try { return JSON.parse(localStorage.getItem(INFO_KEY)) || {}; } catch { return {}; } };

  /* ---------- Header / Footer ---------- */
  function navLinks() {
    return [
      ["catalogo.html", "Perfumes"],
      ["index.html#formatos", "Tamaños"],
      ["index.html#como-funciona", "Cómo pedir"],
      ["nosotros.html", "Nosotros"],
      ["preguntas.html", "Preguntas"],
    ];
  }

  function renderChrome() {
    const page = document.body.dataset.page;
    const header = $("#site-header");
    if (header) {
      header.innerHTML = `
      <div class="announce" role="note" aria-label="Envíos a toda Colombia. Decants de 5, 10 y 30 ml. Pedidos por WhatsApp.">
        <div class="marquee" aria-hidden="true">
          ${[0, 1].map(() => `<div class="marquee-group">${["Envíos a toda Colombia", "Decants de 5, 10 y 30 ml", "Pedidos por WhatsApp 320 650 6648", "Instagram @jcj_fragrance", "TikTok @jcj.fragrance"].map((t) => `<span>${t}</span><img src="assets/brand/monogram-white.png" alt="" width="14" height="13">`).join("")}</div>`).join("")}
        </div>
      </div>
      <div class="header-bar" role="banner">
        <div class="container header-inner">
          <button class="icon-btn menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav">${I.menu}</button>
          <a class="logo" href="index.html" aria-label="JCJ Fragrance — Inicio">
            <img src="assets/brand/monogram-black.png" alt="" width="40" height="38">
            <span class="logo-word"><span class="logo-name">JCJ</span><span class="logo-sub">Fragrance</span></span>
          </a>
          <nav class="main-nav" aria-label="Principal">
            ${navLinks().map(([h, t]) => `<a href="${h}" ${(page === "catalogo" && h === "catalogo.html") || (page === "nosotros" && h === "nosotros.html") || (page === "preguntas" && h === "preguntas.html") ? 'aria-current="page"' : ""}>${t}</a>`).join("")}
          </nav>
          <div class="header-actions">
            <a class="icon-btn hide-sm" href="${igLink}" target="_blank" rel="noopener" aria-label="Instagram">${I.instagram}</a>
            <a class="icon-btn hide-sm" href="${ttLink}" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a>
            <button class="icon-btn cart-btn" aria-label="Abrir bolsa de compras" aria-controls="cart-drawer">${I.bag}<span class="cart-count" aria-live="polite">0</span></button>
          </div>
        </div>
      </div>
      <div class="mobile-nav" id="mobile-nav" hidden>
        <nav aria-label="Móvil">
          ${navLinks().map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}
        </nav>
        <div class="mobile-social">
          <a href="${igLink}" target="_blank" rel="noopener">${I.instagram}<span>@${C.instagram}</span></a>
          <a href="${ttLink}" target="_blank" rel="noopener">${I.tiktok}<span>@${C.tiktok}</span></a>
          <a href="${waLink("Hola JCJ Fragrance, quiero asesoría.")}" target="_blank" rel="noopener">${I.whatsapp}<span>${C.whatsappDisplay}</span></a>
        </div>
      </div>`;
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.innerHTML = `
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="assets/brand/signature-white.png" alt="JCJ Fragrance" width="120" height="136" loading="lazy">
            <p class="footer-tag">${C.tagline}</p>
            <p class="muted">Perfumes en atomizadores de 5, 10 y 30 ml, preparados a mano y enviados a toda Colombia.</p>
          </div>
          <div class="footer-col">
            <h3>Tienda</h3>
            <a href="catalogo.html">Todos los perfumes</a>
            ${P.map((p) => `<a href="producto.html?p=${p.slug}">${esc(p.name)}</a>`).join("")}
          </div>
          <div class="footer-col">
            <h3>Ayuda</h3>
            <a href="index.html#como-funciona">Cómo pedir</a>
            <a href="nosotros.html">Nosotros</a>
            <a href="preguntas.html">Preguntas frecuentes</a>
            <a href="envios.html">Envíos, cambios y garantía</a>
            <a href="${waLink("Hola JCJ Fragrance, necesito ayuda con un pedido.")}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
          </div>
          <div class="footer-col">
            <h3>Síguenos</h3>
            <a href="${igLink}" target="_blank" rel="noopener" class="with-icon">${I.instagram} @${C.instagram}</a>
            <a href="${ttLink}" target="_blank" rel="noopener" class="with-icon">${I.tiktok} @${C.tiktok}</a>
            <a href="${waLink("Hola JCJ Fragrance")}" target="_blank" rel="noopener" class="with-icon">${I.whatsapp} ${C.whatsappDisplay}</a>
          </div>
        </div>
        <div class="footer-legal">
          <p class="disclaimer">JCJ Fragrance selecciona y comercializa decants: fragancias fraccionadas y reenvasadas en atomizadores propios. Cada presentación es independiente y no corresponde a una presentación oficial de la casa perfumista. Las marcas y nombres de fragancias mencionados pertenecen a sus respectivos titulares y se usan solo como referencia; JCJ Fragrance no está afiliada ni patrocinada por ellos. Notas olfativas según información del fabricante.</p>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} JCJ Fragrance. Todos los derechos reservados.</span>
            <nav aria-label="Legal">
              <a href="terminos.html">Términos y condiciones</a>
              <a href="privacidad.html">Privacidad</a>
              <a href="cookies.html">Cookies</a>
              <a href="envios.html">Envíos y garantía</a>
              <a href="https://www.sic.gov.co/" target="_blank" rel="noopener">SIC</a>
            </nav>
          </div>
        </div>
      </div>`;
    }

    // Drawer, overlay, WhatsApp flotante, toast, cookies
    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" hidden></div>
      <aside class="drawer" id="cart-drawer" aria-label="Bolsa de compras" aria-hidden="true" tabindex="-1">
        <header class="drawer-head">
          <h2>Tu bolsa</h2>
          <button class="icon-btn drawer-close" aria-label="Cerrar bolsa">${I.close}</button>
        </header>
        <div class="drawer-body"></div>
        <footer class="drawer-foot"></footer>
      </aside>
      <a class="wa-float" href="${waLink("Hola JCJ Fragrance, quiero hacer un pedido.")}" target="_blank" rel="noopener" aria-label="Pedir por WhatsApp">
        ${I.whatsapp}<span class="wa-float-label">Pedir por WhatsApp</span>
      </a>
      <div class="toast" role="status" aria-live="polite"></div>
    `);

    // Eventos header
    const menuBtn = $(".menu-btn"), mnav = $("#mobile-nav");
    menuBtn && menuBtn.addEventListener("click", () => {
      const open = mnav.hidden;
      mnav.style.top = Math.max(0, $(".header-bar").getBoundingClientRect().bottom) + "px";
      mnav.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = open ? I.close : I.menu;
      document.body.classList.toggle("nav-open", open);
    });
    $$("#mobile-nav a").forEach((a) => a.addEventListener("click", () => { mnav.hidden = true; menuBtn.innerHTML = I.menu; menuBtn.setAttribute("aria-expanded", "false"); document.body.classList.remove("nav-open"); }));

    $(".cart-btn").addEventListener("click", openDrawer);
    $(".drawer-close").addEventListener("click", closeDrawer);
    $(".overlay").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

    // Header sombra al hacer scroll
    const bar = $(".header-bar");
    const onScroll = () => bar && bar.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Drawer ---------- */
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    const d = $("#cart-drawer"), o = $(".overlay");
    o.hidden = false;
    requestAnimationFrame(() => { o.classList.add("show"); d.classList.add("open"); });
    d.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    setTimeout(() => d.focus(), 50);
  }
  function closeDrawer() {
    const d = $("#cart-drawer"), o = $(".overlay");
    if (!d || !d.classList.contains("open")) return;
    d.classList.remove("open"); o.classList.remove("show");
    d.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lock");
    setTimeout(() => { o.hidden = true; }, 300);
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  function renderCart() {
    $$(".cart-count").forEach((el) => { const n = Cart.count(); el.textContent = n; el.classList.toggle("has", n > 0); });
    const body = $(".drawer-body"), foot = $(".drawer-foot");
    if (!body) return;
    if (!Cart.items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <img src="assets/brand/monogram-black.png" alt="" width="56" height="54">
          <p class="h-serif">Tu bolsa está vacía</p>
          <p class="muted">Empieza con 5 ml y prueba el perfume con calma.</p>
          <a class="btn btn-primary" href="catalogo.html">Ver perfumes</a>
        </div>`;
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = Cart.items.map((i) => {
      const p = bySlug(i.slug);
      return `
      <div class="cart-item">
        <a class="cart-thumb" href="producto.html?p=${p.slug}">${media(p, i.ml)}</a>
        <div class="cart-info">
          <p class="cart-house">${esc(p.house)}</p>
          <a class="cart-name" href="producto.html?p=${p.slug}">Decant ${esc(p.name)}</a>
          <p class="cart-size">${i.ml} ml, ${fmt(p.prices[i.ml])} c/u</p>
          <div class="qty qty-sm" data-slug="${p.slug}" data-ml="${i.ml}">
            <button data-d="-1" aria-label="Quitar una unidad">${I.minus}</button>
            <span aria-label="Cantidad">${i.qty}</span>
            <button data-d="1" aria-label="Agregar una unidad">${I.plus}</button>
          </div>
        </div>
        <div class="cart-right">
          <p class="cart-line">${fmt(p.prices[i.ml] * i.qty)}</p>
          <button class="link-btn cart-remove" data-slug="${p.slug}" data-ml="${i.ml}" aria-label="Eliminar">${I.trash}</button>
        </div>
      </div>`;
    }).join("");

    const info = getInfo();
    const free = C.freeShippingFrom;
    const remaining = free ? free - Cart.total() : 0;
    foot.innerHTML = `
      ${free ? `<p class="ship-note">${remaining > 0 ? `Te faltan <strong>${fmt(remaining)}</strong> para envío gratis` : "Tu pedido tiene <strong>envío gratis</strong>"}</p>` : ""}
      <div class="cart-total"><span>Subtotal</span><strong>${fmt(Cart.total())}</strong></div>
      <p class="muted small">El costo de envío y los medios de pago se confirman por WhatsApp según tu ciudad.</p>
      <div class="cart-fields">
        <label><span>Nombre</span><input type="text" name="name" autocomplete="name" value="${esc(info.name || "")}" placeholder="Tu nombre"></label>
        <label><span>Ciudad</span><input type="text" name="city" autocomplete="address-level2" value="${esc(info.city || "")}" placeholder="Ciudad de entrega"></label>
      </div>
      <a class="btn btn-primary btn-block btn-wa checkout" href="#" target="_blank" rel="noopener">${I.whatsapp} Finalizar pedido por WhatsApp</a>
      <p class="tiny muted center">Al continuar aceptas los <a href="terminos.html">términos</a> y la <a href="privacidad.html">política de privacidad</a>.</p>`;

    $$(".drawer-body .qty button").forEach((b) => b.addEventListener("click", () => {
      const q = b.closest(".qty"); const slug = q.dataset.slug, ml = +q.dataset.ml;
      const it = Cart.items.find((x) => x.slug === slug && x.ml === ml);
      Cart.set(slug, ml, it.qty + +b.dataset.d);
    }));
    $$(".cart-remove").forEach((b) => b.addEventListener("click", () => Cart.set(b.dataset.slug, +b.dataset.ml, 0)));
    $$(".cart-fields input").forEach((inp) => inp.addEventListener("input", () => {
      const cur = getInfo(); cur[inp.name] = inp.value.trim(); localStorage.setItem(INFO_KEY, JSON.stringify(cur));
    }));
    $(".checkout").addEventListener("click", (e) => {
      e.currentTarget.href = waLink(orderMessage());
      track("InitiateCheckout", { value: Cart.total(), currency: "COP", num_items: Cart.count() });
    });
  }

  let toastT;
  function toast(html) {
    const t = $(".toast"); t.innerHTML = html; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function addToCart(slug, ml, qty = 1, open = true) {
    const p = bySlug(slug);
    if (!p || !p.stock[ml]) return;
    Cart.add(slug, ml, qty);
    track("AddToCart", { content_ids: [`${slug}-${ml}`], value: p.prices[ml] * qty, currency: "COP" });
    if (open) openDrawer(); else toast(`Agregado: <strong>${esc(p.name)}, ${ml} ml</strong>`);
  }

  /* ---------- Analítica (solo con consentimiento) ---------- */
  function track(event, data) {
    if (localStorage.getItem("jcj_consent") !== "all") return;
    if (typeof window.fbq === "function") window.fbq("track", event, data);
    if (typeof window.gtag === "function") window.gtag("event", event, data);
  }

  /* ---------- Tarjeta de producto ---------- */
  function productCard(p) {
    const def = p.stock[10] ? 10 : C.sizes.find((s) => p.stock[s]) || 10;
    const any = C.sizes.some((s) => p.stock[s]);
    return `
    <article class="card reveal" data-slug="${p.slug}" data-ml="${def}">
      <a class="card-media" href="producto.html?p=${p.slug}" aria-label="Ver detalles de ${esc(p.name)}">
        <div class="card-img">${media(p, def)}</div>
        <div class="card-img card-img-alt" aria-hidden="true">${altMedia(p)}</div>
      </a>
      <div class="card-body">
        <p class="card-house">${esc(p.house)}</p>
        <h3 class="card-title"><a href="producto.html?p=${p.slug}">${esc(p.name)}</a></h3>
        <p class="card-meta">${esc(p.short)}</p>
        <div class="sizes" role="radiogroup" aria-label="Tamaño">
          ${C.sizes.map((s) => `<button role="radio" aria-checked="${s === def}" class="size ${s === def ? "on" : ""}" data-ml="${s}" ${p.stock[s] ? "" : "disabled"}>${s} ml</button>`).join("")}
        </div>
        <div class="card-foot">
          <p class="price"><span class="price-val">${fmt(p.prices[def])}</span><span class="price-unit"> / ${def} ml</span></p>
          <button class="btn btn-primary btn-sm add" ${any ? "" : "disabled"}>${any ? "Agregar" : "Agotado"}</button>
        </div>
      </div>
    </article>`;
  }

  function bindCards(root = document) {
    $$(".card", root).forEach((card) => {
      const p = bySlug(card.dataset.slug);
      $$(".size", card).forEach((b) => b.addEventListener("click", () => {
        const ml = +b.dataset.ml;
        card.dataset.ml = ml;
        $$(".size", card).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", String(x === b)); });
        $(".price-val", card).textContent = fmt(p.prices[ml]);
        $(".price-unit", card).textContent = ` / ${ml} ml`;
        const ci = $(".card-img", card);
        ci.innerHTML = media(p, ml);
        ci.classList.remove("swap"); void ci.offsetWidth; ci.classList.add("swap");
      }));
      $(".add", card).addEventListener("click", () => addToCart(p.slug, +card.dataset.ml, 1, false));
    });
    observeReveal(root);
  }

  /* ---------- Reveal ---------- */
  let io;
  function observeReveal(root = document) {
    const els = $$(".reveal:not(.in), .reveal-img:not(.in)", root);
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Titulares palabra por palabra ---------- */
  function splitHeadings() {
    $$("[data-split]").forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "1";
      el.setAttribute("aria-label", el.textContent.trim());
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--d:${i * 55}ms">${esc(w)}</span></span>`).join(" ");
      el.classList.add("reveal", "words");
    });
  }

  /* ---------- Movimiento ligado al scroll ---------- */
  function motion() {
    const drifts = $$("[data-drift]");
    const par = $$("[data-parallax]");
    const header = $(".header-bar");
    if (reduceMotion) return;
    let ticking = false;
    const frame = () => {
      ticking = false;
      const y = window.scrollY, vh = window.innerHeight;
      drifts.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const k = parseFloat(el.dataset.drift) || 0.3;
        el.style.transform = `translate3d(${(r.top + r.height / 2 - vh / 2) * k}px, 0, 0)`;
      });
      par.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const k = parseFloat(img.dataset.parallax) || 0.1;
        const c = (r.top + r.height / 2 - vh / 2) * k;
        img.style.transform = `translateY(${Math.max(-60, Math.min(60, c))}px)`;
      });
      header && header.classList.toggle("compact", y > 120);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame();

    // Tarjetas: inclinación 3D al pasar el cursor
    if (window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener("pointermove", (e) => {
        const m = e.target.closest && e.target.closest(".card-media, .pdp-main");
        $$(".tilt-on").forEach((x) => { if (x !== m) { x.classList.remove("tilt-on"); x.style.removeProperty("--rx"); x.style.removeProperty("--ry"); } });
        if (!m) return;
        const r = m.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        m.classList.add("tilt-on");
        m.style.setProperty("--rx", (py * -8).toFixed(2) + "deg");
        m.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
        m.style.setProperty("--gx", ((px + 0.5) * 100).toFixed(1) + "%");
        m.style.setProperty("--gy", ((py + 0.5) * 100).toFixed(1) + "%");
      });
    }
  }

  /* ---------- Páginas ---------- */
  function pageHome() {
    const grid = $("#featured-grid");
    if (grid) { grid.innerHTML = P.filter((p) => p.featured).map(productCard).join(""); bindCards(grid); }
    const hero = $("#hero-visual");
    if (hero) {
      if (!hero.querySelector("img")) {
        const [a, b, c] = P;
        hero.innerHTML = `
          <div class="hero-bottle hb-1">${decantSVG(b || a, 10)}</div>
          <div class="hero-bottle hb-2">${decantSVG(a, 30)}</div>
          <div class="hero-bottle hb-3">${decantSVG(c || a, 5)}</div>`;
      }
    }
    const fmts = $("#formats-visual");
    if (fmts) {
      const p = P[0];
      $$("[data-format]", fmts).forEach((el) => {
        const ml = +el.dataset.format;
        el.innerHTML = img(`assets/img/products/decant-${ml}.webp`, `Decant JCJ de ${ml} ml`);
        const im = el.firstElementChild;
        if (im && el.dataset.speed) im.dataset.parallax = el.dataset.speed;
      });
    }
    $$("[data-min-price]").forEach((el) => { el.textContent = fmt(Math.min(...P.map(minPrice))); });
  }

  function pageCatalog() {
    const grid = $("#catalog-grid");
    if (!grid) return;
    const houses = [...new Set(P.map((p) => p.house))].sort();
    const families = [...new Set(P.map((p) => p.family))].sort();
    const genders = [...new Set(P.map((p) => p.gender))].sort();
    const params = new URLSearchParams(location.search);
    const state = { house: params.get("marca") || "", family: "", gender: "", size: "", sort: "featured", q: "" };

    const chipGroup = (key, label, values) => `
      <fieldset class="filter">
        <legend>${label}</legend>
        <div class="chips">
          <button class="chip ${!state[key] ? "on" : ""}" data-k="${key}" data-v="">Todas</button>
          ${values.map((v) => `<button class="chip ${state[key] === String(v) ? "on" : ""}" data-k="${key}" data-v="${esc(v)}">${esc(v)}${key === "size" ? " ml" : ""}</button>`).join("")}
        </div>
      </fieldset>`;
    $("#filters").innerHTML = `
      <label class="search"><span class="sr-only">Buscar</span><input type="search" id="q" placeholder="Buscar fragancia, marca o nota"></label>
      ${chipGroup("house", "Marca", houses)}
      ${chipGroup("family", "Familia olfativa", families)}
      ${chipGroup("gender", "Perfil", genders)}
      ${chipGroup("size", "Tamaño", C.sizes)}`;

    function apply() {
      let list = P.filter((p) =>
        (!state.house || p.house === state.house) &&
        (!state.family || p.family === state.family) &&
        (!state.gender || p.gender === state.gender) &&
        (!state.size || p.stock[+state.size]) &&
        (!state.q || [p.name, p.house, p.family, ...Object.values(p.notes).flat()].join(" ").toLowerCase().includes(state.q)));
      const priceOf = (p) => (state.size ? p.prices[+state.size] : minPrice(p));
      if (state.sort === "price-asc") list.sort((a, b) => priceOf(a) - priceOf(b));
      if (state.sort === "price-desc") list.sort((a, b) => priceOf(b) - priceOf(a));
      if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      $("#result-count").textContent = `${list.length} ${list.length === 1 ? "fragancia" : "fragancias"}`;
      grid.innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty"><p class="h-serif">Sin resultados</p><p class="muted">Prueba con otros filtros o escríbenos: conseguimos la fragancia que buscas.</p><a class="btn btn-secondary" target="_blank" rel="noopener" href="${waLink("Hola JCJ Fragrance, ¿tienen decant de esta fragancia?: ")}">Preguntar por WhatsApp</a></div>`;
      // Si se filtró por tamaño, preseleccionarlo en las tarjetas
      if (state.size) $$(".card", grid).forEach((c) => (c.dataset.ml = state.size));
      bindCards(grid);
      if (state.size) $$(".card", grid).forEach((c) => { const b = $(`.size[data-ml="${state.size}"]`, c); b && b.click(); });
    }

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      state[b.dataset.k] = b.dataset.v;
      $$(`.chip[data-k="${b.dataset.k}"]`).forEach((x) => x.classList.toggle("on", x === b));
      apply();
    });
    $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); apply(); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; apply(); });
    const ft = $("#filters-toggle");
    ft && ft.addEventListener("click", () => { const f = $("#filters"); f.classList.toggle("open"); ft.setAttribute("aria-expanded", f.classList.contains("open")); });
    apply();
  }

  function pageProduct() {
    const root = $("#product");
    if (!root) return;
    const p = bySlug(new URLSearchParams(location.search).get("p")) || P[0];
    let ml = p.stock[10] ? 10 : C.sizes.find((s) => p.stock[s]) || 10;
    let qty = 1;

    document.title = `${p.name} de ${p.house} en decant | JCJ Fragrance`;
    const md = $('meta[name="description"]'); md && md.setAttribute("content", `Decant de ${p.name} (${p.house}) en 5, 10 y 30 ml. ${p.short}`);

    const hasPhotos = !!photo(p, 10);
    const views = hasPhotos ? [...C.sizes.filter((s) => photo(p, s)).map((s) => ({ ml: s, src: photo(p, s) })), ...(p.gallery || []).map((src) => ({ src }))] : null;
    root.innerHTML = `
      <nav class="crumbs container" aria-label="Ruta"><a href="index.html">Inicio</a><span>/</span><a href="catalogo.html">Catálogo</a><span>/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <div class="container pdp">
        <div class="pdp-gallery">
          <div class="pdp-main" id="pdp-main">${media(p, ml, true)}</div>
          <div class="pdp-thumbs">
            ${views ? views.map((v, i) => `<button class="pdp-thumb ${v.ml === ml ? "on" : ""}" data-i="${i}" ${v.ml ? `data-ml="${v.ml}"` : ""} aria-label="${v.ml ? `Ver ${v.ml} ml` : "Ver comparativa de formatos"}"><img class="photo ${v.ml ? "" : "photo-wide"}" src="${esc(v.src)}" alt="" loading="lazy"><span class="thumb-tag">${v.ml ? `${v.ml} ml` : "Tamaños"}</span></button>`).join("")
              : `<div class="pdp-trio">${trioSVG(p)}<p class="tiny muted center">Tamaños de 5, 10 y 30 ml.</p></div>`}
          </div>
        </div>
        <div class="pdp-info">
          <p class="pdp-house">${esc(p.house)}, ${esc(p.concentration)}</p>
          <h1 class="pdp-title">Decant ${esc(p.name)}</h1>
          <p class="pdp-short">${esc(p.short)}</p>
          <p class="pdp-price"><span id="pdp-price">${fmt(p.prices[ml])}</span> <span class="muted" id="pdp-unit">${ml} ml</span></p>

          <div class="pdp-block">
            <p class="label">Tamaño</p>
            <div class="size-cards" role="radiogroup" aria-label="Tamaño">
              ${C.sizes.map((s) => `
                <button role="radio" class="size-card ${s === ml ? "on" : ""}" aria-checked="${s === ml}" data-ml="${s}" ${p.stock[s] ? "" : "disabled"}>
                  <span class="sc-ml">${s} ml</span>
                  <span class="sc-price">${p.stock[s] ? fmt(p.prices[s]) : "Agotado"}</span>
                  <span class="sc-hint">${{ 5: "Descubrir", 10: "Uso frecuente", 30: "Rutina diaria" }[s] || ""}</span>
                </button>`).join("")}
            </div>
            <p class="tiny muted"></p>
          </div>

          <div class="pdp-actions">
            <div class="qty" id="pdp-qty">
              <button data-d="-1" aria-label="Quitar una unidad">${I.minus}</button>
              <span>1</span>
              <button data-d="1" aria-label="Agregar una unidad">${I.plus}</button>
            </div>
            <button class="btn btn-primary btn-grow" id="pdp-add">Agregar a la bolsa</button>
          </div>
          <a class="btn btn-secondary btn-block btn-wa" id="pdp-wa" href="#" target="_blank" rel="noopener">${I.whatsapp} Comprar ahora por WhatsApp</a>

          <p class="pdp-note">Lo enviamos a toda Colombia. El costo del envío depende de tu ciudad y te lo confirmamos por WhatsApp antes de pagar.</p>

          <div class="accordion">
            <details open>
              <summary>Descripción</summary>
              <div><p>${esc(p.description)}</p>
                <dl class="specs">
                  <div><dt>Casa</dt><dd>${esc(p.house)}</dd></div>
                  <div><dt>Concentración</dt><dd>${esc(p.concentration)}</dd></div>
                  <div><dt>Familia olfativa</dt><dd>${esc(p.family)}</dd></div>
                  <div><dt>Perfil</dt><dd>${esc(p.gender)}</dd></div>
                  <div><dt>Lanzamiento</dt><dd>${p.year}</dd></div>
                  <div><dt>Momentos</dt><dd>${p.moments.map(esc).join(", ")}</dd></div>
                </dl>
              </div>
            </details>
            <details>
              <summary>Notas olfativas</summary>
              <div class="pyramid">
                <div><p class="label">Salida</p><p>${p.notes.salida.map(esc).join(", ")}</p></div>
                <div><p class="label">Corazón</p><p>${p.notes.corazon.map(esc).join(", ")}</p></div>
                <div><p class="label">Fondo</p><p>${p.notes.fondo.map(esc).join(", ")}</p></div>
                <p class="tiny muted">Notas olfativas según información del fabricante.</p>
              </div>
            </details>
            <details>
              <summary>Origen y condición</summary>
              <div><p>${esc(p.condition)}</p><p class="muted">Decant fraccionado y comercializado por JCJ Fragrance. Presentación independiente, no oficial de ${esc(p.house)}. JCJ Fragrance no está afiliada a la casa perfumista.</p></div>
            </details>
            <details>
              <summary>Envío y entrega</summary>
              <div><p>Despachamos a toda Colombia. Al confirmar tu pedido por WhatsApp te compartimos el costo de envío según tu ciudad, los medios de pago disponibles y el tiempo estimado de entrega. <a href="envios.html">Ver política de envíos y garantía</a>.</p></div>
            </details>
          </div>
        </div>
      </div>
      <section class="section container">
        <h2 class="h2" style="margin-bottom:48px">Otros perfumes</h2>
        <div class="grid grid-3" id="related"></div>
      </section>`;

    const update = () => {
      $("#pdp-price").textContent = fmt(p.prices[ml] * qty);
      $("#pdp-unit").textContent = `${ml} ml${qty > 1 ? ` x ${qty}` : ""}`;
      $(".pdp-block .tiny").innerHTML = `Rinde unas ${{ 5: "50", 10: "100", 30: "300" }[ml]} atomizaciones.`;
      const main = $("#pdp-main");
      main.classList.remove("wide");
      main.innerHTML = media(p, ml, true);
      $$(".pdp-thumb").forEach((x) => x.classList.toggle("on", +x.dataset.ml === ml));
      $("#pdp-wa").href = waLink(`Hola JCJ Fragrance, quiero comprar:\n\n- ${p.name} (${p.house}), ${ml} ml x ${qty}: ${fmt(p.prices[ml] * qty)}\n\n¿Me confirman disponibilidad, costo de envío y medios de pago?`);
    };
    $$(".size-card").forEach((b) => b.addEventListener("click", () => {
      ml = +b.dataset.ml;
      $$(".size-card").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", String(x === b)); });
      update();
    }));
    $$("#pdp-qty button").forEach((b) => b.addEventListener("click", () => {
      qty = Math.max(1, Math.min(20, qty + +b.dataset.d));
      $("#pdp-qty span").textContent = qty; update();
    }));
    $("#pdp-add").addEventListener("click", () => addToCart(p.slug, ml, qty, true));
    $("#pdp-wa").addEventListener("click", () => track("InitiateCheckout", { value: p.prices[ml] * qty, currency: "COP" }));
    $$(".pdp-thumb").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.ml) { const sc = $(`.size-card[data-ml="${b.dataset.ml}"]`); sc && !sc.disabled && sc.click(); return; }
      $$(".pdp-thumb").forEach((x) => x.classList.toggle("on", x === b));
      const v = views[+b.dataset.i];
      const main = $("#pdp-main");
      main.classList.add("wide");
      main.innerHTML = `<img class="photo photo-wide" src="${esc(v.src)}" alt="Comparativa de formatos 5, 10 y 30 ml de ${esc(p.name)}">`;
    }));
    update();

    const rel = $("#related");
    const others = P.filter((x) => x.slug !== p.slug);
    rel.innerHTML = others.map(productCard).join("");
    bindCards(rel);
    track("ViewContent", { content_ids: [p.slug], content_name: p.name, currency: "COP", value: p.prices[ml] });

    // Datos estructurados (SEO)
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product",
      name: `Decant ${p.name} — ${p.house}`, description: p.description, brand: { "@type": "Brand", name: "JCJ Fragrance" },
      offers: { "@type": "AggregateOffer", priceCurrency: "COP", lowPrice: minPrice(p), highPrice: Math.max(...C.sizes.map((s) => p.prices[s])), offerCount: C.sizes.length, availability: "https://schema.org/InStock" },
    });
    document.head.appendChild(ld);
  }

  /* ---------- Cookies ---------- */
  function cookieBanner() {
    if (localStorage.getItem("jcj_consent")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div class="cookie" role="dialog" aria-live="polite" aria-label="Preferencias de cookies">
        <p>Usamos almacenamiento esencial para recordar tu bolsa de compras y, con tu autorización, cookies de medición para mejorar tu experiencia. <a href="cookies.html">Más información</a>.</p>
        <div class="cookie-actions">
          <button class="btn btn-secondary btn-sm" data-c="essential">Solo esenciales</button>
          <button class="btn btn-primary btn-sm" data-c="all">Aceptar todas</button>
        </div>
      </div>`);
    $$(".cookie button").forEach((b) => b.addEventListener("click", () => {
      localStorage.setItem("jcj_consent", b.dataset.c);
      const el = $(".cookie"); el.classList.add("hide"); setTimeout(() => el.remove(), 300);
      document.dispatchEvent(new CustomEvent("jcj:consent", { detail: b.dataset.c }));
    }));
  }

  /* ---------- Links sociales en contenido estático ---------- */
  function hydrateLinks() {
    $$("[data-wa]").forEach((a) => { a.href = waLink(a.dataset.wa || "Hola JCJ Fragrance"); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-ig]").forEach((a) => { a.href = igLink; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-tt]").forEach((a) => { a.href = ttLink; a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-icon]").forEach((el) => { el.insertAdjacentHTML("afterbegin", I[el.dataset.icon] || ""); });
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    const rc = $("#reset-consent");
    rc && rc.addEventListener("click", () => { localStorage.removeItem("jcj_consent"); location.reload(); });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    Cart.load();
    renderChrome();
    hydrateLinks();
    renderCart();
    pageHome();
    pageCatalog();
    pageProduct();
    splitHeadings();
    observeReveal();
    motion();
    cookieBanner();
    // Monograma: animación de entrada discreta (Manual §12)
    requestAnimationFrame(() => document.body.classList.add("ready"));
  });

  window.JCJ = { Cart, addToCart, openDrawer, decantSVG };
})();
