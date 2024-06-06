// NOTAL PERSONAL, para lo dle combate lo resolvi que entonces cuadno se efectual el ataque de ambos y sale el resultado , debeb ahora borar SOLO el ataque ya registrado pero para el enemigo , si lo hace apra ambos falla aun no entiendo porque aun lo estoy analizadno pero tambein es correto que solo borre ell de el enegimo oprque estaria sobreescribriendo mi actual ataque por lo que no habira que borrar ambos, pero borrar ambos lo daña por alguan razon 

//la dinamica del juego cambia, ahora se hara que no depende de las vidas 
// sino de los ataques, como lo entiendo cada mokepon tiene n ataques, en teoria
// todos tiene 5 y se seleccionan los ataques hasta que pasen los 5 ataques

// const { response } = require("express")

//(supongo porque cada vez se inhabiliatan los ataques usados)
let ataqueJugador
let ataqueEnemigo
let victoriasJugador = 0
let vicotriasEnemigo = 0
const botonReiniciar = document.getElementById('boton-reiniciar')  // la mayoria se pasaron de let a const porque como se trata de para buscar un elemento del html eso no va a cambiar entonces la cambiaron por const
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
let botonFuego //= document.getElementById('boton-fuego')
let botonAgua //= document.getElementById('boton-agua')
let botonTierra //= document.getElementById('boton-tierra')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
let inputHipodoge 
let inputCapipepo 
let inputRatigueya 
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')
const spanVictoriasJugador = document.getElementById('vidas-jugador')
const spanVictoriasEnemigo = document.getElementById('vidas-enemigo')
const sectionMensajes = document.getElementById('resultado_f')   
const ataqueDelJugador = document.getElementById('ataqueDelJugador')
const ataqueDelEnemigo = document.getElementById('ataqueDelEnemigo')
const sectionMensajes2 = document.getElementById('mensajes')   
let lugar_mokes=document.getElementById('mostrar_mokepones');
let lugar_botones_jugador=document.getElementById('area_botones');
let total_juagadas=0;
let numero_ataques_totales=5;
const sectionVerMapa=document.getElementById('ver-mapa');
const mapa=document.getElementById('mapa');
let lienzo=mapa.getContext("2d");//para poder hacer cosas en el canvas se debe obetner el contexto del canvas
                                   //y se declara 2d porque vamos a trabajar en 2 dimensiones 
let imgMapaBackground=new Image();
    imgMapaBackground.src="./assets/mokemap.png";
let alturaQueBuscamos
let anchoDelMapa=window.innerWidth-20 //el innerwidth toma el ancho actual que tenga en pantalla la ventana y le resta 20 para no tomar tan exactamente ese ancho
                                    //ojo esta medida la esta tomando uanm vez por actualizacion de pagina obviamente, de momento no estoy haciendo que se actualize en tiempo real

const anchoMaximoDelMapa=800; // serian 350px
if(anchoDelMapa>anchoMaximoDelMapa){
    anchoDelMapa=anchoMaximoDelMapa-20; //el -20 es para no tomar exacto el ancho sino un poco menos
}
alturaQueBuscamos=anchoDelMapa * 600 / 800 ; //esto viene de una regla de 3 del tamaño original que teniamos para cualquier proporcion que tendria ante el cambio de tamaño de pantalla
//tambien se maneraja un max para que no sea tan grande en pantalla
//ahora defino esos tamaños al mapa
mapa.width=anchoDelMapa;
mapa.height=alturaQueBuscamos;

let jugadorId=null;// va a tener el id del jugador que viene del get al servidor por lo tanto mientras pasa se deja nulo 
let enemigoId=null;// como logicamente solo puedo enfrentar a un enemigo por juego , necesito saber cual de todos los enemigos reales me choque para enviar al servidor



class Mokepon{

    // constructor(nombre,foto,vida,icono_mapa,x=20,y=30){
    constructor(nombre,foto,vida,icono_mapa,x,y,id){
        this.id=id || null;
        this.nombre=nombre;
        this.foto=foto;
        this.vida=vida;
        this.ataques=[]; //el profe decide agregar esto despues y se deja vacio
        //lo siguiente es para controlar la posicion en el canvas osea el lienzo
        this.x=x ||20;
        this.y=y ||30;
        this.ancho=40;
        this.alto=40;
        this.mapaFoto= new Image(); //crea un formato imagen osea creo objeto imagen
        this.mapaFoto.src=foto;        //le coloca que imagen debe tenr
        this.icono_mapa=new Image()
        this.icono_mapa.src=icono_mapa;
        this.velovidadX=0;
        this.velovidadY=0;
    }  
    // segun la clase se hizo que lo de pintarlo en el mapa se añadiera como funcion que forma parte
    // de la clase , pero si hago eso (en mi caso pasaria para cuadno clono los mokepones para los enemigos ya que la profe solamente lso creo como si fueran uno normla pero enemigo )
    // no se añaden los metodos al clon asi que lo dejo donde se pintaba normalmente y ya 
    pintarMokepon() {
        lienzo.drawImage(this.icono_mapa,
            this.x,
            this.y,
            this.ancho,
            this.alto);    
    }

}

