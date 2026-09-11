# Verificación

**Sistema:** International Fest 2026 — mesas registradas (sitio público de ISA)
**Dominio:** código
**Clasificado:** 2026-09-11

## Los dos números

- **`nivel_requerido`: 5**
- **`nivel_actual`: 2**

### Por qué 5

La primera intención fue 3 por la regla «es público y compartido, y un error se
ve pero se arregla». No se sostiene. La página publica **31 correos y 26
teléfonos personales de 71 estudiantes y profesores** en un sitio indexable por
Google. Eso activa la regla 1 de la prueba de consecuencia: *un error toca a un
tercero*. Un dato equivocado aquí no es un error propio, es el teléfono de otra
persona mal puesto en internet, y borrarlo del sitio no lo borra del historial
de git ni del caché de Google.

Isaac tomó esta decisión de forma explícita el 2026-09-11, después de que el
agente planteara la alternativa de publicar sin teléfonos. Queda escrita aquí
para que ningún agente futuro la trate como un descuido.

### Por qué el actual es 2

Tiene git desde el primer commit y `node verificar.js` pasa en verde en local.
Eso es exactamente nivel 2. Se trabaja como **nivel 2**: Isaac revisa el diff
completo antes de integrar.

## Verificar con

```
node verificar.js
```

## Qué prueba la puerta

Las reglas que, si fallan, devuelven una página en blanco o un dato falso en vez
de un error visible:

1. Los cinco archivos del sitio existen.
2. `data/tables.js` evalúa sin error.
3. Por cada mesa: id único, **país sin repetir** (dos mesas de South Korea ya
   pasó una vez), región existente, al menos un correo bien formado, código ISO
   válido para la bandera, emoji de respaldo, teléfono en formato E.164.
4. **El puente HTML ↔ JS**: los 12 ids que `app.js` busca con `getElementById`
   existen en `index.html`. Si uno se renombra, la página carga en blanco y el
   navegador no da ningún error.
5. Los enlaces locales del HTML resuelven.
6. Las seis regiones tienen color propio, válido y distinto entre sí.
7. **Los números del pie contra los datos reales.** El pie dice «28 tables from
   26 countries and 2 programs» a mano; si los datos cambian y el pie no, la
   página miente sin dar error.
8. Las peticiones de mesas contiguas apuntan a mesas que existen.
9. Avisa, cada vez que corre, de cuántos datos personales se están publicando.

## Brecha abierta, de 2 a 5

En orden:

- **A 3:** CI corriendo la puerta en cada push. Ya está escrito en
  `.github/workflows/verificar.yml`; sube a 3 cuando Isaac lo vea en verde.
- **A 4:** comprobación de que el HTML renderizado dibuja las 28 tarjetas (hoy
  la puerta valida los datos y el puente, no el resultado en pantalla), y vista
  previa antes de integrar.
- **A 5:** rastro de auditoría de qué dato personal se publicó y cuándo, un
  procedimiento probado de retirada a petición de un host (incluye reescribir el
  historial de git), y aviso a Isaac si la página se cae.

**Mientras la brecha siga abierta, se trabaja como nivel 2.**

## Origen de los datos

- `scripts/fuente.xlsx` — «International Festival Sign Up Fall 2026 (Responses)»,
  descargado el 2026-09-11. 27 inscripciones.
- Las dos mesas de programas (Prague/Vienna/Budapest e Iceland) las pasó Isaac a
  mano el 2026-09-11 desde un segundo formulario.
- South Korea son dos inscripciones fusionadas en una mesa.

## Hallazgos pendientes de confirmar con ISA

- **Venezuela**: el correo preferido del formulario dice `ppineirl@my.loyno.edu`,
  una letra distinto de la cuenta Loyola `ppineiro@my.loyno.edu`. El sitio usa la
  cuenta Loyola. Confirmar con Pablo Piñeiro.
- **Ecuador**: la inscripción se marcó «submitting on behalf of someone else who
  will be present».
- **Nepal**: el teléfono llegó como `+(504) 5053896`. Se interpretó como número
  de New Orleans, `+1 504 505 3896`. Confirmar.
- **Shivika Sharma** aparece a la vez en la mesa de India y como host de Nepal.

Protocolo completo: `~/.claude/verificacion/PROTOCOLO.md`
