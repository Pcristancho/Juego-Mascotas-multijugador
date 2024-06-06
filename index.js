//recordar que de momento hubo que instalar node, npm y expres
//aqui lo que voy a realizar es crear el servidor con ayuda de una libreria 
//que lo facilita para poder usar el juego de mokepon online}
//para ello con express lo que hago es crear una aplicacion que representa al servidor 
//al cual recibir las peticiones de los clientes y por lo tanto responderles tambien 
console.log('hola Node');
const express=require("express"); //aqui estamos importando express,"requiere" es una funcion especial de express,lo nos permite usar librerias que 
                            //instalamos con npm para el cual exportamos express
const   cors= require("cors") //esta es otra libreria que se hizo para trabajar con express
                              // con ayuda de esta podemos arreglar el detalle de acceder desde la pagina externa la aplicacion de mokepon sin que ponga problema por eso 
                              //, con eso se arregla este problema de raiz de lo contrario tocaria seguir definiendolo para cada caso al parecer


  

const app=express();//en teoria creo estoy instanciando al servidor aqui

app.use(cors()); //aqui es donde se usa la libreria en la aplicacion para que no ponga problema por el error de la pagina externa entre otras caosas 
                 // no me quedo claro si podia retirar entonces lo del res.setHeader("Access-Control-Allow-Origin","*"); o no 
app.use(express.static("public")); // aqui se selecciona una carpeta para hacer que en uno de los endpointso tambien es decir en una url de nuestras rutas , podamos "servir"  archivos estaticos (osea un html, css, javascript, imagenes o todo lo que un navegador puede entender ) normalmente se usa la carpeta "public" pero no es obligatorio. TODO esto con la idea de poder entrar el front end de nuestra aplicacion desde el servidor de node.js. AHORA inicialmente tenia los archivos de css js y html por fuera de la carpeta public y para poderlo compartir deben estar dentro de esta que especifique , no obstante si descuadra como importe a los archivos hay que corregir (no hace falta compartir index porque es lo que refiere al servidor y solo nos interesa compartir lo que refiere y use al front end de la aplicacion ) pero en este punto lo que hago es aceder mediante la url del http// localhost:8080 que configure ese puerto .
// IMPORTANTE yo tengo que imagniar que lo que o ponga ahi es lo que necesita el front para funcionar bien porque resulta que no tenia la carpeta assets y aunque si estaba bien dirigia la ruta en el codigo porque estaba fuera de "public" no servida porque el servidor en localhost de esto solo usa lo qeu esta en la carpeta especificada lo demas como que no lo permite buscar asi , lo curioso es que para este archivo de servidor no hizo falta colocarlo a¿en public pero pues si se usa en el servidor y tiene sentido que no lo necesite porque segun el profe se coloca en la carpta lo que necesita el FRONT para funcionar



app.use(express.json());// con esto le abro la capacidad a servidor de poder recibir (supongo que enviar tambien aunque creo no se puede no se) informacion en formato de JSON 


// vamos a crear una lista de jugadores que es los que van a unir al servidor
const jugadores=[];/// inicialmente la lista de jugadores inicai vacia

//AHROA PARA cada jugador se va a tener en cuenta coomo un objeto con propiedades 

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

// endpoint para asignar ide al jugador actual-------------------------------
app.get("/unirse",(req,res)=>{ //el req es la peticion y res la respuesta que le damos al usuario esto se determino asi
    //res.send("Hola usuario") // asi como esta quien acceda al servidor solo responde el mensaje 
    const   id=`${(Math.random())}` //genero un numero aleatorio para generar un ID esta es una forma facil pero hay mejores
    const jugador=new Jugador(id);  //genero a un jugador que va a contener la info de su id
    jugadores.push(jugador) //añado el jugador a la lista de los Qque van ingresando   
   
    res.setHeader("Access-Control-Allow-Origin","*"); //establecemos una cabecera donde permitimos que haga llamadas del tipo del error que se presento "Access-Control-Allow-Origin" 
                    //esto se debe a que el html del juego no esta en el servidor sino en otro lado de mi pc y una solicitud hecha desde alli  se toma como insegura por eso da este error 
                    // para corregirlo se procede a configurar este servidor apra que se permita escribiendo como esta en la instuccion 
                    // OJO esto lo hacemos aqui pero lo cierto es que puede ser inseguro , para terminar el "*" indica que se permite solicitudes desde cualquier origen
    res.send(id);
    // res.send("tu numero de ID es: "+id);  //esto indica que 
    
}); // el .get() es para indicarle para cuando esten pidiendo solicitudes (los clientes) vamos a revisar cosas
                //lo que necesita es .get(en que url va a necesitar ese recurso, como procesar la solicitud o como tratar lso datos de la peticion y como responder parece que normalmente es con una funcion ()=>)
                //si para el primer parametro no necesitas alguna url simplemente se coloca "/" y no estaria haciendo nada en ese apartado, porque entiendo es para el enlace normal sin añadiduras a otra parte ej creo https:://www.platzi/ o asi donde no accede a algo exactamente ademas de el enalce original
    //algo curioso es que para este caso coloque /unirse y ese ya seria un endpoint si lo entendi bien pues 
    //seria localhost:8080/unirse

