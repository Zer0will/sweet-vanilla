import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DAILY_CAPACITY, upcomingWeekendKeys } from "@shared/orders";
import { getOrderCountsByDate, listOrders, updateOrderStatus } from "../db";
import { protectedProcedure, router } from "../_core/trpc";

/** Only the site owner (admin role) may manage orders */
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo el administrador puede acceder." });
  }
  return next({ ctx });
});

export const adminRouter = router({
  /** All orders, newest first */
  orders: adminProcedure.query(async () => {
    return listOrders();
  }),

  /** Occupancy per upcoming weekend date (pending + confirmed) */
  capacity: adminProcedure.query(async () => {
    const keys = upcomingWeekendKeys(new Date(), 8);
    const counts = await getOrderCountsByDate(keys);
    return keys.map(key => ({
      date: key,
      used: counts[key] ?? 0,
      capacity: DAILY_CAPACITY,
    }));
  }),

  /** Confirm or cancel an order; cancelled orders no longer count toward capacity */
  setStatus: adminProcedure
    .input(
      z.object({
        orderId: z.number().int().positive(),
        status: z.enum(["pending", "confirmed", "cancelled"]),
      }),
    )
    .mutation(async ({ input }) => {
      const updated = await updateOrderStatus(input.orderId, input.status);
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pedido no encontrado." });
      }
      return { success: true } as const;
    }),
});
