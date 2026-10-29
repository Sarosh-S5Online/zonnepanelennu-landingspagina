// Alles wat per actie verandert staat hier. Pas dit bestand aan voor een volgende aanbieding en draai `npm run build`.
// Datums zijn in Nederlandse tijd (+01:00 in de winter, +02:00 in de zomer).

export default {
  // PREVIEW-VLAG: true = noindex, geen canonical, testmelding bij het formulier, preview-label.
  // Zet op false (of bouw met LP_PREVIEW=0) voor de definitieve versie.
  preview: true,

  // TRACKING-VLAG: false = GTM wordt niet geladen, zodat testbezoeken de echte data en Ads-conversies niet vervuilen.
  // Zet op true (of bouw met LP_TRACKING=1) om de GTM-container weer aan te zetten.
  tracking: { enabled: false, gtmId: 'GTM-W6DFZ44X' },

  site: {
    url: 'https://zonnepanelennu.nl',
    brand: 'ZonnepanelenNu',
    phoneHref: '+31182607948',
    phoneLabel: '0182 – 60 79 48',
  },

  offer: {
    name: 'Novemberaanbieding',
    start: '2026-11-01T00:00:00+01:00',
    end: '2026-11-30T23:59:59+01:00',
    period: 'Geldig van 1 t/m 30 november 2026',
    endText: '30 november',
    monthText: 'november',
    // true: de aanbieding is ook zichtbaar vóór de startdatum (nodig voor de preview voor de klant)
    showBeforeStart: true,
  },

  texts: {
    sub: 'Kies de batterij die bij uw verbruik past. Wij regelen alles: advies, levering, installatie en aansluiting. U hoeft zelf niets te doen.',
    inclusive: 'Inclusief volledige installatie van A tot Z',
    promise: 'Goedkoper krijgt u het niet: volledig geïnstalleerd van A tot Z, zonder verborgen kosten.',
    promiseSmall: 'Levering, montage, aansluiting en ingebruikname inbegrepen.',
    unsure: 'Twijfelt u welke past? Wij adviseren vrijblijvend op basis van uw verbruik.',
    buttonLive: 'Vraag deze aanbieding aan',
    buttonExpired: 'Vraag advies aan',
    expiredPrice: 'Vraag uw vaste prijs aan',
  },

  // Volgorde = volgorde op de pagina (op mobiel staat het eerste product bovenaan).
  products: [
    {
      id: 'anker',
      name: 'Anker SOLIX Solarbank Max AC',
      short: 'Anker SOLIX Solarbank Max AC',
      alt: 'Anker SOLIX Solarbank Max AC thuisbatterij 7 kWh',
      image: '/assets/img/anker-solix-solarbank-max-ac.webp',
      imageSize: [640, 480],
      oldPrice: 3500,
      newPrice: 2850,
      specs: ['7 kWh opslag', '3,5 kW vermogen', 'Uitbreidbaar tot 42 kWh'],
      fit: 'Compact, voor huishoudens met bestaande zonnepanelen.',
      compare: {
        opslag: '7 kWh',
        vermogen: '3,5 kW',
        type: 'LFP',
        extra: 'Noodstroomfunctie, uitbreidbaar tot 42 kWh',
        geschikt: 'Compact, voor huishoudens met bestaande zonnepanelen',
      },
    },
    {
      id: 'alpha',
      name: 'AlphaESS thuisbatterij 18,6 kWh',
      short: 'AlphaESS thuisbatterij 18,6 kWh',
      alt: 'AlphaESS thuisbatterij 18,6 kWh',
      image: '/assets/img/alphaess-thuisbatterij-18-6-kwh.webp',
      imageSize: [640, 480],
      oldPrice: 8000,
      newPrice: 7500,
      specs: ['18,6 kWh opslag', 'LFP-batterij', '5 jaar garantie op de installatie'],
      fit: 'Grote opslag, voor gezinnen met hoger verbruik of een warmtepomp of laadpaal.',
      compare: {
        opslag: '18,6 kWh',
        vermogen: 'Afhankelijk van de installatie',
        type: 'LFP',
        extra: '5 jaar garantie op de installatie',
        geschikt: 'Grote opslag, voor gezinnen met hoger verbruik of een warmtepomp of laadpaal',
      },
    },
  ],

  seo: {
    titleLive: 'Thuisbatterij incl. installatie vanaf {from} | Novemberaanbieding | ZonnepanelenNu',
    descriptionLive:
      'Novemberaanbieding: thuisbatterij inclusief volledige installatie. Anker SOLIX 7 kWh voor {anker} of AlphaESS 18,6 kWh voor {alpha}. Vraag gratis advies aan.',
    titleExpired: 'Thuisbatterij incl. volledige installatie | ZonnepanelenNu',
    descriptionExpired:
      'Sla uw zonnestroom op met een thuisbatterij, volledig geïnstalleerd van A tot Z. Eerlijk advies aan huis door ons eigen team. Vraag gratis advies aan.',
  },
};