// endpoint para recibir el id y el nombre del mokepon del jugador actual-----------------------------
app.post("/mokepon/:jugadorId/",(req,res)=>{//este ya seria para otro servicio , que se usa para saber que enviar 
    // nota: por si me confundo, esto se ve como desde el punto del vista del usuario, arriba es para cuando el usuario hace un get y aqui cuando hace un post 
    //NOTA: la profe indica que es mejor que se haga un servicio para cada cosa 
    // aqui se usa una "variable tipo parametro" ya que esta dentro del enlace y tiene el ID del jugador que se creo , 
    //se declara con el ":" del enlace

    const jugadorId=req.params.jugadorId || ""; // el id lo obtengo del propio enlace que estaria en el request o solicitud , eso tiene muchas cosa mas
                                                //  OJO el || "" es "o dejar con vacio" ya que si no llega respuesta entocnes lo deja con "" osea vacio
    
    const nombreMok=req.body.mokepon || ""; // trae del body de la peticion el nombre del mokepon  sino lo deja vacia
    // console.log(nombreMok);
    const mokepon=new Mokepon(nombreMok);
    // una vez obtengo el moquepon (y creo porque cuadno asigne el id correspndiente al jugador fue en otra parte) 
    // voy a buscar en la lista de jugadores el id correspondiente al jugador y le asigno el mokepon gracias al metodo de lista find index que devuleve el indice de la lista el elemento que cumpla la condicion (si no existe devuelve -1)
    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); //regresa el id del jugador si coincide ocn la condicion (parece que en find index normamente se escribe una funcion como aparece )
    // console.log(jugadorindex)
    if(jugadorindex>=0) { // si es mayor o igual a index 0 es porque lo encontro , sino devuelve -1 y no lo deberia asignar a nadie en la lista
        jugadores[jugadorindex].asignarMokepon(mokepon); //aqui el jugador en lista tiene su id y ahora su mokepon seleccionado en ese momento 
        // console.log("si encontro");
    }

    console.log(jugadores); //se imprime la lista de jugadores
    console.log(jugadorId); // se imprime el id del jugador que llego 
    const enemigos= jugadores.filter((jugador)=> jugadorId !==jugador.id); //filtra la lista de jugadores que no soy yo actualemnte
      

    
    // res.end(); /// esto es para que en respuesta no responda nada 
    res.send({enemigos}) //en nodejs solo puedes devolver json no una lista asi no mas, osea objetos ya que es {}
})

// entpoint para obtener la posicion en el mapa del mokepon del jugador - ademas regresa la posicion de los demas jugadores----------------------
app.post("/mokepon/:jugadorId/posicion",(req,res)=>{
    const jugadorId=req.params.jugadorId || ""; // el id lo obtengo del propio enlace que estaria en el request o solicitud , eso tiene muchas cosa mas
                                                //  OJO el || "" es "o dejar con vacio" ya que si no llega respuesta entocnes lo deja con "" osea vacio
    const   x= req.body.x || 0; //se trae el valor de posicion x del body de la peticion sino encuentra por defecto sera 0 
    const   y= req.body.y || 0;

    // voy a buscar en la lista de jugadores el id correspondiente al jugador y le actulizo posicion en servidor gracias al metodo de lista find index que devuleve el indice de la lista el elemento que cumpla la condicion (si no existe devuelve -1)
    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); //regresa el id del jugador si coincide ocn la condicion (parece que en find index normamente se escribe una funcion como aparece )
    // console.log(jugadorindex)
    if(jugadorindex>=0){ // si es mayor o igual a index 0 es porque lo encontro , sino devuelve -1 y no lo deberia asignar a nadie en la lista
        jugadores[jugadorindex].actualizarPosicion(x,y); //aqui el jugador en lista tiene su id y ahora su posicion en este momento
        // console.log("si encontro");
    }
    // AHORA entiendo que en post no solo se puede lelgar la solicitud y cambiar unirseAlJuego, se debe responder, pero en este caso no respondemos nada, luego se responde nulo ... asi 
    const   enemigos= jugadores.filter((jugador)=> jugador.id!== jugadorId) // enemigos sera la lista hecho por el filtro de todo jugador en lista que no tenga el jugadorID del jugador actual , esos son los enmigos 

    
    res.send(
        {
            enemigos    //recordemos qu en node js se manejan JSON por eso devuelvo con un JSON o objeto
        }
        );
})

