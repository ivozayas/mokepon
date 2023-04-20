// dirIPv4 = dirección IPv4 (adaptador de LAN inalámbrica Wi-Fi 2) del dispositivo donde se levante el servidor. Por lo que al levantar el servidor se puede acceder con la dirección IPv4 seguida de ":8080".
const dirIPv4 = "192.168.0.237"

const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador = document.getElementById("boton-mascota")
const botonReiniciar = document.getElementById("boton-reiniciar")
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota")
const spanMascotaJugador = document.getElementById("mascota-jugador")

const contenedorAtaques = document.getElementById("contenedor-ataques")
const subtituloAtaque = document.getElementById("subtitulo-ataques")

const spanMascotaEnemigo = document.getElementById("mascota-enemigo")

const spanVictoriasJugador = document.getElementById("victorias-jugador")
const spanVictoriasEnemigo = document.getElementById("victorias-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataquesJugador = document.getElementById("ataques-del-jugador")
const ataquesEnemigo = document.getElementById("ataques-del-enemigo")

const sectionVerMapa = document.getElementById("ver-mapa")
const mapa = document.getElementById("mapa")

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let arrayAtaqueJugador = []
let arrayAtaqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego 
let botonAgua
let botonPlanta
let botonesAtaque = []
let indexAtaqueJugador 
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let VidasJugador = 3
let vidasEnemigo = 3

let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = "./assets/mokemap.png"
let objetoMascotaJugador


let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa = 400

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos


class Mokepon {
    constructor (nombre, foto, vida, mapaFoto, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.mapaFoto = new Image()
        this.mapaFoto.src = mapaFoto
        this.alto = 40
        this.ancho = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.distanciaX = 0
        this.distanciaY = 0
    }

    pintarMokepon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.alto,
            this.ancho
        )
    }
}

let capipepo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png")
let hipodoge = new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.webp", 5, "./assets/hipodoge.png")
let ratigueya = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.webp", 5, "./assets/ratigueya.webp")

const hipodogeAtaques = [
    {nombre:"💧", id:"boton-agua"},
    {nombre:"💧", id:"boton-agua"},
    {nombre:"💧", id:"boton-agua"},
    {nombre:"🌵", id:"boton-planta"},
    {nombre:"🔥", id:"boton-fuego"}
]
hipodoge.ataques.push(...hipodogeAtaques)

const capipepoAtaques = [
    {nombre:"🌵", id:"boton-planta"},
    {nombre:"🌵", id:"boton-planta"},
    {nombre:"🌵", id:"boton-planta"},
    {nombre:"💧", id:"boton-agua"},
    {nombre:"🔥", id:"boton-fuego"}
]
capipepo.ataques.push(...capipepoAtaques)

const ratigueyaAtques = [ 
    {nombre:"🔥", id:"boton-fuego"},
    {nombre:"🔥", id:"boton-fuego"},
    {nombre:"🔥", id:"boton-fuego"},
    {nombre:"💧", id:"boton-agua"},
    {nombre:"🌵", id:"boton-planta"}
]
ratigueya.ataques.push(...ratigueyaAtques)

mokepones.push(hipodoge, capipepo, ratigueya)

//
function iniciarJuego(){   
    sectionSeleccionarAtaque.style.display = "none"
    sectionReiniciar.style.display = "none"
    sectionVerMapa.style.display = "none"
    
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt="${mokepon.nombre}">
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputHipodoge = document.getElementById("Hipodoge")
        inputCapipepo = document.getElementById("Capipepo")
        inputRatigueya = document.getElementById("Ratigueya")
    }) // IMPORTANTE

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador)
    botonReiniciar.addEventListener("click", reiniciarJuego)

    unirseAlJuego()
}

