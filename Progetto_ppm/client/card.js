//creo una breve lista di domande e opere come risposta

var listaopere = [
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

var list = [
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

]

const sock = io();

var QUESTIONS_NUMBER = 5;

var correct = 0;
var wrong = 0;



$(document).ready(function(){
    $('.flip').click(function(){ //hover  can be used
        $(this).find('.card').toggleClass('flipped');
        if($(this).find('img').hasClass('correct')==true){
            $('#next').removeClass('disabled')
            correct++;
        }else{
            wrong++;
        }
        //check if game is over
        if(correct == QUESTIONS_NUMBER){
            sock.emit("gamedata");
            $('#next').addClass('disabled');
        }
    });
    //$('#next').addClass('disabled') attivare o disattivare bottone
    //$('#next').removeClass('disabled')
    //$('#next').addClass('disabled')
    //$('#im2').attr('src', 'images/opera1.jpg'); cambio immagine
    function buttonClick(){
        let flips = false;
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

    buttonClick();
  });

  function nextClicked(){
    let x = Math.floor(Math.random()*11);
        let qst = list[x];
        let parsedtext = qst["question"];
        let imageurl = qst["risposta"];
        //scegli carta random tra 0-4
        var cardnumber = Math.floor(Math.random()*4+1);
        $('#im'+cardnumber).attr('src', imageurl)
        var allcardslist = [];
        allcardslist.push(x);
        for(let i = 0; i< 6; i++){
            if(i == cardnumber ){
                $('#ans'+i).text("Risposta corretta");
                $('#im'+i).addClass('correct');
            }else{
                $('#im'+i).removeClass('correct');
                var rand = Math.floor(Math.random()*11);
                while(allcardslist.includes(rand)){
                    rand = Math.floor(Math.random()*11);
                }
                allcardslist.push(rand);
                $('#im'+i).attr('src', listaopere[rand]);
                $('#ans'+i).text("Risposta errata");
            }
            
        }
        $('#question-text').text(parsedtext)

        $('#next').addClass('disabled')
        
  };

  function questionsOver(){
    //il giocatore ha risposto correttamente a tutte le domande
    sock.emit('gamedata'); 
  }