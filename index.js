
//****** GAME LOOP ********//
const textbox = document.querySelector(".openContainer");
const villain = document.querySelector('#villain')
const text = document.querySelector("#opener-text");
const btnStart = document.querySelector('.start')
var dino = document.querySelector(".dino");


dino.classList.remove("dino-corriendo");

text.innerHTML = `
    <p>
    Hoy eres una gigante Wari.
    <br>Ve y disfruta el mundo,
    pero ten cuidado, tienes que evitar los obstaculos...
    </p>
`

var time = new Date();
var deltaTime = 0;

    function Init() {

        time = new Date();
        Start();
        Loop();
        textbox.style.display = "none"
 
    }


function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}



//****** GAME LOGIC ********//

var montañasX= 20;

var sueloY = 22;
var velY = 0;
var impulso = 920;
var gravedad = 2300;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1280/3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 1;
var tiempoObstaculoMin = 1;
var tiempoObstaculoMax = 2;
var obstaculoPosY = 16;

var tiempoHastaEnemigo = 5;
var tiempoEnemigoMin = 1;
var tiempoEnemigoMax = 5;
var enemigoMinY = 80;
var enemigoMaxY = 280;

var velEnimigo = 0.7;

var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 1;
var tiempoNubeMax = 3.5;
var maxNubeY = 300;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var tiempoHastaEstrella = 0.2;
var tiempoEstrellaMin = 0.2;
var tiempoEstrellaMax = 4;
var maxEstrellaY = 500;
var minEstrellaY = 100;
var estrellas = [];
var velEstrellas = 0.5;

var tiempoHastacespeds= 1;
var tiempocespedsMin = 0.7;
var tiempocespedsMax= 5.5;
var maxcespedsY = 16;
var mincespedsY = 16;
var cespeds = [];
var velcespeds = 0.4;

var tiempoHastaplantas= 0.0;
var tiempoplantasMin = 0.9;
var tiempoplantasMax= 5;
var maxcespedsY = 16;
var mincespedsY = 16;
var plantas = [];
var velplantas = 0.45;

var tiempoHastaMoneda = 5;
var tiempoMonedaMin = 0.3;
var tiempoMonedaMax = 1.8;
var monedaMinY = 100;
var monedaMaxY = 200;
var interactuables = [];

var contenedor;
var textoScore;
var montañas;
var suelo;
var gameOver;
var Bunny;
var star;
// var sol;


function Start() {
    gameOver = document.querySelector(".game-over");
    montañas = document.querySelector(".montañas");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    Bunny = document.getElementsByClassName("Bunny");
    textoScore = document.querySelector(".score");
    star = document.querySelector('.star')
   //  sol = document.querySelector("#sol");
    document.addEventListener("keydown", HandleKeyDown);
    dino.classList.add("dino-corriendo");
}

var imagen = document.createElement("img");
imagen.src="img/facepoint/normal.png"
imagen.classList.add("imagen");
document.querySelector(".Bunny").appendChild(imagen);



function Update() {
    if(parado) return;
    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearEnemigo();
    DecidirCrearMonedas();
    DecidirCrearNubes();
    DecidirCrearEstrellas();
    DecidirCrearcespeds();
    DecidirCrearplantas();
    MoverObstaculos();
    MoverNubes();
    MoverEstrellas();
    Movercespeds();
    Moverplantas();
    DetectarColision();
    MoverInteractuables()
    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev){
    if(ev.keyCode == 32){
        Saltar();
    }
    if(ev.keyCode ==  13){
        Saltar();
    }
}

function Saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
        imagen.src="img/facepoint/happy.png"
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
    imagen.src="img/facepoint/normal.png"
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();

    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";

    montañasX += CalcularDesplazamiento() * velplantas;
    montañas.style.left = - montañasX% contenedor.clientWidth+"px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime ;
    // * gameVel;
}

