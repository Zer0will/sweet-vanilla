const WA_NUMBER = "12065716064";
const DAILY_CAPACITY = 5;
const MIN_NOTICE_DAYS = 4;

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(body));
}

export function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { reject(new Error("invalid json")); }
    });
    req.on("error", reject);
  });
}

export function toDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromDateKey(key) {
  const [y, m, d] = String(key).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dateLabel(key) {
  const d = fromDateKey(key);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export function isWeekend(key) {
  const dow = fromDateKey(key).getDay();
  return dow === 0 || dow === 6;
}

export function hasMinNotice(key, today = new Date()) {
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const min = new Date(t);
  min.setDate(min.getDate() + MIN_NOTICE_DAYS);
  return fromDateKey(key).getTime() >= min.getTime();
}

export function upcomingWeekendKeys(today = new Date(), count = 8) {
  const keys = [];
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (keys.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) keys.push(toDateKey(d));
  }
  return keys;
}

export function buildWhatsAppMessage(o) {
  const lines = ["🧁 NUEVO PEDIDO — Sweet Vanilla"];
  lines.push(`Producto: ${o.item}${o.quantity > 1 ? ` × ${o.quantity}` : ""}`);
  if (o.flavor) lines.push(`${o.productType === "churros" ? "Topping" : "Sabor"}: ${o.flavor}`);
  if (o.filling) lines.push(`${o.productType === "churros" ? "Extras" : "Relleno"}: ${o.filling}`);
  if (o.decoration) lines.push(`Decoración: ${o.decoration}`);
  if (o.occasion) lines.push(`Ocasión: ${o.occasion}`);
  if (Array.isArray(o.photoUrls) && o.photoUrls.length) lines.push(`Fotos: ${o.photoUrls.join(" · ")}`);
  lines.push(`Entrega: ${dateLabel(o.deliveryDate)}`);
  lines.push(`Cliente: ${o.customerName} · ${o.customerPhone}`);
  if (o.notes) lines.push(`Notas: ${o.notes}`);
  lines.push(`Total estimado: $${o.estimatedTotal}${o.productType === "pastel" ? " + decoración" : ""}`);
  lines.push("— Enviado desde sweetvanilla · web");
  return lines.join("\n");
}

export function whatsAppLink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const LIMITS = { DAILY_CAPACITY, MIN_NOTICE_DAYS };
