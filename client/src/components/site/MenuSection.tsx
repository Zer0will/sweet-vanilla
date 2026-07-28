import { ASSETS } from "@/lib/assets";
import { DOCENA_ITEMS } from "@shared/orders";

/** Photos for docena items — real Sweet Vanilla product shots from Instagram/repo */
const DOCENA_PHOTOS: Record<string, { img: string; alt: string; desc: string }> = {
  gelatinas: {
    img: ASSETS.napolitanoFlan,
    alt: "Mesa de postres con gelatinas y flan Sweet Vanilla",
    desc: "Suaves y coloridas, favoritas en toda mesa de postres.",
  },
  flan: {
    img: ASSETS.napolitanoFlan,
    alt: "Mini flan napolitano Sweet Vanilla",
    desc: "Nuestro flan napolitano cremoso en porción individual.",
  },
  chocoflan: {
    img: ASSETS.chocoflan,
    alt: "Chocoflan corazón Sweet Vanilla",
    desc: "La combinación perfecta de pastel de chocolate y flan.",
  },
  cupcakes: {
    img: ASSETS.sprinkleBirthdayCake,
    alt: "Cupcakes decorados Sweet Vanilla",
    desc: "Decorados a juego con el tema de tu celebración.",
  },
  cakepops: {
    img: ASSETS.fresasArreglo,
    alt: "Arreglo dulce estilo Sweet Vanilla",
    desc: "Bocaditos de pastel cubiertos de chocolate.",
  },
  popsicle: {
    img: ASSETS.flanNapolitano,
    alt: "Postre corazón decorado Sweet Vanilla",
    desc: "Cake pops estilo paleta, ideales para mesas de dulces.",
  },
  churrocheesecake: {
    img: ASSETS.churrosMenu,
    alt: "Churros con toppings Sweet Vanilla",
    desc: "Cheesecake con el toque crujiente de canela del churro.",
  },
  moussecheesecake: {
    img: ASSETS.strawberriesCreamCup,
    alt: "Vasito de mousse Sweet Vanilla",
    desc: "Mousse de cheesecake servido en vasito individual.",
  },
  mousseoreo: {
    img: ASSETS.blackGoldCake,
    alt: "Postre de chocolate Sweet Vanilla",
    desc: "Capas de mousse de Oreo con pudín de chocolate.",
  },
  gelatinamosaico: {
    img: ASSETS.boxedSweetCrepe,
    alt: "Postres en vasito Sweet Vanilla",
    desc: "Gelatina mosaico cremosa servida en vasito.",
  },
};

const FLAVOR_CARDS = [
  {
    tag: "CLÁSICO",
    name: "Tradicional",
    desc: "Pastel de vainilla húmedo en tres leches al estilo Sweet Vanilla, relleno de dulce de leche.",
    price: "Desde $80 · +$5 relleno de coctel de frutas",
    img: ASSETS.marcBirthdayCake,
    alt: "Pastel tradicional personalizado Sweet Vanilla",
  },
  {
    tag: "FAVORITO",
    name: "Strawberry Creamcheese",
    desc: "Tres leches relleno de fresas con crema y cream cheese.",
    price: "Desde $80",
    img: ASSETS.strawberriesCreamCup,
    alt: "Fresas con crema estilo Sweet Vanilla",
  },
  {
    tag: "ESPECIAL",
    name: "Chocolate Deluxe",
    desc: "Torta húmeda de chocolate semidulce con almíbar de cocoa, relleno de ganache de dulce de leche o de chocolate.",
    price: "Desde $80",
    img: ASSETS.sprinkleBirthdayCake,
    alt: "Pastel de chocolate personalizado con sprinkles",
  },
  {
    tag: "NUEVO",
    name: "Moca Cookie Crumble",
    desc: "Vainilla húmeda en moca, relleno de mousse de chocolate y crumbles de Oreo.",
    price: "Desde $80",
    img: ASSETS.mochaCake,
    alt: "Pastel moca cookie crumble Sweet Vanilla",
  },
];

