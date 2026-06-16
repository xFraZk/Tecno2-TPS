
class Circulo{


    constructor( x_ , y_ , diam_ , tinte_ ){
        this.x = x_;
        this.y = y_;
        this.tinte = tinte_;

        this.diam = diam_;
        push();
        colorMode( HSB , 360 , 100 ,100 );
        this.elColor = color( tinte , 100 , 100 );
        pop();
        this.estado = "configurar";
        this.incremento = 2;
        this.estaChocando = false;
    }

    actualizar( grafico ){

        if( this.estado == "crecer" ){

            console.log( this.estado );
            this.diam += this.incremento;

            // console.log("valor = "+ this.estaChocando);
            if( this.estaChocando ){

                if( this.diam > 150 ){
                    this.estado = "configurar";
                }else{
                    this.estado = "fin";
                }               

            }
        }else if( this.estado == "configurar" ){
            this.caminantes = [];
            this.cantidadCaminantes = int(this.diam,150,500,30,150);
            for( let i=0 ; i<this.cantidadCaminantes ; i++ ){
                let angulo = map( i , 0 , this.cantidadCaminantes , 0 , TWO_PI );
                let dx = this.diam/2 * cos( angulo );
                let dy = this.diam/2 * sin( angulo );
                this.caminantes[i] = new Caminante( this.x+dx , this.y+dy , 
                    angulo + PI , this.tinte , this.diam );
            }
            this.estado = "dibujar";

            grafico.push();
            grafico.fill(0,180);
            grafico.ellipse(this.x,this.y,this.diam,this.diam);
            grafico.pop();

        }else if( this.estado == "dibujar" ){
            for( let i=0 ; i<this.cantidadCaminantes ; i++ ){
                this.caminantes[i].actualizar();
                this.caminantes[i].dibujarGrafico( grafico );
            }

        }else if( this.estado == "fin" ){

        }

    }

    comparar( otroCirculo ){
        let margen = 10;

        if( !this.estaChocando ){
            
            let distanciaCentros = dist( this.x, this.y, 
                otroCirculo.x , otroCirculo. y );

            let sumaRadios = this.diam/2 + otroCirculo.diam/2;

            if( distanciaCentros < sumaRadios + margen ){
                
                this.estaChocando = true;
                
            }
        }
        return this.estaChocando;
    }

    dibujar(){
        
            push()
            
            if( this.estado == "crecer" ){
                fill(0);
            }else{
                noFill();
            }
            // noFill();
            stroke( this.elColor );
            if( this.estado == "fin" ){
                strokeWeight(5);
            }
            ellipse( this.x, this.y ,  this.diam , this.diam );
            pop();
        
    }

    dibujarGrafico( grafico ){
        
        
            grafico.push()
            
            if( this.estado == "crecer" ){
                grafico.fill(0);
            }else{
                grafico.noFill();
            }
            // noFill();
            grafico.stroke( this.elColor );
            if( this.estado == "fin" ){
                grafico.strokeWeight(5);
            }
            grafico.ellipse( this.x, this.y ,  this.diam , this.diam );
            grafico.pop();
        
    }

}
/*
Relacion NO Simetrica

for( let i=0 ; i<cantidad ; i++ ){
    for( let j=0 ; j<cantidad ; j++ ){
        if( i!=j ){
            establece la relacion
        }
    }
}

Relacion SIMETRICA

for( let i=0 ; i<cantidad-1 ; i++ ){
    for( let j=i+1 ; j<cantidad ; j++ ){        
        establece la relacion        
    }
}

*/