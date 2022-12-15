//questo file js è il file che contiene la logica del server node

const http = require('http');
const express = require('express');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const app = express();
const path = require("path");

const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const { query } = require('express');
const { type } = require('os');

var n_player = 2;


//connessione al database: inserire qui i dati corretti per la connessione
var con = mysql.createConnection({
    host: "localhost",  //indirizzo host
    user: "root",   //nome user del db
    password: "",   //password
    database: "ppmdb"     //nome del db
});

con.connect(function (err) {
    if (err) throw err;
});

const oneDay = 1000 * 60 * 60 * 24;

const clientPath = `${__dirname}/../client`;
console.log(`seving static from ${clientPath}`);

var sessionslist = [];
var resList = [];

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientPath));

app.use(express.static('public'))

app.use(cookieParser());

app.use(fileUpload());

function getHighestScoreSocket(gameResult) {//in base ai gameresults calcola il socket vincitore
    var temp = gameResult.slice();
    var best = 100
    var bestSock = 0

    //selectionSort del temp array
    function swap(a, b, arr) {
        var t = arr[a];
        arr[a] = arr[b];
        arr[b] = t;
    }

    console.log({ temp })

    var i, j, min;
    for (i = 0; i < temp.length - 1; i++) {
        min = i;
        for (j = i + 1; j < temp.length; j++) {
            if (temp[j][1] < temp[min][1]) {
                min = j;
            }
            else if (temp[j][1] == temp[min][1]) {//se hanno commesso lo stesso numero di errori
                if (temp[j][2] < temp[min][2]) {
                    min = j
                }
            }
            if (min != i) {
                swap(min, i, temp);
            }
        }
    }
    console.log({ temp })
    bestSock = temp[0][0]   //restituisce il socket 
    //con il miglior punteggio
    //meno errori o meno tempo
    return bestSock
}

function getWinType(gameResult) {//in base ai gameresults calcola il socket vincitore
    var temp = gameResult.slice();
    var best = 100
    var type = 0
    //selectionSort del temp array
    function swap(a, b, arr) {
        var t = arr[a];
        arr[a] = arr[b];
        arr[b] = t;
    }

    console.log({ temp })

    var i, j, min;
    for (i = 0; i < temp.length - 1; i++) {
        min = i;
        for (j = i + 1; j < temp.length; j++) {
            if (temp[j][1] < temp[min][1]) {
                min = j;
            }
            else if (temp[j][1] == temp[min][1]) {//se hanno commesso lo stesso numero di errori
                type=1
                if (temp[j][2] < temp[min][2]) {
                    min = j
                }
            }
            if (min != i) {
                swap(min, i, temp);
            }
        }
    }
    console.log({ temp })
    return type //restituisce il tipo di vittoria
}
const server = http.createServer(app);

var number = 0;
var gameTerminated = 0;
var gameResult = [] //contiene il riferimento al client e il risultato

app.post('/upload', function (req, res) {
    //load file and redirect per l'immagine nell'inserimento di un'opera 
    console.log(req.files);
    const { image } = req.files;
    console.log(image);
    //if(!image) return res.sendStatus(400);
    console.log(clientPath + '/images/' + image.name);
    image.mv(clientPath + '/images/' + image.name);

    var sql = "INSERT INTO opera (name, description, image_url) VALUES (?, ?, ?)";
    con.query(sql, [req.body.title, req.body.description, 'images/' + image.name], function (err, result) {
        if (err) throw err;
        console.log("record opera inserito correttamente");
    });

    res.sendFile(path.resolve(clientPath + "/admin.html"));
});


app.post('/uploadQuestion', function (req, res) {      //esegue la query di inserimento di una nuova domanda(pannello admin)
    var sql = "INSERT INTO indovinello (testo, opera) VALUES( ?, ? )";
    con.query(sql, [req.body.question, req.body.selectOpera], function (err, result) {
        if (err) throw err;
        console.log("record indovinello inserito");
    });

    res.sendFile(path.resolve(clientPath + "/admin.html"));
});

app.post('/uploadSettings', function (req, res) {   //esegue query aggiornamento settings (pannello admin)
    var sql = "UPDATE settings SET numero_domande = ?, numero_client = ?";
    con.query(sql, [req.body.questionsPerGame, req.body.clientsNumber], function (err, result) {
        if (err) throw err;
        console.log("record settings aggiornato");
    });
    res.sendFile(path.resolve(clientPath + "/admin.html"));
});

app.post('/updateOpera', function (req, res) {  //esegue query aggiornamento opera (pannello admin)
    console.log(req.body);
    if (req.body.send == "update") {
        var sql = "UPDATE opera SET description = ?, name = ? WHERE code = ?";
        con.query(sql, [req.body.description, req.body.title, req.body.code], function (err, result) {
            if (err) throw err;
            console.log("record opera aggiornato");
            console.log(result)
        });
    } else if (req.body.send == "delete") {
        var sql = "DELETE FROM opera WHERE code = ?";
        con.query(sql, [req.body.code], function (err, result) {
            if (err) throw err;
            console.log("record opera cancellato");
        });
    }
    res.sendFile(path.resolve(clientPath + "/admin.html"));
});

app.post('/updateQuestion', function (req, res) {   //aggiornamento domanda 
    if (req.body.send == "update") {
        var sql = "UPDATE indovinello SET testo = ?, opera = ? WHERE code = ?";
        con.query(sql, [req.body.testo, req.body.selectOpera, req.body.code], function (err, result) {
            if (err) throw err;
            console.log("record opera aggiornato");
            console.log(result)
        });
    } else if (req.body.send == "delete") {
        var sql = "DELETE FROM indovinello WHERE code = ?";
        con.query(sql, [req.body.code], function (err, result) {
            if (err) throw err;
            console.log("record opera cancellato");
        });
    }
    res.sendFile(path.resolve(clientPath + "/admin.html"));
});



