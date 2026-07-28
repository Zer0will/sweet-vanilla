import { ASSETS } from "@/lib/assets";
import { DOCENA_ITEMS } from "@shared/orders";

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
    img: ASSETS.blackGoldCake,
    alt: "Pastel moca cookie crumble blanco y negro",
  },
];

const EXTRA_ROWS: Array<[string, string]> = [
  ["Churros con toppings (por box, 1 topping)", "$8 · +$2 extra"],
  ["Porción de pastel — vainilla con dulce de leche", "$8"],
  ["Porción de pastel — triple chocolate especial", "$10"],
  ["Crepas dulces (cada dos viernes)", "Precio por confirmar"],
  ["Fresas con crema (de temporada)", "Precio por confirmar"],
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

      <div className="overflow-hidden rounded-2xl border border-secondary bg-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="bg-primary px-4 py-3 font-display text-[0.95rem] font-normal text-primary-foreground">
                Producto
              </th>
              <th className="bg-primary px-4 py-3 text-right font-display text-[0.95rem] font-normal text-primary-foreground">
                Precio
              </th>
            </tr>
          </thead>
          <tbody>
            {DOCENA_ITEMS.map(item => (
              <tr key={item.id}>
                <td className="border-t border-secondary px-4 py-2.5 text-[0.9rem]">
                  {item.name} ({item.units} unidades)
                </td>
                <td className="whitespace-nowrap border-t border-secondary px-4 py-2.5 text-right text-[0.9rem] font-bold text-caramel">
                  ${item.price}
                </td>
              </tr>
            ))}
            {EXTRA_ROWS.map(([name, price]) => (
              <tr key={name}>
                <td className="border-t border-secondary px-4 py-2.5 text-[0.9rem]">{name}</td>
                <td className="whitespace-nowrap border-t border-secondary px-4 py-2.5 text-right text-[0.9rem] font-bold text-caramel">
                  {price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-[0.82rem] text-muted-foreground">
        * El precio de los pasteles puede variar según la decoración, el tamaño y el relleno.
      </p>
    </section>
  );
}
