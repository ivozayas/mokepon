// 1) IMPORTO EXPRESS JS PARA  PODER UTILIZARLO EN MI PROYECTO.
// const express = require("express")
// require() me permite utilizar las librerias que instale con npm

// 2) CREO UNA APLICACIÓN CON EXPRESS JS
// const app = express()
// genero una copia del servidor que estoy utilizando

// 3) LE DIGO A EXPRESS JS QUE CUANDO RECIBA UNA PETICIÓN ("req") A LA URL RAIZ ("/") RESPONDA "Hola" (res.send("Hola"))
// app.get("/", (req, res) => {
//     res.send("Hola")
// })
// get(): cada vez que un cliente solicite un recurso va a pasar algo. hay que indicarle en que url va a solicitar ese recurso y como va a procesar y responder esa solicitud.

// 4) LE DIGO QUE ESCUCHE CONTINUAMENTE EN EL PUERTO 8080 LAS PETICIONES DE LOS CLIENTES, PARA QUE TODO EL TIEMPO PUEDA RESPONDER
// app.listen(8080, () => {
//     console.log("Servidor funcionando")
// })
// hago que escuche las peticiones de los clientes a través de un puerto, listen() me permite iniciar el servidor

const express = require("express")
const cors = require("cors") // Sin CORS, los navegadores web aplican la política de mismo origen (Same-Origin Policy) que restringe el acceso a recursos de diferentes dominios para prevenir ataques de seguridad, como la suplantación de identidad o la inyección de scripts maliciosos. CORS es utilizado para permitir peticiones HTTP de origen cruzado (o Cross-Origin Request, una solicitud HTTP realizada desde un dominio diferente al dominio del servidor que recibe la solicitud). 
const app = express()

app.use(cors()) 
app.use(express.static('public'))
app.use(express.json()) // habilito la capacidad de recibir peticiones post que traigan contenido en formato json

const jugadores = []

class Jugador{
    constructor(id){
        this.id = id
    }

    asignarMokepon(mokepon){
        this.mokepon = mokepon
    }

    actualizarPosicion(x, y){
        this.x = x 
        this.y = y
    }

    asignarAtaques(ataques){
        this.ataques = ataques
    }
}

class Mokepon{
    constructor(nombre){
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}` // meto el MAth.random() en un template strign para que sea una cadena de texto
    const jugador = new Jugador(id)
    jugadores.push(jugador)

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id) // para enviar datos a un servidor (en el contexto de una solicitud HTTP)
})

app.post("/mokepon/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || "" // para acceder a la variable definida en la url. Si no llegara por algun motivo será un string vacío por defecto.
    const nombreMokepon = req.body.mokepon || ""
    const mokepon = new Mokepon(nombreMokepon)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) // si en la lista uno de los jugadores tiene el mismo id que acaba de mandar el  usuario en la peticion

    if(jugadorIndex >= 0){ // si no se hayó el jugadorId en jugadores con el método findIndex, éste devuelve -1, osea, no existe. Por lo tanto sólo debo asignarle el mokepon al jugador si existe, es decir, si jugadorIndex es mayor o igual a 0
        jugadores[jugadorIndex].asignarMokepon(mokepon)
    }

    // console.log(jugadores)

    res.end() // Para enviar los datos al servidor y finalizar la solicitud
})

app.post("/mokepon/:jugadorId/posicion", (req, res) =>{
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0
    
    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id) 

    if(jugadorIndex >= 0){
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }
    
    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id) || []

    res.send({ // en express no puedo devolver una lista, por lo que devuelvo un json con la lista de enemigos dentro
        enemigos
    })
})

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)

    if(jugadorIndex >= 0){
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques
    })
})

app.listen(8080, () => {
     console.log("Servidor funcionando")
})