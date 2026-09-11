// Lo que comparten todas las páginas: configuración, utilidades y corazones de fondo.
const C = typeof CONFIG !== "undefined" ? CONFIG : {};
const $ = (sel) => document.querySelector(sel);
const azar = (min, max) => min + Math.random() * (max - min);
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];
const conNombre = (texto) => String(texto || "").replaceAll("{nombre}", C.nombre || "");

document.querySelectorAll("[data-nombre]").forEach((el) => (el.textContent = C.nombre || ""));

// "2025-02-14" -> Date local (sin el desfase de zona horaria). "hoy" -> hoy.
function leerFecha(texto) {
  if (texto === "hoy") return new Date();
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto || "");
  return partes ? new Date(+partes[1], partes[2] - 1, +partes[3]) : null;
}

function formatearFecha(fecha) {
  return fecha.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
}

// Música de fondo (si hay una en config.js). Sigue donde se quedó al cambiar de página.
(function iniciarMusica() {
  if (!C.musica) return;

  const audio = new Audio(C.musica);
  audio.loop = true;

  const leer = (clave) => {
    try { return sessionStorage.getItem(clave); } catch (e) { return null; }
  };
  const guardar = (clave, valor) => {
    try { sessionStorage.setItem(clave, valor); } catch (e) {}
  };

  let silenciada = leer("musicaSilenciada") === "1";
  const segundo = parseFloat(leer("musicaTiempo")) || 0;
  if (segundo) {
    audio.addEventListener("loadedmetadata", () => (audio.currentTime = segundo % audio.duration), { once: true });
  }

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton-musica";
  const pintar = () => {
    boton.textContent = audio.paused ? "🔇" : "🔊";
    boton.setAttribute("aria-label", audio.paused ? "Poner música" : "Quitar música");
  };
  audio.addEventListener("play", pintar);
  audio.addEventListener("pause", pintar);
  pintar();
  document.body.append(boton);

  const tocar = () => {
    if (!silenciada) audio.play().catch(() => {});
  };

  boton.addEventListener("click", () => {
    silenciada = !audio.paused;
    guardar("musicaSilenciada", silenciada ? "1" : "0");
    if (silenciada) audio.pause();
    else tocar();
  });

  // Los navegadores no dejan sonar música sin que la persona toque algo primero
  const desbloquear = (e) => {
    if (boton.contains(e.target)) return;
    tocar();
    document.removeEventListener("click", desbloquear, true);
    document.removeEventListener("keydown", desbloquear, true);
  };
  document.addEventListener("click", desbloquear, true);
  document.addEventListener("keydown", desbloquear, true);
  tocar();

  const guardarTiempo = () => guardar("musicaTiempo", audio.currentTime);
  window.addEventListener("pagehide", guardarTiempo);
  setInterval(guardarTiempo, 1000);
})();

// Arranca los corazones del fondo. Devuelve una función para cambiar el ritmo (en ms).
function iniciarCorazones(msInicial = 700) {
  const capa = $("#corazones");
  const figuras = ["💗", "💖", "💕", "❤️", "🌸", "✨"];

  function lanzar() {
    const c = document.createElement("span");
    c.className = "corazon";
    c.textContent = elegir(figuras);
    c.style.left = azar(0, 100) + "vw";
    c.style.fontSize = azar(14, 36) + "px";
    c.style.animationDuration = azar(7, 13) + "s";
    c.style.setProperty("--dx", azar(-60, 60) + "px");
    c.style.setProperty("--giro", azar(-40, 40) + "deg");
    c.addEventListener("animationend", () => c.remove());
    capa.appendChild(c);
  }

  let intervalo = setInterval(lanzar, msInicial);
  return (ms) => {
    clearInterval(intervalo);
    intervalo = setInterval(lanzar, ms);
  };
}
