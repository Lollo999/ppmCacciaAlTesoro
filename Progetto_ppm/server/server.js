const http = require('http');
const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const app = express();
const path = require("path");


const oneDay = 1000 * 60 * 60 * 24;

const clientPath = `${__dirname}/../client`;
console.log(`seving static from ${clientPath}`);

var sessionslist = [];
var resList = [];

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientPath));

app.use(cookieParser());



function getHighestScoreSocket(gameResult){
    var best = 100
    var bestSock = 0
    for( i= 0; i<gameResult.length; i++){
        if(gameResult[i][1]<best){
            best = gameResult[i][1]
            bestSock = gameResult[i][0];
        }
    }
    return bestSock
}

const server = http.createServer(app);

var number = 0;
var gameTerminated = 0;
var gameResult = [] //contiene il riferimento al client e il risultato

app.post('/questions', function(req,res){
    if(number < 2){
        //crea sessione per il client
        s = req.session;
        s.userid = req.body.username;
        sessionslist.push(s);
        console.log(req.session);
        //res.sendFile(path.resolve(clientPath+"/questions.html"));
        resList.push(res);
        number++;
        if(number == 2){
            for(var i = 0; i<resList.length; i++){
                resList[i].sendFile(path.resolve(clientPath+"/questions.html"));
            }
        }
    }else{  
        io.emit("tooManyClients");
        console.log("too many clients sent");
        //TODO risolvere il problema di attesa risposta dopo la richiesta tramite post
        
    }
}); 



const io = socketio(server);
io.on('connection', (sock) =>{
    console.log('user connesso');

    sock.on('ready', (req, res)=>{
        number++;
        console.log('ready button pressed: '+number);
        if(number == 2){
            io.emit("startGame");
            console.log('startGame sent');
        }
    })
    sock.on('gamedata',function(wrong){  //aggiunge al sock appena connesso la gestione dell'evento
        gameTerminated++;
        console.log("game data receivedb by:");
        console.log(wrong);
        gameResult.push([sock, wrong])
        if(gameTerminated == 2){
            //redirect clients with resList
            var bestSock = getHighestScoreSocket(gameResult)
            for(i = 0; i<gameResult.length; i++){
                s = gameResult[i][0]
                var str = "GG hai trovato il tesoro, hai sbagliato "+gameResult[i][1]+" volte"
                if(s == bestSock){
                    str = str + "\n ma il tuo avversario è più nabbo quindi HAI VINTO"
                    console.log("vinto"+gameResult[i][1])
                    s.send(str)
                }else{
                    str = str + "\n quindi HAI PERSO, F per te"
                    console.log("perso"+gameResult[i][1])
                    s.send(str)
                }
                
            }
            console.log("gioco terminato")
        }
    });
});



server.on('error',err => {
    console.error('server error :', err);
});

server.listen(8080, () => {
    console.log('Server started on 8080');
});