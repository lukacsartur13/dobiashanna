// node build.mjs  →  writes every HU page to the root and every EN page to /en.
// Edit src/*.mjs and assets/*, never the generated .html files.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { T, SITE, PAGES, SERVICE_KEYS } from './src/content.mjs';
import * as S from './src/svg.mjs';
import { REGION_KEYS } from './src/regions.mjs';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const DEFS = S.DEFS_BASE.replace('</defs></svg>', S.BAND_DEF + '</defs></svg>');

const link = (lang, key, from = lang) => {
  const file = PAGES[key][lang];
  if (from === lang) return file;
  return lang === 'en' ? `en/${file}` : `../${file}`;
};
const asset = lang => (lang === 'en' ? '../assets/' : 'assets/');
const url = (lang, key) => `${SITE.domain}/${lang === 'en' ? 'en/' : ''}${PAGES[key][lang] === 'index.html' ? '' : PAGES[key][lang]}`;
const pad = n => String(n).padStart(2, '0');
// The address is long: let it break before the @ instead of forcing its column wider.
const MAIL = SITE.email.replace('@', '<wbr>@');

// ------------------------------------------------------------ THE HOVER ICON SYSTEM
// Every interactive icon is a chip holding two copies of its glyph in a one-line mask:
// on hover the fill rises, the chip squares off, and the glyph is replaced by its twin.
const GLYPH = {
  arrow: '<svg viewBox="0 0 24 24"><path d="M4 12 H19 M13 6 L19 12 L13 18"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 20 V5 M6 11 L12 5 L18 11"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5 V19 M5 12 H19"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12"/><path d="M4 7 L12 13 L20 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6 4 H10 L11.5 8.5 L9 10 C10 12.5 11.5 14 14 15 L15.5 12.5 L20 14 V18 C20 19 19 20 18 20 C10 19.5 4.5 14 4 6 C4 5 5 4 6 4 Z"/></svg>',
};
// logo.png: black GARDEN for light grounds; logo-light.png: pale GARDEN for the dark footer.
const brand = (t, cls = '', file = 'logo.png') => `<a class="brand ${cls}" href="${link(t.lang, 'home')}"><img class="brand__logo" src="${asset(t.lang)}img/${file}" alt="${SITE.name}" width="724" height="300"><span class="brand__sub">${t.brandSub}</span></a>`;
const ic = (g = 'arrow', cls = '') => `<span class="ic ${cls}" aria-hidden="true"><span class="ic__in">${GLYPH[g]}${GLYPH[g]}</span></span>`;
const pm = '<span class="ic ic--pm" aria-hidden="true"><i></i><i></i></span>';
const btn = (href, label, { cls = '', g = 'arrow', attrs = '' } = {}) =>
  `<a class="btn ${cls}" href="${href}" ${attrs}><span class="btn__l">${label}</span>${ic(g)}</a>`;
const lbl = (n, text) => `<p class="lbl" data-reveal><i></i>${n !== null ? `(${pad(n)}) ` : ''}${text}</p>`;
const rich = s => s.replace(/\[\[(.+?)\]\]/g, `<mark class="scr">$1${S.SCRIBBLE}</mark>`);
// Words too long for a phone-width display line get a soft hyphen at a correct break point.
// (Browser hyphenation guesses Hungarian breaks wrong, so it is switched off in the CSS.)
const SHY = { agglomerációban: 'agglomeráció&shy;ban', agglomeration: 'agglomer&shy;ation', Növénykiültetési: 'Növény&shy;kiültetési', mennyiségkimutatás: 'mennyiség&shy;kimutatás' };
const SHY_RE = new RegExp(Object.keys(SHY).join('|'), 'g');
// The menu is set in lowercase; acronyms such as "3D" keep their capitals.
const nocase = s => s.replace(/\b(?=\w*[A-Z])[A-Z0-9]{2,}\b/g, '<span class="nocase">$&</span>');
const shy = html => html.replace(/>([^<]+)</g, (m, txt) => `>${txt.replace(SHY_RE, w => SHY[w])}<`); // text only, never attributes

function header(t, key) {
  const L = k => link(t.lang, k);
  const svcs = SERVICE_KEYS.map(k => `<li><a href="${L(k)}"${k === key ? ' aria-current="page"' : ''}><span class="mono">${t.services[k].n}</span><span>${t.services[k].title}</span>${ic()}</a></li>`).join('');
  const regs = REGION_KEYS.map(k => `<li><a href="${L(k)}"${k === key ? ' aria-current="page"' : ''}><span class="mono">${t[k].n}</span><span>${t[k].name}</span>${ic()}</a></li>`).join('');
  return `<a class="skip" href="#main">${t.nav.skip}</a>
<header class="hdr" data-hdr>
  ${brand(t)}
  <nav class="nav" aria-label="${t.nav.menu}">
    <ul class="nav__list">
      <li class="nav__drop"><a href="${L('home')}#szolgaltatasok"${SERVICE_KEYS.includes(key) ? ' aria-current="true"' : ''}><i></i>${t.nav.services}</a><ul class="nav__sub">${svcs}</ul></li>
      <li class="nav__drop"><a href="${L('home')}#regiok"${REGION_KEYS.includes(key) ? ' aria-current="true"' : ''}><i></i>${t.regionsUI.nav}</a><ul class="nav__sub">${regs}</ul></li>
      <li><a href="${L('home')}#folyamat"><i></i>${t.nav.process}</a></li>
      <li><a href="${L('about')}"${key === 'about' ? ' aria-current="page"' : ''}><i></i>${t.nav.about}</a></li>
      <li><a href="${L('home')}#gyik"><i></i>${t.nav.faq}</a></li>
    </ul>
  </nav>
  <div class="hdr__end">
    <div class="lang mono"><a href="${link('hu', key, t.lang)}" hreflang="hu" lang="hu"${t.lang === 'hu' ? ' aria-current="true"' : ''}>HU</a><a href="${link('en', key, t.lang)}" hreflang="en" lang="en"${t.lang === 'en' ? ' aria-current="true"' : ''}>EN</a></div>
    ${btn(L('contact'), t.nav.cta, { cls: 'btn--sm hdr__cta' })}
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" data-burger><span class="mono" data-open-label="${t.nav.menu}" data-close-label="${t.nav.close}">${t.nav.menu}</span><i></i></button>
  </div>
</header>
<div class="menu" id="menu" data-menu hidden>
  <ol class="menu__list">
    ${SERVICE_KEYS.map(k => `<li><a href="${L(k)}"><span class="mono">${t.services[k].n}</span><span>${nocase(t.services[k].title)}</span></a></li>`).join('')}
    ${REGION_KEYS.map(k => `<li class="menu__reg"><a href="${L(k)}"><span class="mono">${t.regionsUI.region} ${t[k].n}</span>${t[k].name}</a></li>`).join('')}
    <li><a href="${L('about')}"><span class="mono">05</span>${t.nav.about}</a></li>
    <li><a href="${L('contact')}"><span class="mono">06</span>${t.nav.cta}</a></li>
  </ol>
  <p class="menu__foot mono"><a href="tel:${SITE.phoneHref}">${SITE.phone}</a> · <a href="mailto:${SITE.email}">${MAIL}</a></p>
</div>`;
}

