/* Nombre de pais -> codigo ISO y region.
   La bandera emoji NO se guarda: se deriva del ISO, asi no puede quedar
   desincronizada. Las claves van normalizadas (sin acentos, minusculas). */
'use strict';

const REGION = {
  NA: 'north-america', SA: 'south-america', EU: 'europe',
  AS: 'asia', AF: 'africa', OC: 'oceania'
};

/* iso: [region, ...nombres y alias tal como los escribe la gente] */
const PAISES = [
  // --- America del Norte, Central y el Caribe ---
  ['us', REGION.NA, 'united states', 'usa', 'united states of america', 'u s a', 'america'],
  ['ca', REGION.NA, 'canada'],
  ['mx', REGION.NA, 'mexico', 'méxico'],
  ['gt', REGION.NA, 'guatemala'],
  ['bz', REGION.NA, 'belize'],
  ['sv', REGION.NA, 'el salvador', 'salvador'],
  ['hn', REGION.NA, 'honduras'],
  ['ni', REGION.NA, 'nicaragua'],
  ['cr', REGION.NA, 'costa rica'],
  ['pa', REGION.NA, 'panama', 'panamá'],
  ['cu', REGION.NA, 'cuba'],
  ['do', REGION.NA, 'dominican republic', 'republica dominicana'],
  ['ht', REGION.NA, 'haiti', 'haití'],
  ['jm', REGION.NA, 'jamaica'],
  ['pr', REGION.NA, 'puerto rico'],
  ['tt', REGION.NA, 'trinidad and tobago', 'trinidad'],
  ['bs', REGION.NA, 'bahamas'],
  ['bb', REGION.NA, 'barbados'],

  // --- America del Sur ---
  ['br', REGION.SA, 'brazil', 'brasil'],
  ['ar', REGION.SA, 'argentina'],
  ['cl', REGION.SA, 'chile'],
  ['co', REGION.SA, 'colombia'],
  ['pe', REGION.SA, 'peru', 'perú'],
  ['ec', REGION.SA, 'ecuador'],
  ['ve', REGION.SA, 'venezuela'],
  ['bo', REGION.SA, 'bolivia'],
  ['py', REGION.SA, 'paraguay'],
  ['uy', REGION.SA, 'uruguay'],
  ['gy', REGION.SA, 'guyana'],
  ['sr', REGION.SA, 'suriname'],

  // --- Europa ---
  ['gb', REGION.EU, 'united kingdom', 'uk', 'england', 'great britain', 'scotland', 'wales'],
  ['ie', REGION.EU, 'ireland'],
  ['fr', REGION.EU, 'france'],
  ['de', REGION.EU, 'germany', 'deutschland', 'deutschland (germany)'],
  ['es', REGION.EU, 'spain', 'españa', 'espana'],
  ['pt', REGION.EU, 'portugal'],
  ['it', REGION.EU, 'italy', 'italia'],
  ['ch', REGION.EU, 'switzerland', 'suiza', 'schweiz'],
  ['at', REGION.EU, 'austria', 'osterreich', 'österreich'],
  ['nl', REGION.EU, 'netherlands', 'holland'],
  ['be', REGION.EU, 'belgium'],
  ['lu', REGION.EU, 'luxembourg'],
  ['dk', REGION.EU, 'denmark'],
  ['se', REGION.EU, 'sweden'],
  ['no', REGION.EU, 'norway'],
  ['fi', REGION.EU, 'finland'],
  ['is', REGION.EU, 'iceland'],
  ['pl', REGION.EU, 'poland'],
  ['cz', REGION.EU, 'czechia', 'czech republic'],
  ['sk', REGION.EU, 'slovakia'],
  ['hu', REGION.EU, 'hungary'],
  ['ro', REGION.EU, 'romania'],
  ['bg', REGION.EU, 'bulgaria'],
  ['gr', REGION.EU, 'greece'],
  ['hr', REGION.EU, 'croatia'],
  ['rs', REGION.EU, 'serbia'],
  ['si', REGION.EU, 'slovenia'],
  ['ba', REGION.EU, 'bosnia and herzegovina', 'bosnia'],
  ['al', REGION.EU, 'albania'],
  ['ua', REGION.EU, 'ukraine'],
  ['lv', REGION.EU, 'latvia'],
  ['lt', REGION.EU, 'lithuania'],
  ['ee', REGION.EU, 'estonia'],
  ['mt', REGION.EU, 'malta'],
  ['cy', REGION.EU, 'cyprus'],
  // Transcontinentales: se agrupan en Europa para la feria.
  ['tr', REGION.EU, 'turkiye', 'türkiye', 'turkey'],
  ['ru', REGION.EU, 'russia'],
  ['ge', REGION.EU, 'georgia'],
  ['am', REGION.EU, 'armenia'],
  ['az', REGION.EU, 'azerbaijan'],

  // --- Asia ---
  ['cn', REGION.AS, 'china'],
  ['jp', REGION.AS, 'japan'],
  ['kr', REGION.AS, 'south korea', 'korea', 'republic of korea'],
  ['in', REGION.AS, 'india'],
  ['np', REGION.AS, 'nepal'],
  ['pk', REGION.AS, 'pakistan'],
  ['bd', REGION.AS, 'bangladesh'],
  ['lk', REGION.AS, 'sri lanka'],
  ['vn', REGION.AS, 'vietnam', 'viet nam'],
  ['th', REGION.AS, 'thailand'],
  ['ph', REGION.AS, 'philippines'],
  ['id', REGION.AS, 'indonesia'],
  ['my', REGION.AS, 'malaysia'],
  ['sg', REGION.AS, 'singapore'],
  ['kh', REGION.AS, 'cambodia'],
  ['mm', REGION.AS, 'myanmar', 'burma'],
  ['tw', REGION.AS, 'taiwan'],
  ['hk', REGION.AS, 'hong kong'],
  ['mn', REGION.AS, 'mongolia'],
  ['kz', REGION.AS, 'kazakhstan'],
  ['uz', REGION.AS, 'uzbekistan'],
  ['af', REGION.AS, 'afghanistan'],
  ['ir', REGION.AS, 'iran'],
  ['iq', REGION.AS, 'iraq'],
  ['sa', REGION.AS, 'saudi arabia'],
  ['ae', REGION.AS, 'united arab emirates', 'uae'],
  ['qa', REGION.AS, 'qatar'],
  ['kw', REGION.AS, 'kuwait'],
  ['jo', REGION.AS, 'jordan'],
  ['lb', REGION.AS, 'lebanon'],
  ['sy', REGION.AS, 'syria'],
  ['il', REGION.AS, 'israel'],
  ['ps', REGION.AS, 'palestine'],

  // --- Africa ---
  ['za', REGION.AF, 'south africa'],
  ['ng', REGION.AF, 'nigeria'],
  ['gh', REGION.AF, 'ghana'],
  ['ke', REGION.AF, 'kenya'],
  ['tz', REGION.AF, 'tanzania'],
  ['ug', REGION.AF, 'uganda'],
  ['et', REGION.AF, 'ethiopia'],
  ['eg', REGION.AF, 'egypt'],
  ['ma', REGION.AF, 'morocco'],
  ['dz', REGION.AF, 'algeria'],
  ['tn', REGION.AF, 'tunisia'],
  ['ly', REGION.AF, 'libya'],
  ['sn', REGION.AF, 'senegal'],
  ['ci', REGION.AF, 'ivory coast', "cote d'ivoire"],
  ['cm', REGION.AF, 'cameroon'],
  ['zw', REGION.AF, 'zimbabwe'],
  ['zm', REGION.AF, 'zambia'],
  ['rw', REGION.AF, 'rwanda'],
  ['bw', REGION.AF, 'botswana'],
  ['ao', REGION.AF, 'angola'],
  ['mz', REGION.AF, 'mozambique'],
  ['sd', REGION.AF, 'sudan'],
  ['so', REGION.AF, 'somalia'],
  ['cd', REGION.AF, 'democratic republic of the congo', 'drc', 'congo'],

  // --- Oceania ---
  ['au', REGION.OC, 'australia'],
  ['nz', REGION.OC, 'new zealand'],
  ['fj', REGION.OC, 'fiji'],
  ['pg', REGION.OC, 'papua new guinea'],
  ['ws', REGION.OC, 'samoa'],
  ['to', REGION.OC, 'tonga']
];

