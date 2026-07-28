import { ASSETS } from "@/lib/assets";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <header
      id="inicio"
      className="relative overflow-hidden px-5 pb-14 pt-16 md:pt-20"
      style={{
        background:
          "radial-gradient(ellipse 60% 55% at 50% 0%, oklch(0.92 0.035 140) 0%, transparent 70%)",
      }}>
      <div className="mx-auto grid max-w-5xl items-center gap-9 md:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center md:text-left">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-caramel">
            Repostería artesanal · Shoreline &amp; Lake Forest Park
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.3rem,6vw,3.7rem)] font-light leading-[1.12] text-primary">
            Hecho con amor,
            <br />
            <em className="font-normal">al estilo Sweet Vanilla.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground md:mx-0">
            Pasteles tres leches, flan napolitano, churros con toppings y postres por docena —
            hechos por encargo, listos para tu ocasión especial.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button asChild size="lg" className="rounded-full px-8 font-bold">
              <a href="#ordenar">Ordena en línea</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-[1.5px] border-primary px-8 font-bold text-primary">
              <a href="#menu">Ver menú</a>
            </Button>
          </div>
          <p className="mt-5 text-[0.83rem] text-muted-foreground">
            Solo pick up · Pedidos con 4 días de anticipación · Máx. 5 pedidos por día
          </p>
        </div>
        <figure className="relative mx-auto w-full max-w-[520px] rotate-[1.2deg] overflow-hidden rounded-[34px] border-8 border-white bg-white shadow-[0_24px_70px_rgba(62,90,60,0.22)]">
          <img
            src={ASSETS.hero}
            alt="Pastel blanco y negro con topper dorado de Sweet Vanilla"
            className="h-[min(62vw,540px)] w-full object-cover md:h-[540px]"
            loading="eager"
          />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-background/95 px-4 py-2 text-[0.82rem] font-bold text-primary shadow-lg">
            Pasteles personalizados
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
