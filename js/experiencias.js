// ==========================================================================
// Experiencias de alumnos: las deja cualquiera desde /clases#experiencias, se guardan en Supabase
// como PENDIENTES y aparecen recién cuando Tonio las aprueba (Table Editor → experiencias → "aprobado").
// Las reglas de la base están en supabase/experiencias.sql.
//
// En la compu (herramientas/servir.js y las pruebas) la conexión se cambia por la base local de prueba
// (/api-local, PGlite con las mismas reglas): probar nunca ensucia la base real.
// ==========================================================================
const SUPABASE = {
  url: "https://obpzkefmmytjjchfdzbb.supabase.co",
  clave: "sb_publishable_qn1efgdWqtiC_SINoj727g_SNBvvjbO",   // la clave PÚBLICA: es pública por diseño, las reglas de la base la limitan
};
const API_EXP = (SUPABASE.url ? SUPABASE.url.replace(/\/$/, "") + "/rest/v1" : "/api-local/rest/v1") + "/experiencias";
const cabecerasExp = () => {
  const c = { "content-type": "application/json", apikey: SUPABASE.clave || "local" };
  if (SUPABASE.clave && !SUPABASE.clave.startsWith("sb_")) c.authorization = "Bearer " + SUPABASE.clave;   // claves anon viejas (JWT)
  return c;
};

