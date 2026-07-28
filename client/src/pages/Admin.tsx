import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  Loader2,
  LogIn,
  Phone,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ASSETS } from "@/lib/assets";
import { trpc } from "@/lib/trpc";
import { dateLabel } from "@shared/orders";

type OrderStatus = "pending" | "confirmed" | "cancelled";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  pending: "bg-[#F6E8D8] text-[#8a5a2a]",
  confirmed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

function parsePhotoUrls(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(u => typeof u === "string") : [];
  } catch {
    return [];
  }
}

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [tab, setTab] = useState<string>("pending");
  const utils = trpc.useUtils();

  const isAdmin = isAuthenticated && user?.role === "admin";

  const ordersQuery = trpc.admin.orders.useQuery(undefined, { enabled: isAdmin });
  const capacityQuery = trpc.admin.capacity.useQuery(undefined, { enabled: isAdmin });

  const setStatus = trpc.admin.setStatus.useMutation({
    onSuccess: () => {
      utils.admin.orders.invalidate();
      utils.admin.capacity.invalidate();
      utils.ordering.availability.invalidate();
      toast.success("Pedido actualizado.");
    },
    onError: err => toast.error(err.message),
  });

  const grouped = useMemo(() => {
    const orders = ordersQuery.data ?? [];
    return {
      pending: orders.filter(o => o.status === "pending"),
      confirmed: orders.filter(o => o.status === "confirmed"),
      cancelled: orders.filter(o => o.status === "cancelled"),
    };
  }, [ordersQuery.data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm rounded-3xl border border-secondary bg-card p-8 text-center">
          <img src={ASSETS.logo} alt="Sweet Vanilla" className="mx-auto h-14 w-14 rounded-full" />
          <h1 className="mt-4 font-display text-xl text-primary">Panel de pedidos</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para administrar los pedidos de Sweet Vanilla.
          </p>
          <Button className="mt-5 rounded-full px-7 font-bold" onClick={() => startLogin()}>
            <LogIn className="h-4 w-4" /> Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm rounded-3xl border border-secondary bg-card p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 font-display text-xl text-primary">Acceso restringido</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta página es solo para la administradora de Sweet Vanilla.
          </p>
          <Button asChild variant="outline" className="mt-5 rounded-full border-primary font-bold text-primary">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Volver al sitio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-secondary bg-background/90 backdrop-blur-md">
        <div className="container flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2.5">
            <img src={ASSETS.logo} alt="Sweet Vanilla" className="h-9 w-9 rounded-full" />
            <div>
              <p className="font-display text-base font-semibold leading-tight text-primary">
                Panel de pedidos
              </p>
              <p className="text-[0.72rem] text-muted-foreground">Sweet Vanilla · {user?.name}</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full border-primary font-bold text-primary">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" /> Sitio
            </Link>
          </Button>
        </div>
      </header>

      <main className="container max-w-4xl py-8">
        {/* Capacity overview */}
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-primary">
            <CalendarDays className="h-4.5 w-4.5 text-caramel" /> Cupo por fecha de entrega
          </h2>
          {capacityQuery.isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {capacityQuery.data?.map(d => (
                <div
                  key={d.date}
                  className={`rounded-xl border px-3 py-2.5 text-center ${
                    d.used >= d.capacity ? "border-destructive/40 bg-destructive/5" : "border-secondary bg-card"
                  }`}>
                  <p className="text-[0.8rem] font-bold text-primary">{dateLabel(d.date)}</p>
                  <p className={`text-[0.76rem] ${d.used >= d.capacity ? "font-bold text-destructive" : "text-muted-foreground"}`}>
                    {d.used} / {d.capacity} pedidos
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-[0.76rem] text-muted-foreground">
            Los pedidos cancelados no ocupan cupo. Confirmados y pendientes sí cuentan.
          </p>
        </section>

        {/* Orders */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full justify-start rounded-full bg-secondary/60">
            {(["pending", "confirmed", "cancelled"] as OrderStatus[]).map(s => (
              <TabsTrigger key={s} value={s} className="rounded-full font-bold data-[state=active]:text-primary">
                {STATUS_LABEL[s]} ({grouped[s].length})
              </TabsTrigger>
            ))}
          </TabsList>

          {(["pending", "confirmed", "cancelled"] as OrderStatus[]).map(s => (
            <TabsContent key={s} value={s} className="mt-4 space-y-3.5">
              {ordersQuery.isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : grouped[s].length === 0 ? (
                <div className="rounded-2xl border border-dashed border-secondary py-10 text-center text-sm text-muted-foreground">
                  No hay pedidos {STATUS_LABEL[s].toLowerCase()}s por ahora.
                </div>
              ) : (
                grouped[s].map(o => {
                  const photos = parsePhotoUrls(o.photoUrls);
                  return (
                    <article key={o.id} className="rounded-2xl border border-secondary bg-card p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-[1.05rem] font-semibold text-primary">
                              #{o.id} · {o.item}
                            </h3>
                            <Badge className={`rounded-full border-0 ${STATUS_BADGE[o.status as OrderStatus]}`}>
                              {STATUS_LABEL[o.status as OrderStatus]}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-[0.82rem] text-muted-foreground">
                            Entrega: <strong className="text-foreground">{dateLabel(o.deliveryDate)}</strong> ·
                            Recibido {new Date(o.createdAt).toLocaleDateString("es-US", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <p className="text-[1.05rem] font-bold text-caramel">${o.estimatedTotal}</p>
                      </div>

                      <dl className="mt-3 grid gap-x-6 gap-y-1 text-[0.86rem] sm:grid-cols-2">
                        {o.flavor && (
                          <div className="flex gap-1.5">
                            <dt className="font-bold text-primary">{o.productType === "churros" ? "Topping:" : "Sabor:"}</dt>
                            <dd>{o.flavor}</dd>
                          </div>
                        )}
                        {o.filling && (
                          <div className="flex gap-1.5">
                            <dt className="font-bold text-primary">{o.productType === "churros" ? "Extras:" : "Relleno:"}</dt>
                            <dd>{o.filling}</dd>
                          </div>
                        )}
                        {o.decoration && (
                          <div className="flex gap-1.5 sm:col-span-2">
                            <dt className="font-bold text-primary">Decoración:</dt>
                            <dd>{o.decoration}</dd>
                          </div>
                        )}
                        {o.occasion && (
                          <div className="flex gap-1.5">
                            <dt className="font-bold text-primary">Ocasión:</dt>
                            <dd>{o.occasion}</dd>
                          </div>
                        )}
                        {o.notes && (
                          <div className="flex gap-1.5 sm:col-span-2">
                            <dt className="font-bold text-primary">Notas:</dt>
                            <dd>{o.notes}</dd>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <dt className="font-bold text-primary">Cliente:</dt>
                          <dd>{o.customerName}</dd>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-caramel" />
                          <dd>
                            <a
                              href={`https://wa.me/${o.customerPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-primary underline decoration-2 underline-offset-2">
                              {o.customerPhone}
                            </a>
                          </dd>
                        </div>
                      </dl>

                      {photos.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <Camera className="h-4 w-4 text-caramel" />
                          <div className="flex gap-2">
                            {photos.map((url, i) => (
                              <a key={url} href={url} target="_blank" rel="noreferrer">
                                <img
                                  src={url}
                                  alt={`Foto de inspiración ${i + 1}`}
                                  className="h-14 w-14 rounded-lg border border-secondary object-cover transition-transform hover:scale-105"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {o.status !== "confirmed" && (
                          <Button
                            size="sm"
                            className="rounded-full font-bold"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ orderId: o.id, status: "confirmed" })}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmar
                          </Button>
                        )}
                        {o.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full border-destructive/50 font-bold text-destructive hover:bg-destructive/5"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ orderId: o.id, status: "cancelled" })}>
                            <XCircle className="h-3.5 w-3.5" /> Cancelar
                          </Button>
                        )}
                        {o.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full font-bold text-muted-foreground"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ orderId: o.id, status: "pending" })}>
                            <RotateCcw className="h-3.5 w-3.5" /> Marcar pendiente
                          </Button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
