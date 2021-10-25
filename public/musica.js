let sonidoFondo = new Audio();
sonidoFondo.src = "./sonidos/Jungle_Music.mp3";
let music = false;

function toggleMusic() {
  if (music == false) {
    sonidoFondo.play();
    music = true;
    document.getElementById("sound").src ="./iconos/soundOff.png"
  } else {
    sonidoFondo.pause();
    music = false;
    document.getElementById("sound").src ="./iconos/soundOn.png"
  }
}
