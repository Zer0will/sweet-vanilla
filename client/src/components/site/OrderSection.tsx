import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Camera, Send, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  CAKE_FLAVORS,
  CAKE_SIZES,
  CHURROS_BOX_PRICE,
  CHURROS_EXTRA_TOPPING,
  CHURROS_TOPPINGS,
  DOCENA_ITEMS,
  FRUIT_FILLING_EXTRA,
  MAX_PHOTOS,
  MAX_PHOTO_MB,
  dateLabel,
  type ProductType,
} from "@shared/orders";

/** Step ids in visual order for the progress bar */
type StepId = "producto" | "detalle" | "sabor" | "deco" | "fecha" | "datos" | "resumen" | "listo";
const PROGRESS: Record<StepId, number> = {
  producto: 14, detalle: 28, sabor: 42, deco: 56, fecha: 70, datos: 84, resumen: 100, listo: 100,
};
const STEP_NUM: Record<StepId, string> = {
  producto: "01", detalle: "02", sabor: "03", deco: "04", fecha: "05", datos: "06", resumen: "07", listo: "07",
};

interface OrderState {
  productType: ProductType | null;
  item: string;
  basePrice: number;
  quantity: number;
  flavor: string;
  filling: string;
  extraCost: number;
  decoration: string;
  occasion: string;
  date: string;
  name: string;
  phone: string;
  notes: string;
}

const INITIAL: OrderState = {
  productType: null, item: "", basePrice: 0, quantity: 1, flavor: "", filling: "",
  extraCost: 0, decoration: "", occasion: "", date: "", name: "", phone: "", notes: "",
};

