---
sistema: International Fest 2026 (mesas de ISA)
dominio: codigo
nivel_requerido: 5
nivel_actual: 2
verificar: npm run verificar
revisado: 2026-09-11
fuente: ~/.claude/verificacion/PROTOCOLO.md
---

# Verificación de: International Fest 2026 (mesas de ISA)

> Archivo generado. No lo edites a mano: cambia `~/.claude/verificacion/registro.tsv`
> y corre `bash ~/.claude/verificacion/propagar.sh`.

## Contrato de este sistema

| | |
|---|---|
| Nivel requerido | **5** |
| Nivel actual | **2** |
| Comando de verificación | `npm run verificar` |
| Última revisión | 2026-09-11 |

**Brecha abierta (2 de 5).** Clasificado el 2026-09-11. Requerido 5: la pagina publica 31 correos y 26 telefonos de 70 personas, asi que un error toca a un tercero (regla 1). USO INTERNO DECLARADO POR ISAAC EL 2026-09-11, pero entregado por link publico no listado: GitHub Pages no admite paginas privadas fuera de Enterprise y la cuenta jivalare-lab es gratuita. Isaac vio las cuatro opciones (Cloudflare Access con @loyno.edu, quitar los datos personales, dejarlo no listado, o bajarlo) y eligio dejarlo no listado. Mitigaciones: meta robots noindex, robots.txt y un aviso visible de uso interno; la puerta comprueba los tres. ESTA ES LA BRECHA PRINCIPAL Y ES DE DISENO, NO DE DESCUIDO. Tiene git, CI EN VERDE (Node 22) y las puertas pasan 20 estaticas + 15 de render con jsdom. Nivel real 2. El formulario se sincroniza solo cada 3 horas leyendo la hoja PRIVADA por cuenta de servicio (scripts/google.js, JWT con node:crypto, sin dependencias), y la Action ABRE UN PULL REQUEST en vez de publicar, para no romper la disciplina de nivel 2 de que Isaac apruebe el diff. Probado el 2026-09-11: sync.js reproduce las 28 mesas desde los fixtures, es idempotente, un pais nuevo cae solo en su continente, una segunda inscripcion del mismo pais se fusiona, 'Wakanda' aborta con codigo 1, y la Action sin configurar falla nombrando lo que falta (run 34632223899). SIN VERIFICAR TODAVIA: la lectura real contra Google, porque falta que Isaac cree la cuenta de servicio. PENDIENTE DE ISAAC: cuenta de servicio + secreto GOOGLE_CREDENCIALES + variable HOJA_ESTUDIANTES, y confirmar el CI para subir a 3. Para el 5 faltan rastro de auditoria, retirada probada a peticion de un host (incluye reescribir el historial de git) y alerta si la pagina se cae. Clasificacion inicial del agente, pendiente de que Isaac la confirme.

Mientras la brecha siga abierta, todo agente trabaja al **nivel 2**:
diff completo revisado por Isaac antes de integrar, sin excepciones, por
rápido que pueda escribir. La puerta que manda es la que existe.

Este sistema es de riesgo alto. **Cerrar la brecha va antes que cualquier
función nueva.** No construyas encima de lo que no puedes verificar.

## Protocolo de verificación

Fuente canónica: `~/.claude/verificacion/PROTOCOLO.md`.
Por qué el sistema es así, qué se descartó y qué queda por hacer:
`~/.claude/verificacion/BITACORA.md`. Cómo operarlo y extenderlo: `README.md`.
Este bloque se propaga solo. No lo edites aquí, edita la fuente y corre
`bash ~/.claude/verificacion/propagar.sh`.

### Para qué existe

Un agente de IA puede escribir código o notas más rápido de lo que Isaac puede
leerlos. El único límite honesto a esa velocidad es cuánta verificación
automática existe. Este protocolo fija ese límite por escrito, sistema por
sistema, para que ningún agente vaya más rápido de lo que su red de seguridad
aguanta, y para que ningún sistema cargue con más ceremonia de la que su riesgo
justifica.

### Los dos números

Todo sistema declara dos:

- **`nivel_requerido`**: el que exige su consecuencia. Lo fija el daño posible,
  no la ambición ni el cariño que se le tenga al proyecto.
- **`nivel_actual`**: el que su verificación real sostiene hoy. Se mide, no se
  desea. Si la prueba no existe o no corre, no cuenta.

La distancia entre los dos es la cola de trabajo. Nada más.

### Prueba de consecuencia, para fijar `nivel_requerido`

