const POLICIES: Array<{ title: string; items: string[] }> = [
  {
    title: "1. Anticipo y pago",
    items: [
      "Se requiere un 50% de anticipo (no reembolsable) para confirmar tu pedido.",
      "El restante debe pagarse el día de la entrega del producto.",
    ],
  },
  {
    title: "2. Plazo de entrega",
    items: [
      "Los pedidos deben realizarse con al menos 4 días de anticipación a la fecha de entrega deseada.",
      "Se establecerá un horario para recoger tu pedido; en caso de exceder 20 minutos de espera se cobrará una tarifa adicional.",
    ],
  },
  {
    title: "3. Cancelaciones y reagendados",
    items: [
      "No hay devoluciones del depósito por ningún motivo en caso de cancelación.",
      "Las cancelaciones solo son aceptadas con al menos 3 días de anticipación a la fecha de entrega.",
      "Con cancelación anticipada, el pedido puede reagendarse para una fecha posterior, sujeto a disponibilidad.",
      "En caso de cancelación y reagendado a tiempo, puedes cambiar tu producto por uno del mismo precio, sujeto a disponibilidad.",
    ],
  },
  {
    title: "4. Imágenes de referencia",
    items: [
      "Todas las imágenes proporcionadas por el cliente se toman como inspiración para la elaboración del producto, no como garantía de una copia exacta.",
    ],
  },
  {
    title: "5. Responsabilidad",
    items: [
      "Sweet Vanilla se compromete a entregar el producto en perfectas condiciones y en su empaque apropiado para su transportación.",
      "No somos responsables por daños o pérdidas causadas por la cancelación o reagendado de un pedido.",
    ],
  },
  {
    title: "6. Entrega y manipulación del producto",
    items: [
      "Una vez entregado el producto, no nos hacemos responsables por daños o deterioros causados por transporte o manipulación inadecuada, condiciones climáticas adversas, o entorno y almacenamiento inadecuado.",
    ],
  },
];

export default function PoliciesSection() {
  return (
    <section id="politicas" className="container max-w-5xl py-16">
      <div className="mb-9 text-center">
        <h2 className="font-display text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-primary">
          Políticas de Sweet Vanilla
        </h2>
      </div>
      <div className="rounded-3xl border border-secondary bg-card p-7 md:p-9">
        {POLICIES.map((p, i) => (
          <div key={p.title} className={i === 0 ? "" : "mt-6"}>
            <h3 className="font-display text-[1.05rem] font-semibold text-caramel">{p.title}</h3>
            <ul className="mt-1.5 list-disc space-y-1.5 pl-5">
              {p.items.map(item => (
                <li key={item} className="text-[0.9rem] text-foreground/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-7 text-[0.86rem] text-muted-foreground">
          Al realizar un pedido, aceptas estos términos y condiciones establecidos por Sweet
          Vanilla. Si tienes alguna pregunta, no dudes en comunicarte con nosotros.
        </p>
      </div>
    </section>
  );
}
