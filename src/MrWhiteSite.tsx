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
 * - NINCS process, így nem kell @types/node
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.BASE_URL) ||
  "./";

// A képek helye: public/Gallery  (figyelj a nagy G betűre!)
const GALLERY_DIR = "Gallery";
const GALLERY_ROOT = BASE_URL + GALLERY_DIR;

// Projektek: csak a mappanevet és a képek számát add meg
// A fájlneveknek 1.webp, 2.webp, 3.webp... formában kell lenniük
type ProjectSpec = { folder: string; count: number };
const PROJECTS: ProjectSpec[] = [
  { folder: "1. Kertesház", count: 7 },
  { folder: "2. Modern Lakás", count: 6 },
  { folder: "3. Modern Lakás", count: 7 },
  { folder: "4. Lépcsőház", count: 3 },
  { folder: "5. Otthon", count: 5 },
  { folder: "6. Parkettacsiszolás", count: 4 },
];

// Megjelenített szekciócím: vágd le az első két karaktert (pl. "1.")
function displayNameFromFolder(name: string) {
  const sliced = name.slice(2);
  return sliced.replace(/^[\s._-]*/, "");
}

// Kép elérési útvonal
function galleryPath(folder: string, file: string) {
  return `${GALLERY_ROOT}/${encodeURIComponent(folder)}/${file}`;
}

// 1.webp..N.webp lista generálása
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
      </a> {/* EZ hiányzott! 👈 */}

      <nav
        className="flex items-center gap-8 text-[12px] md:text-[14px] ml-auto mr-[-40px]"
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

// Kezdőlap
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

// Árlista
function PricingPage() {
  return (
    <main id="pricing" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-3xl font-bold">Árlista</h2>
        <p className="mt-2 text-zinc-600">A munkák költsége több tényezőtől függ, ezért pontos árajánlatot csak előzetes helyszíni felmérés alapján tudunk nyújtani.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-600 text-sm">
              <tr>
                <th className="p-4">Munka</th>
                <th className="p-4">Leírás</th>
                <th className="p-4">Irányár</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <PriceRow title="Szobafestés" desc="Fal és mennyezet festés" price="1 500 - 3 500 Ft/m²" />
              <PriceRow title="Könnyű és nehéz tapétázás" desc="Vékony és mintás anyagok" price="4 500 - 6 500 Ft/m²" />
              <PriceRow title="Gipszkarton válaszfal és mennyezet" desc="Szerkezet, burkolás és gipszkarton dekor elemek" price="6 000 - 18 000 Ft/m²" />
              <PriceRow title="Melegburkolás" desc="Laminált vagy vinyl lerakás" price="2 500 - 4 500 Ft/m²" />
              <PriceRow title="Parketta csiszolás" desc="Felújítás, lakkozás, olajozás" price="9 500 - 18 000 Ft/m²" />
            </tbody>
          </table>
        </div>
      </div>

      <div className="sticky bottom-0 border-t" style={{ backgroundColor: BEIGE }}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 sm:flex-nowrap">
          <span className="text-sm text-zinc-600 text-center sm:text-left">Felmérésért és árajánlatért hívja ezt a számot.</span>
          <a href={PHONE_LINK} className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:opacity-90 whitespace-nowrap text-center">
            Hívás: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </main>
  );
}

// Galéria csempe: 4:3, középről vágott előnézet; kattintásra lightbox nyílik
function GalleryTile({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void; }) {
  return (
    <button
      type="button"
      onClick={() => onOpen()}
      className="relative aspect-[4/3] rounded-xl border bg-white overflow-hidden group focus:outline-none focus:ring-2 focus:ring-zinc-900"
      aria-label={alt}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.02]" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5" />
    </button>
  );
}