Responde en orden y quédate con el primer sí.

1. ¿Corre sin nadie mirando, o un error toca a un tercero, dinero, salud, un
   documento legal o datos de un cliente? → **5**
2. ¿Alguien depende del resultado y un error podría pasar inadvertido? → **4**
3. ¿Es público o compartido, y un error se ve pero se arregla? → **3**
4. ¿Es trabajo interno y un error solo cuesta tu propio tiempo? → **2**
5. ¿Es desechable? → **1**

La regla 1 no admite matices. Algo que se ejecuta solo es nivel 5 aunque sea
pequeño, aunque sea personal, aunque «solo mande un mensaje».

### Los niveles

**Nivel 1, borrador.** El agente propone, Isaac lee cada línea.
Puerta: ninguna automática, pero el cambio se ejecuta al menos una vez.

**Nivel 2, ejecutor.** El agente escribe, Isaac revisa el diff completo antes de
integrar.
Puerta: control de versiones + el cambio corre + Isaac aprueba el diff.
Piso duro: sin git no se pasa de nivel 1. Nunca.

**Nivel 3, colaborador verificado.** Isaac revisa el resumen, no cada línea.
Puerta en código: typecheck, build y lint corriendo en CI en cada push. Trabajo
en rama, no directo a `main`.
Puerta en vault: los enlaces resuelven, todo campo consultado por Dataview
existe con ese nombre exacto, y no se creó una segunda fuente de verdad.

**Nivel 4, operador.** El agente trabaja solo en una rama y la puerta decide si
entra.
Puerta: todo lo de nivel 3, más pruebas de las reglas críticas (las que si
fallan devuelven un dato falso en vez de un error), más una comprobación de
arquitectura o de esquema, más una vista previa antes de integrar.
Regla añadida: ninguna ruta de error puede quedarse callada.

**Nivel 5, autónomo con garantía.** El agente publica sin que Isaac mire.
Puerta: todo lo de nivel 4, más prueba contra la dependencia real y no simulada,
más idempotencia verificada corriendo el proceso dos veces, más una alerta que
llega a Isaac cuando falla, más rastro de auditoría, más una reversión probada.

### Regla de eficiencia, en las dos direcciones

- **No inviertas por encima del requerido.** Montar CI, pruebas y alertas en un
  sistema de nivel 2 es gastar el recurso escaso en el lugar equivocado.
- **No operes por encima del actual.** Si `nivel_actual` es 2, el agente trabaja
  como nivel 2 aunque el proyecto exija 5. La velocidad la fija la puerta que
  existe, no la que debería existir. Escribir a ritmo de nivel 4 en un repo con
  puertas de nivel 1 es la forma más cara de trabajar que hay.
- **Donde `nivel_requerido` es 4 o 5, cerrar la brecha va antes que cualquier
  función nueva.** No se construye encima de algo que no se puede verificar.

### Puerta de salida, obligatoria en toda tarea

1. **Declara.** Lee el `VERIFICACION.md` del sistema antes de tocar nada. Si no
   existe, clasifícalo con la prueba de consecuencia y créalo primero.
2. **Ejecuta.** Corre el comando de verificación que el nivel actual exige y
   pega su salida real en el informe.
3. **No afirmes sin correr.** «Verificado», «funciona» y «listo» solo se
   escriben con la salida del comando delante. El handoff de otro agente no es
   evidencia: se comprueba.
4. **No falles en silencio.** Lo que no se pudo verificar se dice con nombre
   propio, en la respuesta, no en un log.
5. **No subas de nivel por tu cuenta.** Cerrar una brecha cambia el contrato del
   sistema y lo aprueba Isaac.
6. **Registra.** `nivel_actual` se actualiza solo cuando la puerta nueva ya
   corrió en verde una vez.

### Prohibiciones, aprendidas de esta máquina

- **`.bak` no es control de versiones.** Un `archivo.py.bak-antes-de-x` es la
  señal de que falta `git init`.
- **Un log que nadie lee no es una alerta.** Si el único rastro de un fallo está
  en un `.err.log`, el sistema falla en silencio por definición.
- **Un dato simulado no se presenta nunca como medido.** Si el valor es
  estimado, la interfaz lo dice.
- **Un Dataview vacío se investiga, no se asume correcto.** Casi siempre es un
  campo mal escrito ocultando datos que sí existen.
- **Una función sin prueba puede llevar semanas sin hacer nada** y nadie se
  entera. Ya pasó, con seis a la vez.