function OptionCard({
  title, subtitle, selected, disabled, onClick,
}: {
  title: string; subtitle: string; selected?: boolean; disabled?: boolean; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[18px] border p-4 text-left transition-all duration-150 ${
        selected
          ? "border-sage-deep bg-[rgba(184,220,192,0.28)] shadow-[inset_0_0_0_1px_var(--sage-deep)]"
          : disabled
            ? "cursor-not-allowed border-border bg-background opacity-40"
            : "border-border bg-background hover:-translate-y-px hover:border-sage-deep"
      }`}>
      <div className="font-display text-[1.11rem] font-semibold leading-tight">{title}</div>
      <div className="mt-1 text-[0.72rem] text-cocoa-soft">{subtitle}</div>
    </button>
  );
}

function StepHeader({ num, title, sub }: { num?: string; title: string; sub: string }) {
  return (
    <div className="mb-7 flex items-start gap-4">
      {num && <span className="pt-2 font-display text-[0.9rem] text-sage-deep">{num}</span>}
      <div>
        <h3 className="mb-1 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-none tracking-[-0.04em]">
          {title}
        </h3>
        <p className="m-0 text-[0.78rem] text-cocoa-soft">{sub}</p>
      </div>
    </div>
  );
}

export default function OrderSection() {
  const [step, setStep] = useState<StepId>("producto");
  const [history, setHistory] = useState<StepId[]>(["producto"]);
  const [order, setOrder] = useState<OrderState>(INITIAL);
  const [churrosTopping, setChurrosTopping] = useState("Nutella");
  const [churrosExtras, setChurrosExtras] = useState("0");
  const [fillingChoice, setFillingChoice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const availability = trpc.ordering.availability.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const uploadPhotos = trpc.ordering.uploadPhotos.useMutation();
  const submitOrder = trpc.ordering.submit.useMutation();
  const utils = trpc.useUtils();

  const total = useMemo(() => {
    if (order.productType === "churros") {
      return (order.basePrice + order.extraCost) * order.quantity;
    }
    return order.basePrice + order.extraCost;
  }, [order]);

  const scrollTop = () => {
    wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const go = (next: StepId) => {
    setHistory(h => [...h, next]);
    setStep(next);
    scrollTop();
  };
  const back = () => {
    setHistory(h => {
      if (h.length <= 1) return h;
      const nh = h.slice(0, -1);
      setStep(nh[nh.length - 1]);
      return nh;
    });
    scrollTop();
  };
  const reset = () => {
    setOrder(INITIAL);
    setFiles([]);
    setFillingChoice("");
    setChurrosTopping("Nutella");
    setChurrosExtras("0");
    setWhatsAppUrl("");
    setWaMessage("");
    setHistory(["producto"]);
    setStep("producto");
    utils.ordering.availability.invalidate();
    scrollTop();
  };

  /* Step 1 → route by product type */
  const chooseType = (t: ProductType) => {
    setOrder({ ...INITIAL, productType: t, basePrice: t === "churros" ? CHURROS_BOX_PRICE : 0 });
    go("detalle");
  };

  /* Step 3 flavor selection */
  const chooseFlavor = (flavorId: string) => {
    const flavor = CAKE_FLAVORS.find(f => f.id === flavorId)!;
    setFillingChoice("");
    if (flavor.fillingChoice === null) {
      setOrder(o => ({
        ...o,
        flavor: flavor.name,
        filling: flavor.id === "strawberry" ? "Fresas con crema y cream cheese" : "Mousse de chocolate y crumbles de Oreo",
        extraCost: 0,
      }));
      go("deco");
    } else {
      setOrder(o => ({ ...o, flavor: flavor.name, filling: "", extraCost: 0 }));
    }
  };

  const confirmFilling = () => {
    const isTradicional = order.flavor === "Tradicional";
    if (!fillingChoice) return;
    if (isTradicional) {
      const fruta = fillingChoice === "fruta";
      setOrder(o => ({
        ...o,
        filling: fruta ? `Coctel de frutas (+$${FRUIT_FILLING_EXTRA})` : "Dulce de leche",
        extraCost: fruta ? FRUIT_FILLING_EXTRA : 0,
      }));
    } else {
      setOrder(o => ({ ...o, filling: fillingChoice, extraCost: 0 }));
    }
    go("deco");
  };

  /* Step 4 photo handling */
  const onFilesChange = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    if (arr.length > MAX_PHOTOS) {
      toast.error(`Máximo ${MAX_PHOTOS} fotos de inspiración.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFiles([]);
      return;
    }
    const tooBig = arr.find(f => f.size > MAX_PHOTO_MB * 1024 * 1024);
    if (tooBig) {
      toast.error(`${tooBig.name} supera el límite de ${MAX_PHOTO_MB} MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFiles([]);
      return;
    }
    setFiles(arr);
  };

  /* Step 6 → 7: validate contact info */
  const toSummary = () => {
    if (!order.name.trim() || !order.phone.trim()) {
      toast.error("Por favor escribe tu nombre y teléfono para continuar.");
      return;
    }
    go("resumen");
  };

  /* Step 7: upload photos, persist order, open WhatsApp */
  const send = async () => {
    try {
      let photoUrls: string[] = [];
      if (files.length > 0) {
        const photos = await Promise.all(
          files.map(
            f =>
              new Promise<{ name: string; mimeType: string; dataBase64: string }>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  resolve({ name: f.name, mimeType: f.type || "image/jpeg", dataBase64: result.split(",")[1] });
                };
                reader.onerror = reject;
                reader.readAsDataURL(f);
              }),
          ),
        );
        const uploaded = await uploadPhotos.mutateAsync({ photos });
        photoUrls = uploaded.urls;
      }
      const result = await submitOrder.mutateAsync({
        productType: order.productType!,
        item: order.item,
        quantity: order.quantity,
        flavor: order.flavor || undefined,
        filling: order.filling || undefined,
        decoration: order.decoration || undefined,
        occasion: order.occasion || undefined,
        deliveryDate: order.date,
        customerName: order.name.trim(),
        customerPhone: order.phone.trim(),
        notes: order.notes || undefined,
        photoUrls,
        estimatedTotal: total,
      });
      setWhatsAppUrl(result.whatsAppUrl);
      setWaMessage(result.message);
      window.open(result.whatsAppUrl, "_blank");
      utils.ordering.availability.invalidate();
      go("listo");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo enviar el pedido.";
      toast.error(message);
      utils.ordering.availability.invalidate();
    }
  };

  const sending = uploadPhotos.isPending || submitOrder.isPending;
  const selectedFlavor = CAKE_FLAVORS.find(f => f.name === order.flavor);

  return (
    <section
      id="ordenar"
      ref={wrapRef}
      className="py-[clamp(88px,10vw,156px)]"
      style={{
        background:
          "radial-gradient(circle at 12% 18%, rgba(184,220,192,0.22), transparent 22%), var(--background)",
      }}>
      <div className="mx-auto w-[min(100%-40px,1380px)] md:w-[min(100%-80px,1380px)]">
        <div className="mx-auto mb-11 max-w-[760px] text-center md:mb-16">
          <p className="eyebrow mb-5">Ordena sin idas y vueltas</p>
          <h2 className="display-xl mx-auto text-[clamp(3rem,12vw,4.7rem)] md:text-[clamp(3rem,5.4vw,5.8rem)]">
            Arma tu pedido.
          </h2>
          <p className="mx-auto mt-6 max-w-[580px] text-[0.9rem] leading-[1.75] text-cocoa-soft">
            Completa los detalles paso a paso y enviaremos un resumen organizado directamente al
            WhatsApp de Diana.
          </p>
        </div>

        <div className="mx-auto max-w-[820px] overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_32px_90px_rgba(59,41,35,0.09)]">
          {/* Progress strip */}
          <div
            className="flex min-h-[72px] items-center gap-6 border-b border-border px-5 py-4 md:min-h-[90px] md:gap-8 md:px-[30px]"
            style={{ background: "rgba(221,235,220,0.45)" }}
            aria-label={`Paso ${STEP_NUM[step]} de 07`}>
            <div className="flex min-w-[110px] items-baseline gap-1.5 whitespace-nowrap md:min-w-[150px]">
              <span className="font-display text-[1.4rem] font-semibold">Paso {STEP_NUM[step]}</span>
              <small className="text-[0.66rem] text-cocoa-soft">de 07</small>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-sage-deep/20">
              <span
                className="block h-full rounded-full bg-sage-deep transition-[width] duration-300"
                style={{ width: `${PROGRESS[step]}%` }}
              />
            </div>
          </div>

          <div className="p-5 pb-7 md:p-[44px] md:pb-9">

        {/* STEP 1 — Product type */}
        {step === "producto" && (
          <div>
            <StepHeader num="01" title="¿Qué se te antoja?" sub="Elige un producto para comenzar." />
            <div className="grid gap-3 sm:grid-cols-3">
              <OptionCard title="Pastel personalizado" subtitle="Desde $80" onClick={() => chooseType("pastel")} />
              <OptionCard title="Por docena" subtitle="Minis, cupcakes y más" onClick={() => chooseType("docena")} />
              <OptionCard title="Churros con toppings" subtitle="$8 por box" onClick={() => chooseType("churros")} />
            </div>
          </div>
        )}

        {/* STEP 2 — Size / docena item / churros config */}
        {step === "detalle" && order.productType === "pastel" && (
          <div>
            <StepHeader num="02" title="Elige el tamaño." sub="Los precios pueden variar según la decoración." />
            <div className="grid gap-3 sm:grid-cols-3">
              {CAKE_SIZES.map(s => (
                <OptionCard
                  key={s.id}
                  title={s.name}
                  subtitle={`${s.portions} · desde $${s.basePrice}`}
                  selected={order.item === s.name}
                  onClick={() => {
                    setOrder(o => ({ ...o, item: s.name, basePrice: s.basePrice, quantity: 1 }));
                    go("sabor");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === "detalle" && order.productType === "docena" && (
          <div>
            <StepHeader num="02" title="Elige tu producto." sub="Precios por paquete." />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {DOCENA_ITEMS.map(item => (
                <OptionCard
                  key={item.id}
                  title={item.name}
                  subtitle={`${item.units} unidades · $${item.price}`}
                  selected={order.item.startsWith(item.name)}
                  onClick={() => {
                    setOrder(o => ({
                      ...o,
                      item: `${item.name} (${item.units})`,
                      basePrice: item.price,
                      quantity: 1,
                      flavor: "",
                      filling: "",
                      extraCost: 0,
                    }));
                    go("deco");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === "detalle" && order.productType === "churros" && (
          <div>
            <StepHeader
              num="02"
              title="Churros con toppings"
              sub={`$${CHURROS_BOX_PRICE} por box con 1 topping · +$${CHURROS_EXTRA_TOPPING} por topping extra.`}
            />
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">¿Cuántos boxes?</label>
                <div className="flex items-center justify-center gap-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full border border-sage-deep text-xl text-sage-deep"
                    onClick={() => setOrder(o => ({ ...o, quantity: Math.max(1, o.quantity - 1) }))}>
                    −
                  </Button>
                  <span className="min-w-10 text-center font-display text-2xl">{order.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full border border-sage-deep text-xl text-sage-deep"
                    onClick={() => setOrder(o => ({ ...o, quantity: Math.min(10, o.quantity + 1) }))}>
                    +
                  </Button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">Topping incluido</label>
                <Select value={churrosTopping} onValueChange={setChurrosTopping}>
                  <SelectTrigger className="w-full rounded-[14px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHURROS_TOPPINGS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                  Toppings extra (+${CHURROS_EXTRA_TOPPING} c/u)
                </label>
                <Select value={churrosExtras} onValueChange={setChurrosExtras}>
                  <SelectTrigger className="w-full rounded-[14px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Ninguno</SelectItem>
                    <SelectItem value="1">1 extra (+$2)</SelectItem>
                    <SelectItem value="2">2 extras (+$4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-center">
                <Button
                  className="min-h-[52px] rounded-full px-8 font-bold"
                  onClick={() => {
                    const extras = parseInt(churrosExtras);
                    setOrder(o => ({
                      ...o,
                      item: `Churros con toppings (${o.quantity} box${o.quantity > 1 ? "es" : ""})`,
                      flavor: churrosTopping,
                      filling: extras > 0 ? `${extras} topping(s) extra` : "",
                      extraCost: extras * CHURROS_EXTRA_TOPPING,
                    }));
                    go("deco");
                  }}>
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Flavor (cakes only) */}
        {step === "sabor" && (
          <div>
            <StepHeader num="03" title="Elige tu sabor." sub="El sabor siempre es nuestra prioridad." />
            <div className="grid gap-3 sm:grid-cols-2">
              {CAKE_FLAVORS.map(f => (
                <OptionCard
                  key={f.id}
                  title={f.name}
                  subtitle={f.description}
                  selected={order.flavor === f.name}
                  onClick={() => chooseFlavor(f.id)}
                />
              ))}
            </div>
            {selectedFlavor?.fillingChoice && (
              <div className="mt-5">
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                  {selectedFlavor.fillingChoice === "tradicional" ? "Relleno" : "Elige tu ganache"}
                </label>
                <Select value={fillingChoice} onValueChange={setFillingChoice}>
                  <SelectTrigger className="w-full rounded-[14px]">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFlavor.fillingChoice === "tradicional" ? (
                      <>
                        <SelectItem value="dl">Dulce de leche (incluido)</SelectItem>
                        <SelectItem value="fruta">Coctel de frutas (+$5)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Ganache de dulce de leche">Ganache de dulce de leche</SelectItem>
                        <SelectItem value="Ganache de chocolate">Ganache de chocolate</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <div className="mt-4 text-center">
                  <Button className="min-h-[52px] rounded-full px-8 font-bold" disabled={!fillingChoice} onClick={confirmFilling}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Decoration & inspiration */}
        {step === "deco" && (
          <div>
            <StepHeader num="04" title="Imagina la decoración." sub="Cuéntanos sobre colores, tema y estilo." />
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                  Describe la decoración que te gustaría
                </label>
                <Textarea
                  rows={3}
                  className="rounded-[14px]"
                  placeholder="Ej: estilo vintage en verde sage, con moños rosas, perlas y 'Happy Birthday' en topper plateado"
                  value={order.decoration}
                  onChange={e => setOrder(o => ({ ...o, decoration: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">¿Para qué ocasión es?</label>
                <Input
                  className="rounded-[14px]"
                  placeholder="Ej: cumpleaños, baby shower, aniversario"
                  value={order.occasion}
                  onChange={e => setOrder(o => ({ ...o, occasion: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                  Fotos de inspiración (opcional · máximo {MAX_PHOTOS})
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => onFilesChange(e.target.files)}
                  className="block w-full cursor-pointer rounded-[18px] border border-dashed border-sage-deep bg-[rgba(221,235,220,0.28)] px-3 py-4 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-bold file:text-secondary-foreground"
                />
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map(f => (
                      <li key={f.name} className="flex items-center gap-1.5 text-[0.78rem] text-cocoa-soft">
                        <Camera className="h-3.5 w-3.5" /> {f.name} · {(f.size / 1024 / 1024).toFixed(1)} MB
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1.5 text-[0.76rem] text-cocoa-soft">
                  Hasta {MAX_PHOTOS} imágenes de máximo {MAX_PHOTO_MB} MB cada una. Se envían como enlaces en tu mensaje de WhatsApp.
                </p>
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3.5 text-[0.72rem] leading-[1.6] text-cocoa-soft">
                <strong className="text-foreground">Tu foto es una referencia.</strong> Las imágenes se toman como inspiración para
                la elaboración del producto, no como garantía de una copia exacta.
              </div>
              <div className="text-center">
                <Button className="min-h-[52px] rounded-full px-8 font-bold" onClick={() => go("fecha")}>
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Date picker */}
        {step === "fecha" && (
          <div>
            <StepHeader
              num="05"
              title="¿Cuándo lo necesitas?"
              sub="Entregas sábados y domingos · mínimo 4 días de anticipación."
            />
            {availability.isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-sage-deep" />
              </div>
            ) : availability.isError ? (
              <p className="py-6 text-center text-sm text-destructive">
                No pudimos cargar las fechas. Intenta de nuevo en un momento.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {availability.data?.map(d => (
                  <OptionCard
                    key={d.date}
                    title={dateLabel(d.date).split(" ")[0]}
                    subtitle={`${dateLabel(d.date).split(" ").slice(1).join(" ")} · ${
                      d.reason === "tooSoon" ? "muy pronto" : d.reason === "full" ? "sin cupo" : `${d.remaining} cupo(s)`
                    }`}
                    selected={order.date === d.date}
                    disabled={!d.selectable}
                    onClick={() => {
                      setOrder(o => ({ ...o, date: d.date }));
                      go("datos");
                    }}
                  />
                ))}
              </div>
            )}
            <div className="mt-5 rounded-2xl bg-muted px-4 py-3.5 text-[0.72rem] leading-[1.6] text-cocoa-soft">
              <strong className="text-foreground">Cupo limitado.</strong> Máximo 5 pedidos por día de entrega. Tu fecha queda confirmada cuando
              recibas respuesta por WhatsApp y se realice el anticipo del 50%.
            </div>
          </div>
        )}

        {/* STEP 6 — Contact info */}
        {step === "datos" && (
          <div>
            <StepHeader num="06" title="¿Con quién hablamos?" sub="Diana responderá a estos datos por WhatsApp." />
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">Nombre completo</label>
                <Input
                  className="rounded-[14px]"
                  placeholder="Tu nombre"
                  value={order.name}
                  onChange={e => setOrder(o => ({ ...o, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">Teléfono (WhatsApp)</label>
                <Input
                  className="rounded-[14px]"
                  type="tel"
                  placeholder="(206) 555-0000"
                  value={order.phone}
                  onChange={e => setOrder(o => ({ ...o, phone: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.08em]">
                  Notas adicionales (opcional)
                </label>
                <Textarea
                  rows={2}
                  className="rounded-[14px]"
                  placeholder="Alergias, dedicatoria, etc."
                  value={order.notes}
                  onChange={e => setOrder(o => ({ ...o, notes: e.target.value }))}
                />
              </div>
              <div className="text-center">
                <Button className="min-h-[52px] rounded-full px-8 font-bold" onClick={toSummary}>
                  Ver resumen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7 — Summary & send */}
        {step === "resumen" && (
          <div>
            <StepHeader num="07" title="Revisa tu pedido." sub="Todo listo para enviarlo a WhatsApp." />
            <div className="overflow-hidden rounded-[20px] border border-border bg-background px-5 py-4 text-[0.85rem]">
              {(
                [
                  ["Producto", order.item + (order.quantity > 1 && order.productType === "churros" ? "" : "")],
                  order.flavor ? [order.productType === "churros" ? "Topping" : "Sabor", order.flavor] : null,
                  order.filling ? [order.productType === "churros" ? "Extras" : "Relleno", order.filling] : null,
                  order.decoration ? ["Decoración", order.decoration] : null,
                  order.occasion ? ["Ocasión", order.occasion] : null,
                  files.length > 0 ? ["Fotos", `${files.length} foto(s) de inspiración`] : null,
                  ["Entrega", dateLabel(order.date)],
                  ["Cliente", order.name],
                  ["WhatsApp", order.phone],
                  order.notes ? ["Notas", order.notes] : null,
                ].filter(Boolean) as Array<[string, string]>
              ).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
                  <span className="text-[0.72rem] text-cocoa-soft">{k}</span>
                  <span className="max-w-[60%] text-right">{v}</span>
                </div>
              ))}
              <div className="flex justify-between py-2.5 font-display text-[1.2rem] font-semibold text-caramel">
                <span>Total estimado*</span>
                <span>${total}</span>
              </div>
              <p className="text-[0.72rem] text-cocoa-soft">
                * El total puede variar según la decoración final. Diana te confirma el precio por WhatsApp.
              </p>
            </div>
            <div className="mt-4 rounded-2xl bg-muted px-4 py-3.5 text-[0.72rem] leading-[1.6] text-cocoa-soft">
              <strong className="text-foreground">Anticipo del 50%.</strong> Se requiere (no reembolsable) para confirmar tu
              pedido. El resto se paga el día de la entrega. Al ordenar aceptas nuestras{" "}
              <a href="#politicas" className="font-bold underline">políticas</a>.
            </div>
            <div className="mt-5 flex flex-col items-center gap-2.5">
              <Button
                className="min-h-[52px] rounded-full bg-whatsapp px-8 font-bold text-white hover:bg-whatsapp/90"
                size="lg"
                onClick={send}
                disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {uploadPhotos.isPending ? "Subiendo fotos…" : "Enviando…"}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Enviar pedido por WhatsApp
                  </>
                )}
              </Button>
              <Button variant="ghost" className="rounded-full text-cocoa-soft" onClick={reset} disabled={sending}>
                <RotateCcw className="h-3.5 w-3.5" /> Empezar de nuevo
              </Button>
            </div>
          </div>
        )}

        {/* POST-SUBMIT confirmation */}
        {step === "listo" && (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-sage-deep" strokeWidth={1.2} />
            <p className="eyebrow mt-6">Solicitud enviada</p>
            <h3 className="mt-3 font-display text-[clamp(2.4rem,6vw,3.4rem)] leading-none tracking-[-0.04em]">
              ¡Pedido enviado!
            </h3>
            <p className="mx-auto mt-4 max-w-md text-[0.86rem] leading-[1.75] text-cocoa-soft">
              Tu pedido quedó registrado y se abrió WhatsApp con el mensaje listo para enviar. Diana
              te responderá para confirmar disponibilidad y coordinar el anticipo del 50%.
            </p>
            {whatsAppUrl && (
              <div className="mt-5">
                <Button asChild className="min-h-[52px] rounded-full bg-whatsapp px-7 font-bold text-white hover:bg-whatsapp/90">
                  <a href={whatsAppUrl} target="_blank" rel="noreferrer">
                    <Send className="h-4 w-4" /> Abrir WhatsApp de nuevo
                  </a>
                </Button>
              </div>
            )}
            {waMessage && (
              <details className="mx-auto mt-5 max-w-md rounded-2xl border border-border bg-background p-4 text-left">
                <summary className="cursor-pointer text-[0.82rem] font-bold">
                  Ver mensaje enviado
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-[0.78rem] text-cocoa-soft">{waMessage}</pre>
              </details>
            )}
            <div className="mt-4">
              <Button variant="ghost" className="rounded-full text-cocoa-soft" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5" /> Hacer otro pedido
              </Button>
            </div>
          </div>
        )}

        {/* Back navigation */}
        {step !== "producto" && step !== "listo" && (
          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              className="min-h-[48px] rounded-full border border-border px-6 font-bold"
              onClick={back}
              disabled={sending}>
              <ArrowLeft className="h-4 w-4" /> Atrás
            </Button>
          </div>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}
