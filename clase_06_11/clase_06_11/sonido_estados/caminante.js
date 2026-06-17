class Caminante{

    constructor(){
        this.x = random( width );
        this.y = random( height );
        this.t = 5;
        this.vel = 4;
        this.dir = random( TWO_PI );
        push();
        colorMode( HSB , 360 , 100 ,100 );
        this.elColor = color( random(60) , 100 , 100 );
        pop();
    }

    dibujar( intensidad ){
        this.t = intensidad * 30;
        push()
        fill( this.elColor );
        ellipse( this.x, this.y , this.t , this.t  );
        pop();
    }

    mover( diferencia ){
        let angulo = diferencia * 20;
        this.dir += radians( angulo );

        let dx = this.vel * cos( this.dir );
        let dy = this.vel * sin( this.dir );

        this.x += dx;
        this.y += dy;
        //         condicion.   ? asignar-si   : asignar-no
        this.x = ( this.x>width ? this.x-width : this.x );
        this.x = ( this.x<0 ? this.x+width : this.x );
        this.y = ( this.y>height ? this.y-height : this.y );
        this.y = ( this.y<0 ? this.y+height : this.y );
    }

    perseguir( xo , yo ){
        this.dir = atan2( yo-this.y , xo-this.x );
    }

}