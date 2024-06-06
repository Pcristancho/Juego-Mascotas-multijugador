
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
let lienzo=mapa.getContext("2d");
let imgMapaBackground=new Image();
    imgMapaBackground.src="./assets/mokemap.png";
let alturaQueBuscamos
let anchoDelMapa=window.innerWidth-20 
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

    constructor(nombre,foto,vida,icono_mapa,x,y,id){
        this.id=id || null;
        this.nombre=nombre;
        this.foto=foto;
        this.vida=vida;
        this.ataques=[]; 
        this.x=x ||20;
        this.y=y ||30;
        this.ancho=40;
        this.alto=40;
        this.mapaFoto= new Image(); 
        this.mapaFoto.src=foto;       
        this.icono_mapa=new Image()
        this.icono_mapa.src=icono_mapa;
        this.velovidadX=0;
        this.velovidadY=0;
    }  

    pintarMokepon() {
        lienzo.drawImage(this.icono_mapa,
            this.x,
            this.y,
            this.ancho,
            this.alto);    
    }

}

let hipodoge= new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',3,'./assets/hipodoge.png');
let capipepo= new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',3,'./assets/capipepo.png');
let ratigueya= new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',3,'./assets/ratigueya.png');

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
    inputHipodoge = document.getElementById('Hipodoge') 
    inputCapipepo = document.getElementById('Capipepo')
    inputRatigueya = document.getElementById('Ratigueya')

}


