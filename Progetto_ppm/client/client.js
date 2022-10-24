//file javascript della pagina iniziale, si occupa unicamente di definire il listener per il bottone e disabilitarlo 
//in modo che non possa essere premuto più volte in sequenza

$(document).ready(function(){

    const onReadyPressed = (e) =>{
        //e.preventDefault(); non serve se si usa il form
        //TODO when button gets pressed
        console.log("prova");
        $('#ready').addClass('disabled');
    };

    $('#ready').click(onReadyPressed);
})