//-------------------- NOOOOTA POR ALGUNA RAZON TUBE QUE MODIFICAR LAS UBICACIONES DE IMAGENES Y ASI ----------//

let hipodoge= new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',3,'./assets/hipodoge.png');
let capipepo= new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',3,'./assets/capipepo.png');
let ratigueya= new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',3,'./assets/ratigueya.png');
//let hipodoge2=new Mokepon('Hipodoge2','../assets/mokepons_mokepon_hipodoge_attack.png',3);
console.log(hipodoge);
let Mokepones=[]; //aqui guardare todos los mokepones que se crean 
let mokeponesEnemigos=[]    //OJO este representa la lista de enemigos que son otros jugadores reales conectados no son los que estan por defecto
let Mokepon_jugador;
let Mokepon_jugador_obj;
let Mokepon_enemigo;
let botones_ataques_mok_jug=[];
let ataques_mokepon_enemigo=[];
let movimiento;
let intervalo;
let num_enemigos=3;
let Mokepones_enemigos=[];

const HPODOGUE_ATAQUES=[
    {nombre: 'Agua💧',id: 'boton-agua'},
    {nombre: 'Agua💧',id: 'boton-agua'},
    {nombre: 'Agua💧',id: 'boton-agua'},
    {nombre: 'Fuego🔥',id: 'boton-fuego'},
    {nombre: 'Tierra🌱',id: 'boton-tierra'}]
//ahroa el profe le agrega varios ataques para cada Mokepón 
hipodoge.ataques.push( // se añaden varios ataques al arreglo, por ahora son repetidos algunos
    ...HPODOGUE_ATAQUES
);

const CAPIPEPO_ATAQUES=[
    {nombre: 'Tierra🌱',id: 'boton-tierra'},
    {nombre: 'Tierra🌱',id: 'boton-tierra'},
    {nombre: 'Tierra🌱',id: 'boton-tierra'},
    {nombre: 'Agua💧',id: 'boton-agua'},
    {nombre: 'Fuego🔥',id: 'boton-fuego'}
]
capipepo.ataques.push( // se añaden varios ataques al arreglo, por ahora son repetidos algunos
    ...CAPIPEPO_ATAQUES
);
const RATIGUEYA_ATAQUES=[
    {nombre: 'Fuego🔥',id: 'boton-fuego'},
    {nombre: 'Fuego🔥',id: 'boton-fuego'},
    {nombre: 'Agua💧',id: 'boton-agua'},
    {nombre: 'Fuego🔥',id: 'boton-fuego'},
    {nombre: 'Tierra🌱',id: 'boton-tierra'}
]
ratigueya.ataques.push( // se añaden varios ataques al arreglo, por ahora son repetidos algunos
    ...RATIGUEYA_ATAQUES
);

function añadir_mokepon (Mokepon){
    let div= document.createElement('div');
    let mokepon_individual= `
    <input type="radio" name="mascota" id=${Mokepon.nombre} />
    <label class="tarjeta-de-mokepon" for=${Mokepon.nombre}>
       <div class="tarjetas2">
         <p>${Mokepon.nombre}</p>
         <img src=${Mokepon.foto} alt=${Mokepon.nombre}>
       </div>
        
    </label>`;
    div.innerHTML=mokepon_individual;
    lugar_mokes.appendChild(div);
    inputHipodoge = document.getElementById('Hipodoge') // me funciona si dejo estas asignaciones fuera del For each
                                                        // y de hecho creo que asi como esta es mas repetitivo volviendo a asignar
                                                        // los mismo pero lo dejo asi de momento por seguir al profe 
    inputCapipepo = document.getElementById('Capipepo')
    inputRatigueya = document.getElementById('Ratigueya')
    //NOTA en platzi el profe hizo fue no crear un div aqui y agregarlo con 
    //appendchild sino lo que hizo fue , poner unciamente lo de mokepon_individual 
    // si se pondria a lugar_mokepones como "lugar_mokepones.innerHTML += mokepon_individual"
    // y asi se va concatenadndo cada vez , es otra Buena opcion
}


