const sock = io();

var lista_opere = document.getElementById("listaOpere");
var lista_domande = document.getElementById("listaDomande");

$(document).ready(function(){
    sock.emit("admin-getOpere");
    sock.emit("admin-getQuestions");
    add_item_lista_opere();
    add_item_lista_domande();
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
    li.innerHTML = item.name;//TODO
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