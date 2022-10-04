//creo una breve lista di domande e opere come risposta


/*var listaopere = [
    "images/gioconda.jpeg",
    "images/opera1.jpg",
    "images/opera2.jpg",
    "images/opera3.jpg",
    "images/opera4.jpg",
    "images/opera5.jpg",
    "images/opera6.jpg",
    "images/opera7.jpg",
    "images/opera8.jpg",
    "images/opera9.jpg",
    "images/opera10.jpg"
]

var listaQuestions = [
    {question: "La Gioconda (ce la riprenderemo comunque)", risposta: "images/gioconda.jpeg"},
    {question: "Deposizione caravaggio", risposta: "images/opera1.jpg"},
    {question: "Quadro strano colorato (non mi ricordo il nome sry)", risposta: "images/opera2.jpg"},
    {question: "Matteo e l'angelo", risposta: "images/opera3.jpg"},
    {question: "Le opere della misericordia", risposta: "images/opera4.jpg"},
    {question: "Deposizione Borghese (si ho cercato raffaello su google immagini)", risposta: "images/opera5.jpg"},
    {question: "Sposalizio della vergine", risposta: "images/opera6.jpg"},
    {question: "Il cristo ", risposta: "images/opera7.jpg"},
    {question: "Madonna del cardellino (quella con i bambini sotto)", risposta: "images/opera8.jpg"},
    {question: "Venere di Botticelli", risposta: "images/opera9.jpg"},
    {question: "David, questa la sai per forza oh", risposta: "images/opera10.jpg"}

]*/
var listaopere = [];
var listaQuestions = [];
var shuffledQuestions = [];

const sock = io();

sock.emit("getData");

var QUESTIONS_NUMBER = 5;
var CARDS_NUMBER = 5;

var correct = 0;
var wrong = 0;
var answerGiven = false;
var interval
var gameTime = 0
var currentQuestion = 0;

function startInterval(){
    interval = setInterval(function(){
        gameTime++; //aumenta i secondi trascorsi
        $('#timer').text("Tempo trascorso: "+gameTime+" secondi")
    }, 1000);
};

function stopInterval(){
    clearInterval(interval);
}


$(document).ready(function(){
    $('.flip').click(function(){ 
        if(!answerGiven){//se la risposta è già stata data, non fare nulla 
            $(this).find('.card').toggleClass('flipped');
            if($(this).find('img').hasClass('correct')==true){
                answerGiven = true;
                $('#wrap_question').removeClass('puff-in-top')
                $('#next').removeClass('disabled')
                $('#card').removeClass('slide-in-left')
                $('#card').addClass('slide-in-left')
                correct++;
            }else{
                wrong++;
            }
            //check if game is over
            if(correct == QUESTIONS_NUMBER-1){
                $('#next').on('click', function(event) {
                    $('#next_wrap').addClass('hide');
                    $('#end_wrap').removeClass('hide');
                    console.log("penultima domanda");
                  });
            }
            if(correct == QUESTIONS_NUMBER){
                stopInterval();
                $('#end').removeClass('disabled');
            }
        }
    });
    $('#end').on('click', function(event) {
        sock.emit("gamedata", wrong, gameTime);
      });
    
    function buttonClick(){
        let flips = false;
        answerGiven = false; //r
        $('.flip').each(function(index){
            card=$(this).find('.card');
            if(card.hasClass('flipped')){
                $(this).find('.card').toggleClass('flipped');
                flips = true
            }
        });
        if(flips){
            setTimeout(
                function() 
                {
                  nextClicked()
                }, 400);
        }else{
            nextClicked()
        }
    }

    $('#next').click(buttonClick);

    /*buttonClick();  //start game

    //start timer
    gameTime = 0;
    startInterval();
    spostato al termine della risposta del server
    */


  });

  function nextClicked(){

    if(currentQuestion == 0){
        // copia e randomizza array domande
        shuffledQuestions = listaQuestions.slice();
        for(i = 0; i<listaQuestions.length*5; i++){
            x = Math.floor(Math.random()*listaQuestions.length);
            y = Math.floor(Math.random()*listaQuestions.length);
            var t = shuffledQuestions[x];
            shuffledQuestions[x] = shuffledQuestions[y];
            shuffledQuestions[y] = t;
        }
    }
        //let x = Math.floor(Math.random()*listaQuestions.length);
        let qst = shuffledQuestions[currentQuestion];
        let parsedtext = qst["testo"];
        let imageurl = qst["image_url"];
        //scegli carta random tra 0-4
        var cardnumber = Math.floor(Math.random()*CARDS_NUMBER+1);
        $('#im'+cardnumber).attr('src', imageurl)
        var allcardslist = [];
        allcardslist.push(qst["code"]);
        for(let i = 0; i< CARDS_NUMBER+1; i++){
            if(i == cardnumber ){

                $('#ans'+i).text("risposta corretta")
                $('#im'+i).addClass('correct');
                $('#check'+i).removeClass('hide');
                $('#cross'+i).addClass('hide');
            }else{
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
            }
            
        }

        console.log(allcardslist);

        function getImageUrl(rand){
            for(i = 0; i<listaopere.length; i++){
                if(listaopere[i]["code"]==rand){
                    return listaopere[i]["image_url"];
                }
            }
            return false
        }
        $('#question-text').text(parsedtext)
        $('#wrap_question').addClass('puff-in-top')
        $('#next').addClass('disabled')
        currentQuestion++;
  };

  sock.on('message',function(message){
    $('#replytest').text(message);
  });

  function questionsOver(){
    //il giocatore ha risposto correttamente a tutte le domande
    sock.emit('gamedata'); 
  }

  const onWait = () => {
    console.log('wait command received');
    $('#wait').removeClass('hide');
    $('row1').addClass("p-5");
    $('row2').addClass("p5");
    $('#questions').addClass('hide');
    $('#exit_b').addClass('hide');
    $('#pages').removeClass('hide');
  };
  
  sock.on("wait", onWait);

  const onResults = () => {
    console.log('result command received');
    $('#wait').addClass('hide');
    $('#questions').addClass('hide');
    $('#exit_b').removeClass('hide');
    $('#cardsflex').addClass('puff-in-top');
    $('#res').removeClass('hide');
    $('#pages').removeClass('hide');


    var cards_flexbox = document.getElementById("cardsflex");

    for(i = 0; i<QUESTIONS_NUMBER+1; i++){
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
        card.classList.add("end-card");
        card.classList.add("m-2");
        card.classList.add("border-dark");
        card.classList.add("border-4");
        card.appendChild(img);
        card.appendChild(body);
        cards_flexbox.appendChild(card)
    }

  };
  
  sock.on("results", onResults);


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

sock.on("disc_page", onDisc);