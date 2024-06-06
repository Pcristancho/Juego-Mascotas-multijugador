
console.log('hola Node');
const express=require("express"); 
const   cors= require("cors")   

const app=express();

app.use(cors()); 
app.use(express.static("public")); 

app.use(express.json());

// vamos a crear una lista de jugadores que es los que van a unir al servidor
const jugadores=[];

class Jugador {
    constructor(id){
        this.id=id
    }
    asignarMokepon(mokepon){  //aqui ademas de que el jugador tenga un id tambien se le asigna un mokepon que seria el que escoje de las tarjetas
        this.mokepon=mokepon;
    }
    actualizarPosicion(x,y){
        this.x=x;
        this.y=y;
    }
    asignarAtaque(ataque){
        this.ataque=ataque;
    }
    limpiarAtaque(){
        this.ataque="";
    }
}
class Mokepon{
    constructor(nombre){
        this.nombre=nombre;
    }
}


app.get("/unirse",(req,res)=>{ 
    const   id=`${(Math.random())}` 
    const jugador=new Jugador(id);  
    jugadores.push(jugador)  
   
    res.setHeader("Access-Control-Allow-Origin","*"); 
    res.send(id);

    
}); 


app.post("/mokepon/:jugadorId/",(req,res)=>{

    const jugadorId=req.params.jugadorId || ""; 
    
    const nombreMok=req.body.mokepon || ""; 
    const mokepon=new Mokepon(nombreMok);
    
    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); 
    if(jugadorindex>=0) { 
        jugadores[jugadorindex].asignarMokepon(mokepon); 
    }

    console.log(jugadores); //se imprime la lista de jugadores
    console.log(jugadorId); // se imprime el id del jugador que llego 
    const enemigos= jugadores.filter((jugador)=> jugadorId !==jugador.id); //filtra la lista de jugadores que no soy yo actualemnte

    res.send({enemigos}) 
})


app.post("/mokepon/:jugadorId/posicion",(req,res)=>{
    const jugadorId=req.params.jugadorId || ""; 
    const   x= req.body.x || 0; 
    const   y= req.body.y || 0;

    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); 
    if(jugadorindex>=0){ 
        jugadores[jugadorindex].actualizarPosicion(x,y); 
    }
    
    const   enemigos= jugadores.filter((jugador)=> jugador.id!== jugadorId) 
    res.send(
        {
            enemigos    //recordemos qu en node js se manejan JSON por eso devuelvo con un JSON o objeto
        }
        );
})

app.post("/Mokepon/:jugadorId/ataques",(req,res)=>{
    const jugadorId=req.params.jugadorId || "" 
    const ataques=req.body.ataques || ""    
    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); 
    if(jugadorindex>=0){ 
        jugadores[jugadorindex].asignarAtaque(ataques); 

    }
    res.end(); 

})

app.get("/mokepon/:jugadorId/ataques",(req,res)=>{
    const jugadorId=req.params.jugadorId || "" // guardara caracter vacio si no viene el id

    const jugador=jugadores.find((jugador)=>jugador.id === jugadorId);

    res.send(
        {ataques: jugador.ataque ||""   
        
    })
   
})



app.get("/mokepon/estado",(req,res)=>{
    
    res.send(
        {   jugadores
        
    })
   
})

app.get("/mokepon/:jugadorId/borrarAtaquesActuales",(req,res)=>{
        
    const jugadorId=req.params.jugadorId// guardara caracter vacio si no viene el id

    const jugador=jugadores.find((jugador)=>jugador.id === jugadorId);
    console.log(`el ataque actual del enemigo es ${jugador.ataque}`)
   if(jugador.ataque){
    jugador.limpiarAtaque();
    }
    res.send(
        {  respuesta: "borrados"
        
    })
   
})

    

app.listen(8080,()=>{   
    console.log('Servidor funcionando') 
}) 