function iniciarJuego() {
    Mokepones.push(hipodoge,capipepo,ratigueya);//los guardo en un vector o arreglo
    Mokepones.forEach(mokepon_ind => {
    añadir_mokepon(mokepon_ind); //por cada mokepon en el arreglo "Mokepones" uso la funcion para añadirlos al HTML
    });
    
    sectionVerMapa.style.display='none';
    sectionSeleccionarAtaque.style.display = 'none';
    sectionReiniciar.style.display = 'none'
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)
    //de paso de haber iniciado el juego y luego de haber cargado todo, se invoca el servicio creado en NODE js del servidor de express
    unirseAlJuego();

}
function unirseAlJuego(){
    // fetch("http://localhost:8080/unirse")
    fetch("http://192.168.101.9:8080/unirse")
    .then(function (res){
        //console.log(res); //muestra la respuesta del get (por defecto fetch usa get a no ser que se indique) y resulta que esa respuesta es un objeto, no es que como tal muestre lo que indicamos (osea el id) , para ello debemos ahcer otro paso mas como sigue
        if(res.ok){ //pregunta si la respuesta fue exitosa , osea creo con estatus ok 
            res.text() // nos regresa la respuesta en forma de texto, SI LO QUIERO en JSON seria con otro metodo
            .then(function (respuestaTexto){
                console.log (respuestaTexto)
                jugadorId=respuestaTexto; //guardo el id del jugador
            }) //este metodo de text tiene then pues es una promesa NO SE COMO AJJAJA

        }
    
    })
    .catch(function(error){
        console.log("el error es" +error);
    })
}

function seleccionarMascotaJugador() {
    
    
    sectionSeleccionarMascota.style.display = 'none'; 
    //sectionSeleccionarAtaque.style.display = 'flex' // por ahora se cambia mostrar ataques por ver el mapa
    sectionVerMapa.style.display='flex'; 
    

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id;
        Mokepon_jugador=inputHipodoge.id; // tomara solo el nomnbre no el objeto dle mokepon
        //console.log("llego");

    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id;
        Mokepon_jugador=inputCapipepo.id;
    } else if (inputRatigueya.checked) {
        spanMascotaJugador.innerHTML = inputRatigueya.id
        Mokepon_jugador=inputRatigueya.id
    } else {
        alert('Selecciona una mascota')
        location.reload();
        // iniciarJuego()
        // return;
    }

    //lienzo.fillRect(5,20,15,40); //el fillrect es llenar un rectangulo y debe indicar (posx, posy, ancho, alto) segun cordenadas , pero ancho y alto es segun cuantos campos del canvas
    // pero dibujar un rectangulo no hace poner la imagen del mokepon , para eso toca con otra cosa , cmo sigue 
    //-- esto se habia hehco apra explciar como funciona pero lueog se
    //cambio a que lso parametros sean parte del constructor de la clase
    // let imagenDeCapipepo=new Image();
    // imagenDeCapipepo.src= capipepo.foto;
    // lienzo.drawImage(
    //     imagenDeCapipepo,5,20,100,100
    // );
    // //--------------------------------------
    Mokepones.forEach(mokepon => { //esto es simplemente para asiganr el objeto del mokepon que el jugador elige porque como lo venia manejando solo guardaba el id
        if(mokepon.nombre==Mokepon_jugador){
            Mokepon_jugador_obj=mokepon;
        }
    });
    //pintarPersonaje(Mokepon_jugador_obj);

    
    //seleccionarMascotaEnemigo()

    seleccionarMokepom(Mokepon_jugador); //inicia los datos al backend y envia que nombre mokepon seleciona
    
    seleccion_num_mok_enemigos(num_enemigos); // ESSSTE VA ,aqui llene un vector con todos los posibles objetos de mokepones enemigos 
    console.log('ya paso')
    
    
    
    //ahroa procedo a dibujarlos con el del jugador 
    iniciarMapa();//----------------------------------------------------------------------


}
function seleccionarMokepom(mascotaJugador){

    fetch("http://192.168.101.9:8080/mokepon/" +jugadorId+"/",{//aqui añado el id del jugador en el enlace
        method:"POST",
        // ahora la idea es inidcar 
        // -tipo de dato a enviar al servidor (con la cabecera de la peticion)
        // -los datos a enviar 
        headers:{
            "Content-Type":"application/json" //especifico que el tipo de contenido es json
        },
        body:  JSON.stringify(
            {
                mokepon: mascotaJugador //envio el nombre de la mascota del jugador al backend
            }
        )//segun el estandar de fetch para body debe ser una cadena de texto para lo que quiera usar
        //luego lo que uiqera llevar de mensaje en el body hay que pasarlo a caracteres o string

    })
    //en este caso el fetch no tiene then o catch porque pues solo estoy enviando, no hace falta 
    

}