app.get('/admin', function (req, res) {
    res.sendFile(path.resolve(clientPath + "/admin.html"));
});

app.post('/questions', function (req, res) {    //funzione richiamata quando un client accede alla pagina questions
    if(number == 0){
        con.query("SELECT * FROM settings", function (err, result, fields) {
            if (err) throw err;
            n_player = result[0].numero_client
        })
    }
    //crea sessione per il client
    s = req.session;
    s.userid = req.body.username;
    sessionslist.push(s);
    console.log(req.session);
    resList.push(res);
    number++;
    if (number == n_player) {   //quando tutti i client sono connessi avvia la partita servendo il file questions.html
        for (var i = 0; i < resList.length; i++) {
            resList[i].sendFile(path.resolve(clientPath + "/questions.html"));
        }
    }
    if(number > n_player){
            resList[resList.length-1].sendFile(path.resolve(clientPath + "/tooMany.html"));
            resList.pop()
            number--;
    }
});

const io = socketio(server);
var n_disc=0;




io.on('connection', (sock) => {
    console.log('user connesso');

    sock.on('disconnect', function () { //quando il client si disconnette resetta il server
        console.log('user disconnected');
        n_disc++;
        if (gameTerminated < n_player) {
            io.emit("disc_page");
            console.log('pagina reset');

        }
            gameTerminated = 0;
            for (let i = gameResult.length; i > 0; i--) {
                gameResult.pop();
            }
            for (let i = resList.length; i > 0; i--) {
                resList.pop();
            }
        if(n_disc>=n_player){
            number=0
            n_disc=0
        }
    });


    sock.on('ready', (req, res) => {  //client pronto alla partita
        number++;
        console.log('ready button pressed: ' + number);
        if (number == n_player) {
            io.emit("startGame");
            console.log('startGame sent');
        }
    });
    
    sock.on('gamedata', function (wrong, gameTime) {  //aggiunge al sock appena connesso la gestione dell'evento
        gameTerminated++;
        console.log("game data receivedb by:");
        console.log(wrong);
        gameResult.push([sock, wrong, gameTime])

        if (gameTerminated < n_player) {
            gameResult[0][0].emit("wait");
            console.log('wait sent');
        }
        if (gameTerminated == n_player) {

            io.emit("results");

            var bestSock = getHighestScoreSocket(gameResult)
            var winType = getWinType(gameResult)
            for (i = 0; i < gameResult.length; i++) {
                s = gameResult[i][0]
                var str = ""
                if (s == bestSock && winType==0) {
                    str = str + "\n HAI VINTO! Hai commesso meno errori dell'avversario"
                    console.log("vinto" + gameResult[i][1])
                    s.send(str)
                } else if(s == bestSock && winType==1) {
                    str = str + "\n HAI VINTO! Hai impiegato meno tempo dell'avversario"
                    console.log("vinto" + gameResult[i][1])
                    s.send(str)
                } else if(s != bestSock && winType==0) {
                    str = str + "\n HAI PERSO! Hai commesso più errori dell'avversario"
                    console.log("vinto" + gameResult[i][1])
                    s.send(str)
                } else if(s != bestSock && winType==1) {
                    str = str + "\n HAI PERSO! Hai impiegato più tempo dell'avversario"
                    console.log("vinto" + gameResult[i][1])
                    s.send(str)
                }
            }
            console.log("gioco terminato")
        }

    });

    //ADMIN LISTENERS
    //gestiscono le funzionalotà di interazione del pannello admin
    //get degli elementi
    sock.on("admin-getOpere", function () {
        con.query("SELECT * FROM opera", function (err, result, fields) {
            if (err) throw err;
            sock.emit("admin-resgetOpere", result);
            
        });
    });

    sock.on("admin-getQuestions", function () {
        con.query("SELECT i.code as code, testo, opera, name FROM indovinello as i INNER JOIN opera as o ON i.opera = o.code", function (err, result, fields) {
            if (err) throw err;

            sock.emit("admin-resgetQuestions", result);
        
        });
    });

    sock.on("admin-getSettings", function () {
        con.query("SELECT * FROM settings", function (err, result, fields) {
            if (err) throw err;

            sock.emit("admin-resgetSettings", result[0].numero_domande, result[0].numero_client);
        });
    });


    //quando un client fa richiesta il server esegue le query e invia le informazioni contenute del db al client
    sock.on("getData", function () {
        var o;
        var q;
        var clients_number;
        var cards_number;
        var questions_number;
        var sql = "SELECT * FROM opera";


        function nestedQuery2() {
            sql = "SELECT * FROM settings";
            con.query(sql, function (err, result, fields) {
                if (err) throw err;

                console.log("settings data query successful");
                clients_number = result[0].numero_client;
                cards_number = result[0].numero_carte;
                questions_number = result[0].numero_domande;
                nestedQuery();
            })
        }

        function nestedQuery() {
            sql = "SELECT i.testo, o.image_url, o.code, o.description, o.name FROM indovinello as i INNER JOIN opera as o ON i.opera = o.code";
            con.query(sql, function (err, result, fields) {

                if (err) throw err;

                console.log("data2 query successful");
                q = result;

                sock.emit('res-getData', o, q, clients_number, cards_number, questions_number);
            });
        }

        con.query(sql, function (err, result, fields) {

            if (err) throw err;

            console.log("data1 query successful");


            o = result;

            nestedQuery2();
        });

    });

});



server.on('error', err => {
    console.error('server error :', err);
});

server.listen(8080, () => {
    console.log('Server started on 8080');
});