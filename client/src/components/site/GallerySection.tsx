import { ArrowUpRight, Instagram } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@shared/orders";

const GALLERY = [
  {
    img: ASSETS.hero,
    caption: "Pasteles personalizados",
    alt: "Pastel blanco y negro con topper dorado",
    className: "md:row-span-2 row-span-2",
  },
  {
    img: ASSETS.strawberriesCreamCup,
    caption: "Fresas con crema",
    alt: "Fresas con crema en vaso",
    className: "",
  },
  {
    img: ASSETS.sweetCrepe,
    caption: "Crepas dulces",
    alt: "Crepa dulce con Nutella, fresas y banana",
    className: "",
  },
  {
    img: ASSETS.napolitanoFlan,
    caption: "Mini flan",
    alt: "Mini flanes napolitanos en mesa de fiesta",
    className: "md:col-span-2 col-span-2",
  },
  {
    img: ASSETS.sprinkleBirthdayCake,
    caption: "Celebraciones",
    alt: "Pastel con sprinkles de colores",
    className: "",
  },
  {
    img: ASSETS.churrosMenu,
    caption: "Churros con toppings",
    alt: "Churros con toppings y porciones de pastel",
    className: "",
  },
];

export default function GallerySection() {
  return (
    <section id="galeria" className="overflow-hidden bg-cocoa py-[clamp(88px,10vw,156px)] text-background">
      <div className="mx-auto w-[min(100%-40px,1380px)] md:w-[min(100%-80px,1380px)]">
        <div className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-[1fr_auto] md:gap-10">
          <p className="eyebrow !text-sage md:col-span-2">Hecho por Sweet Vanilla</p>
          <h2 className="display-xl max-w-[780px] text-[clamp(3rem,12vw,4.7rem)] md:text-[clamp(3rem,5.4vw,5.8rem)]">
            Cada creación cuenta una historia distinta.
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mb-2 inline-flex items-center gap-2 justify-self-start border-b border-current pb-1 text-[0.82rem] font-bold text-sage no-underline">
            <Instagram className="h-[18px] w-[18px]" />
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-[18px] md:min-h-[920px] md:grid-cols-3 md:grid-rows-2">
          {GALLERY.map(g => (
            <figure
              key={g.caption}
              className={`group relative m-0 min-h-[220px] overflow-hidden rounded-3xl bg-[#59443c] md:min-h-[340px] ${g.className}`}>
              <img
                src={g.img}
                alt={g.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                loading="lazy"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-b from-transparent to-[rgba(32,21,17,0.55)]"
              />
              <figcaption className="absolute inset-x-4 bottom-4 z-[2] flex items-center justify-between font-display text-[1rem] md:inset-x-5 md:bottom-[18px] md:text-[1.25rem]">
                {g.caption}
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.3} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
