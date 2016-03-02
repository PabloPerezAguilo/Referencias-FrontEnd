app.controller('controladorSeleccionarTecnologias', function ($scope, $mdDialog, $document, servicioRest, tecnologiasSelecIniciales) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var tecSelec = {};
    tecSelec.nodos = [];
    tecSelec.hojas = [];
    var tecIni = [];
    console.log(tecnologiasSelecIniciales);
    
    //console.log(tecnologiasSelecIniciales);
    var nodeData;
    var operacion;
    $scope.nodoSeleccionado={};
    $scope.nodoSeleccionado.clase="raiz";
    $scope.clientes={};
    //$scope.clientes.elemSeleccionado={};
    //console.log($scope.clientes.elemSeleccionado.value);
    

    servicioRest.getTecnologias().then(
        function (response) {
            actualizarArbol(response);
        });
    
    function actualizarArbol(arbol){ 
            if(tecnologiasSelecIniciales != undefined){
                console.log("tec1",tecnologiasSelecIniciales);
                tecSelec = tecnologiasSelecIniciales;
                tecIni = angular.copy(tecnologiasSelecIniciales.hojas);
                console.log("tec2",tecIni);
                console.log("tec2",tecnologiasSelecIniciales.nodos);
                tecIni = tecIni.concat(angular.copy(tecnologiasSelecIniciales.nodos));
                console.log("tec3",tecIni);
            }
        
                                  
            $scope.data = [];                      
            $scope.data[0] = arbol; 
        setTimeout(function(){ 
            recorrerArbol(arbol, document.getElementById("arbol").children[0].children[1]);      //console.log(document.getElementById("arbol").children[0].children[1].children[0].children[1].children[0].firstElementChild.classList.add("elementoSeleccionado"));
//console.log(document.getElementById("arbol").children[0].children[1].children[0].children[1].children);
        
        }, 1)
        
        //console.log($scope.data[0]);
    };
    
    function recorrerArbol(response, padre){
        
        //angular.element(response).addClass("elementoSeleccionado");
        if(response.nodosHijos != null){
            for(var i=0; i<response.nodosHijos.length; i++){
                if(existeElemento(padre.children[i])){
                    padre.children[i].firstElementChild.classList.add("elementoSeleccionado");
                    padre.children[i].firstElementChild.classList.add("elementoSeleccionado");
                }
                
                recorrerArbol(response.nodosHijos[i], padre.children[i].children[1]);
            }
        }
        
        //angular.element(response).addClass("elementoSeleccionado");
        
        //console.log($scope.data[0].$element);
    };
    
    function existeElemento(padre){
        var result = false;
        for(var i=0; i<tecIni.length; i++){
            if(tecIni[i]===padre.firstElementChild.outerText){
                result = true;
            }
        }
        return result;
    }
    
    $scope.nodoSeleccionado;
    
    // Iniciamos el nodo selleccionado a undefined para indicar que inicialmente no hay ninguno seleccionado
    var elementoSeleccionado=undefined;
    
    function marcarElementos(elemActual,marcar) {
        for(var i=0; i<elemActual.childNodes().length; i++){
            if(!marcar){
                if(elemActual.childNodes()[i].$element[0].firstElementChild.classList.contains("elementoSeleccionado")){
                    //console.log("selec");
                    elemActual.childNodes()[i].$element[0].firstElementChild.classList.remove("elementoSeleccionado");
                    //console.log("indexHijo",tecSelec.indexOf(elemActual.$modelValue.nombre));
                    if(elemActual.childNodes()[i].$modelValue.clase === "nodo"){
                        tecSelec.nodos.splice(tecSelec.nodos.indexOf(elemActual.childNodes()[i].$modelValue.nombre),1);
                    }else{
                        tecSelec.hojas.splice(tecSelec.hojas.indexOf(elemActual.childNodes()[i].$modelValue.nombre),1);
                    }
                    
                }
            }else{
                if(!elemActual.childNodes()[i].$element[0].firstElementChild.classList.contains("elementoSeleccionado")){
                    //console.log("no selec");
                    elemActual.childNodes()[i].$element[0].firstElementChild.classList.add("elementoSeleccionado");
                    if(elemActual.childNodes()[i].$modelValue.clase === "nodo"){
                        tecSelec.nodos.push(elemActual.childNodes()[i].$modelValue.nombre);
                    }else{
                        tecSelec.hojas.push(elemActual.childNodes()[i].$modelValue.nombre);
                    }
                    
                }
            }
            if(elemActual.childNodes()[i].hasChild()){
            marcarElementos(elemActual.childNodes()[i],marcar);
            }
        }
    }

    
    $scope.seleccionarElemento=function(elem, nodo){
        
        
        $scope.hayError=false;
        var tipo;
        var marcar;
        nodeData=nodo;
        var elemActual = elem;//   elem.childNodes()[0];
        //console.log("AQUI",elemActual);
            //console.log("AQUI",elemActual.$element[0]);
        if(elemActual.$element[0].classList.contains("elementoSeleccionado")){
            elemActual.$element.removeClass("elementoSeleccionado");
            //console.log("indexPadre",tecSelec.indexOf(elemActual.$modelValue.nombre));
            if(elemActual.$modelValue.clase === "nodo"){
                tecSelec.nodos.splice(tecSelec.nodos.indexOf(elemActual.$modelValue.nombre),1);
            }else{
                tecSelec.hojas.splice(tecSelec.hojas.indexOf(elemActual.$modelValue.nombre),1);
            }
            
            marcar=false;
        }else{
            elemActual.$element.addClass("elementoSeleccionado");
            if(elemActual.$modelValue.clase === "nodo"){
                tecSelec.nodos.push(elemActual.$modelValue.nombre);
            }else{
                tecSelec.hojas.push(elemActual.$modelValue.nombre);
            }
            
            marcar=true;
        }
        
        if(elemActual.hasChild()){
        marcarElementos(elemActual,marcar);}
        /*while(elemActual.hasChild()){
            elemActual = elemActual.childNodes()[0];
            //console.log("AQUI",elemActual);
            //console.log("AQUI",elemActual.$element[0].firstElementChild.classList);
            //console.log("AQUI",elemActual.$element[0].classList);
            if(elemActual.$element[0].firstElementChild.classList.contains("elementoSeleccionado")){
                //console.log("selec");
                elemActual.$element[0].firstElementChild.classList.remove("elementoSeleccionado");
                //console.log("indexHijo",tecSelec.indexOf(elemActual.$modelValue.nombre));
                tecSelec.splice(tecSelec.indexOf(elemActual.$modelValue.nombre),1);
            }else{
                //console.log("no selec");
                elemActual.$element[0].firstElementChild.classList.add("elementoSeleccionado");
                tecSelec.push(elemActual.$modelValue.nombre);
            }
            //tecSelec.push(elemActual.$modelValue.nombre);
            //elemActual.$element.addClass("elementoSeleccionado");
            //console.log(elemActual.$element);
            //console.log(elemActual.$modelValue);
        }*/
        //console.log(tecSelec);
    
    
    
};
    
    
        
    
    
    
    
    
    
    
    
    
    
    
    
    
    var bloqueoActivo=true;
    $document.on('keydown', function(e) {
      if (e.which === 8 && (e.target.nodeName != "TEXTAREA") && bloqueoActivo) { // you can add others here.
        e.preventDefault();
      }
    });
    
    $scope.guardarSeleccion = function () {
        $scope.hide(tecSelec);
    };
    
	$scope.hide = function (razonRechazo) {
        bloqueoActivo=false;
		$mdDialog.hide(razonRechazo);
	};
  	$scope.cancel = function () {
        bloqueoActivo=false;
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});