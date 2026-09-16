#!/usr/bin/env node
/* Sincroniza data/tables.js con lo que llega al formulario.
 *
 *   node scripts/sync.js --estudiantes <url|archivo> [--programas <url|archivo>] [--dry]
 *
 * Reglas de este script, en orden de importancia:
 *   1. Un pais que no sabe ubicar NO se descarta en silencio: aborta y lo nombra.
 *   2. Lo que Isaac corrigio a mano vive en data/overrides.json y sobrevive.
 *   3. No escribe nada si el resultado no cambia.
 *   4. Nunca hace commit ni publica. Eso lo decide una persona.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { busca, isoAEmoji } = require('./paises.js');
const { leeHoja } = require('./google.js');

const root = path.join(__dirname, '..');
const ARCHIVO_DATOS = path.join(root, 'data/tables.js');
const ARCHIVO_OVR   = path.join(root, 'data/overrides.json');
const ARCHIVO_HTML  = path.join(root, 'index.html');

/* ---------------- argumentos ---------------- */
const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i === -1 ? null : args[i + 1]; };
const DRY = args.includes('--dry');
const FUENTE_EST  = arg('--estudiantes') || process.env.FORM_CSV_ESTUDIANTES;
const FUENTE_PROG = arg('--programas')   || process.env.FORM_CSV_PROGRAMAS;

/* ---------------- CSV ---------------- */
/* Parser propio: los campos del formulario traen comas, comillas y saltos de
   linea dentro (los nombres de hosts, sobre todo). split(',') no sirve. */
function parseCSV(texto) {
  const filas = [];
  let fila = [], campo = '', enComillas = false;
  const s = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (enComillas) {
      if (c === '"') {
        if (s[i + 1] === '"') { campo += '"'; i++; }
        else enComillas = false;
      } else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }
  return filas.filter(f => f.some(x => String(x).trim() !== ''));
}

const CREDS = process.env.GOOGLE_CREDENCIALES || '';
const esEnlaceDeSheets = (f) => /docs\.google\.com\/spreadsheets\/d\//.test(f);

/* Devuelve las filas ya partidas, venga de donde venga la fuente.
   Tres caminos, en este orden:
     1. Enlace normal de Google Sheets + credencial de cuenta de servicio.
        La hoja sigue PRIVADA. Es el camino recomendado.
     2. Cualquier URL que devuelva CSV (una hoja publicada a la web).
     3. Un archivo local, que es como se prueba sin tocar Google. */
async function leeFuente(f, etiqueta) {
  if (!f) return null;

  if (esEnlaceDeSheets(f)) {
    if (!CREDS) {
      throw new Error(
        `${etiqueta}: es un enlace de Google Sheets pero falta la credencial.\n` +
        '  Exporta GOOGLE_CREDENCIALES con el JSON de la cuenta de servicio,\n' +
        '  o en GitHub creala como secreto. Lee la seccion "Keeping it in sync" del README.'
      );
    }
    const { pestana, filas } = await leeHoja(f, CREDS);
    console.log(`  ${etiqueta}: leida la pestaña "${pestana}" (hoja privada, via cuenta de servicio)`);
    return filas;
  }

  if (/^https?:/.test(f)) {
    const r = await fetch(f, { redirect: 'follow' });
    if (!r.ok) throw new Error(`${etiqueta}: la URL respondio ${r.status} ${r.statusText}`);
    const t = await r.text();
    if (/<html/i.test(t.slice(0, 400))) {
      throw new Error(
        `${etiqueta}: la URL devolvio HTML, no CSV.\n` +
        '  La hoja no es legible sin iniciar sesion. Usa el enlace normal de la hoja\n' +
        '  con una cuenta de servicio, o publicala como CSV.'
      );
    }
    return parseCSV(t);
  }

  const p = path.isAbsolute(f) ? f : path.join(root, f);
  if (!fs.existsSync(p)) throw new Error(`${etiqueta}: no existe el archivo ${p}`);
  return parseCSV(fs.readFileSync(p, 'utf8'));
}