function cta(t, o = {}) {
  const co = t.home.cta;
  return `<section class="cta" aria-labelledby="cta-h">
  <div class="wrap">
    <div class="cta__frame" data-cursor="${t.ui.plan}">
      ${S.PLUS4}
      ${co.map((c, i) => `<span class="cta__co cta__co--${i} mono" aria-hidden="true">${c}</span>`).join('')}
      <div class="cta__clip" aria-hidden="true"><div class="cta__art"><svg viewBox="0 0 200 200"><path class="ln-thin" d="${S.scallop(100, 100, 84, 22, 1.08)}"/><path class="ln-hair" d="${S.scallop(100, 100, 60, 16, 1.1)}"/><line class="ln-hair" x1="88" y1="100" x2="112" y2="100"/><line class="ln-hair" x1="100" y1="88" x2="100" y2="112"/></svg></div></div>
      <div class="cta__in">
        ${lbl(null, t.cta.eyebrow)}
        <h2 class="display display--xl" id="cta-h" data-reveal>${o.h || t.cta.h}</h2>
        <div class="cta__row" data-reveal>
          <p class="lead">${o.p || t.cta.p}</p>
          <div class="cta__act">
            ${btn(link(t.lang, 'contact'), t.cta.btn, { cls: 'btn--lg' })}
            <a class="ulink mono" href="tel:${SITE.phoneHref}">${t.cta.call} ${SITE.phone}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function footer(t) {
  const L = k => link(t.lang, k);
  return `<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__col ftr__brand">
      ${brand(t, 'brand--lg', 'logo-light.png')}
      <p>${t.footer.tag}</p>
    </div>
    <div class="ftr__col"><p class="lbl"><i></i>${t.footer.pages}</p><ul>${SERVICE_KEYS.map(k => `<li><a class="ulink" href="${L(k)}">${t.services[k].title}</a></li>`).join('')}<li><a class="ulink" href="${L('about')}">${t.nav.about}</a></li><li><a class="ulink" href="${L('contact')}">${t.nav.cta}</a></li></ul></div>
    <div class="ftr__col"><p class="lbl"><i></i>${t.regionsUI.label}</p><ul>${REGION_KEYS.map(k => `<li><a class="ulink" href="${L(k)}">${t[k].name}</a></li>`).join('')}</ul></div>
    <div class="ftr__col"><p class="lbl"><i></i>${t.footer.contact}</p><ul><li><a class="ulink" href="tel:${SITE.phoneHref}">${SITE.phone}</a></li><li><a class="ulink" href="mailto:${SITE.email}">${MAIL}</a></li></ul></div>
    <div class="ftr__col"><p class="lbl"><i></i>${t.footer.follow}</p><ul><li><a class="ulink" href="${SITE.instagram}" rel="noopener">Instagram</a></li><li><a class="ulink" href="${SITE.facebook}" rel="noopener">Facebook</a></li></ul></div>
  </div>
  <div class="wrap ftr__base mono"><span>© 2026 ${SITE.name} ${t.brandSub}. ${t.footer.legal}</span><a class="ftr__top" href="#top">${t.footer.top}${ic('up')}</a></div>
  <p class="ftr__giant" aria-hidden="true">${t.brandSub}</p>
</footer>`;
}

// ------------------------------------------------------------ STRUCTURED DATA
const BIZ_ID = `${SITE.domain}/#business`;
const business = t => ({
  '@type': 'ProfessionalService', '@id': BIZ_ID, name: `${SITE.name} ${t.brandSub}`, url: `${SITE.domain}/`, logo: `${SITE.domain}/assets/img/logo.png`,
  founder: {
    '@type': 'Person', name: SITE.designer[t.lang], jobTitle: t.lang === 'en' ? 'Landscape and garden engineer' : 'Tájrendező és kertépítő mérnök',
    alumniOf: { '@type': 'CollegeOrUniversity', name: t.lang === 'en' ? 'Hungarian University of Agriculture and Life Sciences' : 'Magyar Agrár- és Élettudományi Egyetem' },
  },
  email: SITE.email, telephone: SITE.phone, knowsLanguage: ['hu', 'en'],
  description: t.home.desc,
  areaServed: REGION_KEYS.flatMap(k => t[k].schemaArea.map(([type, name]) => ({ '@type': type, name }))),
  sameAs: [SITE.instagram, SITE.facebook],
});
const crumbs = (t, items) => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, key], i) => ({ '@type': 'ListItem', position: i + 1, name: name.replace(/<[^>]+>/g, ''), item: url(t.lang, key) })) });
const faqLd = items => ({ '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const serviceLd = (t, key, name, area) => ({
  '@type': 'Service', name, serviceType: t.brandSub, url: url(t.lang, key), provider: { '@id': BIZ_ID },
  ...(area ? { areaServed: area } : {}),
  hasOfferCatalog: { '@type': 'OfferCatalog', name: t.nav.services, itemListElement: SERVICE_KEYS.map(k => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: t.services[k].title, url: url(t.lang, k) } })) },
});

function layout(t, key, body, { bodyClass = '', ctaO = {}, graph = [] } = {}) {
  const p = t[key];
  const a = asset(t.lang);
  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url(t.lang, key)}">
