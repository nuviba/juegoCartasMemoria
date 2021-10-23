//const methods = require("methods");

//queremos que al entrar a tablero.html ya se muestre el tablero
mostrarTablero();

//---------CONTADOR-------------

let numJugadas = 0;
document.getElementById("numJugadas").innerHTML = `<h2>${numJugadas}</h2>`;
// let numAciertos = 0;
// document.getElementById("numAciertos").innerHTML = `<h2>${numAciertos}</h2>`;

//pendiente de cambiar api y modificar llamada
let posiciones;
function mostrarTablero() {
  fetch("https://botw-compendium.herokuapp.com/api/v2")
    .then(handleResponse)
    .then(function cogerData(data) {
      let catObject;
      catObject = data.data.creatures.non_food;

      document.getElementById("tablero").innerHTML = "";
      //generamos una array de posiciones aleatorias con parejas
      posiciones = genPosRan();
      console.log(posiciones);
      //recorremos las posiciones
      for (let i = 0; i < posiciones.length; i++) {
        //para cada posición mostramos una carta

        templateCard(i, catObject[posiciones[i]], posiciones[i]);
      }
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
  document.getElementById("tablero").innerHTML += `
  <div class=card  id=${id}>
      <div class=front >
          <img src=${objeto.image} onclick="girarCarta(${id})" alt="zelda objet">
      </div>
      <div class="back">
      <img src="./media/card-back.png" onclick="girarCarta(${id})" alt="">
      </div>
  </div>
 `;
}

//generamos las posiciones en el tablero duplicando las cartas y de forma aleatoria
function genPosRan() {
  let arrayOriginal = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  arrayOriginal.sort(function () {
    return Math.random() - 0.5;
  });
  return arrayOriginal;
}

function resetTablero() {
  numJugadas = 0;
  document.getElementById("numJugadas").innerHTML = `<h2>${numJugadas}</h2>`;
  numAciertos = 0;
  // document.getElementById("numAciertos").innerHTML = `<h2>${numAciertos}</h2>`;
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
  if (indice1 == id || tresNo) {
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
      girarDos(indice1, id);
    }
    //si son iguales guardamos su valor en el array "valoresEncontrados" para que no se puedan volver a girar
    else {
      tresNo = false;
      valoresEncontrados.push(indice1);
      valoresEncontrados.push(id);
      numAciertos++; //aumentamos en 1 el valor de aciertos
      document.getElementById(
        "numAciertos"
      ).innerHTML = `<h2>${numAciertos}</h2>`;
      ganar(); //función que comprueba si hemos terminado el juego
    }
    valor1 = null;
    indice1 = null;
  }
}

function girarTodas() {
  for (let i = 0; i < 16; i++) {
    document.getElementById(i).classList.toggle("flipCard");
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
  if (valoresEncontrados.length == 16) {
    setTimeout(function () {
      valoresEncontrados = [];
      document.getElementById("tablero").innerHTML = `
      <div id="fireworks-flip"></div>
      <div id="ranking">
        <h1>¡Enhorabuena has ganado!</h1>
        <h2>¿Deseas registrar tu puntuación?</h2>
        <div id="saveScoreQuestion">
          <button onclick="showInput()">Si</button>
          <button onclick="showRanking()">No</button>
        </div>
        <div id="saveScore">
          <h2>Escribe tu nombre o apodo:</h2>
          
          <input type="text" id="name" placeholder="Nombre">
          <button onclick="saveScoreAndShowRanking()">Guardar</button>
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
        </div>
        `;
      }
      document.getElementById(
        "tablero"
      ).innerHTML = `<div id="ranking">${htmlCode}</div>`;
    });
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
