import { ASSETS } from "@/lib/assets";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WA_DISPLAY, WA_NUMBER } from "@shared/orders";

export default function Footer() {
  return (
    <footer className="bg-primary px-5 py-11 text-center text-primary-foreground/85">
      <img
        src={ASSETS.logo}
        alt="Sweet Vanilla logo"
        className="mx-auto h-14 w-14 rounded-full border-2 border-white/70"
      />
      <p className="mt-3 font-display text-xl text-primary-foreground">Sweet Vanilla</p>
      <p className="mt-2 text-[0.88rem]">
        Repostería artesanal · Shoreline &amp; Lake Forest Park, WA
      </p>
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 font-bold text-primary transition-transform duration-150 hover:-translate-y-0.5">
        WhatsApp · {WA_DISPLAY}
      </a>
      <p className="mt-3 text-[0.88rem]">
        Instagram:{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-primary-foreground underline decoration-2 underline-offset-4">
          {INSTAGRAM_HANDLE}
        </a>
      </p>
      <p className="mt-4 text-[0.76rem] opacity-70">
        Sitio por Salt &amp; Tide Creative
      </p>
    </footer>
  );
}
