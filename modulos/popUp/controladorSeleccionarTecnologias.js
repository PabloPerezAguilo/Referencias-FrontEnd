app.controller('controladorSeleccionarTecnologias', function ($scope, $mdDialog, $document, servicioRest, tecnologiasSelecIniciales) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var tecSelec = {};
    tecSelec.nodos = [];
    tecSelec.hojas = [];
    var tecIni = [];
    
    var nodeData;
    var operacion;
    $scope.nodoSeleccionado={};
    $scope.nodoSeleccionado.clase="raiz";
    $scope.clientes={};
    //$scope.clientes.elemSeleccionado={};
    

    servicioRest.getTecnologias().then(
        function (response) {
            actualizarArbol(response);
        });
    
    function actualizarArbol(arbol){ 
            if(tecnologiasSelecIniciales != undefined){

                tecSelec = tecnologiasSelecIniciales;
                tecIni = angular.copy(tecnologiasSelecIniciales.hojas);
                tecIni = tecIni.concat(angular.copy(tecnologiasSelecIniciales.nodos));

            }
        
                                  
            $scope.data = [];                      
            $scope.data[0] = arbol; 
        setTimeout(function(){ 
            recorrerArbol(arbol, document.getElementById("arbol").children[0].children[1]);      //document.getElementById("arbol").children[0].children[1].children[0].children[1].children[0].firstElementChild.classList.add("elementoSeleccionado");
        
        }, 1)
    };
    
    function recorrerArbol(response, padre){
        
        //angular.element(response).addClass("elementoSeleccionado");
        if(response.nodosHijos != null){
            for(var i=0; i<response.nodosHijos.length; i++){
                if(existeElemento(padre.children[i])){
                    padre.children[i].firstElementChild.classList.add("elementoSeleccionado");
                    padre.children[i].firstElementChild.children[0].classList.remove("ocultarImagen");
                    //padre.children[i].firstElementChild.classList.add("elementoSeleccionado");
                }
                
                recorrerArbol(response.nodosHijos[i], padre.children[i].children[1]);
            }
        }
        
        //angular.element(response).addClass("elementoSeleccionado");
        
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
                    elemActual.childNodes()[i].$element[0].firstElementChild.classList.remove("elementoSeleccionado");
                    elemActual.childNodes()[i].$element[0].children[0].children[0].classList.add("ocultarImagen");
                    if(elemActual.childNodes()[i].$modelValue.clase === "nodo"){
                        tecSelec.nodos.splice(tecSelec.nodos.indexOf(elemActual.childNodes()[i].$modelValue.nombre),1);
                    }else{
                        tecSelec.hojas.splice(tecSelec.hojas.indexOf(elemActual.childNodes()[i].$modelValue.nombre),1);
                    }
                    
                }
            }else{
                if(!elemActual.childNodes()[i].$element[0].firstElementChild.classList.contains("elementoSeleccionado")){
                    elemActual.childNodes()[i].$element[0].firstElementChild.classList.add("elementoSeleccionado");
                    elemActual.childNodes()[i].$element[0].children[0].children[0].classList.remove("ocultarImagen");
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
        var elemActual = elem;
        if(elemActual.$element[0].classList.contains("elementoSeleccionado")){
            elemActual.$element.removeClass("elementoSeleccionado");
            elemActual.$element[0].childNodes[1].classList.add("ocultarImagen");
            if(elemActual.$modelValue.clase === "nodo"){
                tecSelec.nodos.splice(tecSelec.nodos.indexOf(elemActual.$modelValue.nombre),1);
            }else{
                tecSelec.hojas.splice(tecSelec.hojas.indexOf(elemActual.$modelValue.nombre),1);
            }
            
            marcar=false;
        }else{
            elemActual.$element.addClass("elementoSeleccionado");
            elemActual.$element[0].childNodes[1].classList.remove("ocultarImagen");
            if(elemActual.$modelValue.clase === "nodo"){
                tecSelec.nodos.push(elemActual.$modelValue.nombre);
            }else{
                tecSelec.hojas.push(elemActual.$modelValue.nombre);
            }
            
            marcar=true;
        }
        
        if(elemActual.hasChild()){
            marcarElementos(elemActual,marcar);
        }
        /*while(elemActual.hasChild()){
            elemActual = elemActual.childNodes()[0];
            if(elemActual.$element[0].firstElementChild.classList.contains("elementoSeleccionado")){
                elemActual.$element[0].firstElementChild.classList.remove("elementoSeleccionado");
                tecSelec.splice(tecSelec.indexOf(elemActual.$modelValue.nombre),1);
            }else{
                elemActual.$element[0].firstElementChild.classList.add("elementoSeleccionado");
                tecSelec.push(elemActual.$modelValue.nombre);
            }
            //tecSelec.push(elemActual.$modelValue.nombre);
            //elemActual.$element.addClass("elementoSeleccionado");
        }*/

    
    
    
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