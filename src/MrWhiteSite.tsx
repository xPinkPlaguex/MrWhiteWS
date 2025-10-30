import React, { useEffect, useMemo, useState } from "react";

// Gyorsan szerkeszthető adatok
const COMPANY_NAME = "Sárvári Káldor E.V.";
const PHONE_DISPLAY = "+36 70 677 41 10";
const PHONE_LINK = "tel:+36706774110";
const INSTAGRAM_URL = "https://www.instagram.com/mr.white.renovalas/";
const FACEBOOK_URL = "https://facebook.com/yourprofile";
const GOOGLE_REVIEW_URL = "https://g.page/r/your-google-review";
const BEIGE = "#E1DED2";

/**
 * BASE_URL:
 * - Vite alatt az import.meta.env.BASE_URL értékét használjuk
 * - fallback: relatív "./" (GitHub Pages-en is működik)
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.BASE_URL) ||
  "./";

// A képek helye: public/Gallery
const GALLERY_DIR = "Gallery";
const GALLERY_ROOT = BASE_URL + GALLERY_DIR;

type ProjectSpec = { folder: string; count: number };
const PROJECTS: ProjectSpec[] = [
  { folder: "1. Kertesház", count: 7 },
  { folder: "2. Modern Lakás", count: 6 },
  { folder: "3. Modern Lakás", count: 7 },
  { folder: "4. Lépcsőház", count: 3 },
  { folder: "5. Otthon", count: 5 },
  { folder: "6. Parkettacsiszolás", count: 4 },
];

function displayNameFromFolder(name: string) {
  const sliced = name.slice(2);
  return sliced.replace(/^[\s._-]*/, "");
}

function galleryPath(folder: string, file: string) {
  return `${GALLERY_ROOT}/${encodeURIComponent(folder)}/${file}`;
}

function numberFiles(count: number) {
  return Array.from({ length: count }, (_, i) => `${i + 1}.webp`);
}

export default function MrWhiteSite() {
  const [route, setRoute] = useState<string>(() => window.location.hash || "#home");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      const lock = route === "#home" && mql.matches;
      document.documentElement.style.overflow = lock ? "hidden" : "auto";
      document.body.style.overflow = lock ? "hidden" : "auto";
    };
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [route]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Aboreto&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      body{font-family: Arial, Helvetica, sans-serif;}
      h1,h2,h3,.heading{font-family:'Aboreto', serif;}
      .no-scrollbar::-webkit-scrollbar{display:none;}
      .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
    `;
    document.head.appendChild(style);

    return () => {
      try { document.head.removeChild(style); } catch {}
      try { document.head.removeChild(link); } catch {}
    };
  }, []);

  useEffect(() => { document.title = "Mr. White - renoválás"; }, []);

  const Nav = useMemo(() => (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "#E1DED2",
        backgroundImage: `url("${BASE_URL}nav-left.webp")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "auto 100%",
        minHeight: "120px",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-4 md:py-5 flex items-center justify-between">
        <a href="#home" className="inline-flex items-center gap-2" aria-label="Mr White — Kezdőlap">
          <img
            src={BASE_URL + "aa.svg"}
            alt="Mr White logó"
            className="h-[3.75rem] md:h-[4.375rem] w-auto block"
            loading="eager"
            decoding="async"
          />
        </a>

        <nav
          className="flex items-center gap-8 text-[12px] md:text-[14px] ml-auto mr-[60px]"
          style={{
            fontFamily: "'Aboreto', serif",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: "400",
          }}
        >
          <a href="#gallery" className="text-white hover:opacity-80 transition-opacity duration-200">
            Galéria
          </a>
          <a href="#pricing" className="text-white hover:opacity-80 transition-opacity duration-200">
            Árlista
          </a>
        </nav>
      </div>
    </header>
  ), []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {Nav}
      {route === "#home" && <HomeHero />}
      {route === "#gallery" && <GalleryPage />}
      {route === "#pricing" && <PricingPage />}

      {route !== "#home" && (
        <footer className="border-t bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-zinc-600 flex flex-col md:flex-row items-center justify-between gap-3">
            <div>© {new Date().getFullYear()} {COMPANY_NAME}</div>
            <div className="flex items-center gap-4">
              <a href="#home" className="hover:text-zinc-900">Vissza a főoldalra</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function HomeHero() {
  return (
    <section id="home" className="relative h-[calc(100vh-120px)] overflow-auto md:overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-6 md:py-10 flex flex-col h-full justify-between">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Mr White renoválás</h1>
        <p className="mt-3 max-w-2xl text-base md:text-xl text-zinc-700">
          Közel 30 éves tapasztalattal rendelkezünk, melyből több mint egy évtizednyi Németország és Skandinávia területéről származik. Küldetésünk, hogy az ott tanult szemléletet hozzuk Magyarország szívébe, Budapestre és környékére.
        </p>

        <div className="mt-6">
          <div className="text-sm uppercase tracking-widest text-zinc-500 mb-3">Vállalunk:</div>
          <div className="grid grid-cols-2 gap-2 w-full min-w-0 items-stretch md:flex md:flex-nowrap md:gap-2">
            <MiniCard title="Szobafestés" desc="Fal és mennyezet festés" img="icons/szobafestes.webp" />
            <MiniCard title="Melegburkolás" desc="Laminált vagy vinyl lerakás" img="icons/melegburkolas.webp" />
            <MiniCard title="Gipszkartonozás" desc="Szerkezet, burkolás és gipszkarton dekor elemek" img="icons/gipszkartonozas.webp" />
            <MiniCard title="Parkettacsiszolás" desc="Felújítás, lakkozás, olajozás" img="icons/parkettacsiszolas.webp" />
          </div>
        </div>

        <div className="mt-2 pb-3">
          <div className="flex flex-wrap items-center gap-2 w-full text-xs sm:text-sm">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Instagram</a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Facebook</a>
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Google értékelés</a>
            <span className="px-3 py-2 md:py-3 rounded-xl border font-medium bg-white whitespace-nowrap">{COMPANY_NAME}</span>
            <a href={PHONE_LINK} className="px-2 py-2 md:px-4 md:py-2 rounded-xl bg-zinc-900 text-white font-medium whitespace-nowrap">Hívás: {PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ title, desc, img }: { title: string; desc: string; img?: string }) {
  return (
    <div className="rounded-xl border p-3 md:p-4 flex-1 min-w-0 h-auto" lang="hu" style={{ backgroundColor: BEIGE }}>
      {img && <img src={BASE_URL + img} alt="" className="h-[2.025rem] w-[2.025rem] mb-1 block" loading="lazy" decoding="async" />}
      <div className="font-semibold leading-tight tracking-tight text-[clamp(12px,1.8vw,15px)] md:text-[clamp(14px,1.4vw,16px)] whitespace-normal" style={{ hyphens: "auto" }}>
        {title}
      </div>
      <p className="mt-1 text-black leading-snug text-[clamp(11px,1.6vw,14px)] md:text-[clamp(12px,1.2vw,14px)]">{desc}</p>
    </div>
  );
}
