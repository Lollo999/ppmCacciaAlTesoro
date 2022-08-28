const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`seving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);
io.on('connection', (sock) =>{
    console.log('user connesso');
});

server.on('error',err => {
    console.error('server error :', err);
});

server.listen(8080, () => {
    console.log('Server started on 8080');
});