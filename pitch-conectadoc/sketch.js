
//------ Configuracion ------
let AMP_MIN = 0.03; // Lo bajamos mucho para que capte tu voz normal
let AMP_MAX = 1; // Bajamos el techo del volumen también
let AMORTIGUACION = 0.9;

let FREC_MIN = 900;
let FREC_MAX = 2000; // Lo subimos mucho para que abarque todos los picos

let IMRPIMIR = true;

// --------------------------------------------

const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let audioContext;
let mic;


let caminante =[];
let escalaNoise;

// ----------- PALETA DE COLORES ----------- //
let p; //Paleta 1
let img; //imagen paleta 1

let elColor;
let colorInicial;
let colorFinal;





//------ AMPLITUD ------
let amp; //variable para cargar la amplitud
let haySonido = false;
let antesHabiaSonido = false; //memoria del estado "haySonido" un fotograma atras

//------ GESTOR ------
let gestorAmp;
let gestorPitch;

//------ ESTADOS ------


//------

function preload() {
  img = loadImage("img/imagen.jpg");
  img2 = loadImage("img/p2.jpg");
}


function setup() {
createCanvas(windowWidth, windowHeight);
  background(225);

  p = new Paleta(img);
  p2 = new Paleta(img2);
  
  for (let i = 0; i < 10; i++) {
    caminante[i] = new Caminante(p.darUnColor());
  }


   //------ GESTOR ------
   gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
   gestorAmp.f = AMORTIGUACION;
   gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);
   
   
  //------ MICROFONO ------
  mic = new p5.AudioIn();

  userStartAudio();
   audioContext = getAudioContext();

  mic.start(startPitch);
}

function draw() {
  gestorAmp.actualizar(mic.getLevel());

  amp = gestorAmp.filtrada;
  haySonido = amp > AMP_MIN;

 let empezoElSonido = haySonido && !antesHabiaSonido; //EVENTO
 let finDelSonido = !haySonido && antesHabiaSonido;
 
 



  if (haySonido) {
     for (let i = 0; i < 10; i++) {
      caminante[i].actualizar(amp);
      caminante[i].dibujar();
      caminante[i].mover();
      caminante[i].comprobarLimites();
    }
  }
  
 
  
   if (IMRPIMIR) {
    printData();
  }
  
  antesHabiaSonido = haySonido; //guardo el estado anterior del fotograma
}


//------------------------ SONIDO ------------------------
function printData() {
 background(255);
  
    push();
   
    noStroke();
  textSize(16);
  fill(0);
  let texto;

  texto = 'amplitud: ' + amp;
  text(texto, 20, 20);

  // 2. Frecuencia Mínima
  let textoFrecMin = 'Frecuencia Mínima: ' + FREC_MIN + ' Hz';
  text(textoFrecMin, 20, 40);

  // 3. Frecuencia Máxima
  let textoFrecMax = 'Frecuencia Máxima: ' + FREC_MAX + ' Hz';
  text(textoFrecMax, 20, 60);

  // 4. Pitch Actual
  let textoPitch = 'Pitch Actual: ' + gestorPitch.filtrada.toFixed(2) + ' Hz';
  text(textoPitch, 20, 80);

  fill(0);
  ellipse(width/2, height-amp * 1000, 30, 30);
  pop();
  
  strokeWeight(1);
  gestorAmp.dibujar(100, 500);
  gestorPitch.dibujar(100, 300);
}





//------------------------ Pitch ------------------------

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext , mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, frequency) {

    if (frequency && haySonido) { 
      gestorPitch.actualizar(frequency);
      console.log(frequency);
    } else {

      gestorPitch.actualizar(FREC_MIN); 
    }
    
  
    setTimeout(getPitch); 
  });
}

function keyPressed() {
  if (key == ' ') {
    background(225);
    for (let i = 0; i < 10; i++) {
      caminante[i] = new Caminante(p.darUnColor());
    }
  }

  if (key == 'v') {
    for (let i = 0; i < 10; i++) {
      caminante [i].vel +=1 ;
    }
  }

  if (key == 'a') {
    for (let i = 0; i < 10; i++) {
      caminante [i].t +=4 ;
    }
  }
}