/* Ciudades de los programas de estudios en el extranjero. Una mesa que dice
   "Summer in Prague/Vienna/Budapest" tiene que caer en algun sitio. */
const CIUDADES = [
  ['cz', 'prague', 'praha'], ['at', 'vienna', 'wien'], ['hu', 'budapest'],
  ['it', 'rome', 'florence', 'venice', 'milan'], ['es', 'madrid', 'barcelona', 'seville', 'granada'],
  ['fr', 'paris', 'lyon', 'nice'], ['gb', 'london', 'oxford', 'cambridge', 'edinburgh'],
  ['de', 'berlin', 'munich'], ['ie', 'dublin'], ['nl', 'amsterdam'], ['gr', 'athens'],
  ['pt', 'lisbon'], ['be', 'brussels'], ['jp', 'tokyo', 'kyoto'], ['kr', 'seoul'],
  ['cn', 'beijing', 'shanghai'], ['ar', 'buenos aires'], ['pe', 'cusco', 'lima'],
  ['cr', 'san jose'], ['mx', 'mexico city', 'oaxaca'], ['za', 'cape town'],
  ['au', 'sydney', 'melbourne'], ['ma', 'rabat'], ['in', 'delhi', 'mumbai']
];

/* Quita acentos, parentesis, puntuacion y espacios de mas. */
function normaliza(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[().,/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const INDICE = new Map();
for (const [iso, region, ...nombres] of PAISES) {
  for (const n of nombres) INDICE.set(normaliza(n), { iso, region });
}
// Las ciudades heredan la region de su pais. No pisan un nombre de pais.
const REGION_DE = new Map(PAISES.map(([iso, region]) => [iso, region]));
for (const [iso, ...ciudades] of CIUDADES) {
  for (const c of ciudades) {
    const k = normaliza(c);
    if (!INDICE.has(k)) INDICE.set(k, { iso, region: REGION_DE.get(iso) });
  }
}

/* 'hn' -> 🇭🇳 . Se deriva, no se escribe a mano. */
function isoAEmoji(iso) {
  return String.fromCodePoint(
    ...[...iso.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

/* Busca por nombre exacto y, si falla, por el nombre mas largo contenido
   en el texto. Asi "Summer in Prague/Vienna/Budapest" encuentra algo. */
function busca(texto) {
  const n = normaliza(texto);
  if (!n) return null;
  if (INDICE.has(n)) return { ...INDICE.get(n), emoji: isoAEmoji(INDICE.get(n).iso), exacto: true };

  let mejor = null;
  for (const [nombre, dato] of INDICE) {
    if (nombre.length < 4) continue;
    if (n.includes(nombre) && (!mejor || nombre.length > mejor.nombre.length)) {
      mejor = { nombre, dato };
    }
  }
  if (mejor) return { ...mejor.dato, emoji: isoAEmoji(mejor.dato.iso), exacto: false };
  return null;
}

module.exports = { PAISES, CIUDADES, REGION, normaliza, isoAEmoji, busca, INDICE };
