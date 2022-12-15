//javascript relativo alla pagina questions.html
//variabili globali della pagina, liste elementi ottenute dal server, impostazioni e stato del gioco
var listaopere = [];
var listaQuestions = [];
var shuffledQuestions = [];
var wrongAnswers = [];  //contiene le risposte sbagliate
var currentCards = new Array(6); // contiene le carte mostrate in quel momento

const sock = io();

sock.emit("getData");   //invia richiesta al server per ottenere i dati prima di creare la pagina

var QUESTIONS_NUMBER = 5;
var CARDS_NUMBER = 5;

var correct = 0;
var wrong = 0;
var answerGiven = false;
var interval
var gameTime = 0
var currentQuestion = 0;

function startInterval(){   //avvio del timer di gioco
    interval = setInterval(function(){
        gameTime++; //aumenta i secondi trascorsi
        $('#timer').text("Tempo trascorso: "+gameTime+" secondi")
    }, 1000);
};

function stopInterval(){    //termine timer di gioco (rimuove il processo timer)
    clearInterval(interval);
}


$(document).ready(function(){   //quando la pagina è stata caricata, definisce le funzioni e gli action listener (observer) 
    $('.flip').click(function(){    //azione da svolgere quando si effettua un click su una carta
        if(!answerGiven){//se la risposta è già stata data, non fare nulla 
            $(this).find('.card').toggleClass('flipped');   //gira la carta
            if($(this).find('img').hasClass('correct')==true){  //controlla se la risposta è corretta
                answerGiven = true;
                $('#wrap_question').removeClass('puff-in-top')  //gestione animazioni
                $('#next').removeClass('disabled')
                $('#card').removeClass('slide-in-left')
                $('#card').addClass('slide-in-left')
                correct++;  //incrementa il numero di risposte corrette
            }else{
                wrong++;    //altrimenti aumenta il numero di risposte sbagliate
                c = gethtmlcardnumber($(this));
                console.log(currentCards[c]);
                wrongAnswers.push(currentCards[c]);
            }
            //controlla se il gioco è terminato (tutte le domande hanno avuto risposta)
            if(correct == QUESTIONS_NUMBER-1){  //ultima domanda
                $('#next').on('click', function(event) {   //cambia le funzionalità del tasto next
                    $('#next_wrap').addClass('hide');
                    $('#end_wrap').removeClass('hide');
                    console.log("penultima domanda");
                  });
            }
            if(correct == QUESTIONS_NUMBER){
                stopInterval(); //ferma il timer
                $('#end').removeClass('disabled');  
            }
        }
    });
    $('#end').on('click', function(event) { //invia al server i dati della partita
        sock.emit("gamedata", wrong, gameTime);
      });
    
    function buttonClick(){ //viene richiamata ogni volta che viene premuto il tasto next
        let flips = false;
        answerGiven = false; 
        $('.flip').each(function(index){    //controlla se c'è almeno una carta girata
            card=$(this).find('.card');
            if(card.hasClass('flipped')){
                $(this).find('.card').toggleClass('flipped');
                flips = true
            }
        });
        if(flips){  //aggiunge un delay prima di eseguire la funzione nextClicked (permette alle carte di tornare in posizione)
            setTimeout(
                function() 
                {
                  nextClicked()
                }, 400);
        }else{
            nextClicked()
        }
    }

    $('#next').click(buttonClick);  //listener per click bottone #next

  });

  function nextClicked(){   //funzione nextclicked richiamata da buttonClick
    //gestisce la logica di scelta delle carte

    if(currentQuestion == 0){
        // copia e randomizza lista delle domande
        shuffledQuestions = listaQuestions.slice();
        for(i = 0; i<listaQuestions.length*5; i++){
            x = Math.floor(Math.random()*listaQuestions.length);
            y = Math.floor(Math.random()*listaQuestions.length);
            var t = shuffledQuestions[x];
            shuffledQuestions[x] = shuffledQuestions[y];
            shuffledQuestions[y] = t;
        }
    }
        let qst = shuffledQuestions[currentQuestion];   //estrae la carta usando la sequenza domande
        let parsedtext = qst["testo"];         //estrae testo e immagine dalla carta
        let imageurl = qst["image_url"];

        var cardnumber = Math.floor(Math.random()*CARDS_NUMBER+1); //sceglie una posizione casuale in cui inserire la carta
        $('#im'+cardnumber).attr('src', imageurl)
        var allcardslist = [];
        allcardslist.push(qst["code"]); //inserisce il codice della domanda in una coda
        for(let i = 0; i< CARDS_NUMBER+1; i++){ //itera su tutte le carte della pagina (5)
            if(i == cardnumber ){   //se la carta è quella in cui è presente la risposta corretta, imposta diversamente

                $('#ans'+i).text("risposta corretta")
                $('#im'+i).addClass('correct');
                $('#check'+i).removeClass('hide');
                $('#cross'+i).addClass('hide');
            }else{  //altrimenti estrae una carta random, non presente tra quelle già estratte e la inserisce nella carta
                $('#im'+i).removeClass('correct');
                var rand = Math.floor(Math.random()*(listaopere.length-1))+1;
                while(allcardslist.includes(rand) || !getImageUrl(rand)){ //finchè non si trova una carta non presente
                    rand = Math.floor(Math.random()*(listaopere.length-1))+1;
                }
                allcardslist.push(rand);
                $('#im'+i).attr('src', getImageUrl(rand));
                $('#ans'+i).text("risposta sbagliata")
                $('#check'+i).addClass('hide');
                $('#cross'+i).removeClass('hide');
                currentCards[i]=rand;   //aggiorna le carte mostrate
            }
            
        }

        console.log(allcardslist);

        $('#question-text').text(parsedtext)
        $('#wrap_question').addClass('puff-in-top')
        $('#next').addClass('disabled')
        currentQuestion++;
  };

  function getImageUrl(rand){ //restituisce l'url di un'immagine a partire da un numero casuale
    for(i = 0; i<listaopere.length; i++){
        if(listaopere[i]["code"]==rand){
            return listaopere[i]["image_url"];
        }
    }
    return false
}

  function getOpera(num){
    for(j = 0; j<listaopere.length; j++){
        if(listaopere[j]["code"]==num){
            return listaopere[j];
        }
    }
    return listaopere[0];
  }

  function gethtmlcardnumber(card){
    if(card.hasClass('im1'))
        return 1;
    if(card.hasClass('im2'))
        return 2;
    if(card.hasClass('im3'))
        return 3;
    if(card.hasClass('im4'))
        return 4;
    if(card.hasClass('im5'))
        return 5;

  }

  sock.on('message',function(message){
    $('#replytest_1').text(message);
    $('#replytest_2').text(message);
    $('#replytest_3').text(message);
    $('#replytest_4').text(message);
    $('#replytest_5').text(message);
    $('#replytest_6').text(message);
    $('#replytest_7').text(message);
  });

  function questionsOver(){
    //il giocatore ha risposto correttamente a tutte le domande
    sock.emit('gamedata'); 
  }

  const onWait = () => {    //attesa giocatori
    console.log('wait command received');
    $('#wait').removeClass('hide');
    $('row1').addClass("p-5");
    $('row2').addClass("p5");
    $('#questions').addClass('hide');
    $('#exit_b').addClass('hide');
    $('#pages').removeClass('hide');
  };
  
  sock.on("wait", onWait);

  const onResults = () => {     //risultati partita
    console.log('result command received');
    $('#wait').addClass('hide');
    $('#questions').addClass('hide');
    $('#exit_b').removeClass('hide');
    $('#cardsflex').addClass('puff-in-top');
    $('#res').removeClass('hide');
    $('#pages').removeClass('hide');
    $('#cardsAccordion').removeClass('hide');

    if(wrong == 1){
        let_fin  = 'e';
    }
    else{
        let_fin = 'i';
    }
    document.getElementById("wrong-label").innerHTML = "Risposte sbagliate: Hai commesso "+wrong+" error"+let_fin
    var cards_flexbox = document.getElementById("cardsflex-right");

    for(i = 0; i<QUESTIONS_NUMBER; i++){  //inserisce delle card nella pagina finale con descrizione delle opere relative alle risposte corrette
        //crea nuova carta e inseriscila nel flexbox
        var img = document.createElement("img");
        img.src = shuffledQuestions[i]["image_url"];
        img.classList.add("card-img-top");
        img.classList.add("end-card-img")


        var title = document.createElement("h5");
        title.classList.add("card-title");
        title.innerHTML = shuffledQuestions[i]["name"];
        var desc = document.createElement("div");
        desc.classList.add("card-text");
        desc.innerHTML=shuffledQuestions[i]["description"];

        var body = document.createElement("div");
        body.classList.add("card-body");
        body.classList.add("end-card-body");
        body.classList.add("scrollbar")
        body.appendChild(title);
        body.appendChild(desc);

        


        var card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("mw-25");
        card.classList.add("end-card");
        card.classList.add("m-2");
        card.classList.add("border-dark");
        card.classList.add("border-4");
        card.appendChild(img);
        card.appendChild(body);
        cards_flexbox.appendChild(card)
    }


    var cards_flexbox = document.getElementById("cardsflex-wrong");
    wrongAnswers = [...new Set(wrongAnswers)];//rimuove duplicati dall'array delle risposte sbagliate

    for(i = 0; i<wrong; i++){  //inserisce delle card nella pagina finale con descrizione delle opere relative alle risposte corrette
        //crea nuova carta e inseriscila nel flexbox
        var img = document.createElement("img");
        img.src = getOpera(wrongAnswers[i])["image_url"];
        img.classList.add("card-img-top");
        img.classList.add("end-card-img")


        var title = document.createElement("h5");
        title.classList.add("card-title");
        title.innerHTML = getOpera(wrongAnswers[i])["name"];
        var desc = document.createElement("div");
        desc.classList.add("card-text");
        desc.innerHTML=getOpera(wrongAnswers[i])["description"];

        var body = document.createElement("div");
        body.classList.add("card-body");
        body.classList.add("end-card-body");
        body.classList.add("scrollbar")
        body.appendChild(title);
        body.appendChild(desc);


        var card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("mw-25");
        card.classList.add("end-card");
        card.classList.add("m-2");
        card.classList.add("border-dark");
        card.classList.add("border-4");
        card.appendChild(img);
        card.appendChild(body);
        cards_flexbox.appendChild(card)
    }
  };
  
  sock.on("results", onResults);    //quando il server restituisce i risultati della partita


  sock.on("res-getData",function(opere, questions,  clients_number, cards_number, questions_number){
    listaQuestions = questions;
    listaopere = opere;
    QUESTIONS_NUMBER = questions_number;
    CARDS_NUMBER = cards_number;

    //TODO CLIENTS_NUMBER = clients_number

    start_game();//avvia il gioco (e il caricamento delle carte) dopo aver ricevuto risposta

  });

  function start_game(){
    //buttonClick();  //start game
    $('#next').trigger('click');//preme il tasto next
    $('row1').removeClass("p-5");
    $('row2').removeClass("p5");
    //start timer
    gameTime = 0;
    startInterval();
  }
  $('#exit').click(function(){
    sock.emit("other_disconnect");
    window.location.replace("index.html");
});



const onDisc = () =>{
    console.log("reset ricevuto");
    $('#disc').removeClass('hide');
    $('#wait').addClass('hide');
    $('#questions').addClass('hide');
    $('#next_wrap').addClass('hide');
    $('#end_wrap').addClass('hide');
    $('#exit_b').removeClass('hide');
    $('#pages').removeClass('hide');
    
}

sock.on("disc_page", onDisc);   //quando un'altro utente si disconnette dalla partita, il server invia disc_page


