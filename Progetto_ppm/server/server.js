const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const path = require("path");

const clientPath = `${__dirname}/../client`;
console.log(`seving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

var number = 0;

const io = socketio(server);
io.on('connection', (sock) =>{
    console.log('user connesso');

    sock.on('ready', ()=>{
        number++;
        console.log('ready button pressed: '+number);
        if(number == 2){
            io.emit("startGame");
            console.log('startGame sent');
        }
    })
});

server.on('error',err => {
    console.error('server error :', err);
});

server.listen(8080, () => {
    console.log('Server started on 8080');
});