
//pendiente de cambiar api y modificar llamada
function mostrarTablero (){
    fetch('https://botw-compendium.herokuapp.com/api/v2').then((res)=>res.json()).then(function cogerData(data){
            
            let catObject;
            catObject=data.data.creatures.non_food;
            
            document.getElementById("tablero").innerHTML="";
            //generamos una array de posiciones aleatorias con parejas
            let posiciones= genPosRan();
        //recorremos las posiciones
        for (let i=0;i<posiciones.length;i++){
            //para cada posición mostramos una carta
            templateCard(i, catObject[posiciones[i]]);
        }
})}

//función para crear las cartas individuales
function templateCard(id, objeto){
    
    document.getElementById("tablero").innerHTML+=`
    <div class=card  id=${id}>
        <div class=front >
            <img src=${objeto.image} onclick="girarCarta(${id})" alt="zelda objet">
        </div>
        <div class="back">
        <img src="https://i.pinimg.com/originals/1a/58/3f/1a583fac90a845c9103e66f10ca9f19b.jpg" onclick="girarCarta(${id})" alt="">
        </div>
    </div>
   `;
    document.getElementById("tablero").style.margin="10px";
    document.getElementById("tablero").style.marginBottom="10px";
}
 //generamos las posiciones en el tablero duplicando las cartas y de forma aleatoria
function genPosRan(){
    let arrayOriginal = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
    arrayOriginal.sort(function() { return Math.random() - 0.5 });
    return(arrayOriginal)
}

function resetTablero(){
    document.getElementById("tablero").innerHTML="";
}

function girarCarta (id){
    console.log("hola")
    document.getElementById(id).classList.toggle("flipCard");
}





