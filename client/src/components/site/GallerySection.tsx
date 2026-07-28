import { ASSETS } from "@/lib/assets";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@shared/orders";

const GALLERY = [
  { img: ASSETS.hero, caption: "Pastel blanco y negro", alt: "Pastel blanco y negro con topper dorado" },
  { img: ASSETS.blackGoldCake, caption: "Pastel personalizado", alt: "Pastel personalizado negro con esferas doradas" },
  { img: ASSETS.strawberriesCreamCup, caption: "Fresas con crema", alt: "Fresas con crema en vaso" },
  { img: ASSETS.sweetCrepe, caption: "Crepas dulces", alt: "Crepa dulce con Nutella, fresas y banana" },
  { img: ASSETS.churrosMenu, caption: "Churros + porciones", alt: "Churros con toppings y porciones de pastel" },
  { img: ASSETS.napolitanoFlan, caption: "Mini flan", alt: "Mini flanes napolitanos en mesa de fiesta" },
  { img: ASSETS.marcBirthdayCake, caption: "Pastel de cumpleaños", alt: "Pastel de cumpleaños con letras azules" },
  { img: ASSETS.sprinkleBirthdayCake, caption: "Sprinkles y color", alt: "Pastel con sprinkles de colores" },
  { img: ASSETS.boxedSweetCrepe, caption: "Pick up listo", alt: "Crepa dulce empacada para pick up" },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="bg-primary px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-primary-foreground">
            Galería
          </h2>
          <p className="mt-2 text-[0.95rem] text-primary-foreground/80">
            Cada creación es única — síguenos en Instagram{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="font-bold underline decoration-2 underline-offset-4 hover:text-white">
              {INSTAGRAM_HANDLE}
            </a>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GALLERY.map(g => (
            <figure
              key={g.caption}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <img
                src={g.img}
                alt={g.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-2.5 bottom-2.5 rounded-full bg-background/90 px-2.5 py-1.5 text-center text-[0.76rem] font-bold text-primary">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
