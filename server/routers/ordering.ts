import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  DAILY_CAPACITY,
  MAX_PHOTOS,
  MAX_PHOTO_MB,
  buildWhatsAppMessage,
  hasMinNotice,
  isWeekend,
  upcomingWeekendKeys,
  whatsAppLink,
} from "@shared/orders";
import { createOrder, getOrderCountsByDate } from "../db";
import { storagePut } from "../storage";
import { publicProcedure, router } from "../_core/trpc";

const orderInputSchema = z.object({
  productType: z.enum(["pastel", "docena", "churros"]),
  item: z.string().min(1).max(191),
  quantity: z.number().int().min(1).max(10),
  flavor: z.string().max(191).optional(),
  filling: z.string().max(191).optional(),
  decoration: z.string().max(2000).optional(),
  occasion: z.string().max(191).optional(),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  customerName: z.string().min(1).max(191),
  customerPhone: z.string().min(7).max(32),
  notes: z.string().max(2000).optional(),
  photoUrls: z.array(z.string()).max(MAX_PHOTOS).default([]),
  estimatedTotal: z.number().int().min(0),
});

export const orderingRouter = router({
  /** Next 8 weekend dates with availability info, computed against the live DB */
  availability: publicProcedure.query(async () => {
    const today = new Date();
    const keys = upcomingWeekendKeys(today, 8);
    const counts = await getOrderCountsByDate(keys);
    return keys.map(key => {
      const used = counts[key] ?? 0;
      const notice = hasMinNotice(key, today);
      const remaining = Math.max(0, DAILY_CAPACITY - used);
      return {
        date: key,
        remaining,
        selectable: notice && remaining > 0,
        reason: !notice ? ("tooSoon" as const) : remaining === 0 ? ("full" as const) : null,
      };
    });
  }),

  /** Upload up to 3 inspiration photos (base64) to S3, returns public URLs */
  uploadPhotos: publicProcedure
    .input(
      z.object({
        photos: z
          .array(
            z.object({
              name: z.string().max(200),
              mimeType: z.string().regex(/^image\//),
              dataBase64: z.string(),
            }),
          )
          .min(1)
          .max(MAX_PHOTOS),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const urls: string[] = [];
      for (const photo of input.photos) {
        const buffer = Buffer.from(photo.dataBase64, "base64");
        if (buffer.length > MAX_PHOTO_MB * 1024 * 1024) {
          throw new TRPCError({
            code: "PAYLOAD_TOO_LARGE",
            message: `${photo.name} supera el límite de ${MAX_PHOTO_MB} MB.`,
          });
        }
        const ext = photo.name.includes(".") ? photo.name.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
        const key = `inspiracion/${Date.now()}-${nanoid(8)}.${ext || "jpg"}`;
        const { url } = await storagePut(key, buffer, photo.mimeType);
        const origin = `${ctx.req.protocol}://${ctx.req.headers.host}`;
        urls.push(url.startsWith("http") ? url : `${origin}${url}`);
      }
      return { urls };
    }),

  /** Validate business rules, persist the order, and return the WhatsApp link */
  submit: publicProcedure.input(orderInputSchema).mutation(async ({ input }) => {
    const today = new Date();
    if (!isWeekend(input.deliveryDate)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Solo entregamos sábados y domingos." });
    }
    if (!hasMinNotice(input.deliveryDate, today)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Los pedidos requieren mínimo 4 días de anticipación.",
      });
    }
    const counts = await getOrderCountsByDate([input.deliveryDate]);
    if ((counts[input.deliveryDate] ?? 0) >= DAILY_CAPACITY) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Esa fecha ya no tiene cupo disponible. Por favor elige otra.",
      });
    }
    const orderId = await createOrder({
      productType: input.productType,
      item: input.item,
      quantity: input.quantity,
      flavor: input.flavor ?? null,
      filling: input.filling ?? null,
      decoration: input.decoration ?? null,
      occasion: input.occasion ?? null,
      deliveryDate: input.deliveryDate,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      notes: input.notes ?? null,
      photoUrls: JSON.stringify(input.photoUrls),
      estimatedTotal: input.estimatedTotal,
      status: "pending",
    });
    const message = buildWhatsAppMessage(input);
    return { orderId, whatsAppUrl: whatsAppLink(message), message };
  }),
});
