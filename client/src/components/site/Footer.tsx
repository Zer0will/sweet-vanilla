import { ASSETS } from "@/lib/assets";
import { INSTAGRAM_URL, WA_NUMBER } from "@shared/orders";

export default function Footer() {
  return (
    <footer className="bg-cocoa px-0 pb-[34px] pt-[68px] text-background">
      <div className="mx-auto grid w-[min(100%-40px,1380px)] grid-cols-2 gap-x-[30px] gap-y-12 md:w-[min(100%-80px,1380px)] md:grid-cols-[1.5fr_0.5fr_0.5fr] md:gap-20">
        <div className="col-span-2 md:col-span-1">
          <img src={ASSETS.logo} alt="Sweet Vanilla" className="h-[86px] w-[86px] rounded-full" />
          <p className="mt-[18px] max-w-[320px] text-[0.72rem] leading-[1.7] text-background/55">
            Repostería artesanal hecha con amor en Washington. Pasteles tres leches, postres por
            docena y antojos de temporada — por encargo en Shoreline y Lake Forest Park.
          </p>
        </div>
        <div className="flex flex-col items-start gap-[13px]">
          <span className="mb-1 text-[0.61rem] font-bold uppercase tracking-[0.14em] text-sage">
            Explora
          </span>
          <a href="#menu" className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Menú
          </a>
          <a href="#galeria" className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Galería
          </a>
          <a href="#politicas" className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Políticas
          </a>
          <a href="#recoger" className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Pick up
          </a>
        </div>
        <div className="flex flex-col items-start gap-[13px]">
          <span className="mb-1 text-[0.61rem] font-bold uppercase tracking-[0.14em] text-sage">
            Conecta
          </span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Instagram
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            WhatsApp
          </a>
          <a href="#ordenar" className="text-[0.75rem] text-background/75 no-underline hover:text-background">
            Ordenar
          </a>
        </div>
        <p className="col-span-2 m-0 mt-2 border-t border-background/[0.12] pt-6 text-[0.59rem] text-background/40 md:col-span-3 md:mt-[46px]">
          © 2026 Sweet Vanilla · Sitio por Salt &amp; Tide Creative ·{" "}
          <a href="/admin" className="underline underline-offset-2 hover:text-background/70">
            Admin
          </a>
        </p>
      </div>
    </footer>
  );
}

