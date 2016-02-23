app.controller('controladorSeleccionarTecnologias', function ($scope, $mdDialog, $document, servicioRest, tecnologiasSelecIniciales) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    var tecSelec = [];
    if(tecnologiasSelecIniciales != undefined){
        console.log(tecnologiasSelecIniciales);
        tecSelec = tecnologiasSelecIniciales;
    }
    
    console.log(tecnologiasSelecIniciales);
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
            recorrerArbol(arbol);                        
            $scope.data = [];                      
            $scope.data[0] = arbol;                  
    };
    
    
    
    function recorrerArbol(response){
        if(response.nodosHijos != null){
            for(var i=0; i<response.nodosHijos.length; i++){
                recorrerArbol(response.nodosHijos[i]);
            }
        }
        else{
            response.nodosHijos=[];
        }
    };
    
    $scope.nodoSeleccionado;
    
    // Iniciamos el nodo selleccionado a undefined para indicar que inicialmente no hay ninguno seleccionado
    var elementoSeleccionado=undefined;
    
    $scope.eventosArbol = {
        //Cuando salte el evento (la clave), saltará la función de callback que contiene
        
        //cuando se intenta arrastrar un nodo a otro sitio. Si se retorna true, se podrá soltar ahí. Si no, no 
        accept: function(origen, destino, indiceDestino) {
            
            // No se podrá arrastrar un nodo raíz ( Si origen.$parentNodeScope != undefined ), ni se podrámover un elemento a nodo raíz ni fuera ( destino.$parent.$modelValue.nombre!=undefined ) ni se podrá mover un nodo hoja u hoja inválida (destino.$nodeScope.$modelValue.clase === 'nodo')
            
            // ¡¡¡ IMPORTANTE !!!! se compara con '!=' o '==' en lugar de '!==' y '===' porque a veces es null y otras undefined
            
            try{
               // return true;
                console.log("DESTINO:");/* Si se trata del elemento que contienen la raíz, será un array. Soi no, no tendrá $modelValue y dará unerror que recogeremos en el catch
                */
                return destino.$parent.$modelValue.nombre!=undefined 
                        && origen.$parentNodeScope != undefined 
                        && (destino.$nodeScope.$modelValue.clase === 'nodo'
                        || destino.$nodeScope.$modelValue.clase === 'raiz');
            }
            catch(error){
                //console.error(error);
                return false;
            }
        },
        
        //Cuando se ha movido el nodo
        dropped: function(e) {
            console.log("dropped");
            try{
                // Ponemos el nodo seleccionado a  null para que la introducción de datos desaparezca, ya que se pierde el knodo seleccionado al arrastrar
                $scope.nodoSeleccionado=null;
                
                // Obtenemos el padre del que se ha movido el nodo
                var padreOrigen = e.source.nodesScope.$parent.$modelValue.nombre;
                
                //Obtenemos el padre destino
                var padreDestino = e.dest.nodesScope.$parent.$modelValue.nombre;
                
                //Obtenemos el nodo a mover
                var nodo= e.source.nodeScope.$modelValue;
                // Hacer la llamada al back
                servicioRest.putMoverTecnologia(padreDestino, nodo)
                .then(function(data) {
                    //eliminarNodo(scope);
                    actualizarArbol(data);

                }).catch(function(err) {
                    utils.popupInfo('',"Error al mover tecnologia.");
                    console.log("Error al mover tecnologia");
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                });   
            }
            catch(error){
                //Se meterá en el catch en caso de que muevas el elemento raíz o que muevas un elemento fuera del raíz.
                //Como no tiene padre, saltará la excepción de que no existe $modelValue del $parent (NO DEBERÍA PASAR!!!!!)
                console.error(error);
            }
            
        }
    };
    

    
    $scope.seleccionarElemento=function(elem, nodo){
        
        
        $scope.hayError=false;
        var tipo;
        nodeData=nodo;
        var elemActual = elem;//   elem.childNodes()[0];
        if(elemActual.$element[0].classList.contains("elementoSeleccionado")){
            console.log("hola");
            elemActual.$element.removeClass("elementoSeleccionado");
            console.log("indexPadre",tecSelec.indexOf(elemActual.$modelValue.nombre));
            tecSelec.splice(tecSelec.indexOf(elemActual.$modelValue.nombre),1);
        }else{
            elemActual.$element.addClass("elementoSeleccionado");
            tecSelec.push(elemActual.$modelValue.nombre);
        }
        
        while(elemActual.hasChild()){
            elemActual = elemActual.childNodes()[0];
            console.log("AQUI",elemActual.$element[0].classList);
            if(elemActual.$element[0].classList.contains("elementoSeleccionado")){
                console.log("selec");
                elemActual.$element.removeClass("elementoSeleccionado");
                console.log("indexHijo",tecSelec.indexOf(elemActual.$modelValue.nombre));
                tecSelec.splice(tecSelec.indexOf(elemActual.$modelValue.nombre),1);
            }else{
                console.log("no selec");
                elemActual.$element.addClass("elementoSeleccionado");
                tecSelec.push(elemActual.$modelValue.nombre);
            }
            //tecSelec.push(elemActual.$modelValue.nombre);
            //elemActual.$element.addClass("elementoSeleccionado");
            console.log(elemActual.$element);
            console.log(elemActual.$modelValue);
        }
        console.log(tecSelec);
    
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