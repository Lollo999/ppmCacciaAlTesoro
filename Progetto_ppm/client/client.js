
const onGameStart = () => {
    console.log('start command received');
    window.location = "/questions.html";
  };
  


const onReadyPressed = (e) =>{
    e.preventDefault();
    //TODO when button gets pressed
    document.getElementById('ready').classList.add('disabled')
    sock.emit('ready', 'something');
};

const sock = io();
sock.on("startGame", onGameStart);
document.querySelector('#ready').addEventListener('click', onReadyPressed);

