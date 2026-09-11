#!/usr/bin/env node
/* Puerta de verificacion de international-fest-2026.
   Prueba las reglas que, si fallan, devuelven una pagina en blanco o un dato
   falso en vez de un error visible. Sin dependencias: node verificar.js */
'use strict';

const fs = require('fs');
const path = require('path');
const root = __dirname;

let fallos = 0, avisos = 0, pruebas = 0;
const ok   = (m) => { pruebas++; console.log('  \x1b[32m✓\x1b[0m ' + m); };
const mal  = (m) => { pruebas++; fallos++; console.log('  \x1b[31m✗\x1b[0m ' + m); };
const avisa= (m) => { avisos++; console.log('  \x1b[33m!\x1b[0m ' + m); };
const test = (cond, bien, error) => cond ? ok(bien) : mal(error);

console.log('\n\x1b[1mInternational Fest 2026 — puerta de verificacion\x1b[0m\n');

/* ---------- 1. Los archivos existen ---------- */
console.log('\x1b[1m1. Archivos\x1b[0m');
const requeridos = ['index.html', 'assets/styles.css', 'assets/app.js', 'data/tables.js', '.nojekyll'];
for (const f of requeridos) {
  test(fs.existsSync(path.join(root, f)), `existe ${f}`, `FALTA ${f}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js   = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const css  = fs.readFileSync(path.join(root, 'assets/styles.css'), 'utf8');
const src  = fs.readFileSync(path.join(root, 'data/tables.js'), 'utf8');

/* ---------- 2. Los datos cargan ---------- */
console.log('\n\x1b[1m2. Datos\x1b[0m');
let TABLES, CONTINENTS, FEST;
try {
  ({ TABLES, CONTINENTS, FEST } = new Function(src + ';return {TABLES,CONTINENTS,FEST};')());
  ok('data/tables.js evalua sin error');
} catch (e) {
  mal('data/tables.js NO evalua: ' + e.message);
  process.exit(1);
}

test(Array.isArray(TABLES) && TABLES.length > 0, `TABLES trae ${TABLES.length} mesas`, 'TABLES vacio o no es lista');
test(Array.isArray(CONTINENTS) && CONTINENTS.length === 6, `CONTINENTS trae ${CONTINENTS.length} regiones`, 'CONTINENTS deberia traer 6 regiones');

/* ---------- 3. Reglas criticas de cada mesa ---------- */
console.log('\n\x1b[1m3. Integridad de cada mesa\x1b[0m');
const ids = new Set(), nombres = new Set(), contIds = new Set(CONTINENTS.map(c => c.id));
const reEmail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
let errFila = 0;

for (const t of TABLES) {
  const donde = `[${t.id || '¿sin id?'}]`;
  if (!t.id || !t.name) { mal(`${donde} sin id o sin name`); errFila++; continue; }
  if (ids.has(t.id))   { mal(`${donde} id duplicado`); errFila++; }
  ids.add(t.id);

  // Un pais repetido saldria dos veces en la pagina sin que nadie lo note.
  const clave = t.name.toLowerCase().trim();
  if (nombres.has(clave)) { mal(`${donde} "${t.name}" aparece dos veces: hay que fusionar las mesas`); errFila++; }
  nombres.add(clave);

  if (!contIds.has(t.continent)) { mal(`${donde} continente "${t.continent}" no existe en CONTINENTS`); errFila++; }
  if (!['country', 'program'].includes(t.type)) { mal(`${donde} type invalido: ${t.type}`); errFila++; }
  if (!Array.isArray(t.hosts) || t.hosts.length === 0) { mal(`${donde} sin hosts`); errFila++; }

  // Sin correo valido el boton principal de la tarjeta no hace nada.
  if (!Array.isArray(t.emails) || t.emails.length === 0) { mal(`${donde} sin ningun correo: el boton no haria nada`); errFila++; }
  else for (const e of t.emails) {
    if (!reEmail.test(e)) { mal(`${donde} correo mal formado: ${e}`); errFila++; }
  }

  if (!/^[a-z]{2}$/.test(t.iso || '')) { mal(`${donde} codigo ISO invalido "${t.iso}": no cargaria la bandera`); errFila++; }
  if (!t.emoji) { mal(`${donde} sin emoji de respaldo para la bandera`); errFila++; }
  if (t.phoneHref && !/^\+[0-9]{8,15}$/.test(t.phoneHref)) { mal(`${donde} phoneHref no es E.164: ${t.phoneHref}`); errFila++; }
  if (t.heating !== true && t.heating !== false && t.heating !== null) { mal(`${donde} heating debe ser true, false o null`); errFila++; }
}
if (errFila === 0) ok(`las ${TABLES.length} mesas pasan: id unico, pais sin repetir, region valida, correo valido, ISO valido`);

/* ---------- 4. El puente HTML <-> JS ---------- */
console.log('\n\x1b[1m4. Puente entre el HTML y el script\x1b[0m');
// Este es el fallo silencioso de verdad: si un id se renombra, la pagina
// carga en blanco sin ningun error a la vista.
const idsUsados = [...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const faltantes = [...new Set(idsUsados)].filter(id => !new RegExp(`id=["']${id}["']`).test(html));
test(faltantes.length === 0,
  `los ${new Set(idsUsados).size} ids que pide app.js existen en index.html`,
  `app.js busca ids que el HTML no tiene: ${faltantes.join(', ')} — la pagina saldria en blanco`);

/* ---------- 5. Enlaces locales ---------- */
console.log('\n\x1b[1m5. Enlaces locales\x1b[0m');
const locales = [...html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|data:|#)([^"]+)"/g)].map(m => m[1]);
let rotos = 0;
for (const l of locales) {
  if (!fs.existsSync(path.join(root, l))) { mal(`enlace roto en index.html: ${l}`); rotos++; }
}
if (rotos === 0) ok(`los ${locales.length} enlaces locales del HTML resuelven`);

/* ---------- 6. Colores por region ---------- */
console.log('\n\x1b[1m6. Colores\x1b[0m');
let colorErr = 0;
const vistos = new Set();
for (const c of CONTINENTS) {
  if (!/^#[0-9a-f]{6}$/i.test(c.color)) { mal(`${c.id}: color invalido ${c.color}`); colorErr++; }
  if (vistos.has(c.color.toLowerCase())) { mal(`${c.id}: color repetido ${c.color}, dos regiones se verian iguales`); colorErr++; }
  vistos.add(c.color.toLowerCase());
  if (!css.includes(`--c-${c.id}`)) { avisa(`${c.id}: no hay variable --c-${c.id} en styles.css`); }
}
if (colorErr === 0) ok(`las ${CONTINENTS.length} regiones tienen color propio, valido y distinto`);

/* ---------- 7. Coherencia de los numeros ---------- */
console.log('\n\x1b[1m7. Numeros que se muestran\x1b[0m');
const paises   = TABLES.filter(t => t.type === 'country').length;
const programas= TABLES.filter(t => t.type === 'program').length;
const regiones = new Set(TABLES.map(t => t.continent)).size;
const hosts    = new Set(TABLES.flatMap(t => t.hosts)).size;
console.log(`     ${TABLES.length} mesas · ${paises} paises · ${programas} programas · ${regiones} regiones · ${hosts} hosts`);

// El pie tiene los numeros escritos a mano: si los datos cambian y el pie no,
// la pagina miente sin dar ningun error.
const pie = html.match(/(\d+)\s+tables from\s+(\d+)\s+countries and\s+(\d+)\s+study abroad programs/);
if (!pie) { avisa('no se encontro la linea de totales en el pie para contrastarla'); }
else {
  test(Number(pie[1]) === TABLES.length && Number(pie[2]) === paises && Number(pie[3]) === programas,
    `el pie dice ${pie[1]}/${pie[2]}/${pie[3]} y los datos dicen ${TABLES.length}/${paises}/${programas}`,
    `el pie dice ${pie[1]} mesas, ${pie[2]} paises, ${pie[3]} programas; los datos dicen ${TABLES.length}, ${paises}, ${programas}`);
}
test(regiones === CONTINENTS.length,
  'todas las regiones declaradas tienen al menos una mesa',
  `hay ${CONTINENTS.length} regiones declaradas pero solo ${regiones} con mesas: saldria una cabecera vacia`);

/* ---------- 8. Mesas vecinas ---------- */
console.log('\n\x1b[1m8. Peticiones de mesas contiguas\x1b[0m');
let vecErr = 0;
for (const t of TABLES.filter(x => x.neighbour)) {
  const otro = TABLES.find(x => x.id === t.neighbour);
  if (!otro) { mal(`${t.id} pide estar junto a "${t.neighbour}", que no existe`); vecErr++; }
  else if (otro.neighbour !== t.id) { avisa(`${t.id} pide estar junto a ${otro.id}, pero ${otro.id} no lo pide de vuelta`); }
}
if (vecErr === 0) ok('las peticiones de mesas contiguas apuntan a mesas que existen');

/* ---------- 9. Calidad de lo que genera el sincronizador ---------- */
console.log('\n\x1b[1m9. Calidad de los datos generados\x1b[0m');
// Estas fallas no rompen nada: salen impresas en la tarjeta como si fueran
// buenas. Ya pasaron las tres la primera vez que corrio sync.js.
const RELLENOS = new Set(['tbd','tba','none','n/a','na','me','only me','myself','unknown','pending']);
let basura = 0;
for (const t of TABLES) {
  for (const h of t.hosts) {
    if (/^\d/.test(h))                      { mal(`[${t.id}] host que empieza con numero: "${h}"`); basura++; }
    if (RELLENOS.has(h.toLowerCase()))       { mal(`[${t.id}] host de relleno: "${h}"`); basura++; }
    if (/[\u2014\u2013]/.test(h))            { mal(`[${t.id}] host con guion largo: "${h}"`); basura++; }
    if (h.toLowerCase() === t.name.toLowerCase()) { mal(`[${t.id}] el nombre del pais esta puesto como si fuera una persona`); basura++; }
    const abre = (h.match(/\(/g) || []).length, cierra = (h.match(/\)/g) || []).length;
    if (abre !== cierra)                     { mal(`[${t.id}] host con parentesis sin cerrar: "${h}"`); basura++; }
  }
}
if (basura === 0) ok(`los ${TABLES.reduce((n,t)=>n+t.hosts.length,0)} nombres de hosts estan limpios`);

// Un id mal escrito en overrides.json no da error: la correccion simplemente
// no se aplica y nadie se entera. Ha de gritar.
const ovrPath = path.join(root, 'data/overrides.json');
if (fs.existsSync(ovrPath)) {
  const ovr = JSON.parse(fs.readFileSync(ovrPath, 'utf8'));
  const idsReales = new Set(TABLES.map(t => t.id));
  const huerfanos = Object.keys(ovr.byId || {}).filter(id => !idsReales.has(id));
  test(huerfanos.length === 0,
    `las ${Object.keys(ovr.byId || {}).length} correcciones de overrides.json apuntan a mesas que existen`,
    `overrides.json corrige mesas que no existen: ${huerfanos.join(', ')} — esas correcciones no se aplican y nadie lo nota`);
} else {
  avisa('no existe data/overrides.json');
}

/* ---------- 10. La pagina no se indexa ---------- */
console.log('\n\x1b[1m10. Indexacion\x1b[0m');
// Se comparte por link, no se publica al buscador. Si esta linea desaparece,
// 26 telefonos entran en Google sin que nadie se entere.
test(/name=["']robots["'][^>]*noindex/i.test(html),
  'index.html lleva <meta robots noindex>',
  'FALTA el <meta robots noindex>: los datos personales entrarian en Google');
// Isaac declaro el 2026-09-11 que el uso es interno. El aviso es la unica
// senal que recibe quien abre el link. Si desaparece, no queda ninguna.
test(/class="internal"/.test(html) && /Internal ISA roster/.test(html),
  'la pagina muestra el aviso de uso interno',
  'FALTA el aviso de uso interno: quien reciba el link no sabria que no debe reenviarlo');
test(fs.existsSync(path.join(root, 'robots.txt')) &&
     /Disallow:\s*\/\s*$/m.test(fs.readFileSync(path.join(root, 'robots.txt'), 'utf8')),
  'robots.txt bloquea a los rastreadores',
  'robots.txt no existe o no bloquea');

/* ---------- 11. Aviso de datos personales ---------- */
console.log('\n\x1b[1m11. Datos personales publicados\x1b[0m');
const conTel = TABLES.filter(t => t.phone).length;
const correos= TABLES.flatMap(t => t.emails).length;
avisa(`esta pagina publica ${correos} correos y ${conTel} telefonos de terceros en un sitio indexable por Google.`);
avisa('decision tomada por Isaac el 2026-09-11. Si algun host pide retirar su dato, hay que borrarlo de data/tables.js Y reescribir el historial de git.');

/* ---------- Resultado ---------- */
console.log('\n' + '─'.repeat(58));
if (fallos === 0) {
  console.log(`\x1b[32m\x1b[1mVERDE\x1b[0m  ${pruebas} pruebas, 0 fallos, ${avisos} avisos.`);
  process.exit(0);
} else {
  console.log(`\x1b[31m\x1b[1mROJO\x1b[0m   ${pruebas} pruebas, \x1b[31m${fallos} fallos\x1b[0m, ${avisos} avisos.`);
  process.exit(1);
}
