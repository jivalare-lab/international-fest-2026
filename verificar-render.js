#!/usr/bin/env node
/* Prueba de render: carga index.html en un DOM real y comprueba que la pagina
   dibuja todas las tarjetas. La puerta estatica valida los datos; esta valida el
   resultado en pantalla, que es lo que ve quien abre el link. */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

let fallos = 0, pruebas = 0;
const ok  = m => { pruebas++; console.log('  \x1b[32m✓\x1b[0m ' + m); };
const mal = m => { pruebas++; fallos++; console.log('  \x1b[31m✗\x1b[0m ' + m); };
const test = (c, b, e) => c ? ok(b) : mal(e);

console.log('\n\x1b[1mInternational Fest 2026 — prueba de render\x1b[0m\n');

const root = __dirname;
const { TABLES, CONTINENTS } = new Function(
  fs.readFileSync(path.join(root, 'data/tables.js'), 'utf8') + ';return {TABLES,CONTINENTS};')();

const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
  runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://example.org/'
});
const { window } = dom;
const errores = [];
window.addEventListener('error', e => errores.push(e.message));

try {
  // Los dos en un solo eval, igual que dos <script> en la misma pagina:
  // las constantes de tables.js tienen que quedar visibles para app.js.
  window.eval(
    fs.readFileSync(path.join(root, 'data/tables.js'), 'utf8') + '\n;\n' +
    fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8')
  );
  ok('data/tables.js y assets/app.js corren en el DOM sin lanzar excepcion');
} catch (e) {
  mal('el script revienta al cargar: ' + e.message);
  console.log('\n\x1b[31mROJO\x1b[0m — no se puede seguir.'); process.exit(1);
}

const d = window.document;
const q = s => d.querySelectorAll(s);

console.log('\n\x1b[1mLo que ve quien abre el link\x1b[0m');

test(q('#regions .card').length === TABLES.length,
  `dibuja las ${TABLES.length} tarjetas`,
  `dibuja ${q('#regions .card').length} tarjetas y deberian ser ${TABLES.length}`);

test(q('#regions .region').length === CONTINENTS.length,
  `dibuja las ${CONTINENTS.length} secciones de region`,
  `dibuja ${q('#regions .region').length} regiones y deberian ser ${CONTINENTS.length}`);

test(q('#chips .chip').length === CONTINENTS.length + 2,
  `dibuja ${CONTINENTS.length + 2} filtros (todas + una por region + Loyola programs)`,
  `dibuja ${q('#chips .chip').length} filtros`);

test(q('#tbody tr').length === TABLES.length,
  `la tabla resumen trae las ${TABLES.length} filas`,
  `la tabla resumen trae ${q('#tbody tr').length} filas`);

// El boton principal de cada tarjeta. Si un mailto sale vacio, el usuario
// hace clic y no pasa nada, sin ningun error a la vista.
const mails = [...q('#regions .btn-mail')];
test(mails.length === TABLES.length,
  `las ${TABLES.length} tarjetas tienen su boton de correo`,
  `solo ${mails.length} tarjetas tienen boton de correo`);

const malos = mails.filter(a => {
  const h = a.getAttribute('href') || '';
  return !h.startsWith('mailto:') || !/mailto:[^?]+@[^?]+\?subject=/.test(h);
});
test(malos.length === 0,
  'los mailto llevan destinatario y asunto',
  `${malos.length} botones de correo con href invalido`);