<link rel="alternate" hreflang="hu" href="${url('hu', key)}">
<link rel="alternate" hreflang="en" href="${url('en', key)}">
<link rel="alternate" hreflang="x-default" href="${url('hu', key)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:url" content="${url(t.lang, key)}">
<meta property="og:site_name" content="${SITE.name} ${t.brandSub}">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [business(t), ...graph] })}</script>
<meta name="theme-color" content="#D8CBB2">
<link rel="icon" href="${a}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="${a}style.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="${bodyClass}" id="top">
${DEFS}
${header(t, key)}
<div class="page">
<main id="main">
${shy(body)}
</main>
${cta(t, ctaO)}
</div>
${footer(t)}
<div class="cur" aria-hidden="true"><span></span></div>
<script src="${a}main.js" defer></script>
</body>
</html>
`;
}

// ------------------------------------------------------------------ HOME
function home(t) {
  const h = t.home, L = k => link(t.lang, k), lab = h.labels;
  const pins = h.pins.map((p, i) => `<button class="pin" type="button" style="--x:${(p.x / 800 * 100).toFixed(2)}%;--y:${(p.y / 600 * 100).toFixed(2)}%;--d:${1600 + i * 120}ms"><i></i><span class="pin__l"><b>${p.b}</b><span class="mono">${p.s}</span></span></button>`).join('');
  return layout(t, 'home', `
<section class="hero">
  <div class="wrap">
    <div class="hero__meta mono">
      <h1 class="lbl"><i></i>${h.seoH1}</h1>${h.meta.map(m => `<span>${m}</span>`).join('')}
    </div>
    <div class="hero__ph">
      <img src="${asset(t.lang)}img/kert-hero.jpg" alt="${h.photoAlt}" width="1280" height="640" fetchpriority="high">
      <p class="display hero__h">${h.h1}</p>
    </div>
    <div class="hero__grid">
      <div class="hero__side">
        <p class="lead">${h.lead}</p>
        <div class="hero__btns">
          ${btn(L('contact'), h.btn1, { cls: 'btn--lg' })}
          ${btn('#szolgaltatasok', h.btn2, { cls: 'btn--ghost btn--lg', g: 'plus' })}
        </div>
        <p class="hero__scroll mono"><span></span>${t.ui.scroll}</p>
      </div>
      <figure class="sheet" data-sheet>
        <div class="sheet__paper">
          <span class="ruler ruler--x" aria-hidden="true"></span><span class="ruler ruler--y" aria-hidden="true"></span>
          ${S.PLUS4}
          <div class="sheet__svg">${S.heroPlan(t.plan)}
            <div class="pins">${pins}</div>
            <div class="xhair" aria-hidden="true"><i class="xh-x"></i><i class="xh-y"></i><span class="xh-l mono"></span></div>
          </div>
        </div>
        <figcaption class="mono">${h.cursor}</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="bento-s" aria-label="${lab[1]}">
  <div class="wrap bento">
    <div class="bento__big" data-reveal>
      ${S.PLUS4}
      <p class="lbl"><i></i>${SITE.name} · ${t.brandSub}</p>
      <h2 class="display">${h.bento.big}</h2>
      <p class="bento__note">${h.bento.note}</p>
      <svg class="bento__sym" viewBox="0 0 120 120" aria-hidden="true"><path class="ln-thin" d="${S.scallop(60, 60, 48, 16, 1.1)}"/><path class="ln-hair" d="${S.scallop(60, 60, 30, 11, 1.12)}"/><line class="ln-hair" x1="52" y1="60" x2="68" y2="60"/><line class="ln-hair" x1="60" y1="52" x2="60" y2="68"/></svg>
    </div>
    ${h.facts.map(([n, l], i) => `<div class="bento__c bento__c--${i}" data-reveal style="--d:${i * 70}ms"><span class="mono">[${pad(i + 1)}]</span><strong class="odo" data-odo="${n}">${n}</strong><span class="bento__l">${l}</span></div>`).join('')}
  </div>
</section>

<div class="marquee" aria-hidden="true"><div class="marquee__track">${Array(2).fill(['Lavandula angustifolia', 'Hydrangea paniculata', 'Miscanthus sinensis', 'Salvia nemorosa', 'Acer palmatum', 'Echinacea purpurea', 'Hamamelis × intermedia', 'Taxus baccata', 'Allium ‘Purple Sensation’', 'Helleborus orientalis'].map(n => `<span>${n}</span>${S.LOGO}`).join('')).join('')}</div></div>
${S.band()}

<section class="why sec" aria-labelledby="why-h">
  <div class="wrap">
    ${lbl(1, lab[0])}
    <h2 class="display staff" id="why-h">${h.whyLines.map((l, i) => `<span class="staff__l" style="--ind:${[0, 2, 5][i]};--d:${i * 120}ms" data-reveal><span>${l}</span></span>`).join('')}</h2>
    <p class="lead why__p" data-reveal>${h.why.p}</p>
    <ol class="rows">${h.why.items.map(([icn, ti, tx], i) => `<li class="row hov" data-reveal style="--d:${i * 70}ms"><span class="mono row__n">[${pad(i + 1)}]</span><h3 class="row__t">${ti}</h3><p class="row__p">${tx}</p><span class="row__ic">${S.ICON[icn]}</span></li>`).join('')}</ol>
  </div>
</section>

<section class="process sec sec--tint" id="folyamat" data-steps aria-labelledby="proc-h">
  <div class="wrap process__grid">
    <div class="process__l">
      ${lbl(2, lab[3])}
      <h2 class="display display--lg" id="proc-h" data-reveal>${h.process.h}</h2>
      <div data-reveal>${btn(L('contact'), h.btn1)}</div>
    </div>
    <ol class="process__r">${h.process.steps.map(([ti, tx], i) => `<li class="gstep" data-gstep="${i + 1}" data-reveal><span class="gstep__n">${i + 1}</span><div><span class="mono">${pad(i + 1)} — ${h.stepTags[i]}</span><h3>${ti}</h3><p>${tx}</p></div></li>`).join('')}</ol>
  </div>
</section>

<section class="svc sec" id="szolgaltatasok" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="svc__top">
      ${lbl(3, lab[2])}
      <h2 class="display display--lg" id="svc-h" data-reveal>${h.servicesH}</h2>
      <p class="lead" data-reveal>${h.servicesP}</p>
    </div>
    ${accordion(t)}
  </div>
</section>

