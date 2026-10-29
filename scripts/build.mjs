// Bouwt de landingspagina naar dist/. Geen dependencies nodig.
// Gebruik: node scripts/build.mjs   (LP_PREVIEW=0 / LP_TRACKING=1 overschrijven de vlaggen uit src/config.js)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cfg from '../src/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => path.join(root, 'src', ...p);
const dist = (...p) => path.join(root, 'dist', ...p);
const read = (f) => fs.readFileSync(f, 'utf8');

const preview = process.env.LP_PREVIEW !== undefined ? process.env.LP_PREVIEW !== '0' : cfg.preview;
const tracking = process.env.LP_TRACKING !== undefined ? process.env.LP_TRACKING === '1' : cfg.tracking.enabled;
const { site, offer, texts, products, seo } = cfg;

const NB = ' ';
const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const eur = (n) => `€${NB}${num(n)}`;
const eurTight = (n) => `€${num(n)}`;
const benefit = (p) => p.oldPrice - p.newPrice;
const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);

const endMs = Date.parse(offer.end);
const startMs = Date.parse(offer.start);
const now = Date.now();
const expired = now > endMs || (!offer.showBeforeStart && now < startMs);
const from = Math.min(...products.map((p) => p.newPrice));
const priceVars = { from: eurTight(from), ...Object.fromEntries(products.map((p) => [p.id, eur(p.newPrice)])) };

// ---------- onderdelen ----------
const ICON = {
  check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  shield: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  phone: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  tool: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/></svg>',
};

const priceHtml = (p) => `<p class="ocard-price">
        <span data-offer="live"><span class="sr">Oude prijs ${eur(p.oldPrice)}, nu ${eur(p.newPrice)}</span><s class="ocard-old" aria-hidden="true">${eur(p.oldPrice)}</s><b class="ocard-new" aria-hidden="true">${eur(p.newPrice)}</b></span>
        <span class="ocard-ask" data-offer="expired">${texts.expiredPrice}</span>
       </p>`;

function card(p, i) {
  const [w, h] = p.imageSize;
  return `   <article class="ocard" data-product="${p.id}">
     <div class="ocard-media"><img src="${p.image}" alt="${p.alt}" width="${w}" height="${h}" loading="eager" fetchpriority="high" decoding="async"></div>
     <div class="ocard-main">
      <span class="ocard-badge" data-offer="live">${eurTight(benefit(p))} voordeel</span>
      <h2 class="ocard-name">${p.name}</h2>
      ${priceHtml(p)}
      <p class="ocard-incl">${ICON.check}${texts.inclusive}</p>
      <p class="ocard-fit">${p.fit}</p>
     </div>
     <ul class="ocard-specs">${p.specs.map((s) => `<li>${s}</li>`).join('')}</ul>
     <a class="btn btn-amber ocard-btn" href="#formulier" data-battery="${p.id}"><span data-offer="live">${texts.buttonLive}</span><span data-offer="expired">${texts.buttonExpired}</span></a>
    </article>`;
}

const promiseBar = (cls = '') => `<div class="promise ${cls}" data-offer="live">
    <span class="promise-ic">${ICON.shield}</span>
    <div><p class="promise-main">${texts.promise}</p><p class="promise-small">${texts.promiseSmall}</p></div>
   </div>`;

function hero() {
  return `<section class="hero hero2 hero-nov" aria-labelledby="hero-h1">
 <div class="wrap">
  <div class="hero-top">
   <p class="hero-stamps"><span class="hero-label" data-offer="live">${offer.name} · ${offer.period}</span><span class="hero-sal">Saldering stopt 1 januari 2027</span></p>
   <h1 id="hero-h1"><span data-offer="live">${offer.name}: thuisbatterij volledig geïnstalleerd <span>vanaf ${eurTight(from)}</span></span><span data-offer="expired">Thuisbatterij <span>volledig geïnstalleerd</span>, van A tot Z</span></h1>
   <p class="sub">${texts.sub}</p>
  </div>
  <div class="offer-cards">
${products.map(card).join('\n')}
  </div>
  ${promiseBar()}
  <div class="hero-help">
   <p>${texts.unsure}</p>
   <a class="btn btn-call" href="tel:${site.phoneHref}">${ICON.phone}Bel ${site.phoneLabel}</a>
  </div>
  <div class="hero-badges">
   <b><span class="stars">★★★★★</span>&nbsp;4,8 op Google</b>
   <b>${ICON.shield}5 jaar garantie op de installatie</b>
   <b>${ICON.tool}Eigen vakmannen</b>
   <b>${ICON.pin}Omgeving Zuid-Holland</b>
  </div>
 </div>
</section>`;
}

