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
    var temp = gameResult.slice();
    var best = 100
    var bestSock = 0

    //selectionSort del temp array
    function swap(a,b, arr){
        var t = arr[a];
        arr[a] = arr[b];
        arr[b] = t;
    }

    console.log({temp})

    var i, j, min;
    for(i = 0; i<temp.length-1; i++){
        min = i;
        for(j = i+1; j<temp.length; j++){
            if(temp[j][1] < temp[min][1] ){
                min = j;
            }
            else if(temp[j][1] == temp[min][1]){//se hanno commesso lo stesso numero di errori
                if(temp[j][2] < temp[min][2]){
                    min = j
                }
            }
            if(min != i){
                swap(min, i, temp);
            }
        }
    }
    console.log({temp})
    bestSock = temp[0][0]   //restituisce il socket 
                            //con il miglior punteggio
                            //meno errori o meno tempo
    //--------------------
    /*
    for( i= 0; i<gameResult.length; i++){
        if(gameResult[i][1]<best){
            best = gameResult[i][1]
            bestSock = gameResult[i][0];
        }
    }
    */
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
        res.send("troppi client connessi")
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
    sock.on('gamedata',function(wrong, gameTime){  //aggiunge al sock appena connesso la gestione dell'evento
        gameTerminated++;
        console.log("game data receivedb by:");
        console.log(wrong);
        gameResult.push([sock, wrong, gameTime])
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