import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getOrderCountsByDate: vi.fn(),
  createOrder: vi.fn(),
  storagePut: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getOrderCountsByDate: mocks.getOrderCountsByDate,
    createOrder: mocks.createOrder,
  };
});

vi.mock("./storage", () => ({
  storagePut: mocks.storagePut,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { DAILY_CAPACITY, toDateKey, upcomingWeekendKeys } from "../shared/orders";

function createCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { host: "sweetvanilla.test" } } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  } as TrpcContext;
}

/** A valid weekend date far enough in the future from real "today" */
function futureValidDate(): string {
  return upcomingWeekendKeys(new Date(), 8)[7];
}

function validOrder() {
  return {
    productType: "pastel" as const,
    item: 'Pastel 6"',
    quantity: 1,
    flavor: "Tradicional",
    filling: "Dulce de leche",
    deliveryDate: futureValidDate(),
    customerName: "Test",
    customerPhone: "2065550000",
    photoUrls: [],
    estimatedTotal: 80,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getOrderCountsByDate.mockResolvedValue({});
  mocks.createOrder.mockResolvedValue(1);
});

describe("ordering.availability", () => {
  it("returns 8 weekend dates with remaining capacity", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ordering.availability();
    expect(result).toHaveLength(8);
    for (const d of result) {
      expect(d.remaining).toBeLessThanOrEqual(DAILY_CAPACITY);
      expect(new Date(d.date).toString()).not.toBe("Invalid Date");
    }
  });

  it("marks fully booked dates as not selectable", async () => {
    const keys = upcomingWeekendKeys(new Date(), 8);
    const fullDate = keys[7];
    mocks.getOrderCountsByDate.mockResolvedValue({ [fullDate]: DAILY_CAPACITY });
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ordering.availability();
    const full = result.find(d => d.date === fullDate)!;
    expect(full.remaining).toBe(0);
    expect(full.selectable).toBe(false);
    expect(full.reason).toBe("full");
  });
});

describe("ordering.submit", () => {
  it("accepts a valid order and returns a WhatsApp link", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ordering.submit(validOrder());
    expect(result.orderId).toBe(1);
    expect(result.whatsAppUrl).toContain("https://wa.me/12065716064?text=");
    expect(result.message).toContain("🧁 NUEVO PEDIDO — Sweet Vanilla");
    expect(mocks.createOrder).toHaveBeenCalledOnce();
  });

  it("rejects non-weekend delivery dates", async () => {
    const caller = appRouter.createCaller(createCtx());
    // find a future Monday
    const d = new Date();
    d.setDate(d.getDate() + 14);
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    await expect(
      caller.ordering.submit({ ...validOrder(), deliveryDate: toDateKey(d) }),
    ).rejects.toThrow(/sábados y domingos/);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });

  it("rejects dates with less than 4 days notice", async () => {
    const caller = appRouter.createCaller(createCtx());
    // nearest weekend day within 3 days (may not exist → construct: tomorrow if weekend else skip test path via past weekend)
    const d = new Date();
    d.setDate(d.getDate() - (d.getDay() === 0 ? 1 : d.getDay() === 6 ? 0 : d.getDay() + 1)); // most recent Saturday
    await expect(
      caller.ordering.submit({ ...validOrder(), deliveryDate: toDateKey(d) }),
    ).rejects.toThrow(/4 días/);
  });

  it("rejects orders when the date is at capacity", async () => {
    const date = futureValidDate();
    mocks.getOrderCountsByDate.mockResolvedValue({ [date]: DAILY_CAPACITY });
    const caller = appRouter.createCaller(createCtx());
    await expect(
      caller.ordering.submit({ ...validOrder(), deliveryDate: date }),
    ).rejects.toThrow(/cupo/);
    expect(mocks.createOrder).not.toHaveBeenCalled();
  });
});

describe("ordering.uploadPhotos", () => {
  it("uploads photos and returns absolute URLs", async () => {
    mocks.storagePut.mockResolvedValue({ key: "inspiracion/x.jpg", url: "/manus-storage/x.jpg" });
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.ordering.uploadPhotos({
      photos: [{ name: "foto.jpg", mimeType: "image/jpeg", dataBase64: Buffer.from("test").toString("base64") }],
    });
    expect(result.urls).toHaveLength(1);
    expect(result.urls[0]).toBe("https://sweetvanilla.test/manus-storage/x.jpg");
  });

  it("rejects photos over the size limit", async () => {
    const caller = appRouter.createCaller(createCtx());
    const big = Buffer.alloc(9 * 1024 * 1024).toString("base64");
    await expect(
      caller.ordering.uploadPhotos({
        photos: [{ name: "grande.jpg", mimeType: "image/jpeg", dataBase64: big }],
      }),
    ).rejects.toThrow(/8 MB/);
    expect(mocks.storagePut).not.toHaveBeenCalled();
  });
});

