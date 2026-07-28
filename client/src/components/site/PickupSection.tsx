import { MapPin, CalendarDays, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WA_NUMBER } from "@shared/orders";

const POINTS = [
  { icon: MapPin, text: "Solo pick up — Shoreline & Lake Forest Park, WA" },
  { icon: CalendarDays, text: "Entregas los sábados y domingos" },
  { icon: Clock, text: "Ordena con mínimo 4 días de anticipación" },
  { icon: MessageCircle, text: "Te confirmamos hora y punto de entrega por WhatsApp" },
];

export default function PickupSection() {
  return (
    <section id="recoger" className="container max-w-5xl pb-16 pt-2">
      <div className="grid items-center gap-7 overflow-hidden rounded-3xl border border-secondary bg-card md:grid-cols-2">
        <div className="flex aspect-[4/3] items-center justify-center bg-secondary p-6 md:aspect-auto md:h-full">
          <div className="text-center">
            <MapPin className="mx-auto h-10 w-10 text-primary/70" />
            <p className="mt-3 font-display text-lg italic text-primary">
              Zona de pick up
              <br />
              Shoreline &amp; Lake Forest Park, WA
            </p>
            <p className="mt-2 text-[0.82rem] text-primary/70">
              El punto exacto se coordina por WhatsApp al confirmar tu pedido
            </p>
          </div>
        </div>
        <div className="p-7 md:p-9">
          <h2 className="font-display text-[1.8rem] font-normal text-primary">Recoge tu pedido</h2>
          <ul className="mt-4 space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 text-[0.94rem] text-foreground/80">
                <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-caramel" />
                {text}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 rounded-full px-7 font-bold">
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer">
              Escríbenos por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
