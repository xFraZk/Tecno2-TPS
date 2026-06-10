
let caminante =[];
let escalaNoise;

// ----------- PALETA DE COLORES ----------- //
let p; //Paleta 1
let p2; //Paleta 2


let img; //imagen paleta 1
let img2; //imagen paleta 2

//------ Configuracion ------
let AMP_MIN = 0.10; //UNBRAL MINIMO DE SONIDO QUE SUPERA AL RUIDO DE FONDO
let AMP_MAX = 0.90; //AMPLITEUD MAXIMA DEL SONIDO
//------ MICROFONO ------
let mic;

//------ AMPLITUD ------
let amp; //variable para cargar la amplitud
let haySonido = false;
let antesHabiaSonido = false; //memoria del estado "haySonido" un fotograma atras


//------ IMPRIMIR ------
let IMRPIMIR = false;

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

  //------ MICROFONO ------
  mic = new p5.AudioIn();
  mic.start();
  userStartAudio();
}

function draw() {
  
  amp = mic.getLevel();
  haySonido = amp > AMP_MIN;

 let empezoElSonido = haySonido && !antesHabiaSonido; //EVENTO
 
if (empezoElSonido) {
    
  //Aca van el movimiento cambio cuando afecte el sonido
   
    
  }

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

  background(255)
    push();
  textSize(16);
  fill(0);
  let texto;

  texto = 'amplitud: ' + amp;
  text(texto, 20, 20);

  fill(0);
  ellipse(width/2, height-amp * 1000, 30, 30);
  pop();
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
