// La carta. Usa C, $, conNombre e iniciarCorazones de comun.js
(() => {
  iniciarCorazones(1000);

  const datos = C.carta || {};
  const sobre = $("#sobre");
  const carta = $("#carta");

  // ---------- Armar la carta ----------
  $("#carta-saludo").textContent = conNombre(datos.saludo);
  (datos.parrafos || []).forEach((texto) => {
    const p = document.createElement("p");
    p.textContent = conNombre(texto);
    $("#carta-cuerpo").append(p);
  });
  $("#carta-despedida").textContent = conNombre(datos.despedida);
  $("#carta-firma").textContent = conNombre(datos.firma);

  // Cada renglón se va a escribir poco a poco, en orden
  const segmentos = [
    $("#carta-saludo"),
    ...document.querySelectorAll("#carta-cuerpo p"),
    $("#carta-despedida"),
    $("#carta-firma"),
  ].filter((el) => el.textContent.trim());

  // ---------- Abrir el sobre ----------
  let abierto = false;

  function abrir() {
    if (abierto) return;
    abierto = true;
    sobre.classList.add("abierto");

    setTimeout(() => $("#escena").classList.add("saliendo"), 2000);
    setTimeout(() => {
      $("#escena").hidden = true;
      carta.hidden = false;
      window.scrollTo(0, 0);
      setTimeout(escribirCarta, 900);
    }, 2700);
  }

  sobre.addEventListener("click", abrir);
  sobre.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  });

  // ---------- Escribir la carta letra por letra ----------
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  let temporizador = null;
  let terminada = false;

  // Deja el texto completo "invisible" para que la carta ya tenga su tamaño final
  const piezas = segmentos.map((el) => {
    const letras = Array.from(el.textContent);
    const escrito = document.createTextNode("");
    const pendiente = document.createElement("span");
    pendiente.className = "pendiente";
    pendiente.textContent = el.textContent;
    el.replaceChildren(escrito, pendiente);
    return { el, letras, escrito, pendiente };
  });

  function escribirCarta() {
    if (terminada) return; // ya la tocó para verla completa
    let s = 0;
    let i = 0;

    const paso = () => {
      const pieza = piezas[s];
      if (i === 0) pieza.el.insertBefore(cursor, pieza.pendiente);
      i++;
      pieza.escrito.textContent = pieza.letras.slice(0, i).join("");
      pieza.pendiente.textContent = pieza.letras.slice(i).join("");
      if (i % 25 === 1) cursor.scrollIntoView({ behavior: "smooth", block: "nearest" });

      if (i >= pieza.letras.length) {
        s++;
        i = 0;
        if (s >= piezas.length) return terminar();
        temporizador = setTimeout(paso, 600);
        return;
      }
      const letra = pieza.letras[i - 1];
      const pausa = ".!?…".includes(letra) ? 380 : ",;:".includes(letra) ? 180 : 32;
      temporizador = setTimeout(paso, pausa);
    };

    if (piezas.length) paso();
    else terminar();
  }

  function terminar() {
    if (terminada) return;
    terminada = true;
    clearTimeout(temporizador);
    piezas.forEach((p) => {
      p.escrito.textContent = p.letras.join("");
      p.pendiente.textContent = "";
    });
    cursor.remove();
    carta.classList.add("terminada");
    $("#pista-carta").hidden = true;
    const boton = $("#btn-continuar");
    boton.hidden = false;
    boton.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Tocar la carta mientras se escribe la muestra completa
  carta.addEventListener("click", (e) => {
    if (!terminada && !e.target.closest("a")) terminar();
  });
})();