/* Busca la columna cuyo encabezado contenga todas las palabras dadas.
   Asi un cambio de espacios o de mayusculas en el formulario no rompe nada. */
function col(encabezados, ...palabras) {
  const norm = encabezados.map(h => String(h).toLowerCase().replace(/\s+/g, ' '));
  const i = norm.findIndex(h => palabras.every(p => h.includes(p.toLowerCase())));
  return i;
}

/* ---------------- normalizadores ---------------- */
const limpia = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

function slug(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* Lo que la gente escribe en el campo de hosts cuando no hay hosts. */
const NO_ES_NOMBRE = new Set([
  'tbd', 'tba', 'none', 'none as of now', 'n/a', 'na', 'no one', 'nobody',
  'only me', 'me', 'myself', 'just me', 'unknown', 'pending', '-', '?'
]);

function partePersonas(s) {
  let t = limpia(s);
  t = t.replace(/^\d+\s*\(/, '(');      // "6 (Gaeun Kim, ...)" -> "(Gaeun Kim, ...)"
  t = t.replace(/^\((.*)\)$/s, '$1');    // quita los parentesis que envuelven todo

  return t
    .split(/\s*(?:,| y | and |\/|;)\s*/i)
    .map(x => limpia(x)
      .replace(/^\((.*)\)$/, '$1')     // solo si los parentesis envuelven TODO,
                                        // para no comerse el de "Sabryne (maybe)"
      .replace(/[\u2014\u2013]/g, '-')   // guion largo -> guion normal
      .replace(/\u2026$/, '')            // puntos suspensivos al final
      .trim())
    .filter(x =>
      x.length > 1 &&
      !/^\d/.test(x) &&                                  // "6", "2 more"
      !NO_ES_NOMBRE.has(x.toLowerCase()) &&
      !esNombreDePais(x)                                 // escribieron el pais aqui
    );
}

/* Quien llena el formulario tambien es host, pero puede que ya se haya puesto
   con el nombre corto. "Maria Eduarda" y "Maria Eduarda Nastarino Leite" son
   una sola persona: se queda la version mas completa. */
function agregaFirmante(hosts, firmante) {
  if (!firmante) return hosts;
  const f = firmante.toLowerCase();
  for (let i = 0; i < hosts.length; i++) {
    const h = hosts[i].toLowerCase();
    if (h === f || f.includes(h)) { hosts[i] = firmante; return hosts; }  // se queda el mas largo
    if (h.includes(f)) return hosts;                                      // ya estaba, mas completo
  }
  hosts.push(firmante);
  return hosts;
}

/* Alguien puso "South Korea" en el campo de nombres de hosts. No es una persona. */
function esNombreDePais(x) {
  const r = busca(x);
  return !!(r && r.exacto);
}

function parteCorreos(s) {
  return limpia(s).split(/[,;\s]+/).map(x => x.trim()).filter(x => /@/.test(x));
}

/* Telefono -> texto legible + E.164 para el enlace tel:. */
function telefono(bruto) {
  const s = limpia(bruto);
  if (!s) return { phone: '', phoneHref: '' };
  const masInicial = s.trim().startsWith('+');
  const d = s.replace(/[^\d]/g, '');
  if (!d) return { phone: '', phoneHref: '' };

  if (!masInicial && d.length === 10) {
    return { phone: `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`, phoneHref: '+1' + d };
  }
  if (!masInicial && d.length === 11 && d[0] === '1') {
    return { phone: `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`, phoneHref: '+' + d };
  }
  if (masInicial && d.length === 11 && d[0] === '1') {
    return { phone: `+1 (${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`, phoneHref: '+' + d };
  }
  if (d.length >= 8 && d.length <= 15) return { phone: '+' + d, phoneHref: '+' + d };
  return { phone: s, phoneHref: '' };
}

const siNo = (v) => {
  const s = limpia(v).toLowerCase();
  if (!s) return null;
  if (s.startsWith('y') || s.startsWith('s')) return true;
  if (s.startsWith('n')) return false;
  return null;
};

/* La marca de tiempo llega como serial de Excel o como fecha de Google. */
function fecha(v) {
  const s = limpia(v);
  if (!s) return '';
  const n = Number(s);
  if (!Number.isNaN(n) && n > 20000 && n < 80000) {
    return new Date(Date.UTC(1899, 11, 30) + n * 86400000).toISOString().slice(0, 10);
  }
  /* El CSV de Google trae "9/11/2026 21:14:55" en hora de Nueva Orleans. Pasarlo
     por new Date() y toISOString() lo convierte a UTC y corre un dia a quien se
     inscribio de noche. Se lee la fecha tal como esta escrita. */
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\b/);
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

/* ---------------- lectura de cada formulario ---------------- */
const sinMapear = [];

function ubica(textoPais, contexto) {
  const r = busca(textoPais);
  if (!r) { sinMapear.push({ texto: limpia(textoPais), contexto }); return null; }
  return r;
}

/* 'separar' en overrides.json: una inscripcion que NO debe fusionarse con la
   del mismo pais (un summer program no es la mesa del pais). Se identifica
   por el correo con que se lleno el formulario, que no cambia. */
function leeEstudiantes(filas, separar = {}) {
  const h = filas[0];
  const c = {
    correo:    col(h, 'email address'),
    nombre:    col(h, 'first name'),
    apellido:  col(h, 'last name'),
    preferido: col(h, 'preferred', 'email'),
    tel:       col(h, 'preferred', 'phone'),
    hosts:     col(h, 'names of table hosts'),
    pais:      col(h, 'country'),
    activs:    col(h, 'activities'),
    comida:    col(h, 'food'),
    calor:     col(h, 'heating dish'),
    compromiso:col(h, 'committing')
  };
  if (c.pais === -1) throw new Error('el CSV de estudiantes no tiene la columna del pais');

  return filas.slice(1).map((f, i) => {
    const paisTexto = limpia(f[c.pais]);
    const geo = ubica(paisTexto, `estudiantes, fila ${i + 2}`);
    if (!geo) return null;

    const quienFirma = limpia(`${f[c.nombre] || ''} ${f[c.apellido] || ''}`);
    const hosts = partePersonas(f[c.hosts]);
    agregaFirmante(hosts, quienFirma);

    const correos = parteCorreos(f[c.preferido]).length
      ? parteCorreos(f[c.preferido]) : parteCorreos(f[c.correo]);

    const compromiso = limpia(f[c.compromiso]);
    const nota = compromiso && !/^yes$/i.test(compromiso) ? compromiso : '';
    const aparte = separar[limpia(f[c.correo]).toLowerCase()];

    return {
      type: aparte ? 'program' : 'country',
      nombreBruto: aparte ? aparte.name : paisTexto,
      iso: geo.iso, continent: geo.region, emoji: geo.emoji,
      hosts, emails: correos,
      ...telefono(f[c.tel]),
      activities: limpia(f[c.activs]),
      food: limpia(f[c.comida]),
      heating: siNo(f[c.calor]),
      signedUp: fecha(f[0]),
      notes: nota
    };
  }).filter(Boolean);
}

function leeProgramas(filas) {
  const h = filas[0];
  const c = {
    nombre:  col(h, 'program you plan to represent'),
    asiste:  col(h, 'able to attend'),
    reps:    col(h, 'representative', 'attending'),
    correos: col(h, 'mail address', 'representative'),
    tela:    col(h, 'tablecloth'),
    comida:  col(h, 'food'),
    calor:   col(h, 'heating dish'),
    equipo:  col(h, 'equipment'),
    vecino:  col(h, 'next to')
  };
  if (c.nombre === -1) throw new Error('el CSV de programas no tiene la columna del nombre del programa');

  return filas.slice(1).map((f, i) => {
    if (siNo(f[c.asiste]) === false) return null;      // dijo que no asiste
    const nombre = limpia(f[c.nombre]);
    const geo = ubica(nombre, `programas, fila ${i + 2}`);
    if (!geo) return null;

    const tela = limpia(f[c.tela]);
    const comida = limpia(f[c.comida]);
    const equipo = limpia(f[c.equipo]);

    return {
      type: 'program',
      nombreBruto: nombre,
      iso: geo.iso, continent: geo.region, emoji: geo.emoji,
      hosts: partePersonas(f[c.reps]),
      emails: parteCorreos(f[c.correos]),
      phone: '', phoneHref: '',
      activities: /both/i.test(tela) ? "Country flag and program tablecloth" : tela,
      food: /^(none|no|n\/a)$/i.test(comida) ? 'None' : comida,
      heating: siNo(f[c.calor]),
      setup: /^(no|none|n\/a)$/i.test(equipo) ? 'No special equipment needed' : equipo,
      vecinoTexto: limpia(f[c.vecino]),
      signedUp: fecha(f[0]),
      notes: ''
    };
  }).filter(Boolean);
}

/* ---------------- fusion ---------------- */
/* Dos inscripciones del mismo pais son UNA mesa. Ya paso con South Korea. */
function fusiona(registros) {
  const porClave = new Map();
  for (const r of registros) {
    const clave = r.type === 'country' ? 'c:' + r.iso : 'p:' + slug(r.nombreBruto);
    if (!porClave.has(clave)) { porClave.set(clave, { ...r, fusionadas: 1 }); continue; }

    const a = porClave.get(clave);
    a.fusionadas++;
    const unir = (x, y) => [...new Set([...x, ...y].map(s => s.trim()).filter(Boolean))];
    a.hosts  = unir(a.hosts, r.hosts);
    a.emails = unir(a.emails, r.emails);
    a.activities = a.activities || r.activities;
    a.food       = a.food || r.food;
    a.phone      = a.phone || r.phone;
    a.phoneHref  = a.phoneHref || r.phoneHref;
    if (a.heating == null) a.heating = r.heating;
    if (r.signedUp && (!a.signedUp || r.signedUp < a.signedUp)) a.signedUp = r.signedUp;
    a.notes = [a.notes, r.notes].filter(Boolean).join(' ');
  }
  return [...porClave.values()];
}

/* ---------------- construccion final ---------------- */
function construye(registros, ovr) {
  const nombres = ovr.nombres || {};
  const porId   = ovr.byId || {};

  let mesas = registros.map(r => {
    const nombre = nombres[r.nombreBruto] || nombres[limpia(r.nombreBruto)] || limpia(r.nombreBruto);
    const id = slug(nombre);
    const base = {
      id, type: r.type, name: nombre, iso: r.iso, emoji: r.emoji, continent: r.continent,
      hosts: r.hosts, emails: r.emails, phone: r.phone, phoneHref: r.phoneHref,
      activities: r.activities, food: r.food, heating: r.heating, signedUp: r.signedUp,
      notes: r.notes
    };
    if (r.setup) base.setup = r.setup;
    if (r.fusionadas > 1) {
      base.notes = limpia(`${base.notes} ${r.fusionadas} separate sign-ups merged into one table.`);
    }
    return base;
  });

  // Vecinos: el texto libre del formulario se resuelve a un id real.
  const porNombre = new Map(mesas.map(m => [m.name.toLowerCase(), m.id]));
  for (const r of registros) {
    if (!r.vecinoTexto) continue;
    const mia = mesas.find(m => m.id === slug(nombres[r.nombreBruto] || limpia(r.nombreBruto)));
    if (!mia) continue;
    let destino = porNombre.get(r.vecinoTexto.toLowerCase());
    if (!destino) destino = buscaVecino(r.vecinoTexto, mesas, mia.id);
    if (destino && destino !== mia.id) mia.neighbour = destino;
  }

  // Correcciones a mano. Se aplican al final para que nada las pise.
  for (const m of mesas) {
    const o = porId[m.id];
    if (!o) continue;
    for (const [k, v] of Object.entries(o)) {
      if (k === 'notesAppend') { m.notes = limpia(`${m.notes || ''} ${v}`); continue; }
      m[k] = v;
    }
    if (m.iso) m.emoji = isoAEmoji(m.iso);
  }

  const orden = ['north-america','south-america','europe','asia','africa','oceania'];
  mesas.sort((a, b) => {
    const d = orden.indexOf(a.continent) - orden.indexOf(b.continent);
    if (d) return d;
    if (a.type !== b.type) return a.type === 'country' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return mesas;
}

/* El vecino llega como texto libre: "Prague/Vienna/Budapest" tiene que
   encontrar la mesa "Summer in Prague / Vienna / Budapest". Se comparan las
   palabras con peso, ignorando las de relleno. */
const RELLENO = new Set(['summer','in','the','and','a','of','at','table','program','study','abroad','fall','spring']);
const fichas = (s) => String(s).toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .split(/[^a-z0-9]+/).filter(w => w.length > 2 && !RELLENO.has(w));

function buscaVecino(texto, mesas, idPropio) {
  const q = fichas(texto);
  if (!q.length) return null;
  let mejor = null, mejorPuntaje = 0;
  for (const m of mesas) {
    if (m.id === idPropio) continue;
    const c = fichas(m.name);
    const comunes = q.filter(w => c.includes(w)).length;
    if (comunes > mejorPuntaje) { mejorPuntaje = comunes; mejor = m.id; }
  }
  return mejorPuntaje > 0 ? mejor : null;
}

/* ---------------- escritura ---------------- */
const MARCA_INI = '/* === INICIO TABLES: lo genera scripts/sync.js. No editar a mano. === */';
const MARCA_FIN = '/* === FIN TABLES === */';

function serializa(mesas) {
  const campos = ['id','type','name','iso','emoji','continent','hosts','emails',
                  'phone','phoneHref','activities','food','heating','signedUp',
                  'setup','neighbour','notes'];
  const v = (x) => JSON.stringify(x === undefined ? '' : x);
  const cuerpo = mesas.map(m => {
    const l = campos.filter(k => m[k] !== undefined).map(k => `${k}:${v(m[k])}`);
    return '  { ' + l.join(', ') + ' }';
  }).join(',\n\n');
  return `${MARCA_INI}\nconst TABLES = [\n${cuerpo}\n];\n${MARCA_FIN}`;
}

function actualizaPie(html, mesas) {
  const paises = mesas.filter(m => m.type === 'country').length;
  const prog   = mesas.filter(m => m.type === 'program').length;
  return html
    .replace(
      /\d+\s+tables from\s+\d+\s+countries and\s+\d+\s+study abroad programs/,
      `${mesas.length} tables from ${paises} countries and ${prog} study abroad programs`)
    .replace(
      /(og:description" content=")\d+ countries, \d+ study abroad programs/,
      `$1${paises} countries, ${prog} study abroad programs`)
    /* GitHub Pages deja data/tables.js 10 minutos en cache y el navegador
       seguia mostrando el roster viejo. La version es una huella del
       contenido: cambia solo si cambian las mesas. */
    .replace(
      /data\/tables\.js(?:\?v=[0-9a-f]+)?"/,
      `data/tables.js?v=${crypto.createHash('sha1').update(serializa(mesas)).digest('hex').slice(0, 8)}"`);
}

/* ---------------- principal ---------------- */
(async function main() {
  if (!FUENTE_EST) {
    console.error('\nFalta la fuente de estudiantes.\n' +
      '  node scripts/sync.js --estudiantes <url|archivo> [--programas <url|archivo>]\n' +
      '  o exporta FORM_CSV_ESTUDIANTES y FORM_CSV_PROGRAMAS\n');
    process.exit(2);
  }

  console.log('\n\x1b[1mSincronizando con el formulario\x1b[0m\n');

  const [filasEst, filasProg] = await Promise.all([
    leeFuente(FUENTE_EST, 'estudiantes'),
    leeFuente(FUENTE_PROG, 'programas')
  ]);

  const ovr = fs.existsSync(ARCHIVO_OVR) ? JSON.parse(fs.readFileSync(ARCHIVO_OVR, 'utf8')) : {};
  const est  = leeEstudiantes(filasEst, ovr.separar);
  const prog = filasProg ? leeProgramas(filasProg) : [];
  console.log(`  leidas ${est.length} inscripciones de estudiantes y ${prog.length} de programas`);

  // Regla 1: nada se pierde en silencio.
  if (sinMapear.length) {
    console.error('\n\x1b[31mABORTADO\x1b[0m — hay mesas que no se pueden ubicar en un continente:\n');
    for (const x of sinMapear) console.error(`    "${x.texto}"   (${x.contexto})`);
    console.error('\n  Agrega el nombre a scripts/paises.js o corrigelo en el formulario.');
    console.error('  No se escribio nada.\n');
    process.exit(1);
  }

  const mesas = construye(fusiona([...est, ...prog]), ovr);

  const fusionadas = mesas.filter(m => /merged into one table/.test(m.notes || ''));
  console.log(`  ${mesas.length} mesas: ${mesas.filter(m=>m.type==='country').length} paises y ${mesas.filter(m=>m.type==='program').length} programas`);
  if (fusionadas.length) console.log(`  fusionadas por pais repetido: ${fusionadas.map(m=>m.name).join(', ')}`);

  const anterior = fs.readFileSync(ARCHIVO_DATOS, 'utf8');
  const i = anterior.indexOf(MARCA_INI), j = anterior.indexOf(MARCA_FIN);
  if (i === -1 || j === -1) {
    console.error('\n\x1b[31mABORTADO\x1b[0m — data/tables.js no tiene las marcas INICIO/FIN TABLES.\n');
    process.exit(1);
  }
  const nuevo = anterior.slice(0, i) + serializa(mesas) + anterior.slice(j + MARCA_FIN.length);

  const htmlAnt = fs.readFileSync(ARCHIVO_HTML, 'utf8');
  const htmlNue = actualizaPie(htmlAnt, mesas);

  const cambioDatos = nuevo !== anterior;
  const cambioHtml  = htmlNue !== htmlAnt;

  if (!cambioDatos && !cambioHtml) {
    console.log('\n  \x1b[32mSin cambios.\x1b[0m El sitio ya esta al dia.\n');
    process.exit(0);
  }

  if (DRY) {
    console.log('\n  \x1b[33m--dry\x1b[0m: hay cambios, pero no se escribio nada.');
    console.log(`         data/tables.js ${cambioDatos ? 'cambiaria' : 'igual'} | index.html ${cambioHtml ? 'cambiaria' : 'igual'}\n`);
    process.exit(0);
  }

  fs.writeFileSync(ARCHIVO_DATOS, nuevo);
  if (cambioHtml) fs.writeFileSync(ARCHIVO_HTML, htmlNue);
  console.log(`\n  \x1b[32mEscrito.\x1b[0m data/tables.js${cambioHtml ? ' y los totales de index.html' : ''}.`);
  console.log('  Ahora corre: npm run verificar\n');
})().catch(e => {
  console.error('\n\x1b[31mERROR\x1b[0m ' + e.message + '\n');
  process.exit(1);
});
