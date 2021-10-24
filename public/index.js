let saludoFinJuego = 0;
let sonido = new Audio();
sonido.src = "./sonidos/blackjack_1.mp3";
let sonidoAcierto = new Audio();
sonidoAcierto.src = "./sonidos/acierto.mp3";
let sonidoFin = new Audio();
sonidoFin.src = "./sonidos/fin.mov";
//const methods = require("methods");
let tamaño = document.getElementById("dificultad").value;
function cambiarDificultad() {
  tamaño = document.getElementById("dificultad").value;
  mostrarTablero();
}

//queremos que al entrar a tablero.html ya se muestre el tablero

mostrarTablero();
//---------CONTADOR-------------

let numJugadas = 0;
document.getElementById("numJugadas").innerHTML = `<h2>${numJugadas}</h2>`;
// let numAciertos = 0;
// document.getElementById("numAciertos").innerHTML = `<h2>${numAciertos}</h2>`;

//pendiente de cambiar api y modificar llamada
let posiciones;
let blockStart = true;
function mostrarTablero() {
  fetch("https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBJYLV2NQsUb4oI8_kHfUqs_kzGQIdM8Zo&cx=017901247231445677654:zwad8gw42fj&searchType=image&q=site:https://kids.nationalgeographic.com/animals")
    .then(handleResponse)
    .then(function cogerData(data) {
      let catObject;
      catObject = data.items;
      document.getElementById("tablero").innerHTML = "";
      //generamos una array de posiciones aleatorias con parejas
      posiciones = genPosRan();
      console.log(posiciones);
      //recorremos las posiciones
      //creamos tabla para alinear las cartas
      let tabla = `<table class=tableCards>`;
      for (let i = 0; i < tamaño; i++) {
        tabla += `<tr>`;
        for (let j = 0; j < tamaño; j++) {
          tabla += templateCard(
            j + tamaño * i,
            catObject[posiciones[j + tamaño * i]],
            posiciones[j + tamaño * i]
          );
        }
        tabla += `</tr>`;
      }
      tabla += `</table>`;

      document.getElementById("tablero").innerHTML = tabla;

      //girar todas las cartas a los 2 segundos
      setTimeout(girarTodas, 2000);
    })
    .catch((error) => {
      document.getElementById(
        "tablero"
      ).innerHTML = `<div><h1>${error}</h1><h2>Parece que hay un problema, intenta de nuevo más tarde.</h2></div>`;
    });
}
//función para crear las cartas individuales
function templateCard(id, objeto, posicion) {
  //insertamos cada div en una celda de tabla
  let carta = `
  <th><div class=card  id=${id}>
      <div class=front >
          <img src=${objeto.link} onclick="girarCarta(${id})" alt="zelda objet">
      </div>
      <div class="back">
      <img src="./media/explorador.png" onclick="girarCarta(${id})" alt="">
      </div>
  </div></th>
 `;
  return carta;
}

//generamos las posiciones en el tablero duplicando las cartas y de forma aleatoria
function genPosRan() {
  let arrayOriginal = [];
  for (let i = 0; i < (tamaño * tamaño) / 2; i++) {
    arrayOriginal.push(i);
    arrayOriginal.push(i);
  }
  arrayOriginal.sort(function () {
    return Math.random() - 0.5;
  });
  return arrayOriginal;
}

function resetTablero() {
  blockStart = true;
  numJugadas = 0;
  document.getElementById("numJugadas").innerHTML = `<h2>${numJugadas}</h2>`;
  //numAciertos = 0;
  // document.getElementById("numAciertos").innerHTML = `<h2>${numAciertos}</h2>`;
  document.getElementById("tablero").style.backgroundImage = null;
  mostrarTablero();
}

let valor1 = null;
let valor2;
let indice1;
let valoresEncontrados = [];
let tresNo = false;

/*función principal del juego, gira las cartas al hacer click, 
comprueba pareja. Si es pareja se queda volteada, si no se gira al 1 sec. */
function girarCarta(id) {
  //si pulsamos la misma carta dos veces o ya hay dos giradas no deja pulsar una tercera
  if (indice1 == id || tresNo || blockStart) {
    return;
  }
  //si pulsamos una carta de una pareja ya encontrada no la volteamos
  for (let i = 0; i < valoresEncontrados.length; i++) {
    if (valoresEncontrados[i] == id) {
      return;
    }
  }
  //comprobamos si estamos en la primera o en la segunda jugada del turno
  //si es la primera jugada guardamos el valor de la carta y su índice
  if (valor1 == null) {
    document.getElementById(id).classList.toggle("flipCard");
    sonido.play();
    valor1 = posiciones[id];
    indice1 = id;
  }
  //si es la segunda jugada comparamos el valor de la primera y segunda carta, activamos el veto a la tercera
  else {
    tresNo = true;
    document.getElementById(id).classList.toggle("flipCard");

    valor2 = posiciones[id];
    numJugadas++; //aumentamos en 1 el num de jugadas
    document.getElementById("numJugadas").innerHTML = `<h2>${numJugadas}</h2>`;
    //si las dos cartas no son iguales las giramos al segundo
    if (valor1 != valor2) {
      sonido.play();
      girarDos(indice1, id);
    }
    //si son iguales guardamos su valor en el array "valoresEncontrados" para que no se puedan volver a girar
    else {
      tresNo = false;
      valoresEncontrados.push(indice1);
      valoresEncontrados.push(id);
      sonidoAcierto.play();
      /* numAciertos++; //aumentamos en 1 el valor de aciertos
      document.getElementById(
        "numAciertos"
      ).innerHTML = `<h2>${numAciertos}</h2>`; */
      ganar(); //función que comprueba si hemos terminado el juego
    }
    valor1 = null;
    indice1 = null;
  }
}

