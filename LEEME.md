# Sitio de Profee Tonio

Sitio estático: HTML, CSS y JavaScript, sin build. Lo que hay en esta carpeta es exactamente lo que se publica.

- `index.html` — inicio · `biblioteca.html` — los simuladores · `simulador.html?sim=<id>` — la ficha de cada uno
- `clases.html` · `profesor.html?p=tonio|simon` · `404.html`
- `simuladores/` — los 21 simuladores (cada uno funciona solo; `_sim.js` y `_sim.css` son la base de los nuevos)
- `js/simuladores.js` — la lista de simuladores (título, tema, descripción, fecha). Para agregar uno, una línea acá + su `.html` en `simuladores/` + su portada en `assets/portadas/<id>.webp`
- `js/profesores.js` — datos de cada profesor · `vercel.json` — direcciones sin `.html`

Esta carpeta se genera desde `../diseno/` con `python ../diseno/herramientas/construir_sitio.py`.
