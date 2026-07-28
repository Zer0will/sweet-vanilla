import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getOrderCountsByDate: vi.fn(),
  listOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getOrderCountsByDate: mocks.getOrderCountsByDate,
    listOrders: mocks.listOrders,
    updateOrderStatus: mocks.updateOrderStatus,
  };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { DAILY_CAPACITY } from "../shared/orders";

function createCtx(role: "admin" | "user" | null): TrpcContext {
  const user =
    role === null
      ? null
      : {
          id: 1,
          openId: "u1",
          email: "u@x.com",
          name: "Diana",
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  } as TrpcContext;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getOrderCountsByDate.mockResolvedValue({});
  mocks.listOrders.mockResolvedValue([]);
  mocks.updateOrderStatus.mockResolvedValue(true);
});

describe("admin auth gating", () => {
  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createCtx(null));
    await expect(caller.admin.orders()).rejects.toThrow();
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createCtx("user"));
    await expect(caller.admin.orders()).rejects.toThrow(/administrador/);
    await expect(caller.admin.setStatus({ orderId: 1, status: "confirmed" })).rejects.toThrow();
  });

  it("allows admin users", async () => {
    const caller = appRouter.createCaller(createCtx("admin"));
    await expect(caller.admin.orders()).resolves.toEqual([]);
  });
});

describe("admin.setStatus", () => {
  it("updates order status", async () => {
    const caller = appRouter.createCaller(createCtx("admin"));
    const result = await caller.admin.setStatus({ orderId: 5, status: "cancelled" });
    expect(result.success).toBe(true);
    expect(mocks.updateOrderStatus).toHaveBeenCalledWith(5, "cancelled");
  });

  it("throws when the order does not exist", async () => {
    mocks.updateOrderStatus.mockResolvedValue(false);
    const caller = appRouter.createCaller(createCtx("admin"));
    await expect(caller.admin.setStatus({ orderId: 999, status: "confirmed" })).rejects.toThrow(
      /no encontrado/,
    );
  });
});

describe("admin.capacity", () => {
  it("returns 8 upcoming weekend dates with usage", async () => {
    mocks.getOrderCountsByDate.mockImplementation(async (keys: string[]) => ({ [keys[0]]: 3 }));
    const caller = appRouter.createCaller(createCtx("admin"));
    const result = await caller.admin.capacity();
    expect(result).toHaveLength(8);
    expect(result[0].used).toBe(3);
    expect(result[0].capacity).toBe(DAILY_CAPACITY);
    expect(result[1].used).toBe(0);
  });
});
