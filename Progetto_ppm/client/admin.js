const sock = io();

//definizione variabili globali della pagina
var lista_opere = document.getElementById("listaOpere");
var lista_domande = document.getElementById("listaDomande");
var logic_lista_opere; //contiene l'ultimo update alla lista delle opere ricevuto dal server

$(document).ready(function(){       
    //quando il caricamento della pagina è terminato invia le richieste al server
    //delle liste opere, domande e impostazioni
    sock.emit("admin-getOpere");
    sock.emit("admin-getQuestions");
    sock.emit("admin-getSettings");
});

$('#insertOperaButton').click(function(){   //apre il modal di inserimento opera
    const mod = document.getElementById('modalInsert');
    mod.querySelector('#title').innerHTML="inserire nome dell'opera";
    mod.querySelector('#description').innerHTML="inserire descrizione dell'opera";
    $('#modalInsert').modal('show');

});

$('#insertQuestionButton').click(function(){    //apre il modal di inserimento domanda
    const mod = document.getElementById('modalInsertQuestion');
    mod.querySelector('#question').innerHTML = "Inserire l'indovinello";
    var selector = mod.querySelector('#selectOpera');   //il selector è una tendina contenente tutte le opere in modo da facilitare la selezione
    var options_list = mod.querySelectorAll("#selectOpera option")
    for(i = 0; i<options_list.length; i++ ){    //pulisce la lista
        selector.removeChild(options_list[i]);
    } 

    //inserisce nuovi selector nella lista all'interno del modal
    for(i = 0; i<logic_lista_opere.length; i++){
        var opt = document.createElement("option");
        opt.value = logic_lista_opere[i].code;
        opt.innerHTML = logic_lista_opere[i].name;
        selector.appendChild(opt);
    }
    $('#modalInsertQuestion').modal('show');
});

function clear_lista_opere(){   //rimuove gli elementi dalla lista opere
    var items = document.querySelectorAll("#listaOpere li");
    for(i = 0; i<items.length; i++ ){
        lista_opere.removeChild(items[i]);
    } 
}

function add_item_lista_opere(item = 0){    //aggiunge un elemento alla lista opere, creando e definendo il button per gestirlo
    var li = document.createElement("button");
    li.classList.add('list-group-item');
    li.classList.add('list-group-item-action');
    li.type = "button";
    li.id="itemOpera";
    li.value = item.code;
    li.innerHTML = item.name;//TODO
    li.onclick = function(){openModalOpera(item)};
    lista_opere.appendChild(li);
}
function clear_lista_domande(){        //cancella tutti gli elementi dalla lista domande
    var items = document.querySelectorAll("#listaDomande li");
    for(i = 0; i<items.length; i++ ){
        lista_domande.removeChild(items[i]);
    } 
}

function add_item_lista_domande(item = 0){      //aggiunge un elemento alla lista domande creando il button per gestirlo
    var li = document.createElement("button");
    li.classList.add('list-group-item');
    li.classList.add('list-group-item-action');
    li.type = "button";
    li.id="itemQuestion";
    li.value = item.code;
    li.innerHTML = item.testo;//TODO
    li.onclick = function(){openModalQuestion(item)};
    lista_domande.appendChild(li);

}


function openModalQuestion(item){       //apre il modal di aggiornamento (edit) di una question
    const mod = document.getElementById('modalEditQuestion');
    mod.querySelector('#question').innerHTML = item.testo;
    mod.querySelector('#code')
    var selector = mod.querySelector('#selectOpera');
    mod.querySelector('#code').innerHTML = item.code;

    //cancellatutti i figli del selector
    var options_list = mod.querySelectorAll("#selectOpera option")
    for(i = 0; i<options_list.length; i++ ){
        selector.removeChild(options_list[i]);
    } 

    //inserisce nuovi elementi nel selector
    for(i = 0; i<logic_lista_opere.length; i++){
        var opt = document.createElement("option");
        opt.value = logic_lista_opere[i].code;
        opt.innerHTML = logic_lista_opere[i].name;
        if(item.opera == logic_lista_opere[i].code){
            opt.selected = 'selected';
        }
        selector.appendChild(opt);
    }
    $('#modalEditQuestion').modal('show');
}


function openModalOpera(item){  //apre il modal per l'aggiornamento di un'opera
    const mod = document.getElementById('modalOpera');
    mod.querySelector('#title').innerHTML=item.name;
    mod.querySelector('#description').innerHTML=item.description;
    mod.querySelector('#code').innerHTML = item.code;
    $('#modalOpera').modal('show');
}

sock.on("admin-resgetOpere", function(result){  //eseguita quando il server risponde con la lista opere
    //esegue operazioni di aggiornamento sulle list e 
    clear_lista_opere();
    logic_lista_opere = result;
    for(i = 0; i<result.length; i++){
        add_item_lista_opere(result[i]);
    }
});

sock.on("admin-resgetQuestions", function(result){  //eseguita quando il server risponde con la lista domande
    clear_lista_domande();
    for(i = 0; i<result.length; i++){
        add_item_lista_domande(result[i]);
    }
});


sock.on("admin-resgetSettings", function(numero_domande, numero_client){    //eseguita quando il server risponde con la lista delle impostazioni
    document.getElementById('questionsPerGame').innerHTML = numero_domande;
    document.getElementById('clientsNumber').innerHTML = numero_client;
});