// Cada tarjeta debe llevar el color de su region, no el de otra.
const porColor = {};
CONTINENTS.forEach(c => { porColor[c.color.toLowerCase()] = c.id; });
let colorMal = 0;
for (const card of q('#regions .card')) {
  const id = card.dataset.id;
  const esperado = CONTINENTS.find(c => c.id === TABLES.find(t => t.id === id).continent).color.toLowerCase();
  const puesto = (card.getAttribute('style') || '').match(/--rc:\s*(#[0-9a-f]{6})/i);
  if (!puesto || puesto[1].toLowerCase() !== esperado) colorMal++;
}
test(colorMal === 0,
  'cada tarjeta lleva el color de su propia region',
  `${colorMal} tarjetas con el color de otra region`);

// Contadores del encabezado
const leido = id => Number(d.getElementById(id).textContent);
test(leido('n-tables') === TABLES.length
  && leido('n-countries') === TABLES.filter(t => t.type === 'country').length
  && leido('n-regions') === CONTINENTS.length
  && leido('n-hosts') === new Set(TABLES.flatMap(t => t.hosts)).size,
  `los contadores dicen ${leido('n-tables')} mesas, ${leido('n-countries')} paises, ${leido('n-regions')} regiones, ${leido('n-hosts')} hosts`,
  'los contadores del encabezado no cuadran con los datos');

console.log('\n\x1b[1mBusqueda y filtros\x1b[0m');

const search = d.getElementById('search');
const fire = (el, t) => el.dispatchEvent(new window.Event(t, { bubbles: true }));

search.value = 'schnitzel'; fire(search, 'input');
test(q('#regions .card').length === 1 && q('#regions .card')[0].dataset.id === 'austria',
  'buscar "schnitzel" deja solo Austria (busca dentro de la comida)',
  `buscar "schnitzel" dejo ${q('#regions .card').length} tarjetas`);

search.value = 'tracey'; fire(search, 'input');
test(q('#regions .card').length === 2,
  'buscar "tracey" deja las 2 mesas de programas (busca dentro de los hosts)',
  `buscar "tracey" dejo ${q('#regions .card').length} tarjetas`);

const tributo = d.getElementById('tribute');
test(tributo && tributo.hidden && !d.getElementById('tribute-img').getAttribute('src'),
  'el homenaje a Dolly Parton esta escondido y su foto no se descarga si nadie la busca',
  'el homenaje a Dolly Parton se ve (o descarga la foto) sin que nadie la busque');

const formas = ['Dolly Parton', 'DOLLY PARTON', 'dollyparton', 'dolly-parton', 'Doly Partón', ' dolly  parton '];
const fallan = formas.filter(f => { search.value = f; fire(search, 'input'); return tributo.hidden; });
test(fallan.length === 0,
  `buscar Dolly Parton de ${formas.length} maneras distintas muestra el homenaje`,
  `no aparece con: ${fallan.join(' | ')}`);
test(!d.getElementById('empty').classList.contains('on'),
  'con el homenaje visible no sale el mensaje de "No tables match"',
  'el homenaje y el estado vacio salen a la vez');

const parecidas = ['dolly', 'parton', 'molly parton', 'dolly partonx'];
const cuelan = parecidas.filter(f => { search.value = f; fire(search, 'input'); return !tributo.hidden; });
test(cuelan.length === 0,
  'busquedas parecidas (dolly, parton, molly parton) no lo muestran',
  `aparece sin buscarla: ${cuelan.join(' | ')}`);

search.value = 'zzzzz'; fire(search, 'input');
test(d.getElementById('empty').classList.contains('on'),
  'una busqueda sin resultados muestra el estado vacio',
  'una busqueda sin resultados deja la pagina muda');

search.value = ''; fire(search, 'input');
test(q('#regions .card').length === TABLES.length,
  `limpiar la busqueda devuelve las ${TABLES.length} tarjetas`,
  'limpiar la busqueda no restaura todo');

const chipAsia = [...q('#chips .chip')].find(c => c.dataset.r === 'asia');
chipAsia.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const asia = TABLES.filter(t => t.continent === 'asia').length;
test(q('#regions .card').length === asia,
  `filtrar por Asia deja ${asia} tarjetas`,
  `filtrar por Asia dejo ${q('#regions .card').length} y deberian ser ${asia}`);

const chipProg = [...q('#chips .chip')].find(c => c.dataset.r === 'programs');
chipProg.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const progs = TABLES.filter(t => t.type === 'program').map(t => t.id).sort();
const vistas = [...q('#regions .card')].map(c => c.dataset.id).sort();
test(JSON.stringify(vistas) === JSON.stringify(progs),
  `filtrar por Loyola programs deja las ${progs.length} mesas de programas y nada mas`,
  `filtrar por Loyola programs dejo ${vistas.join(', ')}`);

test(errores.length === 0, 'ningun error de JS en la consola', `errores en consola: ${errores.join(' | ')}`);

console.log('\n' + '─'.repeat(58));
if (fallos === 0) { console.log(`\x1b[32m\x1b[1mVERDE\x1b[0m  ${pruebas} pruebas de render, 0 fallos.`); process.exit(0); }
console.log(`\x1b[31m\x1b[1mROJO\x1b[0m   ${pruebas} pruebas de render, \x1b[31m${fallos} fallos\x1b[0m.`); process.exit(1);