<section class="stage sec--dark" data-stage data-active="1" aria-labelledby="stage-h">
  <div class="wrap stage__head">
    ${lbl(4, lab[1])}
    <h2 class="display display--lg" id="stage-h" data-reveal>${h.stage.h}</h2>
    <p class="lead" data-reveal>${h.stage.p}</p>
  </div>
  <div class="wrap stage__body">
    <div class="stage__view"><div class="stage__sticky">${S.stagePlan(t.plan)}
      <div class="segs" aria-hidden="true">${[1, 2, 3, 4].map(n => `<button type="button" class="seg-b" data-dot="${n}" tabindex="-1"><i></i><span class="mono">${pad(n)}</span></button>`).join('')}</div></div></div>
    <ol class="stage__steps">${h.stage.steps.map(([k, tx], i) => `<li class="stage__step" data-step="${i + 1}">
      <span class="stage__n"><b>${i + 1}</b><span class="mono">${t.services[k].n} / 04 · ${t.ui.layers}</span></span>
      <h3 class="display display--md">${t.services[k].title}</h3>
      <p>${tx}</p>
      <a class="ulink mono" href="${L(k)}">${t.more} →</a>
      ${i < 3 ? `<span class="stage__hint mono">[ ${t.ui.scroll} ]</span>` : ''}</li>`).join('')}</ol>
  </div>
</section>

${regionsBlock(t, null, 5, 'regiok')}

<section class="about-t sec" aria-labelledby="about-h">
  <div class="wrap about-t__grid">
    <div class="about-t__l">
      ${lbl(6, lab[4])}
      <p class="body-l about-t__intro" data-reveal>${rich(h.about.p[0])}</p>
      <div class="about-t__art" data-reveal>${S.archPortrait(h.about.portrait, `${asset(t.lang)}img/hanna.jpg`)}</div>
    </div>
    <div class="about-t__r">
      <h2 class="display display--lg" id="about-h" data-reveal>${h.about.h}</h2>
      <p class="body-l" data-reveal>${h.about.p[1]}</p>
      <div data-reveal>${btn(L('about'), h.about.link, { cls: 'btn--ghost' })}</div>
      <dl class="tcard" data-reveal>${S.PLUS4}${t.card.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v === SITE.email ? MAIL : v}</dd></div>`).join('')}</dl>
    </div>
  </div>
</section>

${faq(t, 7, lab[5], h.faq.h, h.faq.items, 'gyik')}
`, { bodyClass: 'is-home', graph: [{ '@type': 'WebSite', '@id': `${SITE.domain}/#site`, url: `${SITE.domain}/`, name: SITE.name, inLanguage: t.lang, publisher: { '@id': BIZ_ID } }, faqLd(h.faq.items)] });
}

function accordion(t) {
  return `<ul class="acc" data-acc>${SERVICE_KEYS.map((k, i) => `<li class="acc__p acc__p--${k}${i === 0 ? ' is-open' : ''}" data-reveal style="--d:${i * 80}ms">
      <a class="acc__a" href="${link(t.lang, k)}" data-cursor="${t.ui.view}">
        <span class="acc__grid" aria-hidden="true"></span>${S.PLUS4}
        <span class="acc__n mono">${t.services[k].n} / 04</span>
        <span class="acc__v" aria-hidden="true">${t.services[k].title}</span>
        <span class="acc__ico">${S.ICON[k]}</span>
        <span class="acc__body"><span class="acc__t">${t.services[k].title}</span><span class="acc__d">${t.services[k].short}</span><span class="acc__go"><span class="mono">${t.more}</span>${ic()}</span></span>
      </a></li>`).join('')}</ul>`;
}

function faq(t, n, label, title, items, id = 'faq') {
  return `<section class="faq sec" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap faq__grid">
    <div class="faq__l">
      ${lbl(n, label)}
      <h2 class="display display--lg" id="${id}-h" data-reveal>${title}</h2>
      <p class="faq__note" data-reveal>${t.ui.faqNote}</p>
      <div data-reveal>${btn(link(t.lang, 'contact'), t.nav.cta, { g: 'mail' })}</div>
    </div>
    <div class="faq__list">${items.map(([q, a], i) => `<details data-reveal style="--d:${i * 50}ms"><summary><span class="faq__i mono">(${i + 1}).</span><span class="faq__q">${q}</span>${pm}</summary><div class="faq__a"><p>${a}</p></div></details>`).join('')}</div>
  </div>
</section>`;
}

// ------------------------------------------------------------------ SERVICE PAGES
function special(t, key) {
  const s = t[key].special;
  const head = `<div class="sp__head">${lbl(null, s.eyebrow)}<h2 class="display display--lg" data-reveal>${s.h}</h2><p class="lead" data-reveal>${s.p}</p></div>`;
  if (key === 'concept') return `<section class="sec sec--tint"><div class="wrap">${head}
    <ul class="swatches">${s.swatches.map(([n, k], i) => `<li class="hov" data-reveal style="--d:${i * 60}ms"><span class="sw sw--${k}"></span><span class="mono">${pad(i + 1)}</span><strong>${n}</strong></li>`).join('')}</ul></div></section>`;
  if (key === 'planting') return `<section class="sec sec--tint"><div class="wrap">${head}
    <div class="cal-wrap" data-reveal>${S.PLUS4}${S.bloomCalendar(s.cal)}</div>
    <ul class="legend mono">${s.legend.map(([k, l]) => `<li><i class="lg lg--${k}"></i>${l}</li>`).join('')}</ul></div></section>`;
  if (key === 'construction') return `<section class="sec sec--tint"><div class="wrap">${head}
    <table class="register" data-reveal><thead><tr>${s.cols.map(c => `<th class="mono">${c}</th>`).join('')}<th aria-hidden="true"></th></tr></thead>
    <tbody>${s.sheets.map(([a, b, c]) => `<tr class="hov"><td class="mono">${a}</td><td>${b}</td><td class="mono">${c}</td><td>${ic('plus')}</td></tr>`).join('')}</tbody></table></div></section>`;
  if (key === 'visual') return `<section class="sec sec--tint"><div class="wrap">${head}</div></section>`;
  return '';
}