function compare() {
  const [a, b] = products;
  const rows = [
    ['Opslag', 'opslag'],
    ['Vermogen', 'vermogen'],
    ['Batterijtype', 'type'],
    ['Extra', 'extra'],
    ['Geschikt voor', 'geschikt'],
  ];
  const priceCell = (p) => `<span data-offer="live"><span class="sr">Oude prijs ${eur(p.oldPrice)}, nu ${eur(p.newPrice)}</span><s aria-hidden="true">${eur(p.oldPrice)}</s> <b aria-hidden="true">${eur(p.newPrice)}</b></span><span data-offer="expired">${texts.expiredPrice}</span>`;
  return `<section class="vgl" id="vergelijk">
 <div class="wrap">
  <div class="head reveal">
   <span class="eyebrow">Vergelijk</span>
   <h2>Welke thuisbatterij past bij u?</h2>
   <p class="lead">Twee batterijen, beide inclusief volledige installatie. Wij adviseren vrijblijvend op basis van uw verbruik.</p>
  </div>
  <div class="vgl-wrap reveal">
   <table class="vgl-table">
    <thead><tr><th scope="col"><span class="sr">Kenmerk</span></th><th scope="col">${a.short}</th><th scope="col">${b.short}</th></tr></thead>
    <tbody>
${rows.map(([label, k]) => `     <tr><th scope="row">${label}</th><td data-label="${a.short}">${a.compare[k]}</td><td data-label="${b.short}">${b.compare[k]}</td></tr>`).join('\n')}
     <tr class="vgl-price"><th scope="row">Prijs inclusief installatie</th><td data-label="${a.short}">${priceCell(a)}</td><td data-label="${b.short}">${priceCell(b)}</td></tr>
     <tr class="vgl-cta"><th scope="row"><span class="sr">Aanvragen</span></th><td data-label="${a.short}"><a class="btn btn-amber" href="#formulier" data-battery="${a.id}"><span data-offer="live">${texts.buttonLive}</span><span data-offer="expired">${texts.buttonExpired}</span></a></td><td data-label="${b.short}"><a class="btn btn-amber" href="#formulier" data-battery="${b.id}"><span data-offer="live">${texts.buttonLive}</span><span data-offer="expired">${texts.buttonExpired}</span></a></td></tr>
    </tbody>
   </table>
  </div>
 </div>
</section>`;
}

const calcOffer = () => {
  const alpha = products.find((p) => p.id === 'alpha') || products[products.length - 1];
  return `<p class="calc-offer" id="co-offer" data-offer="live">Een concreet voorbeeld: de ${alpha.name} kost in ${offer.monthText} <b>${eur(alpha.newPrice)}</b>, inclusief volledige installatie.</p>`;
};

const finalCta = () => `<h2><span data-offer="live">Pak de ${offer.name.toLowerCase()} mee</span><span data-offer="expired">Vraag uw gratis advies aan</span></h2>
  <p><span data-offer="live">Vraag nu advies aan. De aanbieding loopt t/m ${offer.endText} en we bellen u binnen 1 werkdag terug.</span><span data-offer="expired">Vraag nu advies aan. We bellen u binnen 1 werkdag terug.</span></p>`;

// ---------- head / tracking ----------
const gtmHead = tracking
  ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.tracking.gtmId}');</script>`
  : '<!-- tracking uit (config.tracking.enabled = false): GTM wordt niet geladen -->';