function unirseAlJuego(){
    fetch(`http://${dirIPv4}:8080/unirse`) // para enviar solicitudes y obtener respuestas (HTTP). 
        .then(res => {
            if(res.ok){
                res.text() // devuelve una promesa con el contenido de una respuesta HTTP como cadena de texto
                    .then(respuesta => {
                        jugadorId = respuesta
                        console.log(jugadorId)
                    })
            }
        })
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//
function seleccionarMascotaJugador(){   
    if(inputHipodoge.checked){
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
    } else if(inputCapipepo.checked){
        spanMascotaJugador.innerHTML = inputCapipepo.id
        mascotaJugador = inputCapipepo.id
    } else if(inputRatigueya.checked){
        spanMascotaJugador.innerHTML = inputRatigueya.id
        mascotaJugador = inputRatigueya.id
    } else{
        alert("Selecciona una mascota")
        return
    }

    sectionSeleccionarMascota.style.display = "none"
    sectionVerMapa.style.display = "flex"

    seleccionarMokepon(mascotaJugador)
    extraerAtaques(mascotaJugador)
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador){
    fetch(`http://${dirIPv4}:8080/mokepon/${jugadorId}`, {// fetch es por defecto una peticion de tipo get. Para configurarlo para que sea una peticion de tipo post hay que pasarle un segundo parametro: un objeto json de configuracion diciendo que esta va a enviarse como una peticion tipo post
        method: "post",
        headers:{
            "Content-Type": "application/json" // que tipo de contenido voy a enviar
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        }) // el cuerpo de la peticion para el estandar de fetch tiene que ser una cadena de texto. Por lo tanto, con JSON.stringify tomo el json y lo devuelvo como una cadena de texto
    })
}

function obtenerObjetoMascota(){
    for (let i = 0; i < mokepones.length; i++){
        if(mascotaJugador === mokepones[i].nombre){
            return mokepones[i]
        }
    }
}

function seleccionarMascotaEnemigo(enemigo){
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques

    secuenciaAtaques()
}

//
function iniciarMapa(){
    objetoMascotaJugador = obtenerObjetoMascota()
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener("keydown", sePresionoUnaTecla)
    window.addEventListener("keyup", detenerMovimiento)
}

function enviarPosicion(x, y){
    fetch(`http://${dirIPv4}:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x, 
            y // sin definir "clave":"valor", se sobreentiendo que ambos son lo mismo (es decir: {x: x, y: y})
        })
    })
        .then(function(res){
            if(res.ok){
                res.json()
                    .then(({ enemigos }) => {
                        mokeponesEnemigos = enemigos.map((enemigo) => {
                            let mokeponEnemigo = null
                            if(enemigo.mokepon != undefined){
                                const nombreMokeponEnemigo = enemigo.mokepon?.nombre                   
                                if(nombreMokeponEnemigo === "Hipodoge"){
                                    mokeponEnemigo =  new Mokepon("Hipodoge", "./assets/mokepons_mokepon_hipodoge_attack.webp", 5, "./assets/hipodoge.png", enemigo.id)
                                } else if (nombreMokeponEnemigo === "Capipepo") {
                                    mokeponEnemigo = new Mokepon("Capipepo", "./assets/mokepons_mokepon_capipepo_attack.png", 5, "./assets/capipepo.png", enemigo.id)
                                } else if(nombreMokeponEnemigo === "Ratigueya") {
                                    mokeponEnemigo = new Mokepon("Ratigueya", "./assets/mokepons_mokepon_ratigueya_attack.webp", 5, "./assets/ratigueya.webp", enemigo.id)
                                }

                                if (enemigo.x && enemigo.y) {
                                    mokeponEnemigo.x = enemigo.x
                                    mokeponEnemigo.y = enemigo.y
                                }

                                return mokeponEnemigo
                            }  
                        })       
                    })
            }
        })
}

function pintarCanvas(){
    objetoMascotaJugador.x = objetoMascotaJugador.x + objetoMascotaJugador.distanciaX
    objetoMascotaJugador.y = objetoMascotaJugador.y + objetoMascotaJugador.distanciaY
    
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height,
    )

    objetoMascotaJugador.pintarMokepon()
    enviarPosicion(objetoMascotaJugador.x, objetoMascotaJugador.y)

    mokeponesEnemigos.forEach((mokepon) => {
        if(mokepon != undefined){
            mokepon.pintarMokepon()
            revisarColision(mokepon)
        }
    })
}

function moverArriba(){
    objetoMascotaJugador.distanciaY = -5
}

function moverIzquierda(){
    objetoMascotaJugador.distanciaX = -5
}

function moverAbajo(){
    objetoMascotaJugador.distanciaY = 5
}

function moverDerecha(){
    objetoMascotaJugador.distanciaX = 5
}

function sePresionoUnaTecla(event){
    switch (event.key) {
        case "ArrowUp":
            moverArriba()
            break
        case "ArrowLeft":
            moverIzquierda()
            break
        case "ArrowDown":
            moverAbajo()
            break
        case "ArrowRight":
            moverDerecha()
            break
        default:
            break
    }
}

function detenerMovimiento(){
    objetoMascotaJugador.distanciaX = 0
    objetoMascotaJugador.distanciaY = 0
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const izquierdaEnemigo = enemigo.x
    const derechaEnemigo = enemigo.x + enemigo.ancho

    const arribaMascota = objetoMascotaJugador.y
    const abajoMascota = objetoMascotaJugador.y + objetoMascotaJugador.alto
    const izquierdaMascota = objetoMascotaJugador.x
    const derechaMascota = objetoMascotaJugador.x + objetoMascotaJugador.ancho

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)
    console.log("Se detectó una colisión");

    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex"
    sectionVerMapa.style.display = "none"
    seleccionarMascotaEnemigo(enemigo)
}

//
function extraerAtaques(mascotaJugador){
    let ataques
    for (let i = 0; i < mokepones.length; i++){
        if(mascotaJugador === mokepones[i].nombre){
            ataques = mokepones[i].ataques
        }
    }
    
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        ataquesMokepon = `
            <button class="boton-ataque BAtaque" id=${ataque.id}>${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })

    botonFuego = document.getElementById("boton-fuego")
    botonAgua= document.getElementById("boton-agua")
    botonPlanta = document.getElementById("boton-planta")
    botonesAtaque = document.querySelectorAll(".BAtaque")
}