function seleccion_num_mok_enemigos(num){
    //num=1; //para pruebas
    for (let i = 0; i < num; i++) {
        //primero hayq que hacer una copia del objeto del mokepon porque si solo lo asigno con "=" literalmente apuntan a mismo 
        // espacio de meoria y lo que se modifique por parte del primer asigando se vera tambien en el segundo , para eviatr esto se hace 
        // copia de la siguiente forma (intente con JSON.stringify y JSON.parse pero lo hace solo a superficial , ya a niveles inferiores como otro objeto dentor ya no )
        //let Mok_enemigo=structuredClone(Mokepones[seleccionarMascotaEnemigo()]);
        let mokepon_temporal_para_copiar=Mokepones[seleccionarMascotaEnemigo()]; //tengo uan copia completa del mokepon(recordemos que estaria apuntando al mismo punto de memoria)
        let Mok_enemigo=JSON.parse(JSON.stringify(mokepon_temporal_para_copiar)); //aqui realizo la clonacion independiente, sien mbargo no es profunda asi que debo añadir manualmente lo que falta
        //--------- esto es igual a simlemente remplazar como sigue al final--------------
        // Mok_enemigo.icono_mapa=new Image();
        // Mok_enemigo.icono_mapa.src=mokepon_temporal_para_copiar.icono_mapa.src;
        //--------------------------------------------------------------------------------
        Mok_enemigo.icono_mapa=mokepon_temporal_para_copiar.icono_mapa;// esto se hace porque usar la clonacion con json tiene algunas limitaciones. Por ejemplo, no funciona bien con objetos que contienen referencias a funciones, RegExp, o propiedades no enumerables.
                                                                      // de momento no identifique metodo para realizar completo clone
        Mok_enemigo.mapaFoto=mokepon_temporal_para_copiar.mapaFoto;
        
        //let Mok_enemigo=Mokepones[seleccionarMascotaEnemigo()]
        Mokepones_enemigos[i]=Mok_enemigo; // OJO luego ahora existiran los 3 mokepones que se diseñaron inicialmente mas que aqui se hace copias de los originales adicionales  
        //tambien les añado de una vez la posicion aleatoria que tienen 
        // tengo en cuenta que las posiciones aleatorias donde salen los mokepones en mapa no pueden ser erradas respecto a sus dimensiones de representacion en el mapa
        // Mokepones_enemigos[i].x= aleatorio(0,(mapa.width-Mokepones_enemigos[i].ancho)); 
        // Mokepones_enemigos[i].y= aleatorio(0,(mapa.height-Mokepones_enemigos[i].alto));
        Mokepones_enemigos[i].x= aleatorio(300,(mapa.width-Mokepones_enemigos[i].ancho));  // el mapa original mente es de 800x600 asi que lo detalle para que los enemigos no salgan tan cerca
        Mokepones_enemigos[i].y= aleatorio(300,(mapa.height-Mokepones_enemigos[i].alto));
    }
}

function seleccionarMascotaEnemigo(){
    let mascotaAleatoria = aleatorio(0,Mokepones.length-1);
    return mascotaAleatoria;
}

function seleccionarMascotaEnemigo_falta() {
    let mascotaAleatoria = aleatorio(0,Mokepones.length-1);
    //ahora en vez de selecionar asi, hara que se selecionaleatoriamente de la lista
    // de mascotas 
    spanMascotaEnemigo.innerHTML=(Mokepones[mascotaAleatoria]).nombre;   
    Mokepon_enemigo=Mokepones[mascotaAleatoria]; //aqui va con el objeto completo
    ataques_mokepon_enemigo=Mokepon_enemigo.ataques;// es el vector
    iniciarMapa();

    mostrar_botones_jugador()
}

function mostrar_botones_jugador(){

    Mokepones.forEach(mokepon => {
        if(mokepon.nombre==Mokepon_jugador){
            console.log('llego al mokepon y es '+ Mokepon_jugador);
            dibujar_botones(mokepon);//envio todo el objeto
        }
    });
}

function dibujar_botones(mokepon){
    let ataques_mokepon=mokepon.ataques;//seria un vector o arreglo 
    console.log(ataques_mokepon)
    ataques_mokepon.forEach(ataque => {
        // let boton=`
        // <button id=${ataque.id} class="ataques">${ataque.nombre} </button>
        // `;
        let boton=`
        <button class="ataques BAtaque">${ataque.nombre}</button>
        `;
        lugar_botones_jugador.innerHTML += boton;
                
    });

    botones_ataques_mok_jug=document.querySelectorAll('.BAtaque');//guarda en si los <boton> de cada ataque
    
    secuenciaAtaque(botones_ataques_mok_jug);
    //-------------------------------------------------

}

function secuenciaAtaque(botoness){
    botoness.forEach(boton => {
        // boton.addEventListener('click',(e)=>{ //esto l ohace para poder identificar la ruta de el boton y el texto o text content , primeor leyendo en consola como llegar a eso y lo uso seguio a esto 
        //     console.log(e);
        // })
        boton.addEventListener('click',(evento)=>{ //esto l ohace para poder identificar la ruta de el boton y el texto o text content , primeor leyendo en consola como llegar a eso y lo uso seguio a esto 
            console.log(evento);
            let tipo_ataque=evento.target.textContent; //lo que pasa aqui es que uso al propio evento de hacer click ya que puedo ver desde ese evento a QUIEn o que le hago click, y entre
                                                        // a ese quien objeto puedo ver sus propiedades, entre ellas el texto del boton para este caso 
                                                        // lo usare para saber que ataque hacer
            console.log('aaaaaaaaaaaaaaaa '+tipo_ataque+'aaaaa');



            if(tipo_ataque.includes("Fuego🔥")){ //lo hice con includes porquesi se me iba algun espacio ya no daba ==
                //console.log('DEBERIAAA')
                ataqueFuego();
                boton.disabled=true;
            }else if(tipo_ataque.includes("Agua💧")){
                ataqueAgua();
                boton.disabled=true;

            }else if(tipo_ataque.includes("Tierra🌱")){
                ataqueTierra();  
                boton.disabled=true;
            }else{
                console.log('ninguno')
            }

            console.log("FINALIZA ATAQUE pero sin llegar atqeu eenemigo ")

        })
    });

}

