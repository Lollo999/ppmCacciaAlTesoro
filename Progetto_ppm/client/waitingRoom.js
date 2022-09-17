const sock = io();

const onResults = () => {
    console.log('result command received');
    window.location = "/result_screen.html";
  };
  
  sock.on("results", onResults);

