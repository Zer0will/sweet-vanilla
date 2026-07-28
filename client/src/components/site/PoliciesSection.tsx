import { Sparkles } from "lucide-react";

const POLICIES = [
  {
    number: "01",
    title: "Anticipo y pago",
    text: "Se requiere un anticipo no reembolsable del 50% para confirmar tu pedido. El restante se paga el día de la entrega.",
  },
  {
    number: "02",
    title: "Anticipación",
    text: "Los pedidos deben realizarse con al menos 4 días de anticipación. Trabajamos con un máximo de 5 pedidos por día de entrega.",
  },
  {
    number: "03",
    title: "Cambios",
    text: "Las cancelaciones requieren 3 días de anticipación y no incluyen devolución del anticipo. El reagendado o cambio por un producto del mismo precio está sujeto a disponibilidad.",
  },
  {
    number: "04",
    title: "Recogida",
    text: "Solo pick up en Shoreline o Lake Forest Park, sábados y domingos. Una espera mayor a 20 minutos puede generar una tarifa adicional.",
  },
  {
    number: "05",
    title: "Responsabilidad",
    text: "Entregamos el producto en perfectas condiciones y en empaque apropiado. No nos hacemos responsables por daños tras la entrega.",
  },
  {
    number: "06",
    title: "Manipulación",
    text: "Después de la entrega, el cuidado del producto (transporte, clima, refrigeración y almacenamiento) queda en manos del cliente.",
  },
];

export default function PoliciesSection() {
  return (
    <section id="politicas" className="bg-card py-[clamp(88px,10vw,156px)]">
      <div className="mx-auto w-[min(100%-40px,1380px)] md:w-[min(100%-80px,1380px)]">
        <div className="mb-12 grid items-end gap-6 md:mb-[72px] md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:gap-20">
          <div>
            <p className="eyebrow mb-5">Antes de ordenar</p>
            <h2 className="display-xl max-w-[760px] text-[clamp(3rem,12vw,4.7rem)] md:text-[clamp(3rem,5.4vw,5.8rem)]">
              Todo claro desde el primer mensaje.
            </h2>
          </div>
          <p className="text-[0.93rem] leading-[1.75] text-cocoa-soft">
            Estas políticas nos ayudan a cuidar cada pedido y entregar la calidad que esperas de
            Sweet Vanilla. Al ordenar, aceptas estos términos.
          </p>
        </div>

        <div className="grid border-y border-border md:grid-cols-3">
          {POLICIES.map((policy, i) => (
            <article
              key={policy.number}
              className={`min-h-[240px] p-[30px] py-[38px] md:min-h-[300px] ${
                i % 3 !== 2 ? "md:border-r md:border-border" : ""
              } ${i < 3 ? "md:border-b md:border-border" : ""} ${
                i < POLICIES.length - 1 ? "border-b border-border md:border-b-0" : ""
              } ${i < 3 ? "md:!border-b" : ""}`}>
              <span className="font-display text-base text-sage-deep">{policy.number}</span>
              <h3 className="mb-3 mt-9 font-display text-[2.1rem] leading-none tracking-[-0.03em] md:mt-[66px]">
                {policy.title}
              </h3>
              <p className="m-0 text-[0.75rem] leading-[1.7] text-cocoa-soft">{policy.text}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-[920px] items-center gap-7 text-center md:mt-[72px] md:grid-cols-[88px_1fr] md:text-left">
          <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full bg-secondary md:mx-0">
            <Sparkles className="h-[34px] w-[34px] text-sage-deep" strokeWidth={1.3} />
          </div>
          <p className="m-0 flex flex-col gap-2 text-[0.78rem] leading-[1.7] text-cocoa-soft">
            <strong className="font-display text-[1.5rem] font-semibold text-foreground">
              Sobre las fotos de inspiración
            </strong>
            Las imágenes se toman como referencia para sabor, color y estilo; no son garantía de
            una copia exacta. Cada creación es hecha a mano y será única.
          </p>
        </div>
      </div>
    </section>
  );
}