function ataqueFuego() {
    ataqueJugador = 'FUEGO'
    enviarAtaque(ataqueJugador);  //se envia el ataque de mi mokepon para poder interactuar con el ataque de jugador real oponente
    // ataqueAleatorioEnemigo()    //representa al ataque dle npc no de jugadores reales    
}
function ataqueAgua() {
    ataqueJugador = 'AGUA'
    enviarAtaque(ataqueJugador);  //se envia el ataque de mi mokepon para poder interactuar con el ataque de jugador real oponente
    // ataqueAleatorioEnemigo()    //representa al ataque dle npc no de jugadores reales
}
function ataqueTierra() {
    ataqueJugador = 'TIERRA'
    enviarAtaque(ataqueJugador);  //se envia el ataque de mi mokepon para poder interactuar con el ataque de jugador real oponente
    // ataqueAleatorioEnemigo()    //representa al ataque dle npc no de jugadores reales
}

function enviarAtaque(ataqueDeMiMokepon){
    console.log(`envio ataques de mi id ${jugadorId} y de mi enemigo ${enemigoId} y ataque ${ataqueDeMiMokepon}`)
    //debo enviar el ataque y de cual id fue porque como son varios jugadores reales se debe indicar
    fetch(`http://192.168.101.9:8080/mokepon/${jugadorId}/ataques`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            ataques: ataqueDeMiMokepon})    //para el profe es ataques: ataqueJugador que es el vector de ataques
    });
    intervalo=setInterval(obtenerAtaques,500)   // se ejeuta cada 50 ms
    
}

function obtenerAtaques(){
    fetch(`http://192.168.101.9:8080/mokepon/${enemigoId}/ataques`)
        .then((res)=>{
            if(res.ok){ //verifica si si hay respuesta de la peticion para tratar los datos de ataque individual
                console.log("el ataque enemigo es ")
                res.json()
                .then(({ataques})=>{
                    console.log(`vector de atauqes de 1 es ${ataques}`)
                    valoresJugadores();
                    // if(ataques !=="sin ataqueeeeeeee" || ataques !=="" ){
                    if(ataques !==""){
                        console.log(`ENTRA AL IFFFFFF`)
                        console.log(`ataque ${ataques}`)
                        //valdia que llego el ataque (como lo maneja el profe era lenth === 5 porque los enviaba todos)
                        ataqueEnemigo=ataques;
                        combate();

                        console.log("FINALIZA ATAQUE desspues de combate()")
                        // //limpio valores para esperar la siguiente eleccion
                        // valoresJugadores(); //valido atques actuales 
                        // // ataqueJugador="";
                        // // ataqueEnemigo="";
                        // // console.log("aqui se borran ")
                        borrarAtaqueActual();
                        // valoresJugadores();
                        // // clearInterval(intervalo);

                     
                        
                    }
                })

            }
        })
}


function valoresJugadores(){
    fetch(`http://192.168.101.9:8080/mokepon/estado`)
        .then((res)=>{
            if(res.ok){ //verifica si si hay respuesta de la peticion para tratar los datos de ataque individual
                console.log("valores jugadores es")
                res.json()
                .then((respuesta)=>{
                    
                    console.log(respuesta); //observo valor actual de los jugadores con ultimo ataque añadido 
                    //ahrao como se necesita un nuevo ataque debo blanquear ambos pues no se sabe quie ataca primero ahora 
                    //pero eso lo hago en back end con funcion borrarAtaqueActual
                })


            }
        })
}

function borrarAtaqueActual(){
    clearInterval(intervalo);

    // try{
    //     const responsee=await fetch(`http://localhost:8080/mokepon/borrarAtaquesActuales`);
    //     if(!responsee.ok){
    //         throw new Error('Error al obtener los datos');
    //     }
    //     const data = await responsee.json();
    //     return data;
    // }catch (error) {
    //     // Manejar cualquier error que ocurra durante la solicitud
    //     console.error('Error:', error.message);
    //     throw error;
    //   }
    

    return fetch(`http://192.168.101.9:8080/mokepon/${enemigoId}/borrarAtaquesActuales`)
        .then((res)=>{
            if(res.ok){ //verifica si si hay respuesta de la peticion para tratar los datos de ataque individual
                console.log("la respuesta de blanquear es ")
                res.json()
                .then((respuesta)=>{   
                    console.log('se muestran con ataque borrado priemro luego la respuesta de blanquear ')                
                    valoresJugadores();
                    console.log(respuesta); //me indica si ya los blaqueo como listo o no 
                    return respuesta;   
                })
                
            }
        })
}

