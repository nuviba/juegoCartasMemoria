//pendiente de cambiar api y modificar llamada
function mostrarTablero (){
    fetch('https://botw-compendium.herokuapp.com/api/v2').then((res)=>res.json()).then(function cogerData(data){
            
            let catObject;
            catObject=data.data.creatures.non_food;
            
            document.getElementById("tablero").innerHTML="";
        for (let i=0;i<8;i++){
            templateCard(i, catObject[i]);
        }
})}

//función para crear las cartas individuales
function templateCard(id, objeto){
    
    document.getElementById("tablero").innerHTML+="<div class=card id="+id+"></div>";
    document.getElementById("tablero").style.margin="10px";
    document.getElementById("tablero").style.marginBottom="10px";
    document.getElementById("tablero").style.fontFamily="fantasy";
    document.getElementById("tablero").style.color="#624e29";
    
    document.getElementById(id).innerHTML+=`<img src=${objeto.image} alt="zelda objet">`;
    
    }

