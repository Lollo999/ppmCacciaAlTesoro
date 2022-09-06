
const onGameStart = () => {
    console.log('start command received');
    window.location = "/questions.html";
  };
  


const onReadyPressed = (e) =>{
    //e.preventDefault(); non serve se si usa il form
    //TODO when button gets pressed
    document.getElementById('ready').classList.add('disabled')
    //sock.emit('ready', 'something');
};

const onTooManyClients = () =>{
    document.querySelector('#ready').innerHTML("prova")
};

const sock = io();
sock.on("startGame", onGameStart);
sock.on("tooManyClients", onTooManyClients);
document.querySelector('#ready').addEventListener('click', onReadyPressed);

