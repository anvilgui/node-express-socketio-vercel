const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const server = http.createServer(app)
const home = require("./routes/home");

// Middlewares
app.use(express.json());

// Routes
app.use("/home", home);

const { Server } = require("socket.io")
const io = new Server(server)

const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`)
    socket.on('chat message', (msg) => {
        console.log(`Mensagem recebida: ${msg}.`)
        //emitindo evento do back
        io.emit('chat message', msg);//envia para todos os clientes conectados
        //socket.broadcast.emit('chat message', msg);//envia para todos, exceto para o sender
    })
    socket.on('disconnect', () => {
        console.log(`Um usuário desconectou!`)
    })
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})