function ataqueAleatorioEnemigo() {
    
    //let ataqueAleatorio = aleatorio(1,3)
    let Num_ataqueAleatorio=aleatorio(0,ataques_mokepon_enemigo.length-1); // tomaremos aleatoriamente los n ataques del enemigo y se van reduciendo cada vez
    //console.log('numero aleatorio '+Num_ataqueAleatorio)
    let ataqueAleatorio=ataques_mokepon_enemigo[Num_ataqueAleatorio].nombre;
    console.log('el ataque enemigo es'+ataqueAleatorio+' y los ataques restantes son')
    console.log(ataques_mokepon_enemigo);
    if (ataqueAleatorio.includes("Fuego🔥")){ 
    ataqueEnemigo = 'FUEGO'
    } else if (ataqueAleatorio.includes("Agua💧")){
        ataqueEnemigo = 'AGUA'
    } else if(ataqueAleatorio.includes("Tierra🌱")){
        ataqueEnemigo = 'TIERRA'
    }
    ataques_mokepon_enemigo.splice(Num_ataqueAleatorio,1);
    combate()
}

function combate() { 
    //al iniciar el proceso de analizzar ataques debo parar el set interval para que no se siga ejecutando mientras
    clearInterval(intervalo) ;

    if(ataqueJugador !=="" && ataqueEnemigo !==""){
        if(ataqueEnemigo == ataqueJugador) {
            crearMensaje("EMPATE")
        } else if(ataqueJugador == 'FUEGO' && ataqueEnemigo == 'TIERRA') {
            crearMensaje("GANASTE")
            victoriasJugador++;
            spanVictoriasJugador.innerHTML = victoriasJugador;
        } else if(ataqueJugador == 'AGUA' && ataqueEnemigo == 'FUEGO') {
            crearMensaje("GANASTE")
            victoriasJugador++;
            spanVictoriasJugador.innerHTML = victoriasJugador;
        } else if(ataqueJugador == 'TIERRA' && ataqueEnemigo == 'AGUA') {
            crearMensaje("GANASTE")
            victoriasJugador++;
            spanVictoriasJugador.innerHTML = victoriasJugador;
        } else {
            crearMensaje("PERDISTE")
            vicotriasEnemigo++
            spanVictoriasEnemigo.innerHTML = vicotriasEnemigo;
        }
        
        ataqueJugador="jjk";
        ataqueEnemigo="lkjlk22"

        revisarVictorias()
    }

    
    
    
}

function revisarVictorias() {

    total_juagadas++;
    if(total_juagadas>=numero_ataques_totales){
        if (vicotriasEnemigo < victoriasJugador) {
            crearMensajeFinal("FELICITACIONES! Ganaste el juego 😀")
        } else if (vicotriasEnemigo > victoriasJugador ) {
            crearMensajeFinal('Lo siento, perdiste el juego 😑')
        }else{
            crearMensajeFinal('Gran juego, hubo empate 😅')
        }
        
    }
    
    
}

function crearMensaje(resultado) {
  
    let notificacion = document.createElement('p')
    let nuevoAtaqueDelJugador= document.createElement('p')
    let nuevoAtaqueDelEnemigo=document.createElement('p')
    //let parrafo = document.createElement('p')
    //parrafo.innerHTML = 'Tu mascota atacó con ' + ataqueJugador + ', las mascota del enemigo atacó con ' + ataqueEnemigo + '- ' + resultado
    nuevoAtaqueDelJugador.innerHTML=ataqueJugador; //con estas 5 lineas sale el hitorial de ataques es nuevo
    nuevoAtaqueDelEnemigo.innerHTML=ataqueEnemigo;
    sectionMensajes.innerHTML=resultado;
    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
    
    // sectionMensajes.innerHTML=resultado;   //estas 3 lineas es como estaba pero nosalia el hisotrial de ataques
    // ataqueDelJugador.innerHTML=ataqueJugador;
    // ataqueDelEnemigo.innerHTML=ataqueEnemigo;

}

