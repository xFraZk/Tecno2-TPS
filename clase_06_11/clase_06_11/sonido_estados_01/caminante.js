class Caminante{

    constructor( x_ , y_ , dir_ , tinte_ , vida_ ){
        this.x = x_;
        this.y = y_;
        this.anteX = x_;
        this.anteY = y_;
        this.t = 5;
        this.vel = 4;
        this.dir = dir_;
        push();
        colorMode( HSB , 360 , 100 ,100 );

        let variacion = 60;
        let tinte = tinte_ + random(-variacion,variacion);

        tinte = ( tinte + 360 ) % 360;

        this.elColor = color( tinte , 100 , 100 );
        pop();
        this.estado = "curva";
        this.anguloGiro = radians(4) * ( random(100)<50 ? 1 : -1 );
        this.reiniciarTiempo();

        let factor = map( vida_ , 50 , 500 , 0.1 , 1 );
        this.tiempoVida = int( random(10,50) * factor );
    }

    actualizar(){

        if( this.estado == "curva" ){ //estado
            this.girar();
            this.mover();

            this.tiempoVida --;
            this.cuentaRegresiva --;

            if( this.tiempoVida <= 0 ){//evento
                this.estado = "fin;"
            }else if( this.cuentaRegresiva <= 0 ){//evento
                this.estado = "cambiarGiro";
                this.reiniciarTiempo();
            }

        }else if( this.estado == "cambiarGiro" ){ //estado

            this.anguloGiro *= -1;

            this.estado = "curva";
            this.reiniciarTiempo();
            
        }else if( this.estado == "fin" ){ //estado

        }

    }

    dibujar(){
        // let alfa = constrain(
        //     map( this.tiempoVida , 0 , 100 , 100 , 0 ) , 0 , 100 );
        push()
        stroke( this.elColor );
        // stroke( red(this.elColor) , green(this.elColor), blue(this.elColor) , alfa );
        line( this.x, this.y, this.anteX , this.anteY);
        // fill( this.elColor );
        // ellipse( this.x, this.y , this.t , this.t  );
        pop();
    }

    dibujarGrafico( grafico ){

        if( this.estado == "curva" ){
            grafico.push()
            grafico.stroke( this.elColor );
            grafico.line( this.x, this.y, this.anteX , this.anteY);
            grafico.pop();
        }
    }

    girar(){
        this.dir += this.anguloGiro;
    }

    mover(){
        this.anteX = this.x;
        this.anteY = this.y;
        // this.dir += radians( random(-10,10) );

        let dx = this.vel * cos( this.dir );
        let dy = this.vel * sin( this.dir );

        this.x += dx;
        this.y += dy;

        
        // if( this.x > width ){
        //     this.x -= width;
        //     this.anteX = this.x;
        // }
        // if( this.x < 0 ){
        //     this.x += width;
        //     this.anteX = this.x;
        // }
        // if( this.y < 0 ){
        //     this.y += height;
        //     this.anteY = this.y;
        // }
        // if( this.y > height ){
        //     this.y -= height;
        //     this.anteY = this.y;
        // }
        //         condicion.   ? asignar-si   : asignar-no
        // this.x = ( this.x>width ? this.x-width : this.x );
        // this.x = ( this.x<0 ? this.x+width : this.x );
        // this.y = ( this.y>height ? this.y-height : this.y );
        // this.y = ( this.y<0 ? this.y+height : this.y );
    }

    perseguir( xo , yo ){
        this.dir = atan2( yo-this.y , xo-this.x );
    }

    reiniciarTiempo(){
        this.cuentaRegresiva = int(random(10,20));
    }

}