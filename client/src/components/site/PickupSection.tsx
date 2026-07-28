import { ArrowDownRight, CalendarDays, Clock3, MapPin, MessageCircle } from "lucide-react";
import { WA_NUMBER } from "@shared/orders";

const CARD_ROWS = [
  { icon: MapPin, label: "Zona de recogida", value: "Shoreline & Lake Forest Park" },
  { icon: CalendarDays, label: "Días de entrega", value: "Sábados y domingos" },
  { icon: Clock3, label: "Anticipación", value: "Mínimo 4 días" },
];

export default function PickupSection() {
  return (
    <section id="recoger" className="bg-sage-deep py-[clamp(88px,10vw,156px)] text-background">
      <div className="mx-auto grid w-[min(100%-40px,1380px)] items-center gap-14 md:w-[min(100%-80px,1380px)] md:grid-cols-[1.2fr_0.8fr] md:gap-[100px]">
        <div>
          <p className="eyebrow mb-5 !text-sage">Pick up local</p>
          <h2 className="display-xl mb-7 max-w-[780px] text-[clamp(3rem,14vw,4.4rem)] leading-[0.92] md:text-[clamp(3.3rem,6vw,6.2rem)]">
            Tu pedido, listo para hacer el momento especial.
          </h2>
          <p className="mb-8 max-w-[580px] text-[0.87rem] leading-[1.75] text-background/70">
            Recoge en Shoreline o Lake Forest Park. Diana confirmará el punto y la hora exacta
            contigo por WhatsApp.
          </p>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href="#ordenar"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-background px-7 text-[0.88rem] font-bold text-foreground transition-transform duration-200 hover:-translate-y-0.5">
              Comenzar mi pedido
              <ArrowDownRight className="h-[18px] w-[18px]" />
            </a>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 self-center border-b border-current pb-1 text-[0.82rem] font-bold text-background no-underline sm:self-auto">
              <MessageCircle className="h-[18px] w-[18px]" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-background/25 bg-background/[0.07] px-5 py-4 md:px-[34px]">
          {CARD_ROWS.map(({ icon: Icon, label, value }, i) => (
            <p
              key={label}
              className={`m-0 flex items-center gap-[18px] py-[25px] ${
                i < CARD_ROWS.length - 1 ? "border-b border-background/[0.16]" : ""
              }`}>
              <Icon className="h-[23px] w-[23px] text-sage" strokeWidth={1.4} />
              <span className="flex flex-col gap-1 font-display text-[1.28rem]">
                <small className="font-sans text-[0.57rem] font-bold uppercase tracking-[0.12em] text-background/60">
                  {label}
                </small>
                {value}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
