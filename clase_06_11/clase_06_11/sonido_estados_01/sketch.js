let c;

let lienzo;
let temporal;

let x,y;
let diam;
let elColor;
let velocidad = 4;

let circulos = [];
let cantidad = 0;

let tinte = 0;

//-------------CONFIGURACION INICIAL-----------------
let AMP_MIN = 0.001;
let AMP_MAX = 0.13;

let NOTA_MIN = 38;
let NOTA_MAX = 70;

let calibrandoAmp = true;
let monitor = false;

let umbralRuido = 0.2;
let umbralDuracionSonido = 1000;

//-------------SONIDO GENERAL-----------------
let mic;
let audioIniciado = false;

//-------------AMPLITUD-----------------
let pisoAmp = Infinity;
let techoAmp = -Infinity;

let amp = 0;
let intensidad = 0;

//----------ANALISIS FRECUENCIA------
let pitch;
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let frec = 0;
let notaMidi = 0;
let altura = 0;
let difAltura = 0;
let hayPitch = false;

//--------GESTORES-------
let gestorAmp;
let gestorFrec;

//-------ESTADOS Y EVENTOS DE SONIDO-----
let haySonido = false;
let antesHabiaSonido = false;
let empezoElSonido = false;
let terminoElSonido = false;

//-------TEMPORIZADORES----

let marcaInicioSonido = 0;
let marcaFinSonido = 0;
let durSonido = 0;
let durSilencio = 0;
let sonidoLargo = false;
let marcaUltimoPitch = 0;
// Si no llega pitch por unos ms, se considera ausencia de altura confiable.
let timeoutSinPitch = 300;


//=================================
//              SETUP
//=================================
function setup() {
  createCanvas(windowWidth, windowHeight);

  mic = new p5.AudioIn();

  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec = new GestorSenial(NOTA_MIN, NOTA_MAX);
  gestorFrec.dibujarDerivada = true;

  lienzo = createGraphics( width , height );
  temporal = createGraphics( width , height );

  lienzo.background(0);

  c = new Caminante();
  
}

//=================================
//              DRAW
//=================================

function draw() {
  background(255,0,0);

  //------ACTIVACION DE AUDIO----
  if (!audioIniciado) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Haz click para comenzar", width / 2, height / 2);
    return;
  }

  amp = mic.getLevel();

  if (calibrandoAmp) {
    // Captura extremos de amplitud observados para ajustar el rango del gestor.
    pisoAmp = min(pisoAmp, amp);
    techoAmp = max(techoAmp, amp);
    fill(255, 0, 0);
  } else {
    fill(0);
  }

  gestorAmp.actualizar(amp);

  // Variables derivadas del análisis: intensidad (amplitud) y altura (pitch) suavizadas.
  intensidad = gestorAmp.filtrada;
  altura = gestorFrec.filtrada;
  
  // Cuando no hay pitch válido, se evita mostrar derivada vieja para no confundir lectura.
  difAltura = gestorFrec.derivada;

  haySonido = intensidad > umbralRuido;

  // Detectores de flanco para disparar eventos una sola vez en inicio/fin de sonido.
  empezoElSonido = haySonido && !antesHabiaSonido;
  terminoElSonido = !haySonido && antesHabiaSonido;

  if (empezoElSonido) {
    let margen = 100;
    x = random( margen , width-margen );
    y = random( margen , height-margen );
    diam = 50;
    elColor = color( 0 , 255 , 0);
  }

  if (haySonido) {

    tinte = altura * 360;
    push();
    colorMode( HSB , 360 , 100 , 100 , 100 );
    elColor = color( tinte , 100 , 100 );
    pop();

    diam += velocidad;

    temporal.clear();

    temporal.push();
    temporal.stroke( elColor );
    temporal.noFill();
    temporal.strokeWeight(10);
    temporal.ellipse( x , y , diam , diam );
    temporal.pop();
    
  }

  if (terminoElSonido) {
    temporal.clear();
    circulos[ cantidad ] = new Circulo( x , y , diam, tinte );
    cantidad ++;

  }

  for( let i=0 ; i<cantidad ; i++ ){
    circulos[i].actualizar( lienzo );
    circulos[i].dibujarGrafico( lienzo );
  }
  image( lienzo , 0 , 0 );
  image( temporal , 0 , 0 );

  if (!haySonido) {
    durSilencio = millis() - marcaFinSonido;
  }

  
  //---------MONITOREO------
  if (monitor) {
    monitoreo();
    antesHabiaSonido = haySonido; //guardo el estado anterior
    return;
  }


  antesHabiaSonido = haySonido; //guardo el estado anterior

}

//=================================
//              FUNCIONES
//=================================

//-------MONITOREO------