function secuenciaAtaques(){
    botonesAtaque.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if(e.target.textContent === "🔥"){
                arrayAtaqueJugador.push("FUEGO")
                console.log(arrayAtaqueJugador)
                boton.style.background = "rgb(12, 138, 115)"
                boton.style.boxShadow = "1px 1px 5px rgb(9, 61, 41)"
                boton.disabled = true
            } else if(e.target.textContent === "💧"){
                arrayAtaqueJugador.push("AGUA")
                console.log(arrayAtaqueJugador)
                boton.style.background = "rgb(12, 138, 115)"
                boton.style.boxShadow = "1px 1px 5px rgb(9, 61, 41)"
                boton.disabled = true
            } else {
                arrayAtaqueJugador.push("PLANTA")
                console.log(arrayAtaqueJugador)
                boton.style.background = "rgb(12, 138, 115)"
                boton.style.boxShadow = "1px 1px 5px rgb(9, 61, 41)"
                boton.disabled = true
            }
            if(arrayAtaqueJugador.length === 5){
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques(){
    fetch(`http://${dirIPv4}:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: arrayAtaqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://${dirIPv4}:8080/mokepon/${enemigoId}/ataques`)
        .then(res => {
            if(res.ok){
                res.json()
                    .then(({ ataques }) => {
                        if(ataques?.length === 5){
                            arrayAtaqueEnemigo = ataques
                            batalla()
                        }
                    })
            }
        })
}

//
function batalla(){
    clearInterval(intervalo)

    for (let i = 0; i < arrayAtaqueJugador.length; i++) {
        if(arrayAtaqueJugador[i] === "FUEGO" && arrayAtaqueEnemigo[i] === "PLANTA"){
            indexArrayBatalla(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if(arrayAtaqueJugador[i] === "AGUA" && arrayAtaqueEnemigo[i] === "FUEGO"){
            indexArrayBatalla(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if(arrayAtaqueJugador[i] === "PLANTA" && arrayAtaqueEnemigo[i] === "AGUA"){
            indexArrayBatalla(i, i)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if(arrayAtaqueJugador[i] === arrayAtaqueEnemigo[i]){
            indexArrayBatalla(i, i)
            crearMensaje("EMPATE")
        } else{
            indexArrayBatalla(i, i)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }

    }

    revisarVictorias()
}

function indexArrayBatalla(jugador, enemigo){
    indexAtaqueJugador = arrayAtaqueJugador[jugador]
    indexAtaqueEnemigo = arrayAtaqueEnemigo[enemigo]
}

function revisarVictorias(){
    if(victoriasJugador === victoriasEnemigo){
        crearMensajeFinal("EMPATE 😕")
    } else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal("¡VICTORIA! 😎")
    } else {
        crearMensajeFinal("DERROTA... 😨")
    }
}

function crearMensaje(resultado){
    contenedorAtaques.style.display = "none"
    subtituloAtaque.style.display = "none"

    let nuevoAtaqueJugador = document.createElement("p")
    let nuevoAtaqueEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo
   
    ataquesJugador.appendChild(nuevoAtaqueJugador)
    ataquesEnemigo.appendChild(nuevoAtaqueEnemigo)
}

function crearMensajeFinal(resultado){  
    sectionMensajes.innerHTML = resultado
    sectionReiniciar.style.display = "block"
}

function reiniciarJuego(){
    location.reload()
}

window.addEventListener("load", iniciarJuego)