const ANTOJITOS = [
  {
    name: "Churros con toppings",
    desc: "Box de churros recién hechos con 1 topping: Nutella, leche condensada o dulce de leche.",
    price: "$8 por box · +$2 topping extra",
    img: ASSETS.churrosMenu,
    alt: "Box de churros con toppings Sweet Vanilla",
  },
  {
    name: "Porción de pastel — vainilla con dulce de leche",
    desc: "Rebanada individual de nuestro tres leches tradicional.",
    price: "$8",
    img: ASSETS.marcBirthdayCake,
    alt: "Porción de pastel de vainilla Sweet Vanilla",
  },
  {
    name: "Porción de pastel — triple chocolate especial",
    desc: "Rebanada de triple chocolate con dulce de leche.",
    price: "$10",
    img: ASSETS.blackGoldCake,
    alt: "Porción de pastel triple chocolate Sweet Vanilla",
  },
  {
    name: "Crepas dulces",
    desc: "Disponibles cada dos viernes, con toppings a elegir.",
    price: "Precio por confirmar",
    img: ASSETS.sweetCrepe,
    alt: "Crepa dulce Sweet Vanilla",
  },
  {
    name: "Fresas con crema",
    desc: "De temporada, servidas en vaso con crema casera.",
    price: "Precio por confirmar",
    img: ASSETS.strawberriesCreamCup,
    alt: "Vaso de fresas con crema Sweet Vanilla",
  },
];

export default function MenuSection() {
  return (
    <section id="menu" className="container max-w-5xl py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-primary">
          Sabores de pastel
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          Todos nuestros pasteles se hacen por encargo · 6" desde $80 · 8" desde $100 · Corazón 6"
          desde $85
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FLAVOR_CARDS.map(card => (
          <article
            key={card.name}
            className="group overflow-hidden rounded-2xl border border-secondary bg-card transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(62,90,60,0.12)]">
            <div className="h-44 overflow-hidden bg-secondary">
              <img
                src={card.img}
                alt={card.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <span className="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide text-secondary-foreground">
                {card.tag}
              </span>
              <h3 className="font-display text-lg font-semibold text-primary">{card.name}</h3>
              <p className="mt-1.5 text-[0.86rem] text-muted-foreground">{card.desc}</p>
              <p className="mt-2.5 text-[0.9rem] font-bold text-caramel">{card.price}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mb-8 mt-16 text-center">
        <h2 className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-primary">
          Por docena y más
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          Perfectos para fiestas, reuniones y convivios
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DOCENA_ITEMS.map(item => {
          const photo = DOCENA_PHOTOS[item.id];
          return (
            <article
              key={item.id}
              className="group flex overflow-hidden rounded-2xl border border-secondary bg-card transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(62,90,60,0.12)]">
              <div className="h-28 w-28 shrink-0 overflow-hidden bg-secondary">
                <img
                  src={photo.img}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-0.5 p-4">
                <h3 className="font-display text-[1.02rem] font-semibold leading-snug text-primary">
                  {item.name}
                </h3>
                <p className="text-[0.78rem] leading-snug text-muted-foreground">{photo.desc}</p>
                <p className="mt-1 text-[0.88rem] font-bold text-caramel">
                  ${item.price} <span className="font-normal text-muted-foreground">· {item.units} unidades</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mb-8 mt-16 text-center">
        <h2 className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-primary">
          Antojitos
        </h2>
        <p className="mt-2 text-[0.95rem] text-muted-foreground">
          Porciones individuales y antojos de temporada
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {ANTOJITOS.map(item => (
          <article
            key={item.name}
            className="group flex overflow-hidden rounded-2xl border border-secondary bg-card transition-shadow duration-200 hover:shadow-[0_10px_30px_rgba(62,90,60,0.12)]">
            <div className="h-28 w-28 shrink-0 overflow-hidden bg-secondary">
              <img
                src={item.img}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                loading="lazy"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-center gap-0.5 p-4">
              <h3 className="font-display text-[1.02rem] font-semibold leading-snug text-primary">
                {item.name}
              </h3>
              <p className="text-[0.78rem] leading-snug text-muted-foreground">{item.desc}</p>
              <p className="mt-1 text-[0.88rem] font-bold text-caramel">{item.price}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-center text-[0.82rem] text-muted-foreground">
        * El precio de los pasteles puede variar según la decoración, el tamaño y el relleno.
      </p>
    </section>
  );
}