function crearMensajeFinal(resultadoFinal) {   
    let parrafo = document.createElement('p')
    parrafo.innerHTML = resultadoFinal
    sectionMensajes2.appendChild(parrafo)
    sectionReiniciar.style.display = 'flex'
}
function iniciarMapa(){
    // mapa.width= 800;
    // mapa.height=600;
    movimiento=setInterval(pintarCanvas,50);
    window.addEventListener('keydown',tecla_pulsada); // esto es para hacer que las teclas de flechas tambien puedan mover al mokepon
    window.addEventListener('keyup',soltar_tecla);// ahora cuando no la pulse se detenga movimiento
    
}
function pintarCanvas(){
    // console.log("move");
    // velocidades del mokepon jugador------
    Mokepon_jugador_obj.x = Mokepon_jugador_obj.x + Mokepon_jugador_obj.velovidadX
    Mokepon_jugador_obj.y = Mokepon_jugador_obj.y +Mokepon_jugador_obj.velovidadY
    //trazo de limpiar pantalla para actualziar objetos y todo ----
    lienzo.clearRect(0,0, mapa.width, mapa.height);//toca indicar desde donde y hasta donde limpiar
                               //para el caso desde el origen 0,0 hasta el ancho y alto del canvas      //esto limpia el canvas porque sino sale sobrepuesto cada vez que se pinta
    //dibujo al fondo  OJOOOO parece que le orden de pintado importa
    lienzo.drawImage(imgMapaBackground,0,0,mapa.width,mapa.height)
    //dibujo al mokepon jugador
    lienzo.drawImage(Mokepon_jugador_obj.icono_mapa,
                    Mokepon_jugador_obj.x,
                    Mokepon_jugador_obj.y,
                    Mokepon_jugador_obj.ancho,
                    Mokepon_jugador_obj.alto)
    // actualizo posiciones en backend                
    enviarPosicion(Mokepon_jugador_obj.x,Mokepon_jugador_obj.y);

    //aqui dibujo los mokeponos de otros jugadores reales
    mokeponesEnemigos.forEach((mokepon)=>{
        mokepon.pintarMokepon();
        //tambien valdio coliciones con cada moekpon de jugador real
        validarColicion(mokepon);
    });



    //se dibujan los N mokepones enemigos npc
    for (let n = 0; n < num_enemigos; n++) {
        let n_mokepone_enem=Mokepones_enemigos[n];
        lienzo.drawImage(n_mokepone_enem.icono_mapa,
            n_mokepone_enem.x,
            n_mokepone_enem.y,
            n_mokepone_enem.ancho,
            n_mokepone_enem.alto);  
        
        //ahora que se ha mostrado las posiciones de cada mokepon se valdia coliciones solo si hay movimiento 
        // es decir cuando hay velociudad sino no hace falta 
        //esto es para validar colicion con otros jugadores reales
        if(Mokepon_jugador_obj.velovidadX!=0 || Mokepon_jugador_obj.velovidadY!=0){
            validarColicion(n_mokepone_enem);  
        }    

        
        
    }
    
    
    
}

function enviarPosicion(x,y){
    fetch("http://192.168.101.9:8080/mokepon/"+jugadorId+"/posicion",{
        method:"POST",
        headers:{   //tambien se configura la cabecera
            "Content-Type":"application/json" //especifico que el tipo de contenido es json
        },
        body:JSON.stringify({
            x,
            y   //algo curiosos es que en JSON si escirbimos asi, javascript entiende que la clave es el mismo valor o el valor es igual al la clave osea internamente hace x: x  y asi
        })
    }).then(function(res){
        if(res.ok){ // verifica si recibi respuesta sino no haga esto 
            res.json().then(function({enemigos}){ //descompongo la respuesta y obtengo a la lista enemigos que es la que estoy enviando en "el servidor" en el send(enemigos)
                console.log(enemigos); 
                //en este punto como recibo la lista de enemigos lo que se va a hacer es mostrar esos otros jugadores reales en el mapa osea ya cuadno tengo la lista seria crear esos mokepones en este putno que sé cuales son 
                mokeponesEnemigos= enemigos.map((enemigo)=>{
                    let mokeponEnemigo=null; // OJO AQUI VAN ES LOS MOKEPONES REALES DE OTROS JUGADORES QUE SE UNEN 
                    let mokeponNombre=enemigo.mokepon.nombre || "" //esto es interensate, ya que lo que indica es que si el primer valor no existe pues por defecto coloca "" que es cadena vacia , aunque en teoria esto no pasara nunca porque arriba estoy pendiente si llego respuesta o no , depronto el caso se da si la variable no fue bien descrita de la respuesta osea como decir mokepon.no_me_la_se ahi obvio no lo enuentra
                    if(mokeponNombre=="Hipodoge"){
                        mokeponEnemigo= new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',3,'./assets/hipodoge.png',enemigo.x,enemigo.y,enemigo.id);
                    }else if(mokeponNombre=="Capipepo"){
                        mokeponEnemigo= new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',3,'./assets/capipepo.png',enemigo.x,enemigo.y,enemigo.id);
                    }else if(mokeponNombre=="Ratigueya"){
                        mokeponEnemigo= new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',3,'./assets/ratigueya.png',enemigo.x,enemigo.y,enemigo.id);

                    }

                    //ahroa hay que pintarlo
                    // dibujarjj
                    // mokeponEnemigo.pintarMokepon(); esto funciona pero lo djea parpadeando entonces voy aretornar lso elementos mapeados
                    // minuto 18:15
                    return mokeponEnemigo;
                })
                



            })

        }
    })

}