function monitoreo() {
  background(0);
  textSize(20);
  textAlign(LEFT, BASELINE);
  text(
    "AMP: " +
      amp.toFixed(3) +
      " | pisoAmp: " +
      pisoAmp.toFixed(3) +
      " | techoAmp: " +
      techoAmp.toFixed(3),
    50,
    50,
  );

  text("FREC: " + frec.toFixed(2), 50, 100);
  text("NOTA: " + notaMidi.toFixed(2), 50, 150);
  text("INTENSIDAD: " + intensidad.toFixed(2), 50, 200);
  text("ALTURA: " + altura.toFixed(2), 50, 250);
  text("DIF ALTURA: " + difAltura.toFixed(2), 50, 300);
  text("DUR SONIDO: " + (durSonido / 1000).toFixed(2) + " s", 50, 350);
  text("DUR SILENCIO: " + (durSilencio / 1000).toFixed(2) + " s", 50, 400);
  text(
    "SONIDO LARGO: " + (sonidoLargo ? "SI" : "NO") +
      " | UM. " + (umbralDuracionSonido / 1000).toFixed(2) + " s",
    50,
    450,
  );
  // Se evita mostrar eventos de un frame para no introducir ruido visual en monitoreo.
  text("HAY SONIDO: " + (haySonido ? "SI" : "NO"), 50, 500);
  text(
    "HAY PITCH: " + (hayPitch ? "SI" : "NO") +
      " | UMBRAL RUIDO: " +
      umbralRuido.toFixed(2),
    50,
    550,
  );
  text(
    "CALIBRACION AMP: " + (calibrandoAmp ? "ACTIVA" : "INACTIVA") +
      " | C: calibrar | A: aplicar rango | M: monitoreo",
    50,
    600,
  );

  gestorAmp.dibujar(width - 500, 50);
  gestorFrec.dibujar(width - 500, 200);
}

//-------INICIALIZACION DE AUDIO-----
async function iniciarAudio() {
  if (audioIniciado) {
    return;
  }

  try {
    // Requisito del navegador: activar WebAudio con interacción del usuario.
    await userStartAudio();
    mic.start(
      () => {
        background(0);
        audioIniciado = true;
        marcaInicioSonido = millis();
        marcaFinSonido = millis();
        marcaUltimoPitch = millis();
        // Pitch detection se inicializa cuando el stream del micrófono ya existe.
        startPitch();
      },
      (error) => {
        console.error("No se pudo iniciar el microfono", error);
      },
    );
  } catch (error) {
    console.error("No se pudo habilitar el contexto de audio", error);
  }
}

function mousePressed() {
  iniciarAudio();
}

function touchStarted() {
  iniciarAudio();
  return false;
}

//----------------DETECCION DE FRECUENCIA------------
// inicia el modelo de Machine Learning para deteccion de pitch
function startPitch() {
  // Conecta el modelo CREPE al stream de entrada actual.
  pitch = ml5.pitchDetection(
    model_url,
    getAudioContext(),
    mic.stream,
    modelLoaded,
  );
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (err) {
      // Reintento con pausa corta para evitar bucles de error muy agresivos.
      console.error("Error en getPitch:", err);
      setTimeout(getPitch, 120);
      return;
    }

    if (frequency) {
      frec = frequency;
      // Traduce frecuencia continua a escala MIDI para analizar altura musical.
      notaMidi = freqToMidi(frequency);
      hayPitch = true;
      marcaUltimoPitch = millis();
      // Solo se alimenta el gestor cuando hay altura válida.
      gestorFrec.actualizar(notaMidi);
    } else {
      // Sin frecuencia detectada: no forzar nota 0 evita falsas "notas graves".
      frec = 0;
      hayPitch = millis() - marcaUltimoPitch <= timeoutSinPitch;
    }

    // Consulta continua para mantener actualización de altura en tiempo real.
    getPitch();
  });
}

//--------TECLADO------
function keyPressed() {
  if (key === "c" || key === "C") {
    calibrandoAmp = !calibrandoAmp;
    // Exporta rápidamente los extremos capturados para pegarlos en configuración.
    console.log("AMP_MIN =", pisoAmp);
    console.log("AMP_MAX =", techoAmp);
    console.log(`let AMP_MIN = ${pisoAmp}; let AMP_MAX = ${techoAmp};`);
  }

  if (key === "a" || key === "A") {
    // Aplica en caliente la calibración capturada para evitar copiar/pegar manual.
    if (isFinite(pisoAmp) && isFinite(techoAmp) && techoAmp > pisoAmp) {
      gestorAmp.minimo = pisoAmp;
      gestorAmp.maximo = techoAmp;
      console.log("Rango aplicado a gestorAmp:", gestorAmp.minimo, gestorAmp.maximo);
    } else {
      console.warn("No hay calibración válida todavía para aplicar.");
    }
  }

  if (key === "m" || key === "M") {
    monitor = !monitor;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