// ---------------------------------------------------------------- comentarios de los videos (home)
// Capturas REALES de comentarios públicos (las juntó Cowork el 19/10/2026; índice en material/comentarios-videos/indice.md).
// SIN foto ni nombre (decisión de Tonio): sólo el comentario y los me gusta.
// Instagram: link directo al comentario (lo abre resaltado; links en material/comentarios-videos/links-comentarios.md).
// TikTok no permite linkear un comentario: el botón lleva al video.
const CAPTURAS = [
  { img: "assets/comentarios/10-instagram.webp", w: 500, h: 286, fondo: "#F3F5F7", red: "Instagram",
    texto: "El LABURAZO que veo atrás de estos reels! Me encanta!!! Me sentí como viendo un 3blue1brown con acento porteño 😅 Acá nueva seguidora bancando!", video: "https://www.instagram.com/profee_tonio/reel/DcRUKlwJu5m/", comentario: "https://www.instagram.com/p/DcRUKlwJu5m/c/18104030974918422/", tema: "Máximos y mínimos — derivada nula en picos y valles" },
  { img: "assets/comentarios/15-tiktok.webp", w: 672, h: 128, fondo: "#121212", red: "TikTok",
    texto: "Lástima que los profes no apliquen la teoría usando estas cosas más gráficas, genio!!!", video: "https://www.tiktok.com/@profee.tonio/video/7692157326802849076", tema: "Derivadas — la recta tangente" },
  { img: "assets/comentarios/18-tiktok.webp", w: 672, h: 137, fondo: "#121212", red: "TikTok",
    texto: "Soy profesor de matemática y eres muy bueno explicando 👍🏼", video: "https://www.tiktok.com/@profee.tonio/video/7693691015038799110", tema: "Integrales — el área bajo la curva" },
  { img: "assets/comentarios/07-instagram.webp", w: 499, h: 178, fondo: "#F3F5F7", red: "Instagram",
    texto: "Sos crack. Soy ingeniero y me encantan tus explicaciones sencillas", video: "https://www.instagram.com/profee_tonio/reel/DczlR3ApXn3/", comentario: "https://www.instagram.com/p/DczlR3ApXn3/c/17961081714078147/", tema: "Límites — lím(x→0) 1/x² = ∞" },
  { img: "assets/comentarios/01-instagram.webp", w: 492, h: 164, fondo: "#F3F5F7", red: "Instagram",
    texto: "Entendí más acá que en la clase de 70 minutos", video: "https://www.instagram.com/profee_tonio/reel/DbrDcoypRIX/", comentario: "https://www.instagram.com/p/DbrDcoypRIX/c/18127161244754904/", tema: "Derivadas — de la secante a la tangente" },
  { img: "assets/comentarios/04-instagram.webp", w: 499, h: 292, fondo: "#F3F5F7", red: "Instagram",
    texto: "Hola 👋 Tonio.\nExelente tu explicación.\nMuchas Gracias.\nRecordé lo que estaba archivado en mi cerebro.", video: "https://www.instagram.com/profee_tonio/reel/Dd4mv6VBiMh/", comentario: "https://www.instagram.com/p/Dd4mv6VBiMh/c/18173943463450535/", tema: "De dónde sale la tabla de derivadas" },
  { img: "assets/comentarios/03-instagram.webp", w: 499, h: 179, fondo: "#F3F5F7", red: "Instagram",
    texto: "1 semestre de mi vida en un minuto, Muchas graxs", video: "https://www.instagram.com/profee_tonio/reel/DbrDcoypRIX/", comentario: "https://www.instagram.com/p/DbrDcoypRIX/c/18087459959660789/", tema: "Derivadas — de la secante a la tangente" },
  { img: "assets/comentarios/02-instagram.webp", w: 491, h: 167, fondo: "#F3F5F7", red: "Instagram",
    texto: "Es la mejor explicación de derivadas que he visto.", video: "https://www.instagram.com/profee_tonio/reel/DbrDcoypRIX/", comentario: "https://www.instagram.com/p/DbrDcoypRIX/c/17931410799141607/", tema: "Derivadas — de la secante a la tangente" },
  { img: "assets/comentarios/11-instagram.webp", w: 500, h: 214, fondo: "#F3F5F7", red: "Instagram",
    texto: "Clarísimo! Hoy vimos funciones en Análisis I y vos lo resumiste perfecto y simple. Seguido!", video: "https://www.instagram.com/profee_tonio/reel/Dbwhn_PJCdK/", comentario: "https://www.instagram.com/p/Dbwhn_PJCdK/c/18145426717492135/", tema: "Funciones cuadráticas y parábolas" },
  { img: "assets/comentarios/06-instagram.webp", w: 499, h: 142, fondo: "#F3F5F7", red: "Instagram",
    texto: "X fin lo entendí. Ahora, Integrales", video: "https://www.instagram.com/profee_tonio/reel/Dd4mv6VBiMh/", comentario: "https://www.instagram.com/p/Dd4mv6VBiMh/c/18171762454454169/", tema: "De dónde sale la tabla de derivadas" },
  { img: "assets/comentarios/05-instagram.webp", w: 499, h: 178, fondo: "#F3F5F7", red: "Instagram",
    texto: "Mañana con quiz teórico me salvaste genio😭", video: "https://www.instagram.com/profee_tonio/reel/Dd4mv6VBiMh/", comentario: "https://www.instagram.com/p/Dd4mv6VBiMh/c/18180046597430418/", tema: "De dónde sale la tabla de derivadas" },
  { img: "assets/comentarios/21-tiktok.webp", w: 350, h: 109, fondo: "#121212", red: "TikTok",
    texto: "Che que fácil lo entendí!", video: "https://www.tiktok.com/@profee.tonio/video/7692849869635030293", tema: "Integración por partes" },
  { img: "assets/comentarios/16-tiktok.webp", w: 583, h: 164, fondo: "#121212", red: "TikTok",
    texto: "las animaciones están de 10 y la explicación de 10\nasí que 10\n😅👍🏽", video: "https://www.tiktok.com/@profee.tonio/video/7692157326802849076", tema: "Derivadas — la recta tangente" },
  { img: "assets/comentarios/09-instagram.webp", w: 529, h: 193, fondo: "#F3F5F7", red: "Instagram",
    texto: "@profee_tonio Muchas graciasss profe, con esto pude hacer que mi profe me diera la razón jajaja", video: "https://www.instagram.com/profee_tonio/reel/Dc4AyFbwkjK/", comentario: "https://www.instagram.com/p/Dc4AyFbwkjK/c/17926809207181431/", tema: "Teorema de Pitágoras — demostración visual" },
  { img: "assets/comentarios/12-instagram.webp", w: 499, h: 250, fondo: "#F3F5F7", red: "Instagram",
    texto: "Excelente visión, es bueno saber que el recambio docente sigue en buenas manos. Adelante👏👏👏👏👏👏👏👏", video: "https://www.instagram.com/profee_tonio/reel/Dbwhn_PJCdK/", comentario: "https://www.instagram.com/p/Dbwhn_PJCdK/c/18385958500160530/", tema: "Funciones cuadráticas y parábolas" },
  { img: "assets/comentarios/22-tiktok.webp", w: 271, h: 111, fondo: "#121212", red: "TikTok",
    texto: "😳 Lo entendí", video: "https://www.tiktok.com/@profee.tonio/video/7692849869635030293", tema: "Integración por partes" },
  { img: "assets/comentarios/13-instagram.webp", w: 499, h: 147, fondo: "#F3F5F7", red: "Instagram",
    texto: "mi profe favorito 😍", video: "https://www.instagram.com/profee_tonio/reel/Dbl29PZp1g2/", comentario: "https://www.instagram.com/p/Dbl29PZp1g2/c/18225925414322875/", tema: "Funciones — notación f(x)" },
  { img: "assets/comentarios/14-instagram.webp", w: 499, h: 141, fondo: "#F3F5F7", red: "Instagram",
    texto: "Profe vos sos la máquina", video: "https://www.instagram.com/profee_tonio/reel/Dbl29PZp1g2/", comentario: "https://www.instagram.com/p/Dbl29PZp1g2/c/18127096300675389/", tema: "Funciones — notación f(x)" },
  { img: "assets/comentarios/08-instagram.webp", w: 499, h: 147, fondo: "#F3F5F7", red: "Instagram",
    texto: "Qué didáctico! 👏👏👏", video: "https://www.instagram.com/profee_tonio/reel/DczlR3ApXn3/", comentario: "https://www.instagram.com/p/DczlR3ApXn3/c/17927835552163336/", tema: "Límites — lím(x→0) 1/x² = ∞" },
  { img: "assets/comentarios/19-tiktok.webp", w: 345, h: 108, fondo: "#121212", red: "TikTok",
    texto: "Que bien explicas crack", video: "https://www.tiktok.com/@profee.tonio/video/7693691015038799110", tema: "Integrales — el área bajo la curva" },
  { img: "assets/comentarios/20-tiktok.webp", w: 393, h: 108, fondo: "#121212", red: "TikTok",
    texto: "Muy bien explicado hermano", video: "https://www.tiktok.com/@profee.tonio/video/7691055393312689429", tema: "Integrales — sumas de Riemann" },
];