function moverMokeponDerecha(){ //esta funcion se llama desde el HTML en el boton    
    Mokepon_jugador_obj.velovidadX =5;    
    // pintarPersonaje(Mokepon_jugador_obj);
}  
function moverMokeponIzquierda(){ //esta funcion se llama desde el HTML en el boton    
    Mokepon_jugador_obj.velovidadX =-5;    
    // pintarPersonaje(Mokepon_jugador_obj);
}
function moverMokeponArriba(){ //esta funcion se llama desde el HTML en el boton    
    Mokepon_jugador_obj.velovidadY=-5;    
    // pintarPersonaje(Mokepon_jugador_obj);
}
function moverMokeponAbajo(){ //esta funcion se llama desde el HTML en el boton    
    Mokepon_jugador_obj.velovidadY= +5;    
    // pintarPersonaje(Mokepon_jugador_obj);
}
function detenerMov(){
    Mokepon_jugador_obj.velovidadX=0
    Mokepon_jugador_obj.velovidadY=0
}
function tecla_pulsada(evento){// como donde se usa es de un event listener normalmente ellos ya devuleven un evento y lo puedo usar aqui
                             // es curioso porque donde creo el add event listener no funciona si le digo que le mando el argumento evento , pero asi si funciona
    //console.log(evento) // esto lo hago para saber como idenrifca la tecla pulsada pues identifica a todas y saber como se llamaria la propiedad 
                        // que me indica el nombre de la tecla y hacer las comparaciones asi 
    let tecla=evento.key;
    switch (tecla) {
        case "ArrowUp":
            moverMokeponArriba();
            break;
        case "ArrowDown":
            moverMokeponAbajo();
            break;
        case "ArrowRight":
            moverMokeponDerecha();
            break;
        case "ArrowLeft":
            moverMokeponIzquierda();
            break;
    
        default:
            break;
    }
    //NOTA: con el switch se muve mucho mejor que con IFs por alguan razon jajaja 


}
function soltar_tecla(){
    detenerMov();
}
function reiniciarJuego() {
    location.reload()
    total_juagadas=0;
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function validarColicion(mokepon_enemigo_param){
    //aqui se validara si al mover le mokepon el jugador choca con la imagne de los mokepones enemigos 
    // se recuerda que las imagenes son cuadrados aunque no se ve, solo se ve la forma del logo del mokepon
    const arribaMascotaEnemigo=mokepon_enemigo_param.y;
    const abajoMascotaEnemigo=mokepon_enemigo_param.y+mokepon_enemigo_param.alto;
    const izquierdaMascotaEnemigo=mokepon_enemigo_param.x;
    const derechaMascotaEnemigo=mokepon_enemigo_param.x+mokepon_enemigo_param.ancho;

    const arribaMascotaJugador=Mokepon_jugador_obj.y;
    const abajoMascotaJugador=Mokepon_jugador_obj.y+Mokepon_jugador_obj.alto;
    const izquierdaMascotaJugador=Mokepon_jugador_obj.x;
    const derechaMascotaJugador=Mokepon_jugador_obj.x+Mokepon_jugador_obj.ancho;

    if(
        abajoMascotaJugador < arribaMascotaEnemigo ||
        arribaMascotaJugador > abajoMascotaEnemigo ||
        derechaMascotaJugador < izquierdaMascotaEnemigo ||
        izquierdaMascotaJugador > derechaMascotaEnemigo 
    ){
        // si cumple alguna es porque no ha tocado al jugador por lo tanto regresa al proceso normal 
        return;
    }else{
        // si no cumple con ninguna es porque esta tocando al jugador y se ejeucta el combate 
        detenerMov();
        //resulta que como voy a cambiar de vista es mejor parar el set interval que esta atento de actualizar el mapa que esta en la funcion "iniciarMapa()"
        clearInterval(movimiento); //recordar clear los set interval cuadno no se ven ya que es gastar recursos y reloj  que no se ve o usa realmente
        //alert('se a cochado con mokepon  '+mokepon_enemigo_param.nombre);
        //se presenta la seccion para los ataques


        enemigoId=mokepon_enemigo_param.id || -1; //recibe el id del mokempon de enemigo real, si choca con uno npc por defecto el id sera -1

        spanMascotaEnemigo.innerHTML=mokepon_enemigo_param.nombre;
        Mokepon_enemigo=mokepon_enemigo_param; //aqui va con el objeto completo
        ataques_mokepon_enemigo=mokepon_enemigo_param.ataques;// es el vector
        sectionVerMapa.style.display='none';
        sectionSeleccionarAtaque.style.display='flex';
        mostrar_botones_jugador()
    }

}

window.addEventListener('load', iniciarJuego)
