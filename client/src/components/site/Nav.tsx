import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#menu", label: "Menú" },
  { href: "#galeria", label: "Galería" },
  { href: "#politicas", label: "Políticas" },
  { href: "#recoger", label: "Pick up" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-secondary bg-background/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_20px_rgba(62,90,60,0.08)]" : ""
      }`}>
      <div className="container flex items-center justify-between py-2.5">
        <a href="#inicio" className="flex items-center gap-2.5">
          <img
            src={ASSETS.logo}
            alt="Sweet Vanilla logo"
            className="h-10 w-10 rounded-full border-2 border-white shadow-[0_0_0_1px_var(--sage)]"
          />
          <span className="font-display text-lg font-semibold text-primary">Sweet Vanilla</span>
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-5 md:flex">
            {LINKS.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-foreground transition-colors hover:text-caramel">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Button asChild size="sm" className="rounded-full px-5 font-bold">
            <a href="#ordenar">Ordenar</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
