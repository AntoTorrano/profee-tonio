// ==========================================================================
// Base de los simuladores de Profee Tonio. Cada simulador sólo define su matemática:
//
//   Sim({
//     titulo, nota,                                   // nota: HTML corto con qué mirar
//     vista: { x: [x0, x1], y: [y0, y1], igual },     // o una función (v) => vista
//     controles: [{ id, et, min, max, paso, valor, fmt }],
//     botones:   [{ id, et, opciones: [[valor, texto], ...], valor }],
//     acciones:  [{ et, fn(sim) }],
//     arrastrables: [{ id, x, y, color }],            // puntos que se mueven con el mouse/dedo
//     lecturas:  [{ id, et, tipo: "calc" | "res", ancho }],
//     animar: true,                                   // v.t = segundos desde que arrancó
//     dibujar(g, v, sim) { ...; return { idLectura: "texto" } },
//   })
//
// g dibuja en coordenadas del problema (no en píxeles): g.curva(f), g.punto(x, y), g.texto(...)...
// El glow es siempre una capa APARTE del trazo nítido (como en Manim: nunca baño azul difuso).
// ==========================================================================
(function () {
  const C = {
    fondo: "#04060D", superficie: "#080D1A", grilla: "#16233A", linea: "#1E3157", riel: "#22304A",
    neon: "#2E78FF", neonAlt: "#33A1FF", neonSuave: "#4C7DFF", core: "#7FB6FF",
    amarillo: "#FFE14D", verde: "#34D399", cian: "#4FC3E8",
    texto: "#F8FAFC", medio: "#EDEDED", suave: "#AAB6CE", tenue: "#7C93C7",
  };
  window.COLOR = C;

  window.Sim = function (cfg) {
    const q = new URLSearchParams(location.search);
    // ?portada: sólo el gráfico, para sacar la imagen de portada · ?vitrina: compacto, para el carrusel de la home
    const suelto = window.top === window.self && !q.has("portada");
    if (q.has("portada")) document.body.classList.add("portada");
    if (suelto) document.body.classList.add("suelto");
    if (q.has("vitrina")) document.body.classList.add("vitrina");
    document.title = cfg.titulo + " · Profee Tonio";

    document.body.innerHTML = `
      <header class="cab"><span class="t">${cfg.titulo}</span><a class="marca" href="../index.html">Profee <b>Tonio</b></a></header>
      <div class="sim"><div class="lienzo"><canvas></canvas></div><aside class="panel"></aside></div>`;
    const canvas = document.querySelector("canvas"), ctx = canvas.getContext("2d"), panel = document.querySelector(".panel");
    const v = { t: 0 };

    // ---------------------------------------------------------------- controles
    const fmtDef = x => (+x).toFixed(2).replace(/\.?0+$/, "");
    if ((cfg.botones || []).length) panel.insertAdjacentHTML("beforeend", `<div class="rot">Opciones</div>`);
    (cfg.botones || []).forEach(b => {
      v[b.id] = b.valor ?? b.opciones[0][0];
      const caja = document.createElement("div"); caja.className = "ctrl";
      caja.innerHTML = (b.et ? `<div class="fila"><span>${b.et}</span></div>` : "") +
        `<div class="botones">${b.opciones.map(([val, txt]) => `<button data-v="${val}" class="${val == v[b.id] ? "on" : ""}">${txt}</button>`).join("")}</div>`;
      caja.querySelectorAll("button").forEach(bt => bt.onclick = () => {
        v[b.id] = isNaN(+bt.dataset.v) ? bt.dataset.v : +bt.dataset.v;
        caja.querySelectorAll("button").forEach(o => o.classList.toggle("on", o === bt));
        cfg.alCambiar?.(b.id, api); pedir();
      });
      panel.appendChild(caja);
    });
    if ((cfg.controles || []).length) panel.insertAdjacentHTML("beforeend", `<div class="rot">Controles</div>`);
    const sliders = {};
    (cfg.controles || []).forEach(c => {
      v[c.id] = c.valor;
      const caja = document.createElement("div"); caja.className = "ctrl";
      caja.innerHTML = `<div class="fila"><span>${c.et}</span><b></b></div>
        <input type="range" min="${c.min}" max="${c.max}" step="${c.paso ?? (c.max - c.min) / 200}" value="${c.valor}" aria-label="${c.et.replace(/<[^>]+>/g, "")}">`;
      const inp = caja.querySelector("input"), out = caja.querySelector("b");
      const pintar = () => { out.textContent = (c.fmt || fmtDef)(v[c.id]); inp.style.setProperty("--p", ((v[c.id] - c.min) / (c.max - c.min) * 100) + "%"); };
      inp.oninput = () => { v[c.id] = +inp.value; pintar(); cfg.alCambiar?.(c.id, api); pedir(); };
      sliders[c.id] = { inp, pintar }; pintar();
      panel.appendChild(caja);
    });
    if ((cfg.acciones || []).length) {
      const fila = document.createElement("div"); fila.className = "botones";
      (cfg.acciones || []).forEach(a => { const b = document.createElement("button"); b.className = "accion"; b.textContent = a.et; b.onclick = () => a.fn(api); fila.appendChild(b); });
      panel.appendChild(fila);
    }
    const lect = document.createElement("div"); lect.className = "lect";
    lect.innerHTML = (cfg.lecturas || []).map(l => `<div class="${l.ancho ? "ancho" : ""}"><span class="et">${l.et}</span><span class="v ${l.tipo || ""}" data-l="${l.id}">–</span></div>`).join("");
    if ((cfg.lecturas || []).length) panel.appendChild(lect);
    if (cfg.nota) panel.insertAdjacentHTML("beforeend", `<p class="nota">${cfg.nota}</p>`);

    (cfg.arrastrables || []).forEach(a => v[a.id] = { x: a.x, y: a.y });

    // ---------------------------------------------------------------- vista y dibujo
    let W = 0, H = 0, dpr = 1, vista;
    function medir() {
      const r = canvas.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.max(10, r.width); H = Math.max(10, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    function calcularVista() {
      const b = typeof cfg.vista === "function" ? cfg.vista(v) : cfg.vista;
      const m = b.margen ?? 34;
      let [x0, x1] = b.x, [y0, y1] = b.y;
      if (b.igual) {   // misma escala en x e y: una parábola es una parábola y un círculo, un círculo
        const sx = (W - 2 * m) / (x1 - x0), sy = (H - 2 * m) / (y1 - y0), s = Math.min(sx, sy);
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, hw = (W - 2 * m) / s / 2, hh = (H - 2 * m) / s / 2;
        x0 = cx - hw; x1 = cx + hw; y0 = cy - hh; y1 = cy + hh;
      }
      vista = { x0, x1, y0, y1, m, sx: (W - 2 * m) / (x1 - x0), sy: (H - 2 * m) / (y1 - y0) };
    }
    const X = x => vista.m + (x - vista.x0) * vista.sx;
    const Y = y => H - vista.m - (y - vista.y0) * vista.sy;
    const invX = px => vista.x0 + (px - vista.m) / vista.sx;
    const invY = py => vista.y0 + (H - vista.m - py) / vista.sy;

    function trazo(fn, o = {}) {
      const col = o.color || C.core, ancho = o.ancho ?? 2.6;
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (o.dash) ctx.setLineDash(o.dash);
      if (o.glow !== false && !o.dash) {   // halo aparte, después el núcleo nítido
        ctx.globalAlpha = o.alfaGlow ?? .45; ctx.strokeStyle = o.colorGlow || (col === C.core ? C.neon : col);
        ctx.lineWidth = ancho * 3.2; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 16; fn(); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = o.alfa ?? 1; ctx.strokeStyle = col; ctx.lineWidth = ancho; fn(); ctx.stroke();
      ctx.restore();
    }
    const g = {
      C, ctx, get W() { return W; }, get H() { return H; }, get vista() { return vista; }, X, Y, invX, invY,
      cuadricula(paso = 1, pasoY = paso) {
        ctx.save(); ctx.strokeStyle = C.grilla; ctx.lineWidth = 1;
        for (let x = Math.ceil(vista.x0 / paso) * paso; x <= vista.x1; x += paso) { ctx.beginPath(); ctx.moveTo(X(x), 0); ctx.lineTo(X(x), H); ctx.stroke(); }
        for (let y = Math.ceil(vista.y0 / pasoY) * pasoY; y <= vista.y1; y += pasoY) { ctx.beginPath(); ctx.moveTo(0, Y(y)); ctx.lineTo(W, Y(y)); ctx.stroke(); }
        ctx.restore();
      },
      ejes(o = {}) {
        ctx.save(); ctx.strokeStyle = C.suave; ctx.globalAlpha = .55; ctx.lineWidth = 1.6;
        const y0 = Math.min(Math.max(0, vista.y0), vista.y1), x0 = Math.min(Math.max(0, vista.x0), vista.x1);
        ctx.beginPath(); ctx.moveTo(0, Y(y0)); ctx.lineTo(W, Y(y0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X(x0), 0); ctx.lineTo(X(x0), H); ctx.stroke();
        ctx.globalAlpha = 1;
        if (o.marcas) {
          ctx.fillStyle = C.tenue; ctx.font = "11px 'JetBrains Mono', monospace"; ctx.textAlign = "center";
          const mx = o.marcas, my = o.marcasY ?? o.marcas;
          for (let x = Math.ceil(vista.x0 / mx) * mx; x <= vista.x1; x += mx) if (Math.abs(x) > 1e-9) {
            ctx.beginPath(); ctx.moveTo(X(x), Y(y0) - 4); ctx.lineTo(X(x), Y(y0) + 4); ctx.strokeStyle = C.suave; ctx.stroke();
            ctx.fillText(o.fmtX ? o.fmtX(x) : +x.toFixed(2), X(x), Y(y0) + 16);
          }
          ctx.textAlign = "right";
          for (let y = Math.ceil(vista.y0 / my) * my; y <= vista.y1; y += my) if (Math.abs(y) > 1e-9) {
            ctx.beginPath(); ctx.moveTo(X(x0) - 4, Y(y)); ctx.lineTo(X(x0) + 4, Y(y)); ctx.strokeStyle = C.suave; ctx.stroke();
            ctx.fillText(+y.toFixed(2), X(x0) - 8, Y(y) + 4);
          }
        }
        ctx.fillStyle = C.suave; ctx.font = "italic 13px Inter, sans-serif";
        if (o.x) { ctx.textAlign = "right"; ctx.fillText(o.x, W - 10, Y(y0) - 8); }
        if (o.y) { ctx.textAlign = "left"; ctx.fillText(o.y, X(x0) + 8, 16); }
        ctx.restore();
      },
      curva(f, o = {}) {
        const a = o.desde ?? vista.x0, b = o.hasta ?? vista.x1, n = o.n ?? Math.max(200, Math.round(W));
        trazo(() => {
          ctx.beginPath(); let abierto = false;
          for (let i = 0; i <= n; i++) {
            const x = a + (b - a) * i / n, y = f(x);
            if (!isFinite(y) || y > vista.y1 + (vista.y1 - vista.y0) * 3 || y < vista.y0 - (vista.y1 - vista.y0) * 3) { abierto = false; continue; }
            abierto ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); abierto = true;
          }
        }, o);
      },
      camino(pts, o = {}) { trazo(() => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))); if (o.cerrar) ctx.closePath(); }, o); },
      linea(x1, y1, x2, y2, o = {}) { trazo(() => { ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(X(x2), Y(y2)); }, { glow: false, ancho: 1.6, color: C.suave, ...o }); },
      recta(m, b, o = {}) { g.linea(vista.x0, m * vista.x0 + b, vista.x1, m * vista.x1 + b, o); },
      poligono(pts, o = {}) {
        ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))); ctx.closePath();
        ctx.globalAlpha = o.alfa ?? .18; ctx.fillStyle = o.relleno || C.neon; ctx.fill();
        if (o.borde) { ctx.globalAlpha = o.alfaBorde ?? .8; ctx.strokeStyle = o.borde; ctx.lineWidth = o.ancho ?? 1.4; ctx.stroke(); }
        ctx.restore();
      },
      franjaH(y0, y1, o = {}) { g.poligono([[vista.x0, y0], [vista.x1, y0], [vista.x1, y1], [vista.x0, y1]], o); },
      franjaV(x0, x1, o = {}) { g.poligono([[x0, vista.y0], [x1, vista.y0], [x1, vista.y1], [x0, vista.y1]], o); },
      flecha(x1, y1, x2, y2, o = {}) {
        const col = o.color || C.core, ancho = o.ancho ?? 3;
        const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)), L = Math.hypot(X(x2) - X(x1), Y(y2) - Y(y1)), cab = Math.min(14, L * .35);
        const bx = X(x2) - cab * Math.cos(a), by = Y(y2) - cab * Math.sin(a);
        trazo(() => { ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(bx, by); }, { ...o, color: col, ancho });
        ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(X(x2), Y(y2));
        ctx.lineTo(bx + cab * .5 * Math.sin(a), by - cab * .5 * Math.cos(a)); ctx.lineTo(bx - cab * .5 * Math.sin(a), by + cab * .5 * Math.cos(a)); ctx.closePath(); ctx.fill(); ctx.restore();
      },
      punto(x, y, o = {}) {
        const col = o.color || C.core, r = o.r ?? 5.5;
        ctx.save();
        if (o.glow !== false) { ctx.globalAlpha = .35; ctx.fillStyle = col === C.core ? C.neon : col; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(X(x), Y(y), r * 2.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
        ctx.beginPath(); ctx.arc(X(x), Y(y), r, 0, 7);
        if (o.hueco) { ctx.fillStyle = C.superficie; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2.4; ctx.stroke(); } else { ctx.fillStyle = col; ctx.fill(); }
        ctx.restore();
      },
      texto(s, x, y, o = {}) {
        ctx.save(); ctx.fillStyle = o.color || C.suave; ctx.font = `${o.peso || 500} ${o.tam || 13}px ${o.mono ? "'JetBrains Mono', monospace" : "Inter, sans-serif"}`;
        ctx.textAlign = o.alin || "left"; ctx.textBaseline = "middle";
        if (o.fondo) { const w = ctx.measureText(s).width, px = X(x) + (o.dx || 0), py = Y(y) + (o.dy || 0), x0 = o.alin === "center" ? px - w / 2 : o.alin === "right" ? px - w : px;
          ctx.fillStyle = "rgba(8,13,26,.85)"; ctx.fillRect(x0 - 5, py - 10, w + 10, 20); ctx.fillStyle = o.color || C.suave; }
        ctx.fillText(s, X(x) + (o.dx || 0), Y(y) + (o.dy || 0)); ctx.restore();
      },
    };

    // ---------------------------------------------------------------- arrastrar puntos
    let agarrado = null;
    const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const cerca = (px, py) => (cfg.arrastrables || []).find(a => Math.hypot(X(v[a.id].x) - px, Y(v[a.id].y) - py) < 22);
    canvas.addEventListener("pointerdown", e => { const [px, py] = pos(e); agarrado = cerca(px, py); if (agarrado) { canvas.setPointerCapture(e.pointerId); e.preventDefault(); } });
    canvas.addEventListener("pointermove", e => {
      const [px, py] = pos(e);
      if (!agarrado) { canvas.style.cursor = cerca(px, py) ? "grab" : "default"; return; }
      canvas.style.cursor = "grabbing";
      let x = invX(px), y = invY(py);
      if (agarrado.paso) { x = Math.round(x / agarrado.paso) * agarrado.paso; y = Math.round(y / agarrado.paso) * agarrado.paso; }
      v[agarrado.id] = { x, y }; pedir();
    });
    ["pointerup", "pointercancel"].forEach(ev => canvas.addEventListener(ev, () => { agarrado = null; canvas.style.cursor = "default"; }));

    // ---------------------------------------------------------------- ciclo
    let pendiente = false, t0 = performance.now(), visible = true;
    function cuadro() {
      pendiente = false;
      if (cfg.animar) v.t = (performance.now() - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.superficie; ctx.fillRect(0, 0, W, H);
      calcularVista();
      const res = cfg.dibujar(g, v, api) || {};
      (cfg.arrastrables || []).forEach(a => g.punto(v[a.id].x, v[a.id].y, { color: a.color || C.core, r: 7 }));
      for (const [k, txt] of Object.entries(res)) { const el = lect.querySelector(`[data-l="${k}"]`); if (el && el.textContent !== txt) el.textContent = txt; }
      if (cfg.animar && visible) pedir();
    }
    function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(cuadro); } }
    const api = {
      v, g, C, pedir,
      fijar(id, val) { v[id] = val; sliders[id]?.inp && (sliders[id].inp.value = val, sliders[id].pintar()); pedir(); },
      reiniciarReloj() { t0 = performance.now(); pedir(); },
    };
    new ResizeObserver(() => { medir(); pedir(); }).observe(canvas.parentElement);
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) pedir(); });
    medir(); pedir();
    return api;
  };
})();
