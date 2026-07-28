import { ArrowDownRight } from "lucide-react";
import { ASSETS } from "@/lib/assets";
import { DOCENA_ITEMS } from "@shared/orders";

const STACK_CARDS = [
  {
    tag: "02 · Favorito",
    name: "Strawberry Creamcheese",
    desc: "Tres leches con fresas, crema y cream cheese.",
    price: "Desde $80",
    img: ASSETS.strawberriesCreamCup,
    alt: "Strawberry Creamcheese",
  },
  {
    tag: "03 · Intenso",
    name: "Chocolate Deluxe",
    desc: "Chocolate húmedo con ganache de dulce de leche o chocolate.",
    price: "Desde $80",
    img: ASSETS.blackGoldCake,
    alt: "Pastel Chocolate Deluxe",
  },
  {
    tag: "04 · Especial",
    name: "Moca Cookie Crumble",
    desc: "Moca, mousse de chocolate y crumbles de Oreo.",
    price: "Desde $80",
    img: ASSETS.mochaCake,
    alt: "Pastel Moca Cookie Crumble",
  },
];

const SIZES: Array<[string, string, string]> = [
  ["6 pulgadas", "8–10 porciones", "desde $80"],
  ["8 pulgadas", "15–20 porciones", "desde $100"],
  ['Corazón 6"', "8–10 porciones", "desde $85"],
];

const SPECIALS = [
  {
    tag: "Disponible en fechas selectas",
    name: "Churros con toppings",
    desc: "1 box · 1 topping incluido · +$2 topping extra",
    price: "$8",
  },
  {
    tag: "Cada dos viernes",
    name: "Crepas dulces",
    desc: "Pregunta por la próxima fecha",
    price: "Por confirmar",
  },
  {
    tag: "De temporada",
    name: "Fresas con crema",
    desc: "Con toppings al estilo Sweet Vanilla",
    price: "Por confirmar",
  },
];

