// Juego "¿Cuánto me conoces?". Usa C, $, azar, elegir, conNombre e iniciarCorazones de comun.js
(() => {
  const preguntas = (C.preguntasJuego || []).filter((p) => p.pregunta && p.opciones && p.opciones.length);
  if (!preguntas.length) return location.replace("final.html"); // sin preguntas, se salta el juego

  iniciarCorazones(900);

  const reaccionesBien = ["¡Exacto! 😍", "¡Sí me conoces! 🥰", "¡Correcto! 💖", "¡Esa es! ✨"];
  const reaccionesMal = ["Casi... 😅", "Nop, pero te perdono 🙈", "Ups 😂", "Mmm, no 🤭"];

  let actual = 0;
  let aciertos = 0;
  let resultados = [];
  let mostradaEn = 0;

  $("#titulo-juego").textContent = conNombre(C.tituloJuego || "¿Cuánto me conoces?");
  $("#subtitulo-juego").textContent = `${preguntas.length} preguntas para ver qué tanto sabes de mí`;

  function mostrarVista(id) {
    document.querySelectorAll(".vista").forEach((v) => (v.hidden = v.id !== id));
    window.scrollTo(0, 0);
  }

  function barajar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  // 🤍 sin contestar · 💖 bien · 💔 mal
  function pintarVidas(contenedor, recienContestada = -1) {
    contenedor.replaceChildren(
      ...preguntas.map((_, i) => {
        const vida = document.createElement("span");
        vida.textContent = resultados[i] === undefined ? "🤍" : resultados[i] ? "💖" : "💔";
        if (i === recienContestada) vida.className = "nueva";
        return vida;
      })
    );
  }

  function chispas(elemento) {
    const r = elemento.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const chispa = document.createElement("span");
      chispa.className = "chispa";
      chispa.textContent = elegir(["💖", "💕", "✨", "💗"]);
      const angulo = azar(0, Math.PI * 2);
      const distancia = azar(40, 110);
      chispa.style.left = r.left + r.width / 2 + "px";
      chispa.style.top = r.top + r.height / 2 + "px";
      chispa.style.setProperty("--x", Math.cos(angulo) * distancia + "px");
      chispa.style.setProperty("--y", Math.sin(angulo) * distancia + "px");
      chispa.addEventListener("animationend", () => chispa.remove());
      document.body.append(chispa);
    }
  }

  function empezar() {
    actual = 0;
    aciertos = 0;
    resultados = [];
    mostrarVista("juego");
    mostrarPregunta();
  }

  function mostrarPregunta() {
    const p = preguntas[actual];
    // Si "correcta" no coincide con ninguna opción (p. ej. un error de dedo), cualquiera cuenta como buena
    const todasValen = p.correcta === "todas" || !p.opciones.includes(p.correcta);

    $("#progreso").textContent = `Pregunta ${actual + 1} de ${preguntas.length}`;
    pintarVidas($("#vidas"));
    $("#pregunta").textContent = conNombre(p.pregunta);
    $("#reaccion").hidden = true;
    $("#btn-siguiente").hidden = true;

    const opciones = $("#opciones");
    opciones.replaceChildren();
    barajar(p.opciones).forEach((texto, i) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "opcion";
      boton.dataset.correcta = todasValen || texto === p.correcta ? "si" : "no";

      const letra = document.createElement("span");
      letra.className = "letra";
      letra.textContent = "ABCDEFGH"[i];
      const etiqueta = document.createElement("span");
      etiqueta.textContent = conNombre(texto);

      boton.append(letra, etiqueta);
      boton.addEventListener("click", () => responder(boton));
      opciones.append(boton);
    });

    const tarjeta = $("#tarjeta");
    tarjeta.classList.remove("cambio");
    void tarjeta.offsetWidth; // reinicia la animación de entrada
    tarjeta.classList.add("cambio");
    mostradaEn = performance.now();
  }

  function responder(elegida) {
    const botones = [...document.querySelectorAll(".opcion")];
    // Ignora si ya contestó o si fue un doble toque que venía de la pregunta anterior
    if (botones.some((b) => b.disabled) || performance.now() - mostradaEn < 400) return;

    const p = preguntas[actual];
    const acerto = elegida.dataset.correcta === "si";
    const eraTrampa = botones.every((b) => b.dataset.correcta === "si");

    botones.forEach((b) => {
      b.disabled = true;
      if (b.dataset.correcta === "si") b.classList.add("correcta");
      else if (b === elegida) b.classList.add("incorrecta");
      else b.classList.add("apagada");
    });

    resultados[actual] = acerto;
    if (acerto) {
      aciertos++;
      chispas(elegida);
    }
    pintarVidas($("#vidas"), actual);

    $("#reaccion-titulo").textContent = eraTrampa
      ? "¡Era trampa: todas son correctas! 😌"
      : elegir(acerto ? reaccionesBien : reaccionesMal);
    const dato = $("#reaccion-dato");
    dato.textContent = conNombre(p.dato);
    dato.hidden = !p.dato;
    $("#reaccion").hidden = false;

    const siguiente = $("#btn-siguiente");
    siguiente.textContent = actual === preguntas.length - 1 ? "Ver resultado 💖" : "Siguiente →";
    siguiente.hidden = false;
    siguiente.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function mostrarResultado() {
    const R = C.resultadosJuego || {};
    const proporcion = aciertos / preguntas.length;
    const [emoji, mensaje] =
      proporcion === 1
        ? ["🏆", R.perfecto || "¡Perfecto! Me conoces mejor que nadie 🥹"]
        : proporcion >= 0.5
        ? ["🥰", R.bien || "¡Nada mal! Me conoces bastante bien 💕"]
        : ["🙈", R.poco || "Tenemos mucho tiempo para que me conozcas mejor 😌"];

    $("#emoji-resultado").textContent = emoji;
    $("#puntaje").textContent = `${aciertos} / ${preguntas.length}`;
    pintarVidas($("#vidas-final"));
    $("#mensaje-resultado").textContent = conNombre(mensaje);
    $("#cierre-juego").textContent = conNombre(C.cierreJuego || "Pero todavía falta una pregunta...");
    mostrarVista("resultado");

    if (proporcion === 1) setTimeout(() => chispas($("#puntaje")), 300);
  }

  $("#btn-jugar").addEventListener("click", empezar);
  $("#btn-otra-vez").addEventListener("click", empezar);
  $("#btn-siguiente").addEventListener("click", () => {
    actual++;
    if (actual < preguntas.length) mostrarPregunta();
    else mostrarResultado();
  });
})();
