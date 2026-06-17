class Paleta {
  constructor(imgcargado) {
 this.imagen = imgcargado;
 }
 
 darUnColor() {
 let posX = int(random(this.imagen.width));
 let posY = int(random(this.imagen.width));
 return this.imagen.get(posX, posY);
 }
 
 darUnColorAlfa(alfa) {
   let posX = int(random(this.imagen.width));
   let posY = int(random(this.imagen.width));
   
   return color(red(este), green(este), blue(este), alfa);
 }
}
