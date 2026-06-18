//------ Configuracion ------
let AMP_MIN = 0.08; 
let AMP_MAX = 0.4; 
let AMORTIGUACION = 0.5;

let FREC_MIN = 700;   
let FREC_MAX = 882;
let IMPRIMIR = false;


const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let audioContext;
let mic;

let estado = "velocidad";


let marca;
let tiempoLimiteVelocidad = 7000;
let tiempoLimieteLento = 7000;
let tiempoLimieteReiniciar = 7000;
let tiempoLimieteAvanzar = 7000;
let tiempoLimieteColor = 7000;
let tiempoLimieteFin = 7000;



let caminante =[];
let escalaNoise;



// Paleta
let p; 
let p2;
let img; 
let img2;

let elColor;
let colorInicial;
let colorFinal;





//------ AMPLITUD ------
let amp; 
let haySonido = false;
let antesHabiaSonido = false; 

//------ GESTOR ------
let gestorAmp;
let gestorPitch;
                                                                                     

let activo = false; 


function preload() {
  img = loadImage("img/obra_1.jpg");
  img2 = loadImage("img/obra_4.jpg");

}


function setup() {
  createCanvas(windowWidth, windowHeight);
   background(0);
   fill(255)
  
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
  
texto = 'Estado: ' + estado;
  text(texto, 20, 20);
  gestorAmp.actualizar(mic.getLevel());

  amp = gestorAmp.filtrada;
  haySonido = amp > AMP_MIN;

 let empezoElSonido = haySonido && !antesHabiaSonido; //EVENTO
 let finDelSonido = !haySonido && antesHabiaSonido;
 

if(estado == "velocidad") {
 

  if (empezoElSonido) {

  }

  if (haySonido) {
    
for (let i = 0; i < 10; i++) {
     caminante[i].actualizar(gestorPitch.filtrada);
     caminante[i].dibujar();
     caminante[i].mover();
     caminante[i].comprobarLimites();
    }
  }

  if (finDelSonido) {
   marca = millis();
  }

  if (!haySonido) {
  let ahora = millis();
  if(ahora > marca + tiempoLimiteVelocidad) {

    estado = "lento";
    marca = millis();
  }
  }

 } else if (estado == "lento") {

  if (empezoElSonido) {

  }

  if (haySonido) {
for (let i = 0; i < 10; i++) {
     caminante[i].actualizarLento(gestorPitch.filtrada);
     caminante[i].dibujar();
    caminante[i].mover();
    caminante[i].comprobarLimites();
    }
  }

  if (finDelSonido) {
   marca = millis();
  }

  if (!haySonido) { 
  let ahora = millis();
  if(ahora > marca + tiempoLimieteLento ) {

    estado = "color";
    marca = millis();
  }
  }

 } else if (estado == "avanzar") {
   
 } else if (estado == "color") {

      if (empezoElSonido) { 
          for (let i = 0; i < 10; i++) {
    caminante[i] = new Caminante(p2.darUnColor());

  }
      }

      if (haySonido) { 
          for (let i = 0; i < 10; i++) {
              caminante[i].actualizar(gestorPitch.filtrada); 
              caminante[i].dibujar();
              caminante[i].mover();
              caminante[i].comprobarLimites();
          }
      }

 
      if (finDelSonido) { 
          marca = millis();
      }


      if (!haySonido) { 
          let ahora = millis();
          if (ahora > marca + tiempoLimieteColor) { 
              estado = "fin"; 
              marca = millis();
          }
      }

  } else if (estado == "fin") {
      

      if (empezoElSonido) { 
          estado = "reiniciar"; 
      }

  } else if (estado == "reiniciar") {
      
      background(0); 

      caminante = []; 
      
      for (let i = 0; i < 10; i++) {
          caminante[i] = new Caminante(p.darUnColor()); 
      }
      
      estado = "velocidad";
      marca = millis();

  } 
console.log(estado)
 
 
  
   if (IMPRIMIR) {
    printData();
  }
  
  antesHabiaSonido = haySonido; 

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


  let textoFrecMin = 'Frecuencia Mínima: ' + FREC_MIN + ' Hz';
  text(textoFrecMin, 20, 40);


  let textoFrecMax = 'Frecuencia Máxima: ' + FREC_MAX + ' Hz';
  text(textoFrecMax, 20, 60);



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
  

  if (key == 'o' || key == 'O') {
    background(255);
      IMPRIMIR = !IMPRIMIR;
  }

}
