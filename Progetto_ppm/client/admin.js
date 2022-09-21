const sock = io();

var lista_opere = document.getElementById("listaOpere");
var lista_domande = document.getElementById("listaDomande");
var logic_lista_opere; //contiene l'ultimo update alla lista delle opere ricevuto dal server

$(document).ready(function(){
    sock.emit("admin-getOpere");
    sock.emit("admin-getQuestions");
    add_item_lista_opere();
    add_item_lista_domande();
});

$('#insertOperaButton').click(function(){
    const mod = document.getElementById('modalInsert');
    mod.querySelector('#title').innerHTML="inserire nome dell'opera";
    mod.querySelector('#description').innerHTML="inserire descrizione dell'opera";
    /*mod.querySelector('#insert').onclick = function(){
        title = mod.querySelector('#title').innerHTML;
        description = mod.querySelector('#description').innerHTML;
        sock.emit("admin-insertOpera", title, description);
    }*/
    $('#modalInsert').modal('show');

});

$('#insertQuestionButton').click(function(){
    const mod = document.getElementById('modalInsertQuestion');
    mod.querySelector('#question').innerHTML = "Inserire l'indovinello";
    var selector = mod.querySelector('#selectOpera');
    //TODO cancellare tutti i figli del selector
    var options_list = document.querySelectorAll("#selectOpera option")
    for(i = 0; i<options_list.length; i++ ){
        selector.removeChild(options_list[i]);
    } 

    //inserisce nuovi selector
    for(i = 0; i<logic_lista_opere.length; i++){
        var opt = document.createElement("option");
        opt.value = logic_lista_opere[i].code;
        opt.innerHTML = logic_lista_opere[i].name;
        selector.appendChild(opt);
    }
    $('#modalInsertQuestion').modal('show');
});

function clear_lista_opere(){
    var items = document.querySelectorAll("#listaOpere li");
    for(i = 0; i<items.length; i++ ){
        lista_opere.removeChild(items[i]);
    } 
}

function add_item_lista_opere(item = 0){
    var li = document.createElement("button");
    li.classList.add('list-group-item');
    li.classList.add('list-group-item-action');
    li.type = "button";
    li.id="itemOpera";
    li.value = item.code;
    li.innerHTML = item.name;//TODO
    li.onclick = function(){openModal(item)};
    lista_opere.appendChild(li);
}
function clear_lista_domande(){
    var items = document.querySelectorAll("#listaDomande li");
    for(i = 0; i<items.length; i++ ){
        lista_domande.removeChild(items[i]);
    } 
}

function add_item_lista_domande(item = 0){
    var li = document.createElement("button");
    li.classList.add('list-group-item');
    li.classList.add('list-group-item-action');
    li.type = "button";
    li.id="itemQuestion";
    li.value = item.code;
    li.innerHTML = item.testo;//TODO
    li.onclick = function(){openModal(item)};
    lista_domande.appendChild(li);

}

function openModal(item){
    const mod = document.getElementById('modalOne');
    mod.querySelector('#title').innerHTML=item.name;
    mod.querySelector('#description').innerHTML=item.description;
    //options = ""
    //const mewMod = new bootstrap.Modal(mod);

    $('#modalOne').modal('show');
}

sock.on("admin-resgetOpere", function(result){
    clear_lista_opere();
    logic_lista_opere = result;
    for(i = 0; i<result.length; i++){
        add_item_lista_opere(result[i]);
    }
});

sock.on("admin-resgetQuestions", function(result){
    clear_lista_domande();
    for(i = 0; i<result.length; i++){
        add_item_lista_domande(result[i]);
    }
});