function Estrellarse() {
    var elem = document.getElementById("file");
    if (elem.value > 0) {

         elem.value--
         dino.classList.add("dino-estrellado");
         setTimeout(function(){ dino.classList.remove("dino-estrellado")}, 300);
         dino.classList.add("parpadea");
         setTimeout(function(){ dino.classList.remove("parpadea")}, 1000);
         
    } else {
        dino.classList.remove("dino-corriendo");
        dino.classList.add("dino-estrellado");
        parado = true;
        
        text.innerHTML = `
        <h3>Awwww!</h3>
        <p>
        Fuiste derrotado,
        reinicia el juego.
        </p>
        `;
        textbox.style.display = "block" 
        btnStart.style.display = "none" 
        imagen.src="img/facepoint/murder.png"
    }

}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearEnemigo(){
    tiempoHastaEnemigo -= deltaTime;
    if(tiempoHastaEnemigo <= 0) {
        CrearEnemigo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function DecidirCrearEstrellas() {
    if(score > 20) {
        CrearEstrellas();
    }
}

function DecidirCrearcespeds() {
    tiempoHastacespeds -= deltaTime;
    if(tiempoHastacespeds <= 0) {
        Crearcesped();
    }
}

function DecidirCrearplantas() {
    tiempoHastaplantas -= deltaTime;
    if(tiempoHastaplantas <= 0) {
        Crearplanta();
    }
}

function DecidirCrearMonedas() {
    tiempoHastaMoneda -= deltaTime;
    if(tiempoHastaMoneda <= 0) {
        CrearMoneda();
    }
}


function CrearMoneda() {
    var moneda = document.createElement("div");
    contenedor.appendChild(moneda);
    moneda.classList.add("moneda");
    moneda.posX = contenedor.clientWidth;
    moneda.style.left = contenedor.clientWidth+"px";
    moneda.style.bottom = monedaMinY + (monedaMaxY - monedaMinY) * Math.random() + "px";

    interactuables.push(moneda);
    tiempoHastaMoneda = tiempoMonedaMin + Math.random() * (tiempoMonedaMax-tiempoMonedaMin) / gameVel;
}


function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    // Día
    obstaculo.classList.remove("mano");
    obstaculo.classList.remove("manos");
    obstaculo.classList.add("cactus");

    if(Math.random() > 0.5) obstaculo.classList.add("cactus2");
    // Tarde 
    if( score > 10 ){
        if(Math.random() > 0.2) obstaculo.classList.add("cactus");
        // obstaculo.classList.remove("cactus2");
        obstaculo.classList.add("mano");
        if(Math.random() > 0.5) obstaculo.classList.add("manos");
    }

    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    interactuables.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin);
}


function CrearEnemigo() {
    var enemigo = document.createElement("div");
    contenedor.appendChild(enemigo);
    enemigo.classList.add("enemigo");
    enemigo.posX = contenedor.clientWidth;
    enemigo.style.left = contenedor.clientWidth+"px";
    enemigo.style.bottom = enemigoMinY + (enemigoMaxY - enemigoMinY) * Math.random() + "px";

    interactuables.push(enemigo);
    tiempoHastaEnemigo = tiempoEnemigoMin + Math.random() * (tiempoEnemigoMax-tiempoEnemigoMin);
}

function Crearplanta() {
    var planta = document.createElement("div");
    contenedor.appendChild(planta);
    planta.classList.add("planta");


    if( Math.random() < 0.2) planta.classList.add("planta2");
    if(0.3 < Math.random() < 0.4) planta.classList.add("planta3");
    if(0.41 < Math.random() < 0.6) planta.classList.add("planta4");
    if(0.61 < Math.random() < 0.7) planta.classList.add("planta5");

    planta.posX = contenedor.clientWidth;
    planta.style.left = contenedor.clientWidth+"px";
    plantas.push(planta);
    tiempoHastaplantas = tiempoplantasMin + Math.random() * (tiempoplantasMax-tiempoplantasMin) / gameVel;
}


