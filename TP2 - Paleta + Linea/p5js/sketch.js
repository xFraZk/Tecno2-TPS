let caminante =[];
let escalaNoise;

let p;
let img;
function preload() {
 img = loadImage("img/imagen.jpg");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(225);

  p = new Paleta(img);

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
    background(225);   
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
