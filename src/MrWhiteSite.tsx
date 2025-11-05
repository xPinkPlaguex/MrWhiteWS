import React, { useEffect, useMemo, useState } from "react";

// Gyorsan szerkeszthető adatok
const COMPANY_NAME = "Sárvári Káldor E.V.";
const PHONE_DISPLAY = "+36 70 677 41 10";
const PHONE_LINK = "tel:+36706774110";
const INSTAGRAM_URL = "https://www.instagram.com/mr.white.renovalas/";
const FACEBOOK_URL = "https://facebook.com/yourprofile";
const GOOGLE_REVIEW_URL = "https://g.page/r/your-google-review";
const BEIGE = "#E1DED2";

const BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.BASE_URL) ||
  "./";

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
  images: { folder: string; count: number };
  priceRows: { title: string; desc: string; price: string }[];
};

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

function PriceRow({ title, desc, price }: { title: string; desc: string; price: string }) {
  const formattedPrice = price.replace(/\s*Ft\/m²/, "\u00A0Ft/m²").replace(/\s*-\s*/, "\u00A0-\u00A0");
  return (
    <tr>
      <td className="p-4 font-medium">{title}</td>
      <td className="p-4 text-zinc-600">{desc}</td>
      <td className="p-4 whitespace-normal sm:whitespace-nowrap break-words">{formattedPrice}</td>
    </tr>
  );
}

function ServiceStrip({ slug, count, title, onOpen }: { slug: ServiceSlug; count: number; title: string; onOpen: (i:number)=>void }) {
  const id = `strip-${slug}`;
  return (
    <div className="relative mx-auto max-w-6xl px-4">
      <h3 className="text-xl font-semibold mb-3">Munkáink</h3>

      <div className="relative">
        <div className="strip no-scrollbar" id={id} style={{ scrollBehavior: "smooth" }}>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="tile relative aspect-[4/3] rounded-xl border bg-white overflow-hidden"
              onClick={() => onOpen(i)}
              aria-label={`${title} ${i + 1} megnyitása`}
            >
              <img
                src={serviceImagePath(slug, i + 1)}
                alt={`${title} ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Előző képek"
          className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border shadow"
          onClick={() => {
            const el = document.getElementById(id);
            if (!el) return;
            el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
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
            const el = document.getElementById(id);
            if (!el) return;
            el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
          }}
          title="Következő"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