const PROFES_EXP = { tonio: "Profee Tonio", simon: "Simón", videos: "Sólo vi los videos" };

async function leerExperiencias(limite = 60) {
  const r = await fetch(`${API_EXP}?select=id,creado,nombre,materia,profesor,estrellas,comentario&order=creado.desc&limit=${limite}`, { headers: cabecerasExp() });
  if (!r.ok) throw new Error("No se pudieron leer las experiencias (" + r.status + ")");
  return r.json();
}
async function enviarExperiencia(datos) {
  const r = await fetch(API_EXP, { method: "POST", headers: { ...cabecerasExp(), prefer: "return=minimal" }, body: JSON.stringify(datos) });
  if (!r.ok) { const e = await r.json().catch(() => ({})); const err = new Error(e.message || "error " + r.status); err.code = e.code; throw err; }
}

// ---------------------------------------------------------------- tarjeta
// Todo lo que escribió el visitante entra con textContent: nunca como HTML.
const ESTRELLA = '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/></svg>';
function tarjetaExperiencia(x) {
  const t = document.createElement("article"); t.className = "exp";
  t.innerHTML = `<header class="exp-cab"><span class="exp-ini" aria-hidden="true"></span><div class="exp-quien"><b class="exp-nombre"></b><span class="exp-materia"></span></div>
    <span class="exp-estrellas" role="img"></span></header><blockquote class="exp-texto"></blockquote><button class="exp-mas" type="button" hidden>Ver más</button>`;
  t.querySelector(".exp-ini").textContent = (x.nombre.match(/\p{L}/u) || ["?"])[0].toUpperCase();   // primera LETRA del nombre
  t.querySelector(".exp-nombre").textContent = x.nombre;
  t.querySelector(".exp-materia").textContent = x.materia || "";
  const est = t.querySelector(".exp-estrellas");
  est.setAttribute("aria-label", `${x.estrellas} de 5 estrellas`);
  est.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < x.estrellas ? "on" : ""}">${ESTRELLA}</i>`).join("");
  t.querySelector(".exp-texto").textContent = "“" + x.comentario.trim() + "”";
  return t;
}
// "Ver más" sólo donde el texto quedó cortado
function activarVerMas(raiz) {
  raiz.querySelectorAll(".exp").forEach(t => {
    const tx = t.querySelector(".exp-texto"), b = t.querySelector(".exp-mas");
    b.hidden = tx.scrollHeight <= tx.clientHeight + 2;
    b.onclick = () => { const ab = t.classList.toggle("abierta"); b.textContent = ab ? "Ver menos" : "Ver más"; };
  });
}
