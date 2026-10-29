# ZonnepanelenNu: landingspagina novemberaanbieding (preview)

Zelfstandige preview van de landingspagina `/thuisbatterij-2027/` met twee thuisbatterijen in de hero.
Dit project staat los van de live site en van de originele repo. Er is geen framework en er zijn geen dependencies nodig, alleen Node 18 of nieuwer.

## Lokaal draaien

```bash
npm run dev
```

Open daarna http://localhost:5180/ (de server bouwt automatisch opnieuw als je iets in `src/` wijzigt).

```bash
npm run build
```

Bouwt naar `dist/` (dit is wat Vercel publiceert).

## Vercel

| Instelling | Waarde |
|---|---|
| Framework Preset | Other |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | leeg laten (geen dependencies) |

`vercel.json` bevat deze waarden al, dus importeren zonder iets aan te passen werkt ook.

## Alles wat per actie verandert: `src/config.js`

Startdatum, einddatum, productnamen, specs, oude en nieuwe prijzen, voordeelbedragen, teksten en de meta title en description staan op één plek.
Voordeelbedrag = oude prijs min nieuwe prijs (wordt zelf uitgerekend).

Na de einddatum (30 november 2026, 23:59) schakelt de pagina vanzelf over op een nette fallback: geen stempel, geen doorgestreepte prijzen en geen voordeellabels, kop "Thuisbatterij volledig geïnstalleerd, van A tot Z", knoppen "Vraag advies aan". De meta title en description wisselen bij de eerstvolgende build (in de browser wisselt alles direct).

## Preview- en trackingvlaggen

| Vlag | Waar | Standaard | Effect |
|---|---|---|---|
| `preview` | `src/config.js` of `LP_PREVIEW=0` | `true` | `noindex, nofollow` (meta, `X-Robots-Tag` via `vercel.json`, `robots.txt`), geen canonical, label "Preview voor de klant", testmelding bij het formulier |
| `tracking.enabled` | `src/config.js` of `LP_TRACKING=1` | `false` | GTM (`GTM-W6DFZ44X`) wordt wel/niet geladen. De snippet zit in de code en gaat bij `true` 1-op-1 aan. |

Het formulier verstuurt in deze preview niets. Het is een statisch formulier dat doorverwijst naar `/bedankt/?test=1`, met een duidelijke testmelding in het formulier en op de bedankpagina.

## Bij het overzetten naar de live site (WordPress/Elementor)

1. Hero, vergelijkingsblok, prijsbelofte boven het formulier, eindblok en calculatortekst overnemen (`npm run build` en dan `dist/index.html`, of via de generator in `zonnepanelennu-demo`). Het CSS-blok `src/hero.css` hoort erbij.
2. Zet `preview` op `false` en bouw met `LP_PREVIEW=0`. Dan verdwijnen noindex, label en testmelding, en komt de canonical terug.
3. Tracking: op de live site zit GTM al in WordPress. Zet in deze repo alleen `tracking.enabled` op `true` als je deze build zelf als live pagina host. Het cookiebanner en Consent Mode zijn niet aangeraakt.
4. Het live formulier is het Elementor-formulier (template 4877, met Submissions en mail). Het veld "Opmerking" wordt door `src/lp.js` voorgevuld met de gekozen batterij. Wil je de keuze ook als apart veld, voeg dan in Elementor een verborgen veld `batterij` toe.
5. Niet gewijzigd en dus gelijk aan live: formulier-id's (`#lform`, `#formulier`, veld-id's), `tel:`-links, WhatsApp- en `mailto:`-links, `/bedankt/` als doorstuurpagina.

## Gewijzigd ten opzichte van de bestaande landingspagina

- Nieuwe hero met twee gelijkwaardige productkaarten, prijsbelofte en belknop.
- Formulier terug onderaan de pagina (het stond tijdelijk in de hero), met de prijsbelofte erboven.
- Oude oktober-sectie vervangen door een vergelijking (Anker tegen Alpha). Oude actiebalk onderaan verwijderd.
- Calculatorvoorbeeld en eindblok verwijzen naar de novemberaanbieding in plaats van de oktoberactie.
- Menu- en footerlinks wijzen naar de echte site (`https://zonnepanelennu.nl/...`), want deze repo bevat alleen de landingspagina.

## Productfoto's (bron: fabrikant)

- Anker SOLIX Solarbank Max AC: https://cdn.shopify.com/s/files/1/0726/0736/7225/files/A17E2_1000x.png (productpagina https://www.ankersolix.com/nl/products/a17e2)
- AlphaESS: https://eu.alphaess.com/cdn/shop/files/123_2x_856f42bf-0440-4809-b49c-c2f4e9c9718f.webp (productpagina https://eu.alphaess.com/pages/smile-g3)

Beide zijn bijgesneden en als 640 x 480 WebP opgeslagen in `src/assets/img/`.