const gtmBody = tracking
  ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${cfg.tracking.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
  : '';

const clientCfg = {
  preview,
  end: offer.end,
  endText: offer.endText,
  products: Object.fromEntries(
    products.map((p) => [p.id, { name: p.name, price: eur(p.newPrice) }]),
  ),
  note: `Ik wil graag de ${offer.name.toLowerCase()} aanvragen: {name}, inclusief volledige installatie, voor {price}.`,
};
const stateScript = `<script>window.__OFFER__=${JSON.stringify(clientCfg)};(function(){try{if(Date.now()>Date.parse(window.__OFFER__.end))document.documentElement.setAttribute('data-offer','expired')}catch(e){}})();</script>`;

const title = fill(expired ? seo.titleExpired : seo.titleLive, priceVars);
const description = fill(expired ? seo.descriptionExpired : seo.descriptionLive, priceVars);

// ---------- samenstellen ----------
let html = read(src('index.template.html'));
const leadcard = read(src('leadcard.html')).replace(
  '{{TEST_NOTE}}',
  preview ? '<p class="test-note"><b>Testversie:</b> dit formulier verstuurt niets.</p>' : '',
);
const css = read(src('lp.css')) + '\n' + read(src('hero.css'));
const lpjs = read(src('lp.js'));

const swap = (token, value) => {
  if (!html.includes(token)) throw new Error(`placeholder ontbreekt in template: ${token}`);
  html = html.split(token).join(value);
};
swap('<!--@HERO@-->', hero());
swap('<!--@COMPARE@-->', compare());
swap('<!--@PROMISE2@-->', promiseBar('promise-form'));
swap('<!--@LEADCARD@-->', leadcard);
swap('<!--@CALC_OFFER@-->', calcOffer());
swap('<!--@FINAL@-->', finalCta());
swap('/*@LPJS@*/', lpjs);
swap('/*@CSS@*/', css);
swap('{{TITLE}}', title);
swap('{{DESCRIPTION}}', description);
swap('{{ROBOTS_META}}', preview ? '<meta name="robots" content="noindex, nofollow">' : '');
swap('{{CANONICAL}}', preview ? '' : `<link rel="canonical" href="${site.url}/thuisbatterij-2027/">`);
swap('{{OFFER_STATE_SCRIPT}}', stateScript);
swap('{{GTM_HEAD}}', gtmHead);
swap('{{GTM_BODY}}', gtmBody);
swap('{{PREVIEW_PILL}}', preview ? '<div class="prev-pill" role="note">Preview voor de klant · niet live</div>' : '');
html = html.replace('<html lang="nl">', `<html lang="nl"${expired ? ' data-offer="expired"' : ''}>`);

// links naar andere pagina's van de echte site (deze repo bevat alleen de landingspagina)
const keepLocal = (u) => u.startsWith('/assets/') || u.startsWith('/bedankt/') || u.startsWith('//');
const absolutize = (s) =>
  s.replace(/href="(\/[^"#]*)"/g, (m, u) => (keepLocal(u) ? m : `href="${site.url}${u}"`));
html = absolutize(html);

// ---------- uitvoer ----------
fs.rmSync(dist(), { recursive: true, force: true });
fs.mkdirSync(dist('bedankt'), { recursive: true });
fs.cpSync(src('assets'), dist('assets'), { recursive: true });
fs.writeFileSync(dist('index.html'), html);

let thanks = read(src('bedankt.html'));
thanks = thanks
  .replace('{{ROBOTS_META}}', '<meta name="robots" content="noindex, nofollow">')
  .replace('{{GTM_HEAD}}', gtmHead)
  .replace('{{GTM_BODY}}', gtmBody)
  .replace('{{TEST_BLOCK}}', preview ? '<p class="test-note"><b>Testversie:</b> er is niets verstuurd.</p>' : '');
fs.writeFileSync(dist('bedankt', 'index.html'), thanks);

fs.writeFileSync(
  dist('robots.txt'),
  preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /bedankt/\n`,
);

console.log(
  `build klaar: dist/ (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB html) | preview=${preview} tracking=${tracking} | aanbieding ${expired ? 'VERLOPEN' : 'actief'}`,
);
