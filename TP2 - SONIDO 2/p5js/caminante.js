class Caminante{

    constructor(c_){
        this.x = random(width);
        this.y = random(height);
        this.dx;
        this.dy;
        this.dir = radians(random(360));
        this.vel = 3;
        this.t = 10;
        this.c = c_;
    }
    
    //-----------------------------------------------------------------
    
    actualizar(amplitud) {
      
    this.vel = map(amplitud, AMP_MIN, AMP_MAX, 2, 20); //Mapeamos la entrada de velocidad
    
    
    }


    //-----------------------------------------------------------------
    
    dibujar(){
    stroke(this.c);
    strokeWeight(10);
    line(this.x - this.dx, this.y - this.dy, this.x, this.y);
}

   //-----------------------------------------------------------------
   
    mover(){
       
        //valor = noise((this.x+frameCount*10)*escalaNoise, (this.y+frameCount*10)*escalaNoise);
        
        //this.dir = map(valor,0,1,0,radians(360));
        this.dir += radians(random(-18,18));

        this.dx = this.vel * cos(this.dir);
        this.dy = this.vel * sin(this.dir);
        
        this.x += this.dx;
        this.y += this.dy;
    }
    
    //-----------------------------------------------------------------
    
    comprobarLimites(){
        if(this.x < 0 || this.x > width){
            this.dir = PI - this.dir;
        }
        if(this.y < 0 || this.y > height){
            this.dir= -this.dir;
        }
    }
}
