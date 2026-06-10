/* PASAR DATOS DE AMPLITUD AL CAMINANTE: Hola chicos soy Fran, en esta parte del codigo sumando del SONIDO1, ahora tiene
la configuración de amplitud minima y maxima. Mientras emitan un sonido largo,
las lineas aumentan su velocidad. Miren la amplitud activando la booleana haySonido a true.*/

let caminante =[];
let escalaNoise;

let p;
let img;

//------ Configuracion ------
let AMP_MIN = 0.10; //UNBRAL MINIMO DE SONIDO QUE SUPERA AL RUIDO DE FONDO
let AMP_MAX = 0.90; //AMPLITUD MAXIMA DEL SONIDO
//------ MICROFONO ------
let mic;

//------ AMPLITUD ------
let amp; //variable para cargar la amplitud
let haySonido = false;


//------ IMPRIMIR ------
let IMRPIMIR = false;

//------

function preload() {
  img = loadImage("img/imagen.jpg");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(225);

  p = new Paleta(img);
  for (let i = 0; i < 10; i++) {
    caminante[i] = new Caminante(p.darUnColor());
  }

  //------ MICROFONO ------
  mic = new p5.AudioIn();
  mic.start();
  userStartAudio();
}

function draw() {


  if (IMRPIMIR) {
    printData();
  }

  amp = mic.getLevel();
  haySonido = amp > AMP_MIN;

  if (haySonido) {

    for (let i = 0; i < 10; i++) {
      caminante[i].actualizar(amp);
      caminante[i].dibujar();
      caminante[i].mover();
      caminante[i].comprobarLimites();
    }
  }
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