app.post("/Mokepon/:jugadorId/ataques",(req,res)=>{
    const jugadorId=req.params.jugadorId || "" // guardara caracter vacio si no viene el id
    const ataques=req.body.ataques || ""    //aqui iba es [] porque el prof enviaba era todos los ataques de una vez pero yo lo hice para que sea uno a la vez
    // console.log(`servidor mi ataque es ${ataques}`)
    const jugadorindex= jugadores.findIndex((jugador)=> jugadorId===jugador.id); //regresa el id del jugador si coincide ocn la condicion (parece que en find index normamente se escribe una funcion como aparece )
    // console.log(jugadorindex)
    if(jugadorindex>=0){ // si es mayor o igual a index 0 es porque lo encontro , sino devuelve -1 y no lo deberia asignar a nadie en la lista
        jugadores[jugadorindex].asignarAtaque(ataques); //aquise va enviando de a un ataque porque lo tenia asi
        // console.log(`servidor mi ataque es  ${jugadores[jugadorindex].ataque}`)
        // aqui
    }
    res.end(); 

})

app.get("/mokepon/:jugadorId/ataques",(req,res)=>{
    const jugadorId=req.params.jugadorId || "" // guardara caracter vacio si no viene el id

    const jugador=jugadores.find((jugador)=>jugador.id === jugadorId);
    // console.log(`servidor ataque es ${jugador.ataques}`)
    res.send(
        {ataques: jugador.ataque ||""   //"sin ataqueeeeeeee" //envia una cadena vacia si no envio ataque aqui iva ATAQUES PERO= CREO ESTA MAL
        
    })
   
})



app.get("/mokepon/estado",(req,res)=>{
    // const jugadorId=req.params.jugadorId || "" // guardara caracter vacio si no viene el id

    // const jugador=jugadores.find((jugador)=>jugador.id === jugadorId);
    // console.log(`servidor ataque es ${jugador.ataques}`)
    res.send(
        {   jugadores
        
    })
   
})

// app.get("/mokepon/borrarAtaquesActuales",(req,res)=>{
//         //borra los ataque actualemnte guarados de los jugadores que en este punto ya tienen porque se acaba de realizar un combate
//     // jugadores[jugadorId].ataques= "";
//     // jugadores[enemigoId].ataques= "";
//     // jugadores.forEach((jugador) => {
//     //     jugador.ataque="";
        
//     // });




    
//     jugadores[0].limpiarAtaque();
//     jugadores[1].limpiarAtaque();
//     res.send(
//         {  respuesta: "borrados"
        
//     })
   
// })

app.get("/mokepon/:jugadorId/borrarAtaquesActuales",(req,res)=>{
        //borra los ataque actualemnte guarados de los jugadores que en este punto ya tienen porque se acaba de realizar un combate
    const jugadorId=req.params.jugadorId// guardara caracter vacio si no viene el id

    const jugador=jugadores.find((jugador)=>jugador.id === jugadorId);
    // console.log(`servidor ataque es ${jugador.ataques}`)
    console.log(`el ataque actual del enemigo es ${jugador.ataque}`)
   if(jugador.ataque){
    jugador.limpiarAtaque();
    }
    res.send(
        {  respuesta: "borrados"
        
    })
   
})



    
// configuracion para que se esuche peticiones a traves del puerto 8080 OJO con cual se escoje ,siempre hay puertos reservados para otras cosas ------------------------
app.listen(8080,()=>{   //aqui es como ordenamos que esuche toda peticion de los clientes a este puerto 
    console.log('Servidor funcionando') ///aqui creo solo se define un callback cualqueira creo
}) //aqui estoy preparando par hacer que el servidor pueda escuchar las peticiones de los clientes
            //indicandole que pueto va a usar 

//lo anterior es el codigo minimo para crear un servidor aunque aun no hace nada solo el mensaje a quien acceda

// NOTA: para apagar el servidor mintras se esta ejeutando en consola es usar la instruccion Crtl +c como en robot

// y para arrancarlo es escirbir en consola node index.js o segun el nombre pero normalmente se maneja asi 


//NOTAS DE CLASE 
// Hay 2 formas de instalar cosas en node.
// Local: npm install <cosa>. Al instalar librerías así, éstas serán almacenadas en la carpeta node_modules y solo las podrán ver los archivos de nuestro proyecto.
// Global: npm install -g <cosa>. Al instalar librerías así, serán almacenadas de manera que todo nuestro computador pueda verlas.
// Instalar las cosas localmente es muy bueno, ya que quizás en un proyecto necesitas una versión de express, mientras que en otro proyecto necesitas otra versión
// de express (o cualquier otro módulo). En ese caso, tener una instalación global causaría conflictos. Rara vez querréis instalar cosas globalmente en npm.