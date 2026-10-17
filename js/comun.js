// Piezas repetidas de las maquetas (nav y pie), para que todas sean idénticas.
// Uso: <div data-nav="inicio"></div>  ·  <div data-pie></div>

// destinos reales (los datos salen de plataforma/03-contenido-y-copy.md)
const LINKS = {
  inicio: "index.html", simuladores: "biblioteca.html", clases: "clases.html",
  whatsapp: "https://wa.me/5491172796576",
  canal: "https://whatsapp.com/channel/0029Vb98tWMInlqZ302OrJ2n",
  instagram: "https://www.instagram.com/profee_tonio/",
};
const externo = url => `href="${url}" target="_blank" rel="noopener"`;
// WhatsApp con el mensaje ya escrito: el alumno sólo completa lo que dice ___ y envía
const wa = texto => LINKS.whatsapp + "?text=" + encodeURIComponent(texto);
const MSJ = {
  general: "Hola Tonio! Vengo de tu página y quiero agendar una clase. Tema: ___",
  consulta: "Hola Tonio! Vengo de tu página y te quería consultar algo: ___",
};

const ICONO = {
  wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  canal: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10v4h3l5 4V6L7 10H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.1-3.3A8 8 0 0 1 4 12Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  cerrar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};

function logo(alto = 34) {
  // sin la ∫: Tonio no quiere el isotipo. Va su foto de perfil de Instagram.
  return `<a class="logo" href="${LINKS.inicio}"><img class="avatar" src="assets/foto/avatar.png" alt="" style="width:${alto}px;height:${alto}px">
    <span class="logo-txt"><b>Profee</b><b>Tonio</b></span></a>`;
}

function nav(activo) {
  const links = [["inicio", "Inicio"], ["simuladores", "Simuladores"], ["clases", "Clases"]];
  return `<header class="nav">
    ${logo()}
    <nav class="nav-pildora">${links.map(([k, t]) =>
      `<a href="${LINKS[k]}" class="${k === activo ? "is-activo" : ""}">${t}</a>`).join("")}</nav>
    <a class="btn btn-primario nav-cta" ${externo(wa(MSJ.general))}>${ICONO.wa} Agendar por WhatsApp</a>
    <button class="nav-menu" aria-label="Abrir menú">${ICONO.menu}</button>
  </header>`;
}

function pie() {
  return `<footer class="pie">
    <div class="pie-dentro">
      <div class="pie-marca">
        ${logo(40)}
        <p class="chico">Análisis, Álgebra y Física · Clases y simuladores</p>
      </div>
      <div class="pie-links">
        <a ${externo(LINKS.instagram)}>${ICONO.ig} Instagram</a>
        <a ${externo(LINKS.canal)}>${ICONO.canal} Canal de WhatsApp</a>
        <a ${externo(wa(MSJ.consulta))}>${ICONO.wa} Escribime</a>
      </div>
    </div>
    <div class="pie-base"><span class="meta">© 2026 Profee Tonio</span></div>
  </footer>`;
}

function menuMovil(activo) {
  const links = [["inicio", "Inicio"], ["simuladores", "Simuladores"], ["clases", "Clases"]];
  return `<div class="menu-movil" role="dialog" aria-label="Menú">
    <div class="cab">${logo()}<button class="nav-menu" aria-label="Cerrar menú" style="display:grid">${ICONO.cerrar}</button></div>
    <nav class="links">${links.map(([k, t]) => `<a href="${LINKS[k]}" class="${k === activo ? "is-activo" : ""}">${t}</a>`).join("")}</nav>
    <div class="abajo">
      <a class="btn btn-primario" ${externo(wa(MSJ.general))}>${ICONO.wa} Agendar por WhatsApp</a>
      <div class="redes"><a ${externo(LINKS.instagram)}>${ICONO.ig} Instagram</a><a ${externo(LINKS.canal)}>${ICONO.canal} Canal de WhatsApp</a></div>
    </div>
  </div>`;
}

document.querySelectorAll("[data-nav]").forEach(el => {
  const abierto = new URLSearchParams(location.search).has("menu");
  el.outerHTML = nav(el.dataset.nav) + (abierto ? menuMovil(el.dataset.nav) : "");
});
document.querySelectorAll("[data-pie]").forEach(el => el.outerHTML = pie());

// el botón de menú del celular abre y cierra el menú
document.addEventListener("click", e => {
  const b = e.target.closest(".nav-menu"); if (!b) return;
  const abierto = document.querySelector(".menu-movil");
  if (abierto) abierto.remove();
  else document.querySelector(".nav").insertAdjacentHTML("afterend", menuMovil(document.querySelector(".nav-pildora .is-activo")?.textContent.trim().toLowerCase() || ""));
});