function girarTodas() {
  blockStart = false;
  for (let i = 0; i < tamaño * tamaño; i++) {
    document.getElementById(i).classList.toggle("flipCard");
    sonido.play();
  }
}

function girarDos(id1, id2) {
  setTimeout(function () {
    tresNo = false; //liberamos girar tercera carta
    document.getElementById(id1).classList.toggle("flipCard");
    document.getElementById(id2).classList.toggle("flipCard");
  }, 1000);
}

function ganar() {
  if (valoresEncontrados.length == tamaño * tamaño) {
    //if (tamaño * tamaño == tamaño * tamaño) {
    setTimeout(function () {
      sonidoFin.play();
      valoresEncontrados = [];
      document.getElementById("tablero").innerHTML = `
      <div id="fireworks-flip"></div>
      <div id="ranking">
        <h1>¡Enhorabuena has ganado!</h1>
        <h2>¿Deseas registrar tu puntuación?</h2>
        <div id="saveScoreQuestion">
          <button id="ranking-button" onclick="showInput()"><img id="ranking-button-img" src="./media/hojaSi.png" alt="iconoSi" /></button>
          <button id="ranking-button" onclick="showRanking()"><img id="ranking-button-img" src="./media/respuestaNo.png" alt="iconoNo" /></button>
        </div>
        <div id="saveScore">
          <h2>Escribe tu nombre o apodo:</h2>
          
          <input type="text" id="name" placeholder="Nombre">
          <button id="saveButton" onclick="saveScoreAndShowRanking()">Guardar</button>
        </div>
      </div>
      <div id="fireworks"></div>
      `;
      document.getElementById("tablero").style.justifyContent = "center";
      document.getElementById("tablero").style.backgroundImage =
        "url('./media/jungle-night-background.jpeg')";
      document.getElementById("tablero").style.fontFamily =
        "Rampart One, cursive";
      document.getElementById("tablero").style.color = "white";
      document.getElementById("tablero").style.display = "flex";
      document.getElementById("tablero").style.backgroundSize = "cover";
      document.getElementById("tablero").style.minHeight = "80%";
      document.getElementById("tablero").style.width = "100%";
      document.getElementById("tablero").style.position = "absolute";
      document.getElementById("tablero").style.marginLeft = "0px";
      document.getElementById("cartelTablero").style.display = "none";
      document.getElementById("cartelTablero2").style.display = "none";
      document.getElementById("tablero-Up").style.display = "none";
    }, 1000);
  }
}

function showInput() {
  document.getElementById("saveScore").style.display = "block";
  document.getElementById("saveScoreQuestion").style.display = "none";
}
function showRanking() {
  fetch("/api/ranking")
    .then((res) => res.json())
    .then((data) => {
      let htmlCode = "<h1>RANKING</h1>";
      for (let i = 0; i < data.results.length; i++) {
        htmlCode += `
        <div id="listaRanking">
        <h2>${data.results[i].name}</h2>
        <h3>${data.results[i].score}</h3>
        </div>`;
      }
      document.getElementById(
        "tablero"
      ).innerHTML = `<div id="ranking">${htmlCode}</div>`;
      document.getElementById("ranking").style.height = "500px";
      document.getElementById("ranking").style.width = "450px";
      document.getElementById("ranking").style.overflowY = "scroll";
      document.getElementById("tablero").innerHTML += `<div id="FinJuego"> 
      <a href="index.html"> <button id="cartel-fin-button"></button></a>
      <a href="tablero.html"> <button id="cartel-fin-button"></button></a>
      <a href="#"><button id="cartel-fin-button" onclick="finJuego()"></button></a>
      </div>`;
      document.getElementById("tablero").style.justifyContent = "space-around";
      document.getElementById("tablero").style.alignItems = "center";
    });
}
function finJuego() {
  if (saludoFinJuego == 0) {
    document.getElementById("tablero").innerHTML += ` <h2>
    ¡Buena memoria! ¿Sabías que el estímulo de identificar parejas permite
    acelerar la agilidad mental? Buen entreno y ¡Gracias por jugar, espero que
    te hayas divertido!
  </h2>`;
    saludoFinJuego++;
  }
}
function saveScoreAndShowRanking() {
  let registry = {
    name: document.getElementById("name").value,
    score: numJugadas,
  };
  fetch("/api/addScore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registry),
  })
    .then((res) => res.json())
    .then((data) => {});
  showRanking();
}

/* Fuente para manejar el error de la API: https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
Si la respuesta es OK, devuelv el JSON, si no devuelve error */
//FUNCIÓN MANEJAR RESPUESTA
function handleResponse(response) {
  return response.json().then((json) => {
    if (!response.ok) {
      const error = Object.assign({}, json, {
        status: response.status,
        statusText: response.statusText,
      });

      return Promise.reject(error);
    }
    return json;
  });
}
