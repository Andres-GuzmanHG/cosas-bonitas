// Página final: mensajes y tarjetas de cosas bonitas. Usa C, $, azar, elegir, conNombre e iniciarCorazones de comun.js
(() => {
  const ritmo = iniciarCorazones();

  // ---------- Cambiar de pantalla ----------
  let pantallaActual = $("#intro");
  let ultimoCambio = 0;
  function mostrar(id) {
    const siguiente = document.getElementById(id);
    pantallaActual.classList.remove("activa");
    siguiente.classList.add("activa");
    pantallaActual = siguiente;
    ultimoCambio = performance.now();
  }

  // Evita que un doble toque se salte cosas sin leerlas
  const muyPronto = () => performance.now() - ultimoCambio < 500;

  // ---------- Intro ----------
  $("#btn-abrir").addEventListener("click", () => {
    mostrar("mensajes");
    iniciarMensajes();
  });

  // ---------- Mensajes tipo máquina de escribir ----------
  const mensajes = (C.mensajes || []).map(conNombre);
  const cajaTexto = $("#texto-mensaje");
  const pista = $("#pista");
  let indice = 0;
  let escribiendo = false;
  let temporizador = null;
  let completar = () => {};

  function escribir(texto) {
    const letras = Array.from(texto); // Array.from para no partir emojis
    let i = 0;
    escribiendo = true;
    pista.classList.remove("visible");

    const nodo = document.createTextNode("");
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cajaTexto.replaceChildren(nodo, cursor);

    const terminar = () => {
      escribiendo = false;
      pista.classList.add("visible");
    };

    const paso = () => {
      i++;
      nodo.textContent = letras.slice(0, i).join("");
      if (i >= letras.length) return terminar();
      const pausa = ".,!?…".includes(letras[i - 1]) ? 320 : 45;
      temporizador = setTimeout(paso, pausa);
    };

    completar = () => {
      clearTimeout(temporizador);
      nodo.textContent = texto;
      terminar();
    };

    temporizador = setTimeout(paso, 450);
  }

  function iniciarMensajes() {
    if (mensajes.length) escribir(mensajes[0]);
    else despuesDeMensajes();
  }

  function avanzarMensaje() {
    if (muyPronto()) return;
    ultimoCambio = performance.now();
    if (escribiendo) return completar();
    indice++;
    if (indice < mensajes.length) escribir(mensajes[indice]);
    else despuesDeMensajes();
  }

  $("#mensajes").addEventListener("click", avanzarMensaje);
  document.addEventListener("keydown", (e) => {
    if (pantallaActual.id === "mensajes" && [" ", "Enter", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      avanzarMensaje();
    }
  });

  function despuesDeMensajes() {
    const fotos = (C.fotos || []).map((f) => (typeof f === "string" ? { src: f } : f));
    if (fotos.length) mostrarFotos(fotos);
    else mostrarBonitas();
  }

  // ---------- Fotos ----------
  function mostrarFotos(fotos) {
    const galeria = $("#galeria");
    fotos.forEach((foto, n) => {
      const figura = document.createElement("figure");
      figura.className = "polaroid";
      figura.style.setProperty("--rot", azar(-6, 6).toFixed(1) + "deg");
      figura.style.setProperty("--delay", 0.3 + n * 0.25 + "s");

      const img = new Image();
      img.src = foto.src;
      img.alt = conNombre(foto.texto);
      figura.append(img);

      if (foto.texto) {
        const pie = document.createElement("figcaption");
        pie.textContent = conNombre(foto.texto);
        figura.append(pie);
      }
      galeria.append(figura);
    });
    mostrar("fotos");
  }

  $("#btn-fotos").addEventListener("click", () => mostrarBonitas());

  // ---------- Tarjetas de cosas bonitas ----------
  const cosas = C.cosasBonitas || [];
  const rejilla = $("#tarjetas");
  const btnUltima = $("#btn-ultima");
  let volteadas = 0;

  $("#titulo-bonitas").textContent = conNombre(C.tituloBonitas || "Cosas que me encantan de ti");

  function mostrarBonitas() {
    if (cosas.length) mostrar("bonitas");
    else despedida();
  }

  cosas.forEach((cosa, n) => {
    const tarjeta = document.createElement("button");
    tarjeta.type = "button";
    tarjeta.className = "tarjeta-bonita";
    tarjeta.style.setProperty("--delay", n * 0.08 + "s");
    tarjeta.setAttribute("aria-label", `Tarjeta ${n + 1}`);

    const frente = document.createElement("span");
    frente.className = "cara frente";
    frente.textContent = "💌";

    const reverso = document.createElement("span");
    reverso.className = "cara reverso";
    const emoji = document.createElement("span");
    emoji.className = "reverso-emoji";
    emoji.textContent = cosa.emoji || "💖";
    const texto = document.createElement("span");
    texto.textContent = conNombre(cosa.texto);
    reverso.append(emoji, texto);

    tarjeta.append(frente, reverso);
    tarjeta.addEventListener("click", () => voltear(tarjeta));
    rejilla.append(tarjeta);
  });

  function voltear(tarjeta) {
    if (tarjeta.classList.contains("volteada")) return;
    tarjeta.classList.add("volteada");
    tarjeta.removeAttribute("aria-label"); // ya se puede leer lo que dice
    const r = tarjeta.getBoundingClientRect();
    explosion(r.left + r.width / 2, r.top + r.height / 2, 18);

    volteadas++;
    if (volteadas === cosas.length) {
      btnUltima.hidden = false;
      setTimeout(() => btnUltima.scrollIntoView({ behavior: "smooth", block: "nearest" }), 300);
    }
  }

  btnUltima.addEventListener("click", despedida);

  // ---------- Final ----------
  function despedida() {
    $("#titulo-final").textContent = conNombre(C.tituloFinal || "Gracias por existir ✨");
    $("#mensaje-final").textContent = conNombre(C.mensajeFinal);

    mostrar("final");
    ritmo(160);
    celebrar();
    setTimeout(() => ritmo(450), 6000);
  }

  $("#final").addEventListener("click", (e) => explosion(e.clientX, e.clientY, 40));

  // ---------- Confeti ----------
  const lienzo = $("#confeti");
  const ctx = lienzo.getContext("2d");
  const colores = ["#ff4d7e", "#ff8fab", "#ffc2d4", "#ffd166", "#c77dff", "#ffffff"];
  let particulas = [];
  let animando = false;

  function ajustarLienzo() {
    const dpr = window.devicePixelRatio || 1;
    lienzo.width = window.innerWidth * dpr;
    lienzo.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", ajustarLienzo);
  ajustarLienzo();

  function explosion(x, y, cantidad, angMin = 0, angMax = Math.PI * 2, velMin = 3, velMax = 11) {
    for (let i = 0; i < cantidad; i++) {
      const ang = azar(angMin, angMax);
      const vel = azar(velMin, velMax);
      particulas.push({
        x,
        y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel,
        rot: azar(0, Math.PI * 2),
        vr: azar(-0.2, 0.2),
        tam: azar(7, 14),
        color: elegir(colores),
        corazon: Math.random() < 0.35,
        vida: 0,
      });
    }
    if (!animando) {
      animando = true;
      requestAnimationFrame(cuadro);
    }
  }

  function celebrar() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    [0, 700, 1400].forEach((retraso) =>
      setTimeout(() => {
        explosion(w / 2, h * 0.35, 90);
        explosion(0, h, 60, -Math.PI / 2.2, -Math.PI / 6, 10, 20); // cañón izquierdo
        explosion(w, h, 60, -Math.PI + Math.PI / 6, -Math.PI / 2 - 0.2, 10, 20); // cañón derecho
      }, retraso)
    );
  }

  function dibujarCorazon(tam) {
    const s = tam / 10;
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.bezierCurveTo(-8, -1, -4, -9, 0, -4);
    ctx.bezierCurveTo(4, -9, 8, -1, 0, 5);
    ctx.fill();
  }

  function cuadro() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of particulas) {
      p.vy += 0.2;
      p.vx *= 0.99;
      p.vy *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.vida++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.corazon) dibujarCorazon(p.tam);
      else ctx.fillRect(-p.tam / 2, -p.tam / 4, p.tam, p.tam / 2);
      ctx.restore();
    }
    particulas = particulas.filter((p) => p.y < window.innerHeight + 40 && p.vida < 420);

    if (particulas.length) requestAnimationFrame(cuadro);
    else {
      animando = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
})();
