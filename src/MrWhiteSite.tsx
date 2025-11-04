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

// Kép elérési útvonal (Galéria)
function galleryPath(folder: string, file: string) {
  return `${GALLERY_ROOT}/${encodeURIComponent(folder)}/${file}`;
}

// 1.webp..N.webp lista generálása
function numberFiles(count: number) {
  return Array.from({ length: count }, (_, i) => `${i + 1}.webp`);
}

/* =========================
   SZOLGÁLTATÁS OLDALAK
   ========================= */

// Árlista alap (innen szűrünk a szolgáltatás-oldalakra)
const ALL_PRICES = [
  { title: "Szobafestés", desc: "Fal és mennyezet festés", price: "1 500 - 3 500 Ft/m²" },
  { title: "Könnyű és nehéz tapétázás", desc: "Vékony és mintás anyagok", price: "4 500 - 6 500 Ft/m²" },
  { title: "Gipszkarton válaszfal és mennyezet", desc: "Szerkezet, burkolás és gipszkarton dekor elemek", price: "6 000 - 18 000 Ft/m²" },
  { title: "Melegburkolás", desc: "Laminált vagy vinyl lerakás", price: "2 500 - 4 500 Ft/m²" },
  { title: "Parketta csiszolás", desc: "Felújítás, lakkozás, olajozás", price: "9 500 - 18 000 Ft/m²" },
];

type ServiceSlug = "szobafestes" | "melegburkolas" | "gipszkartonozas" | "parkettacsiszolas";

type ServiceSpec = {
  slug: ServiceSlug;
  title: string;
  description: string;
  images: { folder: string; count: number }; // public/Services/<slug>/
  priceRows: { title: string; desc: string; price: string }[];
};

// Szövegek a kérésed szerint (enyhe helyesírási javításokkal)
const SERVICE_SPECS: ServiceSpec[] = [
  {
    slug: "szobafestes",
    title: "Szobafestés, tapétázás",
    description:
      `Nagy gyakorlatunk van nem csak festésben, illetve különböző típusú tapéták ragasztásában, de vállalunk dekor panelek, stukkók, rozetták és egyéb díszítőelemek elhelyezését.`,
    images: { folder: "szobafestes", count: 8 },
    priceRows: ALL_PRICES.filter(r => ["Szobafestés", "Könnyű és nehéz tapétázás"].includes(r.title)),
  },
  {
    slug: "melegburkolas",
    title: "Melegburkolás",
    description:
      `Minőségi munkát végzünk különböző melegburkolatok lerakásakor, legyen az valódi fa svédpadló, laminált vagy vinyl padló. A szegélyezést az ügyfél igénye szerinti leghatékonyabb módszerrel végezzük el.`,
    images: { folder: "melegburkolas", count: 8 },
    priceRows: ALL_PRICES.filter(r => ["Melegburkolás"].includes(r.title)),
  },
  {
    slug: "gipszkartonozas",
    title: "Gipszkartonozás",
    description:
      `Válaszfalak és mennyezetek kiépítése az építési előírások figyelembevételével, megbízható minőségben és gondos kivitelben. Vállaljuk rejtett világításokhoz mennyezeti vagy oldalfali dekor elemek építését is.`,
    images: { folder: "gipszkartonozas", count: 8 },
    priceRows: ALL_PRICES.filter(r => ["Gipszkarton válaszfal és mennyezet"].includes(r.title)),
  },
  {
    slug: "parkettacsiszolas",
    title: "Parkettacsiszolás",
    description:
      `Professzionális gépekkel, igényesen magas minőségben, bármilyen fajtájú fa padlón végzünk csiszolást és felújítást. Tömör fa szegélyek precíz illesztése és rögzítése, valamint lépcsőszegélyek szabását is vállaljuk.`,
    images: { folder: "parkettacsiszolas", count: 8 },
    priceRows: ALL_PRICES.filter(r => ["Parketta csiszolás"].includes(r.title)),
  },
];

