import { describe, expect, it } from "vitest";
import {
  buildWhatsAppMessage,
  dateLabel,
  hasMinNotice,
  isWeekend,
  toDateKey,
  upcomingWeekendKeys,
  whatsAppLink,
  WA_NUMBER,
  type OrderInput,
} from "../shared/orders";

describe("date rules", () => {
  it("identifies weekends correctly", () => {
    expect(isWeekend("2026-08-15")).toBe(true); // Saturday
    expect(isWeekend("2026-08-16")).toBe(true); // Sunday
    expect(isWeekend("2026-08-17")).toBe(false); // Monday
    expect(isWeekend("2026-08-14")).toBe(false); // Friday
  });

  it("enforces the 4-day minimum notice", () => {
    const today = new Date(2026, 7, 10); // Monday Aug 10
    expect(hasMinNotice("2026-08-13", today)).toBe(false); // 3 days out
    expect(hasMinNotice("2026-08-14", today)).toBe(true); // exactly 4 days out
    expect(hasMinNotice("2026-08-15", today)).toBe(true); // 5 days out
    expect(hasMinNotice("2026-08-09", today)).toBe(false); // in the past
  });

  it("generates only upcoming weekend dates", () => {
    const today = new Date(2026, 7, 10); // Monday
    const keys = upcomingWeekendKeys(today, 8);
    expect(keys).toHaveLength(8);
    expect(keys[0]).toBe("2026-08-15");
    expect(keys[1]).toBe("2026-08-16");
    for (const key of keys) expect(isWeekend(key)).toBe(true);
    // strictly in the future
    for (const key of keys) expect(key > toDateKey(today)).toBe(true);
  });

  it("formats Spanish date labels", () => {
    expect(dateLabel("2026-08-15")).toBe("sábado 15 de agosto");
    expect(dateLabel("2026-08-16")).toBe("domingo 16 de agosto");
  });
});

describe("WhatsApp message", () => {
  const baseOrder: OrderInput = {
    productType: "pastel",
    item: 'Pastel de corazón 6"',
    quantity: 1,
    flavor: "Strawberry Creamcheese",
    filling: "Fresas con crema y cream cheese",
    decoration: "verde sage con moños",
    occasion: "cumpleaños",
    deliveryDate: "2026-08-15",
    customerName: "María G.",
    customerPhone: "+1 (206) 555-0000",
    notes: "",
    photoUrls: ["https://example.com/foto1.jpg"],
    estimatedTotal: 85,
  };

  it("matches the PRD structured format", () => {
    const msg = buildWhatsAppMessage(baseOrder);
    expect(msg).toContain("🧁 NUEVO PEDIDO — Sweet Vanilla");
    expect(msg).toContain('Producto: Pastel de corazón 6"');
    expect(msg).toContain("Sabor: Strawberry Creamcheese");
    expect(msg).toContain("Decoración: verde sage con moños");
    expect(msg).toContain("Fotos: https://example.com/foto1.jpg");
    expect(msg).toContain("Entrega: sábado 15 de agosto");
    expect(msg).toContain("Cliente: María G. · +1 (206) 555-0000");
    expect(msg).toContain("Total estimado: $85 + decoración");
  });

  it("uses Topping/Extras labels for churros and omits empty fields", () => {
    const msg = buildWhatsAppMessage({
      ...baseOrder,
      productType: "churros",
      item: "Churros con toppings (2 boxes)",
      quantity: 2,
      flavor: "Nutella",
      filling: "1 topping(s) extra",
      decoration: "",
      occasion: "",
      photoUrls: [],
      estimatedTotal: 20,
    });
    expect(msg).toContain("Topping: Nutella");
    expect(msg).toContain("Extras: 1 topping(s) extra");
    expect(msg).not.toContain("Decoración:");
    expect(msg).not.toContain("Fotos:");
    expect(msg).toContain("Total estimado: $20");
    expect(msg).not.toContain("+ decoración");
  });

  it("builds a wa.me deep link to Diana's number", () => {
    const link = whatsAppLink("hola");
    expect(link).toBe(`https://wa.me/${WA_NUMBER}?text=hola`);
    expect(WA_NUMBER).toBe("12065716064");
  });
});