// Galéria oldal: projektmappákból, előnézeti 4:3 + lightbox lapozással
function GalleryPage() {
  // Lightbox állapot: melyik projekt és melyik kép
  const [lightbox, setLightbox] = useState<{ open: boolean; projIdx: number; imgIdx: number }>({ open: false, projIdx: -1, imgIdx: -1 });

  // Nyitás/bezárás
  const openLightbox = (projIdx: number, imgIdx: number) => setLightbox({ open: true, projIdx, imgIdx });
  const closeLightbox = () => setLightbox({ open: false, projIdx: -1, imgIdx: -1 });

  // Aktuális kép forrása/alt a state alapján
  const currentSrc = () => {
    if (!lightbox.open) return "";
    const proj = PROJECTS[lightbox.projIdx];
    const files = numberFiles(proj.count);
    const file = files[(lightbox.imgIdx + files.length) % files.length];
    return galleryPath(proj.folder, file);
  };
  const currentAlt = () => {
    if (!lightbox.open) return "";
    const display = displayNameFromFolder(PROJECTS[lightbox.projIdx].folder);
    return `${display} - ${lightbox.imgIdx + 1}`;
  };

  // Lapozás (körkörös)
  const goNext = () => {
    const proj = PROJECTS[lightbox.projIdx];
    const len = numberFiles(proj.count).length;
    setLightbox((s) => ({ ...s, imgIdx: (s.imgIdx + 1 + len) % len }));
  };
  const goPrev = () => {
    const proj = PROJECTS[lightbox.projIdx];
    const len = numberFiles(proj.count).length;
    setLightbox((s) => ({ ...s, imgIdx: (s.imgIdx - 1 + len) % len }));
  };

  // Billentyűk: Esc bezár, nyilak lapoznak
  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open]);

  return (
    <main id="gallery" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 space-y-10">
        <div>
          <h2 className="text-3xl font-bold">Galéria</h2>
          <p className="mt-2 text-zinc-600">Válogatott munkáink projektcsoportokra bontva.</p>
        </div>

        {PROJECTS.map((proj, idx) => {
          const display = displayNameFromFolder(proj.folder);
          const files = numberFiles(proj.count);
          if (!files.length) return null;
          return (
            <section key={idx} aria-labelledby={`proj-${idx}`}>
              <h3 id={`proj-${idx}`} className="text-xl font-semibold mb-4">{display}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {files.map((file, i) => {
                  const src = galleryPath(proj.folder, file);
                  return (
                    <GalleryTile
                      key={i}
                      src={src}
                      alt={`${display} - ${i + 1}`}
                      onOpen={() => openLightbox(idx, i)}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="sticky bottom-0 border-t" style={{ backgroundColor: BEIGE }}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 sm:flex-nowrap">
          <span className="text-sm text-zinc-600 text-center sm:text-left">Felmérésért és árajánlatért hívja ezt a számot.</span>
          <a href={PHONE_LINK} className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:opacity-90 whitespace-nowrap text-center">
            Hívás: {PHONE_DISPLAY}
          </a>
        </div>
      </div>

      {lightbox.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Bal/Jobb kattintható zónák */}
          <div
            className="absolute left-0 top-0 h-full w-1/3 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Előző"
            title="Előző"
          />
          <div
            className="absolute right-0 top-0 h-full w-1/3 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Következő"
            title="Következő"
          />

          {/* Kép */}
          <img
            src={currentSrc()}
            alt={currentAlt()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Bal/jobb nyilak */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/90 text-zinc-900 text-sm font-medium shadow"
            aria-label="Előző"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-white/90 text-zinc-900 text-sm font-medium shadow"
            aria-label="Következő"
          >
            ▶
          </button>

          {/* Bezárás */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-sm font-medium"
            aria-label="Bezárás"
          >
            Bezárás
          </button>
        </div>
      )}
    </main>
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

function PriceRow({ title, desc, price }: { title: string; desc: string; price: string }) {
  const MIN_BEFORE_WRAP = 7;
  const withSoftBreak = price.replace("–", "–\u200B");
  const first = withSoftBreak.slice(0, MIN_BEFORE_WRAP).replace(/ /g, "\u00A0");
  const rest = withSoftBreak.slice(MIN_BEFORE_WRAP);
  return (
    <tr>
      <td className="p-4 font-medium">{title}</td>
      <td className="p-4 text-zinc-600">{desc}</td>
      <td className="p-4 whitespace-normal sm:whitespace-nowrap">
        <span className="inline-block whitespace-nowrap">{first}</span>
        {rest}
      </td>
    </tr>
  );
}