// Hash alapján szolgáltatás kikeresése
function parseServiceFromHash(hash: string) {
  const m = hash.match(/^#service\/([a-z0-9-]+)/i);
  if (!m) return null;
  const slug = m[1] as ServiceSlug;
  return SERVICE_SPECS.find(s => s.slug === slug) || null;
}

// Szolgáltatás képek elérése
function serviceImagePath(slug: string, idx: number) {
  return `${BASE_URL}Services/${encodeURIComponent(slug)}/${idx}.webp`;
}

/* =========================
   FŐ KOMPONENS
   ========================= */

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
          <img src={BASE_URL + "aa.svg"} alt="Mr White logó" className="h-[3.75rem] md:h-[4.375rem] w-auto block" loading="eager" decoding="async" />
        </a>
        <nav className="flex items-center gap-4 text-sm font-[Aboreto] uppercase tracking-wide">
          <a href="#gallery" className="text-white hover:opacity-80">Galéria</a>
          <a href="#pricing" className="text-white hover:opacity-80">Árlista</a>
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

      {/* Új: szolgáltatás-oldalak */}
      {route.startsWith("#service/") && <ServicePage route={route} />}

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

/* =========================
   OLDALAK ÉS KOMPONENSEK
   ========================= */

// Kezdőlap
function HomeHero() {
  return (
    <section id="home" className="relative h-[calc(100vh-120px)] overflow-auto md:overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 py-6 md:py-10 flex flex-col h-full justify-between">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Mr. White renoválás</h1>
        <p className="mt-3 max-w-2xl text-base md:text-xl text-zinc-700">
          Közel 30 éves tapasztalattal rendelkezünk, melyből több mint egy évtizednyi Németország és Skandinávia területéről származik. Küldetésünk, hogy az ott tanult szemléletet hozzuk Magyarország szívébe, Budapestre és környékére.
        </p>

        <div className="mt-6">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Instagram</a>
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Facebook</a>
              <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="px-2 py-2 md:px-4 md:py-2 rounded-xl border font-medium bg-white whitespace-nowrap">Google értékelés</a>
              
              {/* ÚJ: e-mail buborék másolás gombbal */}
              <div className="inline-flex items-center gap-2 px-3 py-2 md:py-3 rounded-xl border bg-white">
                <span className="font-medium whitespace-nowrap">festes.burkolat@gmail.com</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText("festes.burkolat@gmail.com")}
                  className="inline-flex items-center justify-center h-6 w-6 md:h-7 md:w-7 rounded border hover:bg-zinc-50"
                  aria-label="E-mail másolása"
                  title="E-mail másolása"
                >
                  {/* copy ikon (inline SVG) */}
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                    <rect x="9" y="9" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="5" y="3" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                  </svg>
                </button>
              </div>
              
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

function MiniCard({ title, desc, img, link }: { title: string; desc: string; img?: string; link?: string }) {
  const Inner = (
    <div className="rounded-xl border p-3 md:p-4 w-full h-full" lang="hu" style={{ backgroundColor: BEIGE }}>
      {/* Belső grid: ikon, cím, szöveg, és egy 1fr spacer, ami a maradék helyet az aljára tolja */}
      <div className="grid grid-rows-[auto_auto_auto_1fr] gap-1 h-full">
        {/* Ikon – fix méret, minden kártyán ugyanott indul */}
        {img && (
          <img
            src={BASE_URL + img}
            alt=""
            className="h-8 w-8 md:h-9 md:w-9 block"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Cím – törés szóhatáron, azonos indulás */}
        <div
          className="font-semibold leading-tight tracking-tight text-[clamp(12px,1.8vw,15px)] md:text-[clamp(14px,1.4vw,16px)] whitespace-normal break-words"
          style={{ hyphens: "auto" }}
        >
          {title}
        </div>

        {/* Rövid leírás */}
        <p className="text-black leading-snug text-[clamp(11px,1.6vw,14px)] md:text-[clamp(12px,1.2vw,14px)]">
          {desc}
        </p>

        {/* Spacer – ez tolja le a „maradékot” az aljára, így a rövidebb kártyák alján lesz üres sáv */}
        <div />
      </div>
    </div>
  );

  return link ? (
    <a href={link} className="block h-full focus:outline-none focus:ring-2 focus:ring-zinc-900" aria-label={`${title} részletek`}>
      {Inner}
    </a>
  ) : (
    Inner
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

// ÚJ: Szolgáltatás oldal komponens
function ServicePage({ route }: { route: string }) {
  const service = useMemo(() => parseServiceFromHash(route), [route]);

  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  if (!service) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold">Az oldal nem található</h2>
          <p className="mt-2 text-zinc-600">Lehet, hogy hibás linkre kattintottál.</p>
        </div>
      </main>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-120px)] bg-white flex flex-col">
      <div className="mx-auto max-w-6xl px-4 py-10 flex-1 flex flex-col gap-10 overflow-hidden">
        {/* 1. Szöveg */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
          <p className="mt-3 max-w-3xl text-base md:text-lg text-zinc-700 leading-relaxed">
            {service.description}
          </p>
        </header>

        {/* 2. Árlista-részlet ugyanazzal a táblázattal */}
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-600 text-sm">
              <tr>
                <th className="p-4">Munka</th>
                <th className="p-4">Leírás</th>
                <th className="p-4">Irányár</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {service.priceRows.map((r, i) => (
                <PriceRow key={i} title={r.title} desc={r.desc} price={r.price} />
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Képsor egy sorban, minimalista oldalsó nyilakkal */}
        <ServiceStrip slug={service.slug} count={service.images.count} title={service.title} />
      </div>

      {/* Alsó CTA, egységes a többi oldallal */}
      <div className="sticky bottom-0 border-t" style={{ backgroundColor: BEIGE }}>
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 sm:flex-nowrap">
          <span className="text-sm text-zinc-600 text-center sm:text-left">Felmérésért és árajánlatért hívja ezt a számot.</span>
          <a href={PHONE_LINK} className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:opacity-90 whitespace-nowrap text-center">
            Hívás: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceStrip({ slug, count, title }: { slug: ServiceSlug; count: number; title: string }) {
  const id = `strip-${slug}`;
  return (
    <div className="relative">
      <h3 className="text-xl font-semibold mb-3">Munkáink</h3>

      <div className="relative">
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          id={id}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="snap-start shrink-0 w-[320px]">
              <div className="relative aspect-[4/3] rounded-xl border bg-white overflow-hidden">
                <img
                  src={serviceImagePath(slug, i + 1)}
                  alt={`${title} ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>

        {/* nyilak */}
        <button
          type="button"
          aria-label="Előző képek"
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border shadow"
          onClick={() => {
            document.getElementById(id)?.scrollBy({ left: -360, behavior: "smooth" });
          }}
          title="Előző"
        >
          ◀
        </button>

        <button
          type="button"
          aria-label="Következő képek"
          className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border shadow"
          onClick={() => {
            document.getElementById(id)?.scrollBy({ left: 360, behavior: "smooth" });
          }}
          title="Következő"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
