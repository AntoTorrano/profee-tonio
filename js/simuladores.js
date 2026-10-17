// Los 8 simuladores reales de "Documents/SEGUNDO año".
// Título = el <title> del HTML sin el prefijo "Guía N · Ej. N —" (vocabulario local).
// Descripción = frases textuales de la introducción de cada simulador.
// Tema = PROPUESTA de mapeo a la lista cerrada de 04-simuladores-modelo-de-datos.md.
// Portada = captura real del simulador (herramientas/portadas.js).
// Fecha = fecha de creación del archivo del simulador.
// Los 21 simuladores viven en la carpeta simuladores/ del proyecto, con el nombre del id.
// Los 8 primeros son copias de "Documents/SEGUNDO año"; los 13 del CBC se hicieron para el sitio (oct 2026)
// con la base común simuladores/_sim.js, en la paleta de la marca.
const RAIZ_SIMS = "simuladores/";
const urlSim = s => RAIZ_SIMS + s.id + ".html";

const SIMULADORES = [
  { id: "pendulo-galileo", fecha: "2026-08-19", tema: "Física",
    titulo: "El péndulo de Galileo: T ∝ √L",
    desc: "Simulación con la ecuación exacta θ̈ = −(g/L)·sin θ, integrada con Runge–Kutta 4. Los períodos que ves medidos salen de contar cruces por cero, no de la fórmula." },
  { id: "potencias-raices-complejos", fecha: "2026-08-19", tema: "Números complejos",
    titulo: "Potencias y raíces de números complejos",
    desc: "La forma polar convierte multiplicar en escalar + rotar. Elevar a la n eleva el módulo y multiplica el argumento. Movés los sliders y mirás la espiral que arman las potencias sucesivas." },
  { id: "tetraedro-simplex", fecha: "2026-08-23", tema: "Integrales",
    titulo: "El tetraedro x+y+z ≤ 1",
    desc: "Arrastrá para girar. Modo Cavalieri: cortes horizontales. Modo barra: la columna que barre la integral iterada." },
  { id: "resonancia-elastica-absorbente", fecha: "2026-08-22", tema: "Física",
    titulo: "Oscilador forzado: amplitud elástica y absorbente",
    desc: "Respuesta estacionaria de x(t) = A·sen(ωt) + B·cos(ωt) frente a una fuerza F₀·cos(ωt). Pasá el cursor por el gráfico principal para leer valores y ver el régimen estacionario en el tiempo." },
  { id: "fasores", fecha: "2026-08-19", tema: "Física",
    titulo: "Fasores: parte real e imaginaria en el tiempo",
    desc: "Cada función es un vector girando en el plano complejo. Su parte real es la sombra sobre el eje Re y su parte imaginaria la sombra sobre el eje Im." },
  { id: "masa-entre-dos-resortes", fecha: "2026-08-20", tema: "Física",
    titulo: "Masa entre dos resortes: longitudinal vs. transversal",
    desc: "Jugá con l₀/l y mirá cómo la pretensión, invisible en el modo longitudinal, controla todo el modo transversal." },
  { id: "regiones-tipo1-tipo2", fecha: "2026-08-23", tema: "Integrales",
    titulo: "Regiones de tipo 1 y tipo 2",
    desc: "Arrastrá los vértices para ver cómo cambian las descripciones. Todo se recalcula solo." },
  { id: "parametrizaciones-circunferencia", fecha: "2026-08-31", tema: "Geometría",
    titulo: "Parametrizaciones de la circunferencia",
    desc: "La misma curva C (la circunferencia de radio r), dos recorridos distintos. La curva nunca cambia: cambia la forma de recorrerla." },
  // ---------------------------------------------------------------- los 13 del CBC (17/10/2026)
  { id: "tiro-oblicuo", fecha: "2026-10-17", tema: "Física", titulo: "Tiro oblicuo",
    desc: "Cambiás el ángulo y la velocidad inicial y ves la parábola de verdad, con el alcance, la altura máxima y el tiempo de vuelo recalculados en vivo." },
  { id: "mruv", fecha: "2026-10-17", tema: "Física", titulo: "MRUV: posición, velocidad y área",
    desc: "x(t) arriba, v(t) abajo, y el área bajo la velocidad pintada: se ve por qué el desplazamiento es la integral de la velocidad." },
  { id: "energia-mecanica", fecha: "2026-10-17", tema: "Física", titulo: "Energía mecánica en una pista",
    desc: "Una bolita en un valle con barras de energía potencial, cinética y total. Sin rozamiento la suma no se mueve; con rozamiento, se pierde." },
  { id: "limite-epsilon-delta", fecha: "2026-10-17", tema: "Límites", titulo: "Límite por definición: ε y δ",
    desc: "Elegís ε, probás δ y el simulador te marca en amarillo dónde la curva se escapa. La definición formal deja de ser un trabalenguas." },
  { id: "secante-tangente", fecha: "2026-10-17", tema: "Derivadas", titulo: "De la secante a la tangente",
    desc: "Achicás h y la recta secante gira hasta pegarse a la tangente. La derivada aparece como lo que es: el límite de una pendiente." },
  { id: "estudio-de-funciones", fecha: "2026-10-17", tema: "Derivadas", titulo: "Estudio de funciones: f, f' y extremos",
    desc: "Una cúbica con sus máximos, mínimos e inflexión marcados, y f'(x) dibujada abajo para ver por qué los extremos están donde f' se anula." },
  { id: "sumas-de-riemann", fecha: "2026-10-17", tema: "Integrales", titulo: "Sumas de Riemann",
    desc: "Rectángulos por izquierda, derecha o punto medio. Subís n y la suma converge a la integral exacta, con el error a la vista." },
  { id: "sucesiones-convergencia", fecha: "2026-10-17", tema: "Series y sucesiones", titulo: "Convergencia de sucesiones",
    desc: "Los términos de aₙ, una franja de ancho ε alrededor del límite y el n₀ desde el cual todos quedan adentro. Y una que no converge." },
  { id: "polinomio-de-taylor", fecha: "2026-10-17", tema: "Series y sucesiones", titulo: "Polinomio de Taylor",
    desc: "Subís el grado y el polinomio copia cada vez más lejos a sen x, cos x, eˣ o ln(1 + x). Con el error medido en el punto que elijas." },
  { id: "transformaciones-de-funciones", fecha: "2026-10-17", tema: "Funciones", titulo: "Transformaciones de funciones",
    desc: "a·f(b(x − c)) + d con un slider por parámetro: estirar, comprimir, reflejar y correr la gráfica, y ver qué hace cada uno." },
  { id: "producto-escalar", fecha: "2026-10-17", tema: "Álgebra lineal", titulo: "Producto escalar y proyección",
    desc: "Arrastrás dos vectores y ves el ángulo, el producto escalar y la proyección de uno sobre el otro, como una sombra." },
  { id: "transformacion-lineal", fecha: "2026-10-17", tema: "Álgebra lineal", titulo: "Transformación lineal en el plano",
    desc: "Una matriz de 2×2 deforma toda la cuadrícula. El cuadrado unidad se vuelve un paralelogramo cuya área es el determinante." },
  { id: "sistemas-2x2", fecha: "2026-10-17", tema: "Álgebra lineal", titulo: "Sistemas de ecuaciones de 2×2",
    desc: "Cada ecuación es una recta: una solución si se cortan, ninguna si son paralelas, infinitas si son la misma. El determinante decide." },
];

function tarjeta(s, { hover = false, sinPortada = false } = {}) {
  const portada = sinPortada
    ? `<div class="portada sin-portada" data-tema="${s.tema}"><span class="sp-tema">${s.tema}</span><span class="sp-titulo">${s.titulo}</span></div>`
    : `<div class="portada"><img src="assets/portadas/${s.id}.webp" alt=""></div>`;
  return `<a class="tarjeta${hover ? " is-hover" : ""}" href="simulador.html?sim=${s.id}">
    ${portada}
    <div class="cuerpo-t">
      <span class="tema">${s.tema}</span>
      <h3 class="h4">${s.titulo}</h3>
      <p class="desc">${s.desc}</p>
      <span class="abrir">Abrir simulador →</span>
    </div>
  </a>`;
}
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fechaLarga = iso => { const [a, m, d] = iso.split("-"); return `${+d} de ${MESES[+m - 1]} de ${a}`; };
const sim = id => SIMULADORES.find(s => s.id === id);
