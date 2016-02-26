app.controller('controladorSeleccionarTecnologias', function ($scope, $mdDialog, $document, servicioRest, tecnologiasSelecIniciales) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var tecSelec = [];
    
    
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
                console.log(tecnologiasSelecIniciales);
                tecSelec = tecnologiasSelecIniciales;
            }
        
            recorrerArbol(arbol);                        
            $scope.data = [];                      
            $scope.data[0] = arbol; 
        //console.log($scope.data[0]);
    };
    
    function recorrerArbol(response){
        if(response.nodosHijos != null){
            for(var i=0; i<response.nodosHijos.length; i++){
                recorrerArbol(response.nodosHijos[i]);
            }
        }
        console.log("hola");
        angular.element(response).addClass("elementoSeleccionado");
        
        //console.log($scope.data[0].$element);
    };
    
    $scope.nodoSeleccionado;
    
    // Iniciamos el nodo selleccionado a undefined para indicar que inicialmente no hay ninguno seleccionado
    var elementoSeleccionado=undefined;
    
    

    
    $scope.seleccionarElemento=function(elem, nodo){
        
        
        $scope.hayError=false;
        var tipo;
        nodeData=nodo;
        var elemActual = elem;//   elem.childNodes()[0];
        //console.log("AQUI",elemActual);
            //console.log("AQUI",elemActual.$element[0]);
        if(elemActual.$element[0].classList.contains("elementoSeleccionado")){
            elemActual.$element.removeClass("elementoSeleccionado");
            //console.log("indexPadre",tecSelec.indexOf(elemActual.$modelValue.nombre));
            tecSelec.splice(tecSelec.indexOf(elemActual.$modelValue.nombre),1);
        }else{
            elemActual.$element.addClass("elementoSeleccionado");
            tecSelec.push(elemActual.$modelValue.nombre);
        }
        
        while(elemActual.hasChild()){
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
        }
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