export default function MenuSection() {
  return (
    <section
      id="menu"
      className="mx-auto w-[min(100%-40px,1380px)] py-[clamp(88px,10vw,156px)] md:w-[min(100%-80px,1380px)]">
      {/* Split heading */}
      <div className="mb-12 grid items-end gap-6 md:mb-[72px] md:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] md:gap-20">
        <div>
          <p className="eyebrow mb-5">Elige tu favorito</p>
          <h2 className="display-xl max-w-[760px] text-[clamp(3rem,12vw,4.7rem)] md:text-[clamp(3rem,5.4vw,5.8rem)]">
            Sabores que se sienten como una celebración.
          </h2>
        </div>
        <p className="text-[0.93rem] leading-[1.75] text-cocoa-soft">
          Cada pastel se prepara por encargo. El precio final puede variar según tamaño, relleno y
          decoración. Porciones individuales: vainilla $8 · triple chocolate $10.
        </p>
      </div>

      {/* Cake cards: featured + stack */}
      <div className="grid gap-6 md:grid-cols-[1.03fr_0.97fr]">
        <article className="group flex min-h-[520px] flex-col overflow-hidden rounded-[28px] border border-border bg-card md:min-h-[664px]">
          <div className="relative min-h-[310px] flex-1 overflow-hidden md:min-h-[390px]">
            <img
              src={ASSETS.marcBirthdayCake}
              alt="Pastel tradicional tres leches"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              loading="lazy"
            />
          </div>
          <div className="p-7 pb-8 md:px-[30px]">
            <span className="text-[0.67rem] font-bold uppercase tracking-[0.2em] text-sage-deep">
              01 · Clásico
            </span>
            <h3 className="my-2 font-display text-[clamp(2rem,3.4vw,3rem)] leading-none tracking-[-0.035em]">
              Tradicional
            </h3>
            <p className="mb-4 max-w-[520px] text-[0.82rem] leading-[1.65] text-cocoa-soft">
              Vainilla húmeda en tres leches con dulce de leche. Agrega coctel de frutas por $5.
            </p>
            <strong className="text-[0.8rem] text-caramel">Desde $80</strong>
          </div>
        </article>

        <div className="grid gap-[18px]">
          {STACK_CARDS.map(card => (
            <article
              key={card.name}
              className="group grid min-h-[170px] grid-cols-[37%_63%] overflow-hidden rounded-[28px] border border-border bg-card md:min-h-[209px] md:grid-cols-[39%_61%]">
              <div className="relative overflow-hidden">
                <img
                  src={card.img}
                  alt={card.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
                  loading="lazy"
                />
              </div>
              <div className="p-[18px] md:px-[26px] md:py-[23px]">
                <span className="text-[0.67rem] font-bold uppercase tracking-[0.2em] text-sage-deep">
                  {card.tag}
                </span>
                <h3 className="my-2 font-display text-[1.62rem] leading-none tracking-[-0.035em] md:text-[clamp(1.65rem,2.5vw,2.35rem)]">
                  {card.name}
                </h3>
                <p className="mb-4 hidden max-w-[520px] text-[0.82rem] leading-[1.65] text-cocoa-soft sm:block">
                  {card.desc}
                </p>
                <strong className="text-[0.8rem] text-caramel">{card.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Size pricing */}
      <div className="mt-16 grid gap-11 border-y border-border py-[50px] md:mt-[88px] md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:py-[58px]">
        <div>
          <p className="eyebrow mb-5">Pasteles personalizados</p>
          <h3 className="display-xl max-w-[480px] text-[clamp(2.6rem,4.3vw,4.6rem)] leading-[0.98]">
            El tamaño perfecto para tu momento.
          </h3>
        </div>
        <div>
          {SIZES.map(([size, portions, price], i) => (
            <p
              key={size}
              className={`grid grid-cols-[1fr_auto] items-center gap-5 border-b border-border py-[22px] sm:grid-cols-[1fr_1fr_auto] ${
                i === 0 ? "border-t" : ""
              }`}>
              <span className="font-display text-[1.45rem] font-semibold">{size}</span>
              <small className="col-start-1 row-start-2 text-cocoa-soft sm:col-start-2 sm:row-start-1">
                {portions}
              </small>
              <strong className="col-start-2 row-start-1 row-span-2 text-[0.79rem] text-caramel sm:col-start-3 sm:row-span-1">
                {price}
              </strong>
            </p>
          ))}
        </div>
      </div>

      {/* Package menu (docena) */}
      <div className="mt-[72px] grid gap-11 md:mt-[98px] md:grid-cols-[0.82fr_1.18fr] md:gap-[100px]">
        <div className="md:sticky md:top-[120px] md:self-start">
          <p className="eyebrow mb-5">Por docena y más</p>
          <h3 className="display-xl max-w-[480px] text-[clamp(2.6rem,4.3vw,4.6rem)] leading-[0.98]">
            Pequeños detalles, gran celebración.
          </h3>
          <p className="my-7 max-w-[430px] text-[0.89rem] leading-[1.75] text-cocoa-soft">
            Vasitos, minis, cake pops y postres listos para compartir en tu siguiente reunión.
          </p>
          <a
            href="#ordenar"
            className="inline-flex items-center gap-2 border-b border-current pb-1 text-[0.82rem] font-bold no-underline">
            Armar un pedido
            <ArrowDownRight className="h-[18px] w-[18px]" />
          </a>
        </div>
        <div className="border-t border-border">
          {DOCENA_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className="grid min-h-[84px] grid-cols-[30px_1fr_auto] items-center gap-4 border-b border-border md:grid-cols-[44px_1fr_auto]">
              <span className="font-display text-base text-sage-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="m-0 flex flex-col gap-px sm:flex-row sm:items-baseline sm:gap-2.5">
                <strong className="font-display text-[1.18rem] font-semibold md:text-[1.42rem]">
                  {item.name}
                </strong>
                <small className="text-[0.7rem] text-cocoa-soft">{item.units} unidades</small>
              </p>
              <b className="text-[0.84rem] text-caramel">${item.price}</b>
            </div>
          ))}
        </div>
      </div>

      {/* Specials row */}
      <div className="mt-16 grid overflow-hidden rounded-[28px] border border-border bg-secondary md:mt-[88px] md:grid-cols-3">
        {SPECIALS.map((item, i) => (
          <article
            key={item.name}
            className={`min-h-[230px] p-9 md:min-h-[260px] ${
              i < SPECIALS.length - 1 ? "border-b border-border md:border-b-0 md:border-r" : ""
            }`}>
            <span className="text-[0.63rem] font-bold uppercase tracking-[0.14em] text-sage-deep">
              {item.tag}
            </span>
            <h3 className="mb-2.5 mt-[42px] font-display text-[2.15rem] leading-none tracking-[-0.03em]">
              {item.name}
            </h3>
            <p className="mb-[22px] text-[0.77rem] text-cocoa-soft">{item.desc}</p>
            <strong className="text-[0.82rem] text-caramel">{item.price}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

