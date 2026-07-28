import { hasMinNotice, isWeekend, json, LIMITS, upcomingWeekendKeys } from "./_orders.js";

export default function handler(req, res) {
  if (req.method !== "GET") return json(res, 405, { error: "Method not allowed" });

  const url = new URL(req.url, `https://${req.headers.host || "sweet-vanilla.vercel.app"}`);
  const date = url.searchParams.get("date");

  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json(res, 400, { error: "Fecha inválida." });
    if (!isWeekend(date)) {
      return json(res, 200, {
        available: false,
        remaining: 0,
        reason: "Las entregas están disponibles únicamente sábados y domingos.",
      });
    }
    if (!hasMinNotice(date)) {
      return json(res, 200, {
        available: false,
        remaining: 0,
        reason: "Se requieren al menos 4 días de anticipación.",
      });
    }
    return json(res, 200, { available: true, remaining: LIMITS.DAILY_CAPACITY });
  }

  const dates = upcomingWeekendKeys(new Date(), 8).map(key => {
    const notice = hasMinNotice(key);
    return {
      date: key,
      remaining: LIMITS.DAILY_CAPACITY,
      selectable: notice,
      reason: notice ? null : "tooSoon",
    };
  });
  return json(res, 200, { dates });
}
