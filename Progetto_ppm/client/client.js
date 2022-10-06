$(document).ready(function(){

    const onReadyPressed = (e) =>{
        //e.preventDefault(); non serve se si usa il form
        //TODO when button gets pressed
        console.log("prova");
        $('#ready').addClass('disabled');
    };

    $('#ready').click(onReadyPressed);
})