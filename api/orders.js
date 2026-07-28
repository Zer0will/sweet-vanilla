import { buildWhatsAppMessage, hasMinNotice, isWeekend, json, readJson, whatsAppLink } from "./_orders.js";

function text(value, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  let payload;
  try {
    payload = await readJson(req);
  } catch {
    return json(res, 400, { error: "La solicitud no es válida." });
  }

  const order = {
    productType: text(payload.productType, 40),
    item: text(payload.item, 191),
    quantity: Number.isInteger(payload.quantity) ? payload.quantity : Number.parseInt(payload.quantity || 1, 10),
    flavor: text(payload.flavor, 191),
    filling: text(payload.filling, 191),
    decoration: text(payload.decoration, 2000),
    occasion: text(payload.occasion, 191),
    deliveryDate: text(payload.deliveryDate, 10),
    customerName: text(payload.customerName, 191),
    customerPhone: text(payload.customerPhone, 32),
    notes: text(payload.notes, 2000),
    photoUrls: Array.isArray(payload.photoUrls) ? payload.photoUrls.slice(0, 3).map(v => text(v, 500)).filter(Boolean) : [],
    estimatedTotal: Number.isFinite(payload.estimatedTotal) ? Math.round(payload.estimatedTotal) : 0,
  };

  if (!["pastel", "docena", "churros"].includes(order.productType)) {
    return json(res, 400, { error: "El producto no es válido." });
  }
  if (!order.item || !order.customerName || order.customerPhone.length < 7) {
    return json(res, 400, { error: "Faltan detalles necesarios para enviar el pedido." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(order.deliveryDate)) {
    return json(res, 400, { error: "La fecha no es válida." });
  }
  if (!isWeekend(order.deliveryDate)) {
    return json(res, 400, { error: "Solo entregamos sábados y domingos." });
  }
  if (!hasMinNotice(order.deliveryDate)) {
    return json(res, 400, { error: "Los pedidos requieren mínimo 4 días de anticipación." });
  }

  const message = buildWhatsAppMessage(order);
  return json(res, 201, {
    ok: true,
    orderId: crypto.randomUUID(),
    whatsAppUrl: whatsAppLink(message),
    message,
  });
}