function Crearcesped() {
    var cesped = document.createElement("div");
    contenedor.appendChild(cesped);
    cesped.classList.add("cespeds");
    cesped.posX = contenedor.clientWidth;
    cesped.style.left = contenedor.clientWidth+"px";
    cespeds.push(cesped);
    tiempoHastacespeds = tiempocespedsMin + Math.random() * (tiempocespedsMax-tiempocespedsMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    if(Math.random() > 0.2) nube.classList.add("nube2");
    if(0.21 < Math.random() < 0.4) nube.classList.add("nube3");
    if(0.41 < Math.random() > 0.6) nube.classList.add("nube4");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function CrearEstrellas() {
    var estrella = document.createElement("div");
    contenedor.appendChild(estrella);
    estrella.classList.add("estrella");
    estrella.posX = contenedor.clientWidth;
    estrella.style.left = contenedor.clientWidth+"px";
    estrella.style.bottom = minEstrellaY + Math.random() * (maxEstrellaY-minEstrellaY)+"px";
    
    estrellas.push(estrella);
    tiempoHastaEstrella = tiempoEstrellaMin + Math.random() * (tiempoEstrellaMax-tiempoEstrellaMin) / gameVel;
}


function CrearMoneda() {
    var moneda = document.createElement("div");
    contenedor.appendChild(moneda);
    moneda.classList.add("moneda");
    moneda.posX = contenedor.clientWidth;
    moneda.style.left = contenedor.clientWidth+"px";
    moneda.style.bottom = monedaMinY + (monedaMaxY - monedaMinY) * Math.random() + "px";

    interactuables.push(moneda);
    tiempoHastaMoneda = tiempoMonedaMin + Math.random() * (tiempoMonedaMax-tiempoMonedaMin) / gameVel;
}


function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        }else{
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function MoverEstrellas() {
    for (var i = estrellas.length - 1; i >= 0; i--) {
        if(estrellas[i].posX < -estrellas[i].clientWidth) {
            estrellas[i].parentNode.removeChild(estrellas[i]);
            estrellas.splice(i, 1);
        }else{
            estrellas[i].posX -= CalcularDesplazamiento() * velEstrellas;
            estrellas[i].style.left = estrellas[i].posX+"px";
        }
    }
}

function Movercespeds() {
    for (var i = cespeds.length - 1; i >= 0; i--) {
        if(cespeds[i].posX < -cespeds[i].clientWidth) {
            cespeds[i].parentNode.removeChild(cespeds[i]);
            cespeds.splice(i, 1);
        }else{
            cespeds[i].posX -= CalcularDesplazamiento() * velcespeds;
            cespeds[i].style.left = cespeds[i].posX+"px";
        }
    }
}

function Moverplantas() {
    for (var i = plantas.length - 1; i >= 0; i--) {
        if(plantas[i].posX < -plantas[i].clientWidth) {
            plantas[i].parentNode.removeChild(plantas[i]);
            plantas.splice(i, 1);
        }else{
            plantas[i].posX -= CalcularDesplazamiento() * velplantas;
            plantas[i].style.left = plantas[i].posX+"px";
        }
    }
}

function MoverInteractuables() {
    for (var i = interactuables.length - 1; i >= 0; i--) {
        if(interactuables[i].posX < -interactuables[i].clientWidth) {
            interactuables[i].parentNode.removeChild(interactuables[i]);
            interactuables.splice(i, 1);
        }else if(interactuables[i].className === 'enemigo'){
                interactuables[i].posX -= CalcularDesplazamiento() * velEnimigo;
            }
            interactuables[i].posX -= CalcularDesplazamiento();
            interactuables[i].style.left = interactuables[i].posX+"px";
        }
    
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;
    if(score == 20){
        gameVel = 1.5;
        contenedor.classList.add("mediodia");
        imagen.src="img/facepoint/5point.png"
        star.src="img/facepoint/1star.png"
        villain.innerHTML = `<div class="pachamama"></div>`
    }else if(score == 40) {
        gameVel = 1.8;
        contenedor.classList.add("tarde");
        imagen.src="img/facepoint/10point.png"
        star.src="img/facepoint/2star.png"

    } else if(score > 50) {
        gameVel = 2;
        contenedor.classList.add("noche");
        imagen.src="img/facepoint/20point.png"
        star.src="img/facepoint/3star.png"
        villain.innerHTML = `<div class="quilla"></div>`
    } else {
        imagen.src="img/facepoint/point.png"
        // sol.style.top = score+"%";
    }

    suelo.style.animationDuration = (3/gameVel)+"s";
}

function GameOver() {
    Estrellarse();
}

function DetectarColision() {

    for (var i = 0; i < interactuables.length; i++) {
        
        if(interactuables[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(IsCollision(dino, interactuables[i], 10, 25, 10, 20)) {
                console.log(interactuables[i].classList);
                if(interactuables[i].classList.contains("moneda")){
                    GanarPuntos();
                    interactuables[i].parentNode.removeChild(interactuables[i]);
                    interactuables.splice(i, 1);
                }else{
                    GameOver();
                }
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}