function iniciarJuego() {
    Mokepones.push(hipodoge,capipepo,ratigueya);
    Mokepones.forEach(mokepon_ind => {
    añadir_mokepon(mokepon_ind); 
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

    fetch("http://192.168.101.9:8080/unirse")
    .then(function (res){

        if(res.ok){ 
            res.text() 
            .then(function (respuestaTexto){
                console.log (respuestaTexto)
                jugadorId=respuestaTexto; //guardo el id del jugador
            }) 

        }
    
    })
    .catch(function(error){
        console.log("el error es" +error);
    })
}

function seleccionarMascotaJugador() {
    
    
    sectionSeleccionarMascota.style.display = 'none'; 
    sectionVerMapa.style.display='flex'; 
    

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id;
        Mokepon_jugador=inputHipodoge.id; 


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


    // //--------------------------------------
    Mokepones.forEach(mokepon => { 
        if(mokepon.nombre==Mokepon_jugador){
            Mokepon_jugador_obj=mokepon;
        }
    });

    seleccionarMokepom(Mokepon_jugador); //inicia los datos al backend y envia que nombre mokepon seleciona
    
    seleccion_num_mok_enemigos(num_enemigos); // aqui llena un vector con todos los posibles objetos de mokepones enemigos 
    
    iniciarMapa();


}
function seleccionarMokepom(mascotaJugador){

    fetch("http://192.168.101.9:8080/mokepon/" +jugadorId+"/",{
        method:"POST",
        headers:{
            "Content-Type":"application/json" 
        },
        body:  JSON.stringify(
            {
                mokepon: mascotaJugador 
            }
        )

    })

    

}

function seleccion_num_mok_enemigos(num){

    for (let i = 0; i < num; i++) {

        let mokepon_temporal_para_copiar=Mokepones[seleccionarMascotaEnemigo()]; 
        let Mok_enemigo=JSON.parse(JSON.stringify(mokepon_temporal_para_copiar)); 

        Mok_enemigo.icono_mapa=mokepon_temporal_para_copiar.icono_mapa;
        Mok_enemigo.mapaFoto=mokepon_temporal_para_copiar.mapaFoto;
        
        Mokepones_enemigos[i]=Mok_enemigo; 
        Mokepones_enemigos[i].x= aleatorio(300,(mapa.width-Mokepones_enemigos[i].ancho));  
        Mokepones_enemigos[i].y= aleatorio(300,(mapa.height-Mokepones_enemigos[i].alto));
    }
}

function seleccionarMascotaEnemigo(){
    let mascotaAleatoria = aleatorio(0,Mokepones.length-1);
    return mascotaAleatoria;
}

function seleccionarMascotaEnemigo_falta() {
    let mascotaAleatoria = aleatorio(0,Mokepones.length-1);

    spanMascotaEnemigo.innerHTML=(Mokepones[mascotaAleatoria]).nombre;   
    Mokepon_enemigo=Mokepones[mascotaAleatoria]; 
    ataques_mokepon_enemigo=Mokepon_enemigo.ataques;
    iniciarMapa();

    mostrar_botones_jugador()
}

function mostrar_botones_jugador(){

    Mokepones.forEach(mokepon => {
        if(mokepon.nombre==Mokepon_jugador){
            console.log('llego al mokepon y es '+ Mokepon_jugador);
            dibujar_botones(mokepon);
        }
    });
}

function dibujar_botones(mokepon){
    let ataques_mokepon=mokepon.ataques;
    console.log(ataques_mokepon)
    ataques_mokepon.forEach(ataque => {

        let boton=`
        <button class="ataques BAtaque">${ataque.nombre}</button>
        `;
        lugar_botones_jugador.innerHTML += boton;
                
    });

    botones_ataques_mok_jug=document.querySelectorAll('.BAtaque');//guarda en si los <boton> de cada ataque
    
    secuenciaAtaque(botones_ataques_mok_jug);


}

function secuenciaAtaque(botoness){
    botoness.forEach(boton => {

        boton.addEventListener('click',(evento)=>{ 
            console.log(evento);
            let tipo_ataque=evento.target.textContent; 
            // console.log('aaaaaaaaaaaaaaaa '+tipo_ataque+'aaaaa');

            if(tipo_ataque.includes("Fuego🔥")){ 

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
    enviarAtaque(ataqueJugador);  
}
function ataqueAgua() {
    ataqueJugador = 'AGUA'
    enviarAtaque(ataqueJugador);  
}
function ataqueTierra() {
    ataqueJugador = 'TIERRA'
    enviarAtaque(ataqueJugador);  
}

function enviarAtaque(ataqueDeMiMokepon){
    console.log(`envio ataques de mi id ${jugadorId} y de mi enemigo ${enemigoId} y ataque ${ataqueDeMiMokepon}`)

    fetch(`http://192.168.101.9:8080/mokepon/${jugadorId}/ataques`,{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            ataques: ataqueDeMiMokepon})    
    });
    intervalo=setInterval(obtenerAtaques,500)   // se ejeuta cada 50 ms
    
}

function obtenerAtaques(){
    fetch(`http://192.168.101.9:8080/mokepon/${enemigoId}/ataques`)
        .then((res)=>{
            if(res.ok){ 
                console.log("el ataque enemigo es ")
                res.json()
                .then(({ataques})=>{
                    console.log(`vector de atauqes de 1 es ${ataques}`)
                    valoresJugadores();

                    if(ataques !==""){
                        console.log(`ENTRA AL IFFFFFF`)
                        console.log(`ataque ${ataques}`)
                        ataqueEnemigo=ataques;
                        combate();

                        console.log("FINALIZA ATAQUE desspues de combate()")

                        borrarAtaqueActual();


                     
                        
                    }
                })

            }
        })
}


function valoresJugadores(){
    fetch(`http://192.168.101.9:8080/mokepon/estado`)
        .then((res)=>{
            if(res.ok){ 
                console.log("valores jugadores es")
                res.json()
                .then((respuesta)=>{
                    
                    console.log(respuesta); 
                })


            }
        })
}

function borrarAtaqueActual(){
    clearInterval(intervalo);

    return fetch(`http://192.168.101.9:8080/mokepon/${enemigoId}/borrarAtaquesActuales`)
        .then((res)=>{
            if(res.ok){ 
                console.log("la respuesta de blanquear es ")
                res.json()
                .then((respuesta)=>{   
                    console.log('se muestran con ataque borrado priemro luego la respuesta de blanquear ')                
                    valoresJugadores();
                    console.log(respuesta); 
                    return respuesta;   
                })
                
            }
        })
}

function ataqueAleatorioEnemigo() {

    let Num_ataqueAleatorio=aleatorio(0,ataques_mokepon_enemigo.length-1); 
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
    
    nuevoAtaqueDelJugador.innerHTML=ataqueJugador; //con estas 5 lineas sale el hitorial de ataques es nuevo
    nuevoAtaqueDelEnemigo.innerHTML=ataqueEnemigo;
    sectionMensajes.innerHTML=resultado;
    ataqueDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataqueDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
    

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
    window.addEventListener('keydown',tecla_pulsada); 
    window.addEventListener('keyup',soltar_tecla);
    
}
function pintarCanvas(){

    // velocidades del mokepon jugador------
    Mokepon_jugador_obj.x = Mokepon_jugador_obj.x + Mokepon_jugador_obj.velovidadX
    Mokepon_jugador_obj.y = Mokepon_jugador_obj.y +Mokepon_jugador_obj.velovidadY

    lienzo.clearRect(0,0, mapa.width, mapa.height);
    lienzo.drawImage(imgMapaBackground,0,0,mapa.width,mapa.height)
    //dibujo al mokepon jugador
    lienzo.drawImage(Mokepon_jugador_obj.icono_mapa,
                    Mokepon_jugador_obj.x,
                    Mokepon_jugador_obj.y,
                    Mokepon_jugador_obj.ancho,
                    Mokepon_jugador_obj.alto)
    // actualizo posiciones en backend                
    enviarPosicion(Mokepon_jugador_obj.x,Mokepon_jugador_obj.y);

    //dibujo los mokeponos de otros jugadores reales
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
            y   
        })
    }).then(function(res){
        if(res.ok){ 
            res.json().then(function({enemigos}){ 
                console.log(enemigos); 

                mokeponesEnemigos= enemigos.map((enemigo)=>{
                    let mokeponEnemigo=null; // OJO VAN ES LOS MOKEPONES REALES DE OTROS JUGADORES QUE SE UNEN 
                    let mokeponNombre=enemigo.mokepon.nombre || "" 
                    if(mokeponNombre=="Hipodoge"){
                        mokeponEnemigo= new Mokepon('Hipodoge','./assets/mokepons_mokepon_hipodoge_attack.png',3,'./assets/hipodoge.png',enemigo.x,enemigo.y,enemigo.id);
                    }else if(mokeponNombre=="Capipepo"){
                        mokeponEnemigo= new Mokepon('Capipepo','./assets/mokepons_mokepon_capipepo_attack.png',3,'./assets/capipepo.png',enemigo.x,enemigo.y,enemigo.id);
                    }else if(mokeponNombre=="Ratigueya"){
                        mokeponEnemigo= new Mokepon('Ratigueya','./assets/mokepons_mokepon_ratigueya_attack.png',3,'./assets/ratigueya.png',enemigo.x,enemigo.y,enemigo.id);

                    }

                    return mokeponEnemigo;
                })
                



            })

        }
    })

}

function moverMokeponDerecha(){   
    Mokepon_jugador_obj.velovidadX =5;    

}  
function moverMokeponIzquierda(){  
    Mokepon_jugador_obj.velovidadX =-5;    

}
function moverMokeponArriba(){ 
    Mokepon_jugador_obj.velovidadY=-5;    

}
function moverMokeponAbajo(){    
    Mokepon_jugador_obj.velovidadY= +5;    

}
function detenerMov(){
    Mokepon_jugador_obj.velovidadX=0
    Mokepon_jugador_obj.velovidadY=0
}
function tecla_pulsada(evento){
                             
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

        return;
    }else{

        detenerMov();

        clearInterval(movimiento); 


        enemigoId=mokepon_enemigo_param.id || -1; 

        spanMascotaEnemigo.innerHTML=mokepon_enemigo_param.nombre;
        Mokepon_enemigo=mokepon_enemigo_param; //aqui va con objeto completo
        ataques_mokepon_enemigo=mokepon_enemigo_param.ataques;
        sectionVerMapa.style.display='none';
        sectionSeleccionarAtaque.style.display='flex';
        mostrar_botones_jugador()
    }

}

window.addEventListener('load', iniciarJuego)
