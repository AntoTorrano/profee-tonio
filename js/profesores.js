// Los profesores: una sola fuente para la tarjeta de Clases y la página de cada uno (profesor.html?p=<id>).
// Videos: copias de Creacion de contenido/Historias detacadas (Simón: "Historia Simon/Videos finales";
// Tonio: "MI historia"). "clase": párrafos de "¿Cómo es una clase con…?"; vacío = bloque pendiente.
const PROFES = {
  tonio: {
    nombre: "Profee Tonio",
    materias: "Análisis, Álgebra y Física",
    foto: "assets/foto/avatar.png",
    bio: "Doy clases desde que tenía 14 años. Explico con animaciones y simuladores hechos a medida para cada alumno.",
    opciones: "clases.html",
    videos: [
      { src: "assets/videos/tonio-1.mp4", poster: "assets/videos/tonio-1.jpg" },
      { src: "assets/videos/tonio-2.mp4", poster: "assets/videos/tonio-2.jpg" },
      { src: "assets/videos/tonio-3.mp4", poster: "assets/videos/tonio-3.jpg" },
    ],
    clase: [
      "Antes de la clase me mandás tu guía, tu parcial o el tema que te traba. Llego con eso ya preparado. No doy una clase genérica de límites: doy la clase de los ejercicios que te están costando a vos.",
      "Doy clases desde los 14 años y en todo ese tiempo me convencí de una sola cosa: casi todo lo que parece que hay que aprender de memoria tiene abajo una explicación intuitiva. Mi trabajo es encontrarla. Si te vas sabiendo la fórmula pero sin entender de dónde sale, la clase no sirvió.",
      "Y te llevás algo más. Para el tema que vemos armo un simulador interactivo: una pieza que podés mover con las manos para ver qué pasa cuando cambiás los valores. Lo usamos juntos durante la clase y te queda a vos, para cuando estudies solo.",
    ],
    fotos: [],
  },
  simon: {
    nombre: "Simón Pasman",
    materias: "Análisis, Álgebra y Física",
    foto: "assets/foto/simon.png",   // fotograma del video crudo de su historia destacada
    bio: "Egresado del Nacional Bs As y ganador del concurso de becas IB 2024. Mi objetivo es que te sientas cómodo: te explico como si charlaras con un amigo.",
    opciones: "clases.html?prof=otros",
    videos: [
      { src: "assets/videos/simon-1.mp4", poster: "assets/videos/simon-1.jpg" },
      { src: "assets/videos/simon-2.mp4", poster: "assets/videos/simon-2.jpg" },
    ],
    clase: [
      "Empecé explicándoles a mis compañeros del Nacional Buenos Aires, cuando alguno tenía que salvar una materia o rendir un examen. Ahí descubrí que enseñar me gustaba tanto como la física. Esa forma de dar clase no la cambié: te explico como si estuviera charlando con un amigo.",
      "Lo que más me importa es que estés cómodo para preguntar. Si algo no se entiende, volvemos atrás las veces que haga falta. Nadie aprende matemática con miedo a quedar mal.",
      "Y no quiero que aprendas a rellenar una fórmula. Quiero que veas el razonamiento que hay atrás de cada ejercicio, porque es lo único que te sirve cuando el examen trae algo que no viste. Si entendés la lógica, lo que venga lo vas a poder resolver.",
    ],
    fotos: [],
  },
};

function tarjetaProfe(id) {
  const p = PROFES[id];
  return `<article class="panel profe">
    <div class="foto"><img src="${p.foto}" alt="${p.nombre}"></div>
    <div class="profe-cuerpo">
      <h3 class="nombre">${p.nombre}</h3>
      <p class="meta materias">${p.materias}</p>
      <p class="bio">${p.bio}</p>
      <a class="btn btn-secundario mas-info" href="profesor.html?p=${id}">Más info →</a>
    </div>
  </article>`;
}
