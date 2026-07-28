import { CalendarDays, Clock3, Heart, MapPin, Sparkles } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import Nav from "./Nav";

export default function Hero() {
  return (
    <>
      <section
        id="inicio"
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 84% 13%, rgba(184,220,192,0.17), transparent 26%), var(--background)",
        }}>
        <Nav />
        <div className="mx-auto grid w-[min(100%-40px,1380px)] items-center md:min-h-[640px] md:w-[min(100%-80px,1380px)] md:grid-cols-[47%_53%]">
          {/* Copy */}
          <div className="relative z-[4] pb-8 pt-12 md:py-16 md:pr-10">
            <p className="eyebrow mb-6">Repostería artesanal · Shoreline</p>
            <h1 className="mb-7 font-display text-[clamp(3.4rem,10.5vw,4.6rem)] font-medium leading-[0.88] tracking-[-0.045em] md:text-[clamp(4rem,6.4vw,6.6rem)] md:leading-[0.84]">
              Hecho con amor,
              <br />
              <em>al estilo Sweet Vanilla.</em>
            </h1>
            <p className="mb-7 max-w-[510px] text-[clamp(0.95rem,1.25vw,1.15rem)] leading-[1.7] text-cocoa-soft">
              Pasteles tres leches, flan napolitano, churros con toppings y postres por docena —
              hechos por encargo, listos para tu ocasión especial.
            </p>
            <div className="mb-7 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center sm:gap-6">
              <a
                href="#ordenar"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-7 text-[0.88rem] font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(59,41,35,0.12)]">
                Ordena en línea
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 self-center border-b border-current pb-1 text-[0.82rem] font-bold no-underline sm:self-auto">
                Ver menú
              </a>
            </div>
            <div className="flex items-center gap-3.5 text-[0.84rem] text-cocoa-soft">
              <CalendarDays className="h-[42px] w-[42px] rounded-full border border-sage-deep p-2.5 text-sage-deep" />
              <span>Pedidos con 4 días de anticipación · Máx. 5 por día</span>
            </div>
          </div>

          {/* Arch visual */}
          <div className="relative -mx-5 min-h-[500px] self-stretch md:mx-0 md:min-h-[640px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-[3] border border-sage-deep/60 border-b-0"
              style={{ top: "-2px", right: "-2.6vw", bottom: "-34px", left: "2.4%", borderRadius: "52% 52% 0 0" }}
            />
            <figure
              className="absolute m-0 overflow-hidden bg-secondary shadow-[0_30px_70px_rgba(59,41,35,0.13)]"
              style={{ top: "10px", right: "-2vw", bottom: "-46px", left: "4%", borderRadius: "52% 52% 4px 4px" }}>
              <img
                src={ASSETS.hero}
                alt="Pastel personalizado blanco y negro con detalles dorados de Sweet Vanilla"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </figure>
            <figure
              className="absolute z-[5] m-0 overflow-hidden border-[9px] border-b-0 bg-secondary shadow-[0_20px_45px_rgba(59,41,35,0.13)]"
              style={{
                bottom: "-46px",
                left: "-6%",
                width: "37%",
                height: "47%",
                borderColor: "var(--background)",
                borderBottom: "0",
                borderRadius: "50% 50% 0 0",
              }}>
              <img
                src={ASSETS.strawberriesCreamCup}
                alt="Fresas con crema de Sweet Vanilla"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </figure>
            <div className="absolute bottom-4 right-6 z-[6] flex items-center gap-2.5 rounded-full bg-background/90 px-3.5 py-2.5 text-[0.69rem] font-bold uppercase tracking-[0.11em] backdrop-blur-md">
              <span>Hecho a mano</span>
              <Heart className="h-3.5 w-3.5 text-caramel" />
            </div>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section aria-label="Información de servicio" className="relative z-[8] border-y border-border bg-card">
        <div className="mx-auto grid w-[min(100%-40px,1380px)] py-4 md:min-h-[102px] md:w-[min(100%-80px,1380px)] md:grid-cols-3 md:py-0">
          <p className="flex min-h-12 items-center gap-3 border-b border-border text-[0.77rem] font-semibold text-cocoa-soft md:justify-center md:border-b-0 md:border-l md:border-r md:border-border">
            <Sparkles className="h-[18px] w-[18px] text-sage-deep" />
            Hecho por encargo
          </p>
          <p className="flex min-h-12 items-center gap-3 border-b border-border text-[0.77rem] font-semibold text-cocoa-soft md:justify-center md:border-b-0 md:border-r md:border-border">
            <MapPin className="h-[18px] w-[18px] text-sage-deep" />
            Shoreline &amp; Lake Forest Park
          </p>
          <p className="flex min-h-12 items-center gap-3 text-[0.77rem] font-semibold text-cocoa-soft md:justify-center md:border-r md:border-border">
            <Clock3 className="h-[18px] w-[18px] text-sage-deep" />
            Pick up sábados y domingos
          </p>
        </div>
      </section>
    </>
  );
}

