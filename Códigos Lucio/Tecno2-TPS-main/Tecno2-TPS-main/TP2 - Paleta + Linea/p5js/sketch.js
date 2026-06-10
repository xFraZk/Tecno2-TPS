let caminante =[];
let colores = [];
let escalaNoise;

let p;
let img;
function preload() {
 img = loadImage("img/imagen.jpg");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  p = new Paleta(img);
  background(p.darUnColor());


  for(let i = 0; i < 10; i++){
    caminante[i] = new Caminante(p.darUnColor());
  }
}

function draw() {
  for(let i = 0; i < 10; i++){
    caminante[i].dibujar();
    caminante[i].mover();
    caminante[i].comprobarLimites();
    
  }
}

function keyPressed(){
  if (key == ' ') {
    background(p.darUnColor());   
    for (let i = 0; i < 10; i++){
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
