(function () {
  var nav = document.querySelector('nav');
  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  function toggleDd(dd) {
    var open = dd.classList.toggle('open');
    dd.querySelector('.ddt').setAttribute('aria-expanded', open);
  }
  document.querySelectorAll('nav .ddt').forEach(function (t) {
    t.addEventListener('click', function () { toggleDd(t.parentNode); });
  });
  document.querySelectorAll('nav a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      // mobiel menu: tik op een hoofdkopje met submenu klapt het open i.p.v. direct naar de pagina te gaan
      if (a.parentNode.classList.contains('dd') && burger && burger.offsetParent !== null) { e.preventDefault(); toggleDd(a.parentNode); return; }
      nav.classList.remove('open');
    });
  });

  // Formulier-koppeling: vul hier de Web3Forms access key van de klant in (of een andere endpoint).
  var CFG = window.ZNN_FORM || { accessKey: '', endpoint: 'https://api.web3forms.com/submit' };
  window.dataLayer = window.dataLayer || [];

  function valid(fields) {
    var ok = true;
    fields.forEach(function (f) {
      var bad = (f.type === 'checkbox') ? !f.checked
        : !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('err', bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    return ok;
  }

  // Hero: postcode meenemen naar het offerteformulier
  document.querySelectorAll('[data-pc]').forEach(function (box) {
    var input = box.querySelector('input');
    function go() {
      if (!input.value.trim()) { input.classList.add('err'); input.focus(); return; }
      input.classList.remove('err');
      var target = document.getElementById('f-postcode') || document.getElementById('form-field-postcode');
      if (target) target.value = input.value;
      var offer = document.getElementById('formulier') || document.getElementById('offerte');
      if (offer) offer.scrollIntoView({ behavior: 'smooth' });
      var first = document.getElementById('f-naam') || document.getElementById('form-field-naam');
      if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 700);
    }
    box.querySelector('button').addEventListener('click', go);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  });

  // Offerteformulier
  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valid([].slice.call(form.querySelectorAll('[required]')))) return;
      var btn = form.querySelector('button[type=submit]');
      var label = btn.textContent; btn.disabled = true; btn.textContent = 'Versturen…';
      function ok() {
        window.dataLayer.push({ event: 'lead_submit', form: 'offerte' });
        form.querySelector('.fields').style.display = 'none';
        form.querySelector('.done').style.display = 'block';
        setTimeout(function () { location.href = '/bedankt/'; }, 900);
      }
      function fail() {
        btn.disabled = false; btn.textContent = label;
        alert('Versturen is niet gelukt. Bel ons gerust op 0182 – 60 79 48.');
      }
      if (!CFG.accessKey) return ok();             // demo-modus: geen backend gekoppeld
      var v = function (id) { return (document.getElementById(id) || {}).value || ''; };
      var data = new FormData();
      data.append('access_key', CFG.accessKey);
      data.append('subject', 'Nieuwe dakscan-aanvraag via zonnepanelennu.nl');
      data.append('from_name', 'ZonnepanelenNu website');
      data.append('naam', v('f-naam')); data.append('telefoon', v('f-tel')); data.append('email', v('f-mail'));
      data.append('postcode_huisnummer', v('f-postcode')); data.append('type_dak', v('f-dak')); data.append('opmerking', v('f-opm'));
      data.append('pagina', location.pathname);
      fetch(CFG.endpoint, { method: 'POST', body: data }).then(function (r) { return r.json(); })
        .then(function (j) { j.success ? ok() : fail(); }).catch(fail);
    });
  });

  // Blog: zoeken + categorie
  var posts = [].slice.call(document.querySelectorAll('#posts .post'));
  if (posts.length) {
    var q = document.querySelector('[data-filter]'), cat = 'Alle', none = document.getElementById('nores');
    function apply() {
      var t = q.value.trim().toLowerCase(), n = 0;
      posts.forEach(function (p) {
        var show = (cat === 'Alle' || p.dataset.cat === cat) && (!t || p.dataset.t.indexOf(t) > -1);
        p.hidden = !show; if (show) { n++; p.classList.add('in'); }
      });
      none.style.display = n ? 'none' : 'block';
    }
    q.addEventListener('input', apply);
    document.querySelectorAll('[data-chip]').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('[data-chip]').forEach(function (x) { x.classList.remove('on'); });
        c.classList.add('on'); cat = c.dataset.chip; apply();
      });
    });
  }

  // Cookiebanner (koppel later aan Google Consent Mode / GTM)
  var box = document.getElementById('cookie');
  function stored() { try { return localStorage.getItem('znn-consent'); } catch (e) { return null; } }
  function choose(v) {
    try { localStorage.setItem('znn-consent', v); } catch (e) {}
    box.hidden = true;
    window.dataLayer.push({ event: 'consent_update', consent: v === 'yes' ? 'granted' : 'denied' });
  }
  if (box) {
    if (!stored()) box.hidden = false;
    box.querySelectorAll('[data-consent]').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.dataset.consent); });
    });
    document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); box.hidden = false; });
    });
  }

  // Batterijcalculator: richtwaarden van de eigenaar (jaarverbruik -> batterijgrootte, besparing en investering)
  var calcRoot = document.getElementById('calculator');
  if (calcRoot) {
    var $ = function (id) { return document.getElementById(id); };
    var fmtInt = function (n) { return Math.round(n).toLocaleString('nl-NL'); };
    // vanaf welk jaarverbruik (kWh) hoort welke batterijgrootte (kWh); onder de eerste drempel: 5 kWh; vanaf 7.300: advies op maat
    var STAPPEN = [[2700, 10], [3600, 15], [5300, 20], [6500, 25]];
    var OP_MAAT = 7300;
    var GROTTES = [5, 10, 15, 20, 25];

    function calc() {
      var verbruik = parseFloat($('c-verbruik').value);
      var kwp = parseFloat($('c-kwp').value);
      var beide = $('c-ev').checked && $('c-wp').checked;
      $('cv-verbruik').textContent = fmtInt(verbruik) + ' kWh';
      $('cv-kwp').textContent = kwp.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' kWp';
      $('cv-panelen').textContent = kwp > 0 ? ('≈ ' + Math.max(1, Math.round((kwp * 1000) / 400)) + ' panelen (± 400 Wp per paneel)') : 'Nog geen zonnepanelen';

      var kwh = 5, custom = verbruik >= OP_MAAT;
      for (var i = 0; i < STAPPEN.length; i++) { if (verbruik >= STAPPEN[i][0]) kwh = STAPPEN[i][1]; }
      if (beide && !custom) { kwh += 5; if (GROTTES.indexOf(kwh) < 0) custom = true; }

      if (custom) {
        $('co-kwh').textContent = 'Op maat'; $('co-unit').textContent = '';
        $('co-model').textContent = 'Bij dit verbruik rekenen we de juiste opzet samen met u uit.';
        $('co-besparing').textContent = 'Op aanvraag'; $('co-terug').textContent = 'Op aanvraag'; $('co-investering').textContent = 'Op aanvraag';
        return;
      }
      var stap = kwh / 5 - 1;                    // 0 bij 5 kWh, 1 bij 10 kWh, ...
      var besparing = 400 + 250 * stap;          // 5 kWh: € 400+, elke 5 kWh erbij: € 250 extra per jaar
      var investering = 3000 + 1500 * stap;      // 5 kWh: € 3.000, elke 5 kWh erbij: € 1.500 extra
      $('co-kwh').textContent = kwh; $('co-unit').textContent = 'kWh';
      $('co-model').textContent = 'Merk en type bespreken we in het adviesgesprek' + (beide ? ' (incl. 5 kWh extra voor auto + warmtepomp)' : '') + '.';
      $('co-besparing').textContent = '€ ' + fmtInt(besparing) + '+ / jaar';
      $('co-terug').textContent = '± ' + Math.round(investering / besparing) + ' jaar';
      $('co-investering').textContent = '€ ' + fmtInt(investering) + '+';
    }

    ['c-verbruik', 'c-kwp', 'c-ev', 'c-wp', 'c-dyn', 'c-btw', 'c-or', 'c-aan'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('input', calc);
    });
    calc();
  }

  // Scroll-reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .1 });
    items.forEach(function (i) { io.observe(i); });
  } else items.forEach(function (i) { i.classList.add('in'); });
})();