function heroArt(t, key) {
  const v = t[key];
  if (key === 'concept') return S.bubbleDiagram(v.svg);
  if (key === 'planting') return S.plantSymbols(v.svg);
  if (key === 'construction') return S.sectionDrawing(v.svg);
  return `<div class="iso-wrap" data-iso data-mode="line" data-season="0">${S.isoGarden(v.svg)}
    <div class="iso-ctl">
      <div class="segc" role="group" aria-label="${v.modeL}"><span class="mono">${v.modeL}</span>${v.modes.map((m, i) => `<button type="button" data-mode="${i ? 'render' : 'line'}" aria-pressed="${i ? 'false' : 'true'}">${m}</button>`).join('')}</div>
      <div class="segc" role="group" aria-label="${v.seasonL}"><span class="mono">${v.seasonL}</span>${v.seasons.map((m, i) => `<button type="button" data-season="${i}" aria-pressed="${i ? 'false' : 'true'}">${m}</button>`).join('')}</div>
    </div></div>`;
}

function service(t, key) {
  const v = t[key], s = t.services[key], sub = t.sub;
  const idx = SERVICE_KEYS.indexOf(key), nk = SERVICE_KEYS[(idx + 1) % 4];
  const L = k => link(t.lang, k);
  return layout(t, key, `
<section class="shero shero--${key}">
  <div class="wrap">
    <div class="shero__meta mono">
      <a class="ulink" href="${L('home')}#szolgaltatasok">← ${sub.back}</a>
      <nav class="svcnav" aria-label="${t.nav.services}">${SERVICE_KEYS.map(k => `<a href="${L(k)}"${k === key ? ' aria-current="page"' : ''} title="${t.services[k].title}"><i></i>${t.services[k].n}</a>`).join('')}</nav>
    </div>
    <div class="shero__grid">
      <div class="shero__copy">
        <p class="shero__num" aria-hidden="true">${s.n}</p>
        <p class="lbl"><i></i>${sub.service} ${s.n} / 04</p>
        <h1 class="display shero__h"><span class="indent" aria-hidden="true"></span>${s.title}</h1>
        <p class="shero__tag"><em>${v.tag}</em></p>
        <p class="lead">${v.lead}</p>
        ${btn(L('contact'), t.cta.btn, { cls: 'btn--lg' })}
      </div>
      <div class="shero__art"><div class="frame">${S.PLUS4}${heroArt(t, key)}</div></div>
    </div>
  </div>
</section>
${S.band()}

<section class="sec deliv">
  <div class="wrap deliv__grid">
    <div class="deliv__l">
      ${lbl(1, sub.deliv)}
      <h2 class="display display--lg" data-reveal>${s.title}</h2>
      <div class="deliv__ico hov" data-reveal>${S.PLUS4}${S.ICON[key]}<span class="mono">${pad(v.deliv.length)} ${t.ui.items}</span></div>
    </div>
    <ol class="deliv__list">${v.deliv.map((d, i) => `<li class="hov" data-reveal style="--d:${i * 50}ms"><span class="mono">[${pad(i + 1)}]</span><span class="deliv__t">${d}</span><svg viewBox="0 0 20 20" class="tick" aria-hidden="true"><path d="M4 10.5 L8.5 15 L16 5"/></svg></li>`).join('')}</ol>
  </div>
</section>

<section class="sec sec--dark who">
  <div class="wrap">
    <div class="who__top">${lbl(2, sub.who)}<h2 class="display display--lg" data-reveal>${t.ui.whoH}</h2></div>
    <ul class="who__grid">${v.who.map((w, i) => `<li class="who__c hov" data-reveal style="--d:${i * 90}ms">${S.PLUS4}<span class="who__q" aria-hidden="true">“</span><p>${w}</p><span class="who__tag mono">${t.ui.you}</span></li>`).join('')}</ul>
  </div>
</section>

${special(t, key)}

<section class="sec steps-s">
  <div class="wrap">
    ${lbl(3, sub.how)}
    <div class="steps3-wrap">
      <svg class="steps3__path" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M60 60 C 300 60 300 220 600 220 S 900 60 1140 60"/></svg>
      <ol class="steps3">${v.steps.map(([a, b], i) => `<li data-reveal style="--d:${i * 120}ms"><span class="steps3__n">${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol>
    </div>
  </div>
</section>

${faq(t, 4, s.title, sub.faq, v.faq)}

<a class="nextsvc" href="${L(nk)}" data-cursor="${t.ui.view}">
  <span class="wrap nextsvc__in"><span class="lbl"><i></i>${sub.next} · ${t.services[nk].n} / 04</span><span class="display nextsvc__t">${t.services[nk].title}</span>${ic('arrow', 'ic--xl')}</span>
</a>
`, { bodyClass: `is-svc is-${key}`, graph: [serviceLd(t, key, s.title), crumbs(t, [[t.regionsUI.home, 'home'], [s.title, key]]), faqLd(v.faq)] });
}

// ------------------------------------------------------------------ REGIONS
function regionsBlock(t, except, n, id = '') {
  const R = t.regionsUI, keys = REGION_KEYS.filter(k => k !== except);
  return `<section class="regs sec${except ? ' sec--tint' : ''}"${id ? ` id="${id}"` : ''} aria-labelledby="regs-h${except ? '-x' : ''}">
  <div class="wrap">
    <div class="svc__top">
      ${lbl(n, R.label)}
      <h2 class="display display--lg" id="regs-h${except ? '-x' : ''}" data-reveal>${except ? R.other : R.h}</h2>
      ${except ? '' : `<p class="lead" data-reveal>${R.p}</p>`}
    </div>
    <ul class="regs__grid regs__grid--${keys.length}">${keys.map((k, i) => `<li data-reveal style="--d:${i * 90}ms"><a class="reg hov" href="${link(t.lang, k)}" data-cursor="${t.ui.view}">${S.PLUS4}
      <span class="reg__map">${S.regionMap(k, { north: t.plan.north, title: `${R.region.toUpperCase()} ${t[k].n}`, note: t[k].coord }, { mini: true })}</span>
      <span class="reg__body"><span class="mono">${R.region} ${t[k].n} / 03 · ${t[k].towns.length} ${R.towns}</span><h3>${t[k].name}</h3><span class="reg__p">${t[k].short}</span><span class="reg__go"><span class="mono">${R.more}</span>${ic()}</span></span>
    </a></li>`).join('')}</ul>
  </div>
</section>`;
}

function region(t, key) {
  const r = t[key], R = t.regionsUI, L = k => link(t.lang, k);
  const area = r.schemaArea.map(([type, name]) => ({ '@type': type, name })).concat(r.towns.filter(x => !/kerület|district/i.test(x)).map(name => ({ '@type': 'City', name })));
  const mapT = { aria: `${R.map}: ${r.name}`, north: t.plan.north, title: `${R.region.toUpperCase()} ${r.n} · ${r.name.toUpperCase()}`, note: `${R.map.toUpperCase()} · ${r.coord}` };
  return layout(t, key, `
<section class="shero shero--region">
  <div class="wrap">
    <div class="shero__meta mono">
      <nav class="crumbs" aria-label="Breadcrumb"><a class="ulink" href="${L('home')}">${R.home}</a><span>/</span><a class="ulink" href="${L('home')}#regiok">${R.label}</a><span>/</span><span aria-current="page">${r.name}</span></nav>
      <nav class="svcnav" aria-label="${R.label}">${REGION_KEYS.map(k => `<a href="${L(k)}"${k === key ? ' aria-current="page"' : ''} title="${t[k].name}"><i></i>${t[k].n}</a>`).join('')}</nav>
    </div>
    <div class="shero__grid">
      <div class="shero__copy">
        <p class="shero__num" aria-hidden="true">${r.n}</p>
        <p class="lbl"><i></i>${R.region} ${r.n} / 03 · ${r.coord}</p>
        <h1 class="display shero__h shero__h--region"><span class="indent" aria-hidden="true"></span>${r.h1}</h1>
        <p class="shero__tag"><em>${r.tag}</em></p>
        <p class="lead">${r.lead}</p>
        ${btn(L('contact'), t.cta.btn, { cls: 'btn--lg' })}
      </div>
      <div class="shero__art"><div class="frame">${S.PLUS4}${S.regionMap(key, mapT)}</div></div>
    </div>
  </div>
</section>
${S.band()}

<section class="sec local">
  <div class="wrap">
    ${lbl(1, r.name)}
    <h2 class="display display--lg local__h" data-reveal>${r.localH}</h2>
    <div class="local__p">${r.localP.map(p => `<p class="body-l" data-reveal>${p}</p>`).join('')}</div>
    <ol class="rows">${r.factors.map(([icn, ti, tx], i) => `<li class="row hov" data-reveal style="--d:${i * 70}ms"><span class="mono row__n">[${pad(i + 1)}]</span><h3 class="row__t">${ti}</h3><p class="row__p">${tx}</p><span class="row__ic">${S.ICON[icn]}</span></li>`).join('')}</ol>
  </div>
</section>

<section class="sec sec--dark who">
  <div class="wrap">
    <div class="who__top">${lbl(2, t.sub.who)}<h2 class="display display--lg" data-reveal>${r.whoH}</h2></div>
    <ul class="who__grid">${r.who.map((w, i) => `<li class="who__c hov" data-reveal style="--d:${i * 90}ms">${S.PLUS4}<span class="who__q" aria-hidden="true">“</span><p>${w}</p><span class="who__tag mono">${t.ui.you}</span></li>`).join('')}</ul>
  </div>
</section>

<section class="sec rsvc-s">
  <div class="wrap">
    <div class="svc__top">${lbl(3, t.nav.services)}<h2 class="display display--lg" data-reveal>${r.svcH}</h2><p class="lead" data-reveal>${r.svcP}</p></div>
    <ul class="rsvc">${SERVICE_KEYS.map((k, i) => `<li class="rsvc__c hov" data-reveal style="--d:${i * 70}ms">${S.PLUS4}<span class="mono">${t.services[k].n} / 04</span>${S.ICON[k]}<h3>${t.services[k].title}</h3><p>${r.svc[k][0]}</p><a class="rsvc__a" href="${L(k)}"><span class="ulink">${r.svc[k][1]}</span>${ic()}</a></li>`).join('')}</ul>
  </div>
</section>

<section class="sec sec--tint steps-s">
  <div class="wrap">
    ${lbl(4, t.nav.process)}
    <h2 class="display display--lg" data-reveal>${r.processH}</h2>
    <div class="steps3-wrap">
      <svg class="steps3__path" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M60 60 C 220 60 220 220 400 220 S 620 60 800 60 S 1000 220 1140 220"/></svg>
      <ol class="steps3 steps3--4">${r.process.map(([a, b], i) => `<li data-reveal style="--d:${i * 110}ms"><span class="steps3__n">${i + 1}</span><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol>
    </div>
  </div>
</section>

<section class="sec area">
  <div class="wrap area__grid">
    <div class="area__l">
      ${lbl(5, R.label)}
      <h2 class="display display--lg" data-reveal>${r.areaH}</h2>
      <p class="body-l" data-reveal>${r.areaP}</p>
    </div>
    <ul class="towns">${r.towns.map((n, i) => `<li data-reveal style="--d:${i * 30}ms"><span class="towns__i" aria-hidden="true"></span>${n}</li>`).join('')}</ul>
  </div>
</section>

<section class="sec sec--dark whyr">
  <div class="wrap whyr__grid">
    ${lbl(6, r.name)}
    <h2 class="display display--lg" data-reveal>${r.whyH}</h2>
    <div class="whyr__p">${r.why.map(p => `<p class="body-l" data-reveal>${p}</p>`).join('')}</div>
  </div>
</section>

${faq(t, 7, r.name, r.faqH, r.faq)}

${regionsBlock(t, key, 8)}
`, { bodyClass: `is-region is-${key}`, ctaO: { h: r.ctaH, p: r.ctaP }, graph: [serviceLd(t, key, r.h1, area), crumbs(t, [[R.home, 'home'], [r.name, key]]), faqLd(r.faq)] });
}

// ------------------------------------------------------------------ ABOUT / CONTACT
function about(t) {
  const a = t.about;
  return layout(t, 'about', `
<section class="shero ab-hero">
  <div class="wrap ab-hero__grid">
    <div class="ab-hero__art">${S.archPortrait(a.portrait, `${asset(t.lang)}img/hanna.jpg`)}</div>
    <div class="ab-hero__copy">
      <p class="lbl"><i></i>${a.eyebrow}</p>
      <h1 class="display shero__h"><span class="indent" aria-hidden="true"></span>${a.h1}</h1>
      <p class="shero__tag"><em>${a.lead}</em></p>
      ${a.p.map((p, i) => `<p class="body-l${i === 0 ? ' dropcap' : ''}">${p}</p>`).join('')}
      <dl class="tcard">${S.PLUS4}${t.card.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v === SITE.email ? MAIL : v}</dd></div>`).join('')}</dl>
    </div>
  </div>
</section>
${S.band()}
<section class="sec sec--dark">
  <div class="wrap">
    <div class="who__top">${lbl(1, a.eyebrow)}<h2 class="display display--lg" data-reveal>${a.values.h}</h2></div>
    <ol class="values">${a.values.items.map(([h, p], i) => `<li class="hov" data-reveal style="--d:${i * 90}ms">${S.PLUS4}<span class="values__n">${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="svc sec">
  <div class="wrap">
    <div class="svc__top">${lbl(2, t.nav.services)}<h2 class="display display--lg" data-reveal>${t.home.servicesH}</h2></div>
    ${accordion(t)}
  </div>
</section>`, { bodyClass: 'is-about' });
}

function contact(t) {
  const c = t.contact, f = c.f;
  const field = (n, l, type = 'text', req = false, extra = '', hint = '') => `<label class="fld"><span class="mono">${l}${req ? ' *' : ''}</span><input name="${n}" type="${type}"${req ? ' required' : ''} ${extra}>${hint ? `<small class="fld__hint">${hint}</small>` : ''}</label>`;
  return layout(t, 'contact', `
<section class="shero">
  <div class="wrap contact__grid">
    <div class="contact__l">
      <p class="lbl"><i></i>${c.eyebrow}</p>
      <h1 class="display shero__h"><span class="indent" aria-hidden="true"></span>${c.h1}</h1>
      <p class="lead">${c.lead}</p>
      <div class="next">
        <h2 class="display display--md">${c.next.h}</h2>
        <ol>${c.next.items.map(([h, p], i) => `<li><span class="gstep__n">${i + 1}</span><div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}</ol>
      </div>
      <div class="direct">
        <p class="lbl"><i></i>${c.direct}</p>
        <a class="direct__a hov" href="tel:${SITE.phoneHref}">${ic('phone')}<span>${SITE.phone}</span></a>
        <a class="direct__a hov" href="mailto:${SITE.email}">${ic('mail')}<span>${MAIL}</span></a>
      </div>
    </div>
    <form class="form" data-form data-to="${SITE.email}" data-ok="${f.ok}" novalidate>
      ${S.PLUS4}
      <div class="form__row">${field('name', f.name, 'text', true, 'autocomplete="name"')}${field('email', f.email, 'email', true, 'autocomplete="email"')}</div>
      <div class="form__row">${field('phone', f.phone, 'tel', false, 'autocomplete="tel"')}${field('city', f.city, 'text', false, '', f.cityHint)}</div>
      ${field('size', f.size, 'number', false, 'min="0" inputmode="numeric"')}
      <fieldset class="chips"><legend class="mono">${f.services}</legend>
        ${SERVICE_KEYS.map(k => `<label><input type="checkbox" name="services" value="${t.services[k].title}"><span>${t.services[k].title}</span></label>`).join('')}
        <label><input type="checkbox" name="services" value="${f.unsure}"><span>${f.unsure}</span></label>
      </fieldset>
      <label class="fld"><span class="mono">${f.msg}</span><textarea name="msg" rows="5" placeholder="${f.msgPh}"></textarea></label>
      <label class="check"><input type="checkbox" name="gdpr" required><span>${f.gdpr}</span></label>
      <button class="btn btn--lg" type="submit"><span class="btn__l">${f.send}</span>${ic('arrow')}</button>
      <p class="form__note mono" data-note>${f.note}</p>
      <div class="form__prog" aria-hidden="true"><i data-prog></i><span class="mono" data-prog-n>0%</span></div>
    </form>
  </div>
</section>`, { bodyClass: 'is-contact' });
}

// ------------------------------------------------------------------ WRITE
mkdirSync(ROOT + 'en', { recursive: true });
for (const lang of ['hu', 'en']) {
  const t = T[lang];
  const dir = ROOT + (lang === 'en' ? 'en/' : '');
  const out = { home: home(t), about: about(t), contact: contact(t) };
  for (const k of SERVICE_KEYS) out[k] = service(t, k);
  for (const k of REGION_KEYS) out[k] = region(t, k);
  for (const [k, html] of Object.entries(out)) writeFileSync(dir + PAGES[k][lang], html);
}
// ------------------------------------------------------------------ AI-READABLE FILES
// llms.txt: a linked index (llmstxt.org). llms-full.txt: the whole site as plain Markdown.
const plain = x => String(x).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\[\[(.+?)\]\]/g, '$1').replace(/&nbsp;/g, ' ').replace(/&shy;/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const li = (lang, key, name, desc) => `- [${plain(name)}](${url(lang, key)}): ${plain(desc)}`;
const areaLine = t => REGION_KEYS.map(k => t[k].name).join(', ');

function llms() {
  const H = T.hu, E = T.en;
  const pages = (t, lang) => ({
    svc: SERVICE_KEYS.map(k => li(lang, k, t.services[k].title, t[k].desc)),
    reg: REGION_KEYS.map(k => li(lang, k, t[k].h1, t[k].desc)),
    other: [li(lang, 'home', t.home.title.split(' | ')[0], t.home.desc), li(lang, 'about', t.about.title.split(' | ')[0], t.about.desc), li(lang, 'contact', t.contact.title.split(' | ')[0], t.contact.desc)],
  });
  const h = pages(H, 'hu'), e = pages(E, 'en');
  return `# ${SITE.name} ${H.brandSub}

> ${plain(H.home.desc)}
> ${plain(E.home.desc)}
> ${SITE.phone} — ${SITE.email} — ${SITE.domain}

A HoneyGarden kerttervezés Dóbiás Hanna kerttervező műhelye: egyedi kertterveket készít családi házakhoz, nyaralókhoz és kisebb közösségi terekhez. Négy tervtípus kérhető külön vagy együtt: koncepcióterv, növénykiültetési terv, kiviteli kertterv és 3D látványterv. Helyszíni bejárással dolgozik a következő régiókban: ${areaLine(H)}; online konzultációval az ország bármely részén. A tervezési díj egyedi, a helyszíni bejárás után írásos, tételes ajánlatban rögzül – fix árlista nincs. Ajánlatkérés az ajánlatkérő oldalon, e-mailben vagy telefonon.

HoneyGarden garden design is the studio of garden designer Hanna Dóbiás, creating bespoke garden plans for family homes, holiday houses and small community spaces. Four plan types can be ordered separately or together: concept plan, planting plan, construction drawings and 3D visualisation. Site visits in: ${areaLine(E)}; anywhere in Hungary via online consultation. Fees are quoted individually in writing after the site visit – there is no fixed price list.

A honlap két nyelvű: magyarul a gyökérben, angolul az /en/ alatt. The site is bilingual: Hungarian at the root, English under /en/.

## Szolgáltatások

${h.svc.join('\n')}

## Kerttervezés régiónként

${h.reg.join('\n')}

## Oldalak

${h.other.join('\n')}

## English: services

${e.svc.join('\n')}

## English: garden design by region

${e.reg.join('\n')}

## English: pages

${e.other.join('\n')}

## Optional

- [llms-full.txt](${SITE.domain}/llms-full.txt): A honlap teljes szövege Markdownban (HU + EN) / Full site text in Markdown
- [sitemap.xml](${SITE.domain}/sitemap.xml): Minden oldal URL-je / Every page URL
`;
}

function llmsFull() {
  const out = [`# ${SITE.name} ${T.hu.brandSub} — teljes szöveg / full text`, '', `> ${plain(T.hu.home.desc)}`, `> ${SITE.phone} — ${SITE.email} — ${SITE.domain}`, ''];
  const q = items => items.map(([a, b]) => `**${plain(a)}**\n${plain(b)}`).join('\n\n');
  const list = items => items.map(x => `- ${plain(x)}`).join('\n');
  for (const lang of ['hu', 'en']) {
    const t = T[lang], h = t.home;
    out.push(`---`, '', `# ${lang === 'hu' ? 'Magyar' : 'English'}`, '');
    out.push(`## ${plain(h.seoH1)}`, `URL: ${url(lang, 'home')}`, '', plain(h.lead), '',
      `### ${plain(h.why.h)}`, plain(h.why.p), '', h.why.items.map(([, a, b]) => `- **${plain(a)}** – ${plain(b)}`).join('\n'), '',
      `### ${plain(h.servicesH)}`, plain(h.servicesP), '', SERVICE_KEYS.map(k => `- **${t.services[k].title}** – ${plain(t.services[k].short)} (${url(lang, k)})`).join('\n'), '',
      `### ${plain(t.regionsUI.h)}`, plain(t.regionsUI.p), '', REGION_KEYS.map(k => `- **${t[k].name}** – ${plain(t[k].short)} (${url(lang, k)})`).join('\n'), '',
      `### ${plain(h.process.h)}`, h.process.steps.map(([a, b], i) => `${i + 1}. **${plain(a)}** – ${plain(b)}`).join('\n'), '',
      `### ${plain(h.faq.h)}`, q(h.faq.items), '');
    for (const k of SERVICE_KEYS) {
      const v = t[k], s = t.services[k];
      out.push(`## ${s.title}`, `URL: ${url(lang, k)}`, '', `*${plain(v.tag)}* ${plain(v.lead)}`, '',
        `### ${t.sub.deliv}`, list(v.deliv), '', `### ${t.sub.who}`, list(v.who), '',
        `### ${t.sub.how}`, v.steps.map(([a, b], i) => `${i + 1}. **${plain(a)}** – ${plain(b)}`).join('\n'), '',
        `### ${plain(v.special.h)}`, plain(v.special.p), '', `### ${t.sub.faq}`, q(v.faq), '');
    }
    for (const k of REGION_KEYS) {
      const r = t[k];
      out.push(`## ${r.h1}`, `URL: ${url(lang, k)}`, '', `*${plain(r.tag)}* ${plain(r.lead)}`, '',
        `### ${plain(r.localH)}`, r.localP.map(plain).join('\n\n'), '', r.factors.map(([, a, b]) => `- **${plain(a)}** – ${plain(b)}`).join('\n'), '',
        `### ${plain(r.whoH)}`, list(r.who), '',
        `### ${plain(r.svcH)}`, plain(r.svcP), '', SERVICE_KEYS.map(s => `- **${t.services[s].title}** – ${plain(r.svc[s][0])} (${url(lang, s)})`).join('\n'), '',
        `### ${plain(r.processH)}`, r.process.map(([a, b], i) => `${i + 1}. **${plain(a)}** – ${plain(b)}`).join('\n'), '',
        `### ${plain(r.areaH)}`, `${plain(r.areaP)} ${r.towns.join(', ')}.`, '',
        `### ${plain(r.whyH)}`, r.why.map(plain).join('\n\n'), '', `### ${plain(r.faqH)}`, q(r.faq), '');
    }
    const a = t.about;
    out.push(`## ${plain(a.h1)}`, `URL: ${url(lang, 'about')}`, '', `*${plain(a.lead)}*`, '', a.p.map(plain).join('\n\n'), '',
      `### ${plain(a.values.h)}`, a.values.items.map(([x, y]) => `- **${plain(x)}** – ${plain(y)}`).join('\n'), '');
    const c = t.contact;
    out.push(`## ${plain(c.h1)}`, `URL: ${url(lang, 'contact')}`, '', plain(c.lead), '',
      `### ${plain(c.next.h)}`, c.next.items.map(([x, y], i) => `${i + 1}. **${plain(x)}** – ${plain(y)}`).join('\n'), '',
      `${c.direct}: ${SITE.phone} · ${SITE.email}`, '');
  }
  return out.join('\n');
}

writeFileSync(ROOT + 'llms.txt', llms());
writeFileSync(ROOT + 'llms-full.txt', llmsFull());
writeFileSync(ROOT + 'robots.txt', `# Search engines and AI assistants are welcome to read this site.
User-agent: *
Allow: /

# AI crawlers, named explicitly
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

# Site summary for language models: ${SITE.domain}/llms.txt
Sitemap: ${SITE.domain}/sitemap.xml
`);

const urls = ['hu', 'en'].flatMap(l => Object.keys(PAGES).map(k => `<url><loc>${url(l, k)}</loc></url>`));
writeFileSync(ROOT + 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log('built', Object.keys(PAGES).length * 2, 'pages');
