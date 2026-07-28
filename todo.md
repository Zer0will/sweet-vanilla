# Sweet Vanilla — Project TODO

## Setup & Branding
- [x] Upload all webp gallery assets + logo via manus-upload-file --webdev
- [x] Global theme: sage green / cream / pine palette, Fraunces + Karla fonts, light mode
- [x] Spanish-language meta tags, title, SEO description (pasteles Shoreline, repostería Lake Forest Park, tres leches Seattle)

## Pages & Sections (single-page layout with anchors)
- [x] Sticky top nav: logo image, Menú / Galería / Políticas / Pick up links + "Ordenar" CTA button
- [x] Hero: hero-black-gold-cake photo, headline exactly "Hecho con amor, al estilo Sweet Vanilla.", subtext, CTAs "Ordena en línea" + "Ver menú"
- [x] Menu section: 4 cake flavor cards (Tradicional, Strawberry Creamcheese, Chocolate Deluxe, Moca Cookie Crumble) with photos + prices
- [x] Menu section: full price table (docena/paquete items + churros + porciones + especiales)
- [x] Gallery grid: 9 webp photos with captions + Instagram @sweet_vanilla2025 callout
- [x] Policies section: anticipo/pago, plazos, cancelaciones, imágenes de referencia, responsabilidad, manejo del producto
- [x] Pickup section: Shoreline & Lake Forest Park info, weekend-only schedule, WhatsApp button
- [x] Footer: logo, WhatsApp (206) 571-6064, Instagram link

## Order Flow (7 steps)
- [x] Step 1: product type (pastel personalizado / por docena / churros)
- [x] Step 2a: cake size (6" $80, 8" $100, corazón 6" $85)
- [x] Step 2b: docena item picker (10 items with prices)
- [x] Step 2c: churros config (boxes qty, topping, extras +$2)
- [x] Step 3: flavor selection; Tradicional → optional coctel de frutas +$5; Chocolate Deluxe → ganache choice
- [x] Step 4: decoration description, occasion, up to 3 inspiration photos (8MB max each) with disclaimer notice
- [x] Step 5: weekend-only date picker, 4-day min notice, 5 orders/day cap from live DB, remaining slots shown
- [x] Step 6: customer name, WhatsApp phone, notes
- [x] Step 7: summary with estimated total, 50% deposit note, WhatsApp send button
- [x] Progress bar + back navigation + reset
- [x] Post-submit confirmation screen explaining Diana confirms via WhatsApp

## Backend
- [x] DB schema: orders table (product, flavor, filling, deco, occasion, date, name, phone, notes, photo URLs, estimated total, status)
- [x] tRPC: availability query (order counts per date, next 8 weekend dates)
- [x] tRPC: order submit mutation (validates date rules + capacity, stores order, returns wa.me link data)
- [x] Photo upload: S3 storage via storagePut, public URLs in WhatsApp message
- [x] WhatsApp message builder matching PRD format (🧁 NUEVO PEDIDO — Sweet Vanilla ...)

## Quality
- [x] Vitest tests: date rules (weekend-only, 4-day notice), capacity cap, order creation, WhatsApp message format (16 tests passing)
- [x] Mobile-first responsive check (375px) + desktop check
- [x] End-to-end browser test: full order flow with photo upload, DB persistence verified, test data cleaned
- [x] Save checkpoint & deliver
