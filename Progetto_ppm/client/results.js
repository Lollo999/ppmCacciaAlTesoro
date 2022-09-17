const sock=io();
$('#replytest').text("spaghetti");
sock.on('message',function(message){
    $('#replytest').text(message);
  });
