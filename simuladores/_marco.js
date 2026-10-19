// Para los simuladores originales (los que no usan _sim.js) cuando están embebidos en el sitio:
// le avisa a la página su alto (en el celular el marco crece con el contenido: un solo scroll)
// y cuándo lo están usando (el carrusel de la home no cambia de simulador en la mano de nadie).
(function () {
  if (window.top === window.self) return;
  const avisar = d => parent.postMessage({ profee: d.tipo, ...d }, "*");
  new ResizeObserver(() => avisar({ tipo: "alto", alto: Math.ceil(document.body.getBoundingClientRect().height
    + parseFloat(getComputedStyle(document.body).marginTop) + parseFloat(getComputedStyle(document.body).marginBottom)) })).observe(document.body);
  let puntero = "mouse";   // con qué lo están usando: dedo o mouse
  ["pointerdown", "input"].forEach(ev => addEventListener(ev, e => { if (e.pointerType) puntero = e.pointerType; avisar({ tipo: "en-uso", puntero }); }, { capture: true, passive: true }));
})();
