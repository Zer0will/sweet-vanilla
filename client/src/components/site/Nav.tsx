import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ASSETS } from "@/lib/assets";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#menu", label: "Menú" },
  { href: "#galeria", label: "Galería" },
  { href: "#politicas", label: "Políticas" },
  { href: "#recoger", label: "Pick up" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-30 mx-auto grid min-h-[88px] w-[min(100%-40px,1420px)] grid-cols-[1fr_auto] items-center md:min-h-[122px] md:grid-cols-[1fr_auto_1fr]">
      <a
        href="#inicio"
        aria-label="Sweet Vanilla, volver al inicio"
        className="block h-[58px] w-[58px] rounded-full shadow-[0_10px_30px_rgba(87,112,94,0.1)] transition-transform duration-200 hover:rotate-[-2deg] hover:scale-[1.02] md:absolute md:left-0 md:top-[20px] md:h-[104px] md:w-[104px]">
        <img src={ASSETS.logo} alt="Sweet Vanilla" className="h-full w-full rounded-full" />
      </a>

      <nav
        aria-label="Navegación principal"
        className="hidden items-center gap-[clamp(24px,3.5vw,52px)] md:col-start-2 md:flex">
        {LINKS.map(l => (
          <a
            key={l.href}
            href={l.href}
            className="group relative py-2 text-[0.86rem] font-semibold no-underline">
            {l.label}
            <span className="absolute bottom-[2px] left-0 right-0 h-px origin-right scale-x-0 bg-sage-deep transition-transform duration-200 group-hover:origin-left group-hover:scale-x-100" />
          </a>
        ))}
      </nav>

      <a
        href="#ordenar"
        className="hidden min-h-[52px] items-center justify-center rounded-full bg-primary px-6 text-[0.88rem] font-bold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(59,41,35,0.12)] md:col-start-3 md:inline-flex md:justify-self-end">
        Ordenar
      </a>

      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="relative z-50 flex h-12 w-12 items-center justify-center rounded-full border border-sage-deep/50 bg-background/90 md:hidden">
        {open ? <X className="h-[22px] w-[22px]" /> : <Menu className="h-[22px] w-[22px]" />}
      </button>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-200 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}>
        <div className="flex h-full flex-col px-7 pb-9 pt-[110px]">
          <p className="eyebrow mb-7">Repostería artesanal</p>
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-border py-3.5 font-display text-[2.4rem] leading-none no-underline">
              <span className="text-[0.8rem] text-sage-deep">0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <a
            href="#ordenar"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex min-h-[52px] items-center justify-center rounded-full bg-primary px-6 text-[0.88rem] font-bold text-primary-foreground">
            Comenzar mi pedido
          </a>
          <small className="mt-4 text-center text-[0.6rem] text-cocoa-soft">
            Shoreline &amp; Lake Forest Park · Solo pick up
          </small>
        </div>
      </div>
    </header>
  );
}
