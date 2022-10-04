
$(document).ready(function(){

    const onReadyPressed = (e) =>{
        console.log("prova");
        $('#ready').addClass('disabled');
    };
    
    $('#ready').click(onReadyPressed);
})

