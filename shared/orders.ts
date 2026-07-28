/**
 * Shared order-domain logic for Sweet Vanilla.
 * Used by both the client (order flow UI) and the server (validation).
 */

export const WA_NUMBER = "12065716064";
export const WA_DISPLAY = "(206) 571-6064";
export const INSTAGRAM_HANDLE = "@sweet_vanilla2025";
export const INSTAGRAM_URL = "https://instagram.com/sweet_vanilla2025";
export const DAILY_CAPACITY = 5;
export const MIN_NOTICE_DAYS = 4;
export const MAX_PHOTOS = 3;
export const MAX_PHOTO_MB = 8;

export type ProductType = "pastel" | "docena" | "churros";

export interface CakeSize {
  id: string;
  name: string;
  portions: string;
  basePrice: number;
}

export const CAKE_SIZES: CakeSize[] = [
  { id: "6in", name: 'Pastel 6"', portions: "8–10 porciones", basePrice: 80 },
  { id: "8in", name: 'Pastel 8"', portions: "15–20 porciones", basePrice: 100 },
  { id: "heart6", name: 'Pastel de corazón 6"', portions: "8–10 porciones", basePrice: 85 },
];

export interface CakeFlavor {
  id: string;
  name: string;
  description: string;
  /** "tradicional" has +$5 fruit cocktail option; "chocolate" chooses ganache */
  fillingChoice: "tradicional" | "chocolate" | null;
}

export const CAKE_FLAVORS: CakeFlavor[] = [
  {
    id: "tradicional",
    name: "Tradicional",
    description: "Vainilla húmedo en tres leches, relleno de dulce de leche",
    fillingChoice: "tradicional",
  },
  {
    id: "strawberry",
    name: "Strawberry Creamcheese",
    description: "Tres leches, relleno de fresas con crema y cream cheese",
    fillingChoice: null,
  },
  {
    id: "chocolate",
    name: "Chocolate Deluxe",
    description: "Torta húmeda de chocolate semidulce con almíbar de cocoa",
    fillingChoice: "chocolate",
  },
  {
    id: "moca",
    name: "Moca Cookie Crumble",
    description: "Vainilla húmeda en moca, relleno de mousse de chocolate y crumbles de Oreo",
    fillingChoice: null,
  },
];

export const FRUIT_FILLING_EXTRA = 5;

export interface DocenaItem {
  id: string;
  name: string;
  units: number;
  price: number;
}

export const DOCENA_ITEMS: DocenaItem[] = [
  { id: "gelatinas", name: "Mini gelatinas", units: 12, price: 60 },
  { id: "flan", name: "Mini flan", units: 24, price: 50 },
  { id: "chocoflan", name: "Mini chocoflan", units: 12, price: 50 },
  { id: "cupcakes", name: "Cupcakes", units: 12, price: 50 },
  { id: "cakepops", name: "Cake pops redondos", units: 12, price: 45 },
  { id: "popsicle", name: "Popsicle cake pops", units: 12, price: 60 },
  { id: "churrocheesecake", name: "Churrocheesecake", units: 16, price: 50 },
  { id: "moussecheesecake", name: "Mousse de cheesecake en vasito", units: 12, price: 45 },
  { id: "mousseoreo", name: "Mousse de Oreo y pudín", units: 12, price: 35 },
  { id: "gelatinamosaico", name: "Gelatina mosaico en vasito", units: 12, price: 45 },
];

export const CHURROS_BOX_PRICE = 8;
export const CHURROS_EXTRA_TOPPING = 2;
export const CHURROS_TOPPINGS = ["Nutella", "Leche condensada", "Dulce de leche"];

/** Days of week / months in Spanish for date labels */
export const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Format a Date as YYYY-MM-DD using its local components */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD into a local-midnight Date */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Human label like "sábado 15 de agosto" */
export function dateLabel(key: string): string {
  const d = fromDateKey(key);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export function isWeekend(key: string): boolean {
  const dow = fromDateKey(key).getDay();
  return dow === 0 || dow === 6;
}

/** True if the date is at least MIN_NOTICE_DAYS after `today` */
export function hasMinNotice(key: string, today: Date): boolean {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const min = new Date(t);
  min.setDate(min.getDate() + MIN_NOTICE_DAYS);
  return fromDateKey(key).getTime() >= min.getTime();
}

/** Next `count` weekend date keys strictly after `today` */
export function upcomingWeekendKeys(today: Date, count = 8): string[] {
  const keys: string[] = [];
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (keys.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) keys.push(toDateKey(d));
  }
  return keys;
}

export interface OrderInput {
  productType: ProductType;
  item: string;
  quantity: number;
  flavor?: string;
  filling?: string;
  decoration?: string;
  occasion?: string;
  deliveryDate: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  photoUrls: string[];
  estimatedTotal: number;
}

/** Build the structured WhatsApp message per the PRD format */
export function buildWhatsAppMessage(o: OrderInput): string {
  const lines: string[] = ["🧁 NUEVO PEDIDO — Sweet Vanilla"];
  lines.push(`Producto: ${o.item}${o.quantity > 1 ? ` × ${o.quantity}` : ""}`);
  if (o.flavor) lines.push(`${o.productType === "churros" ? "Topping" : "Sabor"}: ${o.flavor}`);
  if (o.filling) lines.push(`${o.productType === "churros" ? "Extras" : "Relleno"}: ${o.filling}`);
  if (o.decoration) lines.push(`Decoración: ${o.decoration}`);
  if (o.occasion) lines.push(`Ocasión: ${o.occasion}`);
  if (o.photoUrls.length > 0) {
    lines.push(`Fotos: ${o.photoUrls.join(" · ")}`);
  }
  lines.push(`Entrega: ${dateLabel(o.deliveryDate)}`);
  lines.push(`Cliente: ${o.customerName} · ${o.customerPhone}`);
  if (o.notes) lines.push(`Notas: ${o.notes}`);
  lines.push(`Total estimado: $${o.estimatedTotal}${o.productType === "pastel" ? " + decoración" : ""}`);
  lines.push("— Enviado desde sweetvanilla · web");
  return lines.join("\n");
}

export function whatsAppLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
