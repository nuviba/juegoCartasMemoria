//queremos que al entrar a tablero.html ya se muestre el tablero
mostrarTablero()

//pendiente de cambiar api y modificar llamada
let posiciones;
function mostrarTablero(){
  fetch("https://botw-compendium.herokuapp.com/api/v2")
  .then((res) => res.json())
  .then(function cogerData(data) {
    let catObject;
    catObject = data.data.creatures.non_food;

    document.getElementById("tablero").innerHTML = "";
    //generamos una array de posiciones aleatorias con parejas
    posiciones = genPosRan();
    //recorremos las posiciones
    for (let i = 0; i < posiciones.length; i++) {
      //para cada posición mostramos una carta

      templateCard(i, catObject[posiciones[i]],posiciones[i]);
    }
    //girar todas las cartas a los 2 segundos
    setTimeout(girarTodas,2000);      
  });
}
//función para crear las cartas individuales
function templateCard(id, objeto, posicion) {
  document.getElementById("tablero").innerHTML+=`
  <div class=card  id=${id}>
      <div class=front >
          <img src=${objeto.image} onclick="girarCarta(${id})" alt="zelda objet">
      </div>
      <div class="back">
      <img src="https://i.pinimg.com/originals/1a/58/3f/1a583fac90a845c9103e66f10ca9f19b.jpg" onclick="girarCarta(${id})" alt="">
      </div>
  </div>
 `;}

//generamos las posiciones en el tablero duplicando las cartas y de forma aleatoria
function genPosRan() {
  let arrayOriginal = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
  arrayOriginal.sort(function () {
    return Math.random() - 0.5;
  });
    return arrayOriginal;
}

function resetTablero(){
  mostrarTablero()   
}

let valor1=null;
let valor2;
let indice1;
let valoresEncontrados=[];
let tresNo=false;
//función principal del juego, gira las cartas al hacer click, comprueba pareja. Si es pareja se queda volteada, si no se gira al 1 sec. 
function girarCarta (id){
  //si pulsamos la misma carta dos veces o ya hay dos giradas no deja pulsar una tercera
  if(indice1==id||tresNo){
    return;
  }
  //si pulsamos una carta de una pareja ya encontrada no la volteamos
  for(let i=0;i<valoresEncontrados.length;i++){
    if(valoresEncontrados[i]==id){
      return;
    }
  }
  //comprobamos si estamos en la primera o en la segunda jugada del turno
  //si es la primera jugada guardamos el valor de la carta y su índice
  if(valor1==null){
    document.getElementById(id).classList.toggle("flipCard");
    valor1=posiciones[id];
    indice1=id;
  }
  //si es la segunda jugada comparamos el valor de la primera y segunda carta, activamos el veto a la tercera
  else{
    tresNo=true;
    document.getElementById(id).classList.toggle("flipCard");
    valor2=posiciones[id];
      //si las dos cartas no son iguales las giramos al segundo
      if(valor1!=valor2){
        girarDos(indice1,id);  
      }
      //si son iguales guardamos su valor en el array "valoresEncontrados" para que no se puedan volver a girar
      else{
        tresNo=false;
        valoresEncontrados.push(indice1);
        valoresEncontrados.push(id);
        ganar();//función que comprueba si hemos terminado el juego
      }
      valor1=null;
      indice1=null;
  }
}

function girarTodas(){
  for(let i=0;i<16;i++){
    document.getElementById(i).classList.toggle("flipCard");
  }
}

function girarDos(id1,id2){
    setTimeout(function (){
      tresNo=false;//liberamos girar tercera carta
      document.getElementById(id1).classList.toggle("flipCard");
      document.getElementById(id2).classList.toggle("flipCard")}
      ,1000);
};

function ganar(){
  if(valoresEncontrados.length==16){
      setTimeout(function (){
      valoresEncontrados=[];
      document.getElementById("tablero").innerHTML="<h1>Enhorabuena has ganado!</h1>"
  },1000);
}};

