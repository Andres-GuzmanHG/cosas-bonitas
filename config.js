// ✏️ Aquí se edita todo lo personal. No necesitas tocar nada más.
// Donde escribas {nombre} se reemplaza por su nombre automáticamente.

// Orden en que lo ve:
//   1. index.html  → la carta
//   2. juego.html  → ¿cuánto me conoces?
//   3. final.html  → cosas bonitas

const CONFIG = {
  nombre: "Dani",

  // Opcional: pon un .mp3 en la carpeta y escribe su ruta, p. ej. "musica/cancion.mp3"
  // Suena en todas las páginas y sigue donde se quedó al cambiar de una a otra.
  musica: "",

  // ─────────────── Parte 1: la carta (index.html) ───────────────

  carta: {
    saludo: "Hola, {nombre}:",
    parrafos: [
      "Hay personas que llegan a tu vida y, sin darse cuenta, la hacen mucho mejor. Tú eres una de ellas.",
      "Me encanta platicar contigo, cómo te ríes, lo auténtico de tu forma de ser y lo fácil que es estar contigo. Tienes algo que hace que todo se sienta más ligero.",
      "No soy muy bueno diciendo estas cosas en persona, así que hice lo que mejor sé hacer: programar. Cada línea de esto es para ti.",
      "Te preparé algunas cosas. Solo sigue adelante...",
    ],
    despedida: "Con mucho cariño,",
    firma: "Tu programador favorito 💻",
  },

  // ─────────────── Parte 2: juego (juego.html) ───────────────

  tituloJuego: "¿Cuánto me conoces?",

  // "correcta" tiene que ser IGUAL a una de las opciones (las opciones se revuelven solas).
  // Con correcta: "todas" es pregunta trampa y cualquier respuesta cuenta como buena.
  // "dato" es opcional: un mensajito que aparece después de contestar.
  preguntasJuego: [
    {
      pregunta: "¿Cuál es mi comida favorita?",
      opciones: ["Tacos", "Pizza", "Sushi", "Hamburguesas"],
      correcta: "Sushi",
      dato: "Por cierto, te debo un sushi 🍣",
    },
    {
      pregunta: "¿Qué hago más en mi tiempo libre?",
      opciones: ["Programar", "Dormir", "Jugar videojuegos", "Ver series"],
      correcta: "Programar",
      dato: "Y mira lo que hice con eso 💻",
    },
    {
      pregunta: "¿Cuál es mi color favorito?",
      opciones: ["Azul", "Negro", "Rojo", "Verde"],
      correcta: "Negro",
      dato: "Como el modo oscuro de mi editor 🖤",
    },
    {
      pregunta: "¿Qué es lo que más me gusta de ti?",
      opciones: ["Tu sonrisa", "Tu forma de ser", "Cómo me haces reír", "Tu buena vibra"],
      correcta: "todas",
      dato: "No podía escoger solo una 😌",
    },
    {
      pregunta: "¿En qué pienso antes de dormir?",
      opciones: ["En el código", "En la comida", "En ti", "En nada"],
      correcta: "En el código",
      dato: "Jajaja, bueno... a veces también en ti 🙈",
    },
  ],

  resultadosJuego: {
    perfecto: "¡Perfecto! Me conoces mejor que nadie 🥹",
    bien: "¡Nada mal! Me conoces bastante bien 💕",
    poco: "Jajaja, bueno... tenemos mucho tiempo para que me conozcas mejor 😌",
  },

  cierreJuego: "Y ahora, unas cosas que tenía muchas ganas de decirte...",

  // ─────────────── Parte 3: cosas bonitas (final.html) ───────────────

  // Se escriben uno por uno, como si los estuvieras tecleando.
  mensajes: [
    "Bueno, {nombre}... ✨",
    "Antes de que te vayas, quiero decirte algo.",
    "Eres una persona increíble.",
    "Y me hace muy feliz tenerte en mi vida.",
    "Así que aquí van algunas cosas bonitas... 💖",
  ],

  // Copia tus fotos a la carpeta "fotos" y agrégalas aquí (salen antes de las tarjetas).
  // Si la lista queda vacía, esa parte se salta sola.
  fotos: [
    // { src: "fotos/foto1.jpg", texto: "Un día increíble" },
  ],

  // Cada una es una tarjeta que se voltea al tocarla.
  tituloBonitas: "Cosas que me encantan de ti",
  cosasBonitas: [
    { emoji: "😊", texto: "Tu sonrisa es de mis cosas favoritas." },
    { emoji: "💬", texto: "Platicar contigo es lo mejor de mi día." },
    { emoji: "✨", texto: "Haces que todo se vea más bonito." },
    { emoji: "🌻", texto: "Eres de las personas más auténticas que conozco." },
    { emoji: "😂", texto: "Contigo hasta los días malos terminan en risa." },
    { emoji: "🫶", texto: "Siempre sabes escuchar, y eso vale muchísimo." },
    { emoji: "🌙", texto: "Mereces todo lo bonito que te pase." },
    { emoji: "💖", texto: "Me alegra muchísimo que existas." },
  ],

  tituloFinal: "Gracias por existir ✨",
  mensajeFinal:
    "Nunca cambies, {nombre}. El mundo es mejor contigo en él, y el mío también 💖",
  firma: "— Tu programador favorito 💻",
};
