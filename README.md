# JCJ Fragrance — Sitio web

Boutique de decants (5 · 10 · 30 ml). Sitio estático (HTML/CSS/JS sin dependencias) construido sobre el **Manual Maestro de Identidad Visual v1.0**: paleta B/N, Cormorant Garamond + Manrope, monograma JCJ.

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: hero, selección destacada, formatos, cómo funciona, pilares, nosotros, FAQ, redes |
| `catalogo.html` | Catálogo con filtros (marca, familia, perfil, tamaño), búsqueda y orden por precio |
| `producto.html?p=<slug>` | Ficha: selector de tamaño, cantidad, notas, origen/condición, compra por WhatsApp |
| `terminos.html`, `privacidad.html`, `cookies.html`, `envios.html` | Legales (Ley 1480/2011, Ley 1581/2012) |

## Cómo se compra

1. El cliente agrega decants a la bolsa (se guarda en el navegador).
2. "Finalizar pedido por WhatsApp" abre WhatsApp (+57 320 650 6648) con el pedido completo, subtotal, nombre y ciudad.
3. Se confirma envío y medio de pago por chat.

## Editar catálogo y precios

Todo está en **`assets/js/data.js`**: precios por tamaño, stock, notas, WhatsApp, Instagram y TikTok.

Para usar **fotos reales**, guárdalas en `assets/img/products/` y ponlas en `images`:

```js
images: ["assets/img/products/khamrah-1.jpg", "assets/img/products/khamrah-2.jpg"],
```

Mientras `images` esté vacío se muestra la ilustración del atomizador JCJ.

## Páginas internas

`index.html` se edita directamente. Las demás se generan desde `tools/pages/*.html` con cabecera/pie compartidos:

```bash
python tools/build.py
```

## Publicar

Sitio 100 % estático: funciona en GitHub Pages (Settings → Pages → rama `main`, carpeta `/`), Netlify, Vercel o Cloudflare Pages.

## Pendiente antes del lanzamiento

- [ ] Precios definitivos (los actuales son de referencia).
- [ ] Confirmar el perfume exacto de Jean Paul Gaultier (las etiquetas dicen solo "Jean Paul Gaultier"; en data.js figura como Le Male Elixir).
- [ ] Fotografía real final (las actuales son mockups del kit, procesadas en `assets/img/products`).
- [ ] Razón social, NIT y ciudad en `terminos.html` y `privacidad.html` (buscar `[RAZÓN SOCIAL]`).
- [ ] Correo corporativo (`hola@jcjfragrance.com` es provisional).
- [ ] Dominio y `canonical` en `index.html`.
- [ ] Revisión legal de textos y requisitos INVIMA de fraccionamiento/rotulado (Manual §13).
- [ ] Monograma vectorial final (los logos actuales salen del raster del manual).
