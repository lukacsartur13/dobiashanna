# HoneyGarden kerttervezés — Dóbiás Hanna (HU / EN)

Statikus weboldal, nincs szükség szerverre vagy build-eszközre a megjelenítéshez:
nyisd meg az `index.html`-t, vagy töltsd fel a mappát bármilyen tárhelyre.

## Szerkesztés

A HTML-oldalak **generáltak**. Ne a `.html` fájlokat szerkeszd, hanem:

| Fájl | Mit tartalmaz |
|---|---|
| `src/content.mjs` | Minden szöveg magyarul és angolul, plusz a kapcsolati adatok (`SITE`) |
| `src/svg.mjs` | Az összes SVG-rajz: alaprajz, buborékdiagram, metszet, 3D modell, virágzási naptár |
| `build.mjs` | Oldalsablonok (fejléc, lábléc, szekciók) |
| `assets/style.css`, `assets/main.js` | Stílus és animációk |
| `assets/img/` | Fotók: `kert-hero.jpg` (a kezdőlap címe mögött), `hanna.jpg` (Rólam, íves keretben) |

Módosítás után:

```bash
node build.mjs
```

## Oldalak

| HU | EN |
|---|---|
| index.html | en/index.html |
| koncepcioterv.html | en/concept-plan.html |
| novenykiultetesi-terv.html | en/planting-plan.html |
| kiviteli-kertterv.html | en/construction-plan.html |
| 3d-latvanyterv.html | en/3d-visualisation.html |
| rolam.html | en/about.html |
| ajanlatkeres.html | en/enquiry.html |
| kerttervezes-gyor.html | en/garden-design-gyor.html |
| kerttervezes-budapest.html | en/garden-design-budapest.html |
| kerttervezes-balaton.html | en/garden-design-lake-balaton.html |

## Élesítés előtt kitöltendő

- `src/content.mjs` → `SITE`: e-mail, Instagram, Facebook, végleges domain (a név és a telefonszám már a végleges)
- A hero-fotó (`assets/img/kert-hero.jpg`) csak 1103 px széles; nagy kijelzőn egy legalább 2400 px-es változat élesebb lenne
- Az átfutási idők a GYIK-ben (2–3 hét / 4–8 hét) minta-értékek
- Adatkezelési tájékoztató oldal (az űrlap hivatkozik rá)
- Az ajánlatkérő űrlap jelenleg előre kitöltött e-mailt nyit (mailto). Igazi beküldéshez
  pl. Formspree / Netlify Forms kell.

## Elrendezés- és hover-rendszer (style.css §4)

| Elem | Viselkedés |
|---|---|
| `.ic` ikon-chip | hoverre alulról feltöltődik, sarka lekerekített négyzetté válik, az ikon kicserélődik az ikertestvérére |
| `.btn` osztott gomb | felirat-chip + ikon-chip, hoverre mindkettő zsályazöld lesz |
| `.ulink` | a régi aláhúzás jobbra kifut, az új balról berajzolódik |
| `.px` sarokjelek | a keretezett elemek (kártyák, panelek) sarkain hoverre megjelenő „+” jelek |
| `.ico` vonalas ikonok | hoverre újrarajzolják magukat |
| `[data-cursor]` | homályos kurzor-címke követi az egeret |
| `.band` | ültetési sor alaprajzi nézetben, szekcióelválasztóként |

## Régiós landingek (helyi SEO) — `src/regions.mjs`

Minden régióoldal ugyanarra a kulcsszó-vázra épül:

| Elem | Győr | Budapest | Balaton |
|---|---|---|---|
| URL | `/kerttervezes-gyor` | `/kerttervezes-budapest` | `/kerttervezes-balaton` |
| Fő kulcsszó | kerttervezés Győr | kerttervezés Budapest | kerttervezés Balaton |
| Másodlagos | Győr-Moson-Sopron megye, kerttervező Győr, Mosonmagyaróvár, Sopron | agglomeráció, Budaörs, Szentendre, Gödöllő, lejtős / kis kert | balatoni kert, nyaraló kert, Balatonfüred, Siófok, Keszthely, kevés gondozás |
| Szöveg iránya | szél, talajvíz, helyi kivitelező | lejtős és kis telkek, új építésű házak | szezonális használat, köves/homokos talaj |

Felépítés: title → H1 (fő kulcsszó) → első bekezdés a településnevekkel → helynevet tartalmazó kérdés-H2-k →
4 szolgáltatás-H3 kulcsszavas belső linkkel → folyamat (4 H3) → településlista → helyi GYIK → helynevet tartalmazó ajánlatkérő H2 → a másik két régió linkje.

Strukturált adat oldalanként (`@graph`): `ProfessionalService` (areaServed), `Service` (régiós areaServed + OfferCatalog),
`BreadcrumbList`, `FAQPage`. Minden oldal kap `og:url`, `og:site_name`, hreflang HU/EN/x-default jelölést, és szerepel a sitemap.xml-ben.

Élesítés előtt: Google Search Console-ban beküldeni a `sitemap.xml`-t, Google Cégprofilt létrehozni ugyanazokkal a szolgáltatási
területekkel, és `og:image`-et (1200×630 JPG) készíteni oldalanként.

## AI-láthatóság

A build három fájlt is generál a gyökérbe:

- `llms.txt` – rövid, linkelt áttekintő nyelvi modelleknek (llmstxt.org formátum), HU + EN
- `llms-full.txt` – a teljes honlap szövege Markdownban, oldalanként
- `robots.txt` – minden keresőt és AI-robotot (GPTBot, ClaudeBot, PerplexityBot, Google-Extended stb.) kifejezetten enged, és megadja a sitemapot

Mindhárom a `src/` tartalmából készül, ezért szövegmódosítás után a `node build.mjs` frissíti őket.
