/* Lee una hoja de Google SIN publicarla a la web.
 *
 * Usa una cuenta de servicio: un "usuario robot" de Google al que le compartes
 * la hoja como lector. La hoja sigue privada; solo ese robot y quien tu digas
 * pueden verla.
 *
 * Firma el JWT con node:crypto, asi que no hace falta ninguna dependencia.
 */
'use strict';

const crypto = require('crypto');

const b64url = (b) => Buffer.from(b).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/* El fallo numero uno al guardar el JSON en un secreto: los saltos de linea
   de la clave quedan como \n literales y OpenSSL escupe un error ilegible. */
function clavePrivada(k) {
  if (typeof k !== 'string') throw new Error('private_key no es texto');
  const limpia = k.includes('\\n') && !k.includes('\n')
    ? k.replace(/\\n/g, '\n')
    : k;
  if (!/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(limpia)) {
    throw new Error('a private_key le falta la linea -----BEGIN PRIVATE KEY-----');
  }
  return limpia;
}

/* Intercambia la credencial por un token de acceso de una hora. */
async function token(creds, scope) {
  const ahora = Math.floor(Date.now() / 1000);
  const cabecera = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const cuerpo = b64url(JSON.stringify({
    iss: creds.client_email,
    scope,
    aud: creds.token_uri || 'https://oauth2.googleapis.com/token',
    iat: ahora,
    exp: ahora + 3600
  }));

  let firma;
  try {
    firma = crypto.createSign('RSA-SHA256')
      .update(`${cabecera}.${cuerpo}`)
      .sign(clavePrivada(creds.private_key));
  } catch (e) {
    throw new Error(
      'no se pudo firmar con la clave privada de la cuenta de servicio.\n' +
      `  Node dijo: ${e.message}\n` +
      '  Casi siempre es una de estas dos:\n' +
      '   1. Al pegar el JSON en el secreto, los saltos de linea se volvieron \\n literales.\n' +
      '      Pega el archivo JSON completo, tal cual lo descargaste, sin editarlo.\n' +
      '   2. Copiaste solo un trozo de la clave. Tiene que ir desde\n' +
      '      -----BEGIN PRIVATE KEY----- hasta -----END PRIVATE KEY----- incluidos.'
    );
  }

  const jwt = `${cabecera}.${cuerpo}.${b64url(firma)}`;

  const r = await fetch(creds.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) {
    throw new Error(
      `Google rechazo la credencial (${r.status}). ${d.error_description || d.error || ''}\n` +
      '  Revisa que la cuenta de servicio exista y que la Google Sheets API este habilitada.'
    );
  }
  return d.access_token;
}

const api = async (url, tk, que) => {
  const r = await fetch(url, { headers: { authorization: 'Bearer ' + tk } });
  if (r.status === 403) {
    throw new Error(
      `Google dijo 403 al pedir ${que}.\n` +
      '  Casi siempre es que la hoja NO esta compartida con el correo de la cuenta de servicio.\n' +
      '  Abre la hoja, dale a Compartir, y agregalo como Lector.'
    );
  }
  if (!r.ok) throw new Error(`Google dijo ${r.status} al pedir ${que}`);
  return r.json();
};

/* Del enlace que copias del navegador saca el id y la pestaña. */
function partesDeUrl(url) {
  const id = (url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/) || [])[1];
  const gid = (url.match(/[#&?]gid=(\d+)/) || [])[1];
  if (!id) throw new Error(`no se reconoce el enlace de Google Sheets: ${url}`);
  return { id, gid: gid == null ? null : Number(gid) };
}

/* Devuelve las filas como matriz, la misma forma que da el CSV. */
async function leeHoja(url, credenciales) {
  const { id, gid } = partesDeUrl(url);
  const creds = typeof credenciales === 'string' ? JSON.parse(credenciales) : credenciales;
  if (!creds || !creds.client_email || !creds.private_key) {
    throw new Error('la credencial de la cuenta de servicio no tiene client_email o private_key');
  }

  const tk = await token(creds, 'https://www.googleapis.com/auth/spreadsheets.readonly');

  // El enlace trae un gid numerico; la API pide el nombre de la pestaña.
  const meta = await api(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=sheets.properties(sheetId,title)`,
    tk, 'la lista de pestañas');

  const pestanas = (meta.sheets || []).map(s => s.properties);
  if (!pestanas.length) throw new Error('la hoja no tiene ninguna pestaña');

  const elegida = gid == null
    ? pestanas[0]
    : pestanas.find(p => p.sheetId === gid);
  if (!elegida) {
    throw new Error(
      `la hoja no tiene ninguna pestaña con gid=${gid}. Las que tiene: ` +
      pestanas.map(p => `"${p.title}" (gid=${p.sheetId})`).join(', ')
    );
  }

  const datos = await api(
    `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/` +
    encodeURIComponent(elegida.title) + '?valueRenderOption=UNFORMATTED_VALUE',
    tk, `la pestaña "${elegida.title}"`);

  const filas = (datos.values || []).filter(f => f.some(c => String(c ?? '').trim() !== ''));
  if (!filas.length) throw new Error(`la pestaña "${elegida.title}" vino vacia`);

  // La API recorta las celdas vacias del final: rellenar para que las columnas
  // sigan cuadrando con el encabezado.
  const ancho = filas[0].length;
  return {
    pestana: elegida.title,
    filas: filas.map(f => {
      const r = f.map(c => (c == null ? '' : String(c)));
      while (r.length < ancho) r.push('');
      return r;
    })
  };
}

module.exports = { leeHoja, partesDeUrl };
