/* Loyola's International Fest 2026 — logica de la pagina.
   Sin dependencias. Todo se dibuja desde data/tables.js. */
(function () {
  'use strict';

  var byId = {};
  CONTINENTS.forEach(function (c) { byId[c.id] = c; });

  var state = { q: '', region: 'all' };

  var elGrid    = document.getElementById('regions');
  var elEmpty   = document.getElementById('empty');
  var elChips   = document.getElementById('chips');
  var elSearch  = document.getElementById('search');
  var elClear   = document.getElementById('clear');
  var elCount   = document.getElementById('resultcount');
  var elToast   = document.getElementById('toast');
  var elTbody   = document.getElementById('tbody');

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function mailto(t) {
    var subject = 'International Fest 2026 — ' + t.name + ' table';
    var body = 'Hi ' + t.hosts[0].split(' ')[0] + ',\n\n'
             + 'Writing about your ' + t.name + ' table at Loyola’s International Fest '
             + 'on September 30th, 3:30–5:00 PM at the Peace Quad.\n\n';
    return 'mailto:' + encodeURIComponent(t.emails.join(',')).replace(/%40/g, '@').replace(/%2C/g, ',')
         + '?subject=' + encodeURIComponent(subject)
         + '&body=' + encodeURIComponent(body);
  }

  function toast(msg) {
    elToast.textContent = msg;
    elToast.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { elToast.classList.remove('on'); }, 2200);
  }

  function haystack(t) {
    return [t.name, t.hosts.join(' '), t.food, t.activities, t.emails.join(' '), byId[t.continent].name, t.notes]
      .join(' ').toLowerCase();
  }

  function matches(t) {
    if (state.region !== 'all' && t.continent !== state.region) return false;
    if (!state.q) return true;
    return haystack(t).indexOf(state.q) !== -1;
  }

  /* ---------- iconos ---------- */
  var ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>';

  /* ---------- tarjeta ---------- */
  function cardHTML(t) {
    var c = byId[t.continent];
    var heat = t.heating === true
      ? '<span class="badge-heat">Heating dish</span>'
      : '';
    var prog = t.type === 'program' ? '<span class="badge-prog">Loyola program</span>' : '';

    var rows = '';
    rows += '<div class="row"><span class="lbl">' + (t.hosts.length > 1 ? 'Table hosts' : 'Table host') + '</span>'
          + '<span class="val">' + esc(t.hosts.join(', ')) + '</span></div>';

    rows += '<div class="row"><span class="lbl">Food</span><span class="val' + (t.food ? '' : ' muted') + '">'
          + esc(t.food || 'Not decided yet') + '</span></div>';

    rows += '<div class="row"><span class="lbl">At the table</span><span class="val' + (t.activities ? '' : ' muted') + '">'
          + esc(t.activities || 'Not decided yet') + '</span></div>';

    rows += '<div class="row"><span class="lbl">Contact</span><span class="val">'
          + esc(t.emails.join(' · '))
          + (t.phone ? '<br>' + esc(t.phone) : '') + '</span></div>';

    if (t.notes) rows += '<p class="note">' + esc(t.notes) + '</p>';

    var phoneBtn = t.phoneHref
      ? '<a class="btn btn-ghost" href="tel:' + esc(t.phoneHref) + '" aria-label="Call the ' + esc(t.name) + ' table">' + ICON_PHONE + '</a>'
      : '';

    return '' +
      '<article class="card reveal" style="--rc:' + c.color + '" data-id="' + t.id + '">' +
        '<div class="card-head">' +
          '<span class="flag" aria-hidden="true">' +
            '<img src="https://flagcdn.com/w80/' + t.iso + '.png" alt="" loading="lazy" ' +
            'onerror="this.replaceWith(document.createTextNode(\'' + t.emoji + '\'))">' +
          '</span>' +
          '<div>' +
            '<h3>' + esc(t.name) + '</h3>' +
            '<div class="meta">' + esc(c.name) + ' ' + prog + ' ' + heat + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="card-body">' + rows + '</div>' +
        '<div class="card-foot">' +
          '<a class="btn btn-mail" href="' + mailto(t) + '">' + ICON_MAIL + ' Email this table</a>' +
          '<button class="btn btn-ghost js-copy" data-mail="' + esc(t.emails.join(', ')) + '" ' +
            'aria-label="Copy the e-mail address for ' + esc(t.name) + '">' + ICON_COPY + '</button>' +
          phoneBtn +
        '</div>' +
      '</article>';
  }

  /* ---------- render ---------- */
  function render() {
    var shown = TABLES.filter(matches);
    var html = '';

    CONTINENTS.forEach(function (c) {
      var list = shown.filter(function (t) { return t.continent === c.id; });
      if (!list.length) return;

      list.sort(function (a, b) {
        if (a.type !== b.type) return a.type === 'country' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      html += '<section class="region" id="r-' + c.id + '" style="--rc:' + c.color + ';--rc-ink:' + c.ink + '">' +
        '<header class="region-head">' +
          '<h2>' + c.emoji + ' ' + esc(c.name) + '</h2>' +
          '<span class="region-count">' + list.length + (list.length === 1 ? ' table' : ' tables') + '</span>' +
          '<span class="flagset" aria-hidden="true">' + list.map(function (t) { return t.emoji; }).join('') + '</span>' +
        '</header>' +
        '<div class="grid">' + list.map(cardHTML).join('') + '</div>' +
      '</section>';
    });

    elGrid.innerHTML = html;
    elEmpty.classList.toggle('on', shown.length === 0);

    var regionName = state.region === 'all' ? 'all regions' : byId[state.region].name;
    elCount.innerHTML = 'Showing <b>' + shown.length + '</b> of <b>' + TABLES.length + '</b> tables'
      + (state.region === 'all' ? '' : ' in <b>' + esc(regionName) + '</b>')
      + (state.q ? ' matching <b>“' + esc(state.q) + '”</b>' : '');

    reveal();
  }

  /* ---------- chips ---------- */
  function buildChips() {
    var html = '<button class="chip all" aria-pressed="true" data-r="all">All tables <span class="n">'
             + TABLES.length + '</span></button>';
    CONTINENTS.forEach(function (c) {
      var n = TABLES.filter(function (t) { return t.continent === c.id; }).length;
      if (!n) return;
      html += '<button class="chip" aria-pressed="false" data-r="' + c.id + '" style="--chip:' + c.color + '">'
            + c.emoji + ' ' + esc(c.short) + ' <span class="n">' + n + '</span></button>';
    });
    elChips.innerHTML = html;
  }

  /* ---------- tabla resumen ---------- */
  function buildTable() {
    var rows = TABLES.slice().sort(function (a, b) {
      if (a.continent !== b.continent) {
        return CONTINENTS.findIndex(function (c) { return c.id === a.continent; })
             - CONTINENTS.findIndex(function (c) { return c.id === b.continent; });
      }
      return a.name.localeCompare(b.name);
    });

    elTbody.innerHTML = rows.map(function (t) {
      var c = byId[t.continent];
      return '<tr>' +
        '<td class="cty"><span class="dotc" style="background:' + c.color + '"></span>' + t.emoji + ' ' + esc(t.name) +
          (t.type === 'program' ? ' <span class="badge-prog">Program</span>' : '') + '</td>' +
        '<td>' + esc(c.short) + '</td>' +
        '<td>' + esc(t.hosts.join(', ')) + '</td>' +
        '<td>' + esc(t.food || '—') + '</td>' +
        '<td>' + (t.heating === true ? 'Yes' : t.heating === false ? 'No' : '—') + '</td>' +
        '<td><a href="' + mailto(t) + '">' + esc(t.emails[0]) + '</a></td>' +
      '</tr>';
    }).join('');
  }

  /* ---------- entrada suave ---------- */
  function reveal() {
    var items = elGrid.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (n) { n.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var n = e.target;
        setTimeout(function () { n.classList.add('in'); }, Math.min(i, 6) * 55);
        io.unobserve(n);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: .08 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- contadores del hero ---------- */
  function heroStats() {
    var hosts = {};
    TABLES.forEach(function (t) { t.hosts.forEach(function (h) { hosts[h] = 1; }); });
    document.getElementById('n-tables').textContent    = TABLES.length;
    document.getElementById('n-countries').textContent = TABLES.filter(function (t) { return t.type === 'country'; }).length;
    document.getElementById('n-regions').textContent   = new Set(TABLES.map(function (t) { return t.continent; })).size;
    document.getElementById('n-hosts').textContent     = Object.keys(hosts).length;
  }

  /* ---------- eventos ---------- */
  elChips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    state.region = b.dataset.r;
    elChips.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c === b));
    });
    render();
  });

  elSearch.addEventListener('input', function () {
    state.q = elSearch.value.trim().toLowerCase();
    elClear.classList.toggle('on', elSearch.value.length > 0);
    render();
  });

  elClear.addEventListener('click', function () {
    elSearch.value = ''; state.q = '';
    elClear.classList.remove('on');
    elSearch.focus(); render();
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.js-copy');
    if (!b) return;
    var mail = b.dataset.mail;
    var done = function () {
      b.classList.add('done');
      toast('Copied: ' + mail);
      setTimeout(function () { b.classList.remove('done'); }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail).then(done, function () { toast('Could not copy — ' + mail); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = mail; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { toast('Could not copy — ' + mail); }
      document.body.removeChild(ta);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== elSearch) { e.preventDefault(); elSearch.focus(); }
    if (e.key === 'Escape' && document.activeElement === elSearch) { elSearch.blur(); }
  });

  /* ---------- arranque ---------- */
  buildChips();
  buildTable();
  heroStats();
  render();
})();
