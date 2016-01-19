app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog, $mdToast) {  
    var nodeData;
    var operacion;
    
    function toast(texto) {
		$mdToast.show(
			$mdToast.simple().content(texto).position('top right').hideDelay(1500)
		);
	}
       
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
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.eliminarElem=function(ev, scope){
        console.log(scope.$modelValue.nodosHijos);
        if(scope.$modelValue.nodosHijos[0]==null){
            ev.stopImmediatePropagation();
            console.log(scope.$modelValue.nombre);
            servicioRest.deleteTecnologia(scope.$modelValue.nombre)
                .then(function(data) {
                    //eliminarNodo(scope);
                    actualizarArbol(data);
                toast("Tecnologia eliminada");

                }).catch(function(err) {
                    utils.popupInfo('',"Error al eliminar tecnologia.");
                    console.log("Error al eliminar tecnologia");
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                });   
        }
        else{
            utils.popupInfo('',"No se puede eliminar una tecnologia que tiene hijos.");
        }
    };
    
    $scope.aniadirElem=function(ev, scope, tipoElem){
        ev.stopImmediatePropagation();
        $scope.titulo = "Añadir " + tipoElem;
        $scope.nodoSeleccionado={'clase':tipoElem};
        nodeData=scope.$modelValue;
        operacion="anadir";
    };
    
    $scope.seleccionarElemento=function(elem, nodo){

        console.log(nodo);

        $scope.titulo = "Editar " + nodo.clase;
        nodeData=nodo;
        //console.log(elem.$parent.$parentNodeScope.$modelValue.nombre)
        if(nodeData.clase=="nodo"){
            $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            nodosHijos: nodeData.nodosHijos,
            clase: nodeData.clase
            
            };
        } else {
            $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            nodosHijos: nodeData.nodosHijos,
            producto: nodeData.producto,
            tipo: nodeData.tipo,
            clase: nodeData.clase
            };
        }
        
        $scope.estaValidado=$scope.nodoSeleccionado.clase==='hoja';
        
        elem=elem.$element;
        
        // Modificaremos el elemento seleccionado exclusivamente si no se ha hecho click en un elemenyto que ya estaba seleccionado
        if(elem !== elementoSeleccionado){
            
            // Añadimos la clase al elemento seleccionado actual
            elem.addClass("elementoSeleccionado");
            
            // Eliminamos la clase al anterior elemento seleccionado
            if(elementoSeleccionado!=undefined){
                elementoSeleccionado.removeClass("elementoSeleccionado");
            }
            
            // asignamos el elemento seleccionado al actual
            elementoSeleccionado = elem;
        }
        operacion="editar";
    };
        
    function comprobarArbol(nodos, nombreNodo, encontrado){
        if(nodos.nodosHijos != null){
            var i=0;
            while(!encontrado && i<nodos.nodosHijos.length){
                if(nodos.nodosHijos[i].nombre===nombreNodo){
                    encontrado=true;
                }
                else{
                    encontrado = comprobarArbol(nodos.nodosHijos[i], nombreNodo, encontrado);
                }
                i++;
            }
        }
        return encontrado;
    };
    
    $scope.guardarElem=function(){
        
        var nombreRepetido = comprobarArbol($scope.data[0], $scope.nodoSeleccionado.nombre, false);
        //var nombreRepetido=false;
        if(!nombreRepetido){
            //------------Añadir elemento
            if(operacion=="anadir"){
                console.log($scope.nodoSeleccionado);

                servicioRest.postTecnologia(nodeData.nombre, $scope.nodoSeleccionado)
                .then(function(data) {
                    actualizarArbol(data);
                    toast("Tecnologia añadida");
                    //nodeData.nodosHijos.push($scope.nodoSeleccionado);
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                    utils.popupInfo('',"Error al añadir tecnologia.");
                    console.log("Error al añadir tecnologia");
                }); 
            }
             //------------Editar elemento
            else if (operacion=="editar"){
                var oldId=nodeData.nombre;


                servicioRest.putTecnologia(oldId, $scope.nodoSeleccionado)
                .then(function(data) {
                    actualizarArbol(data);
                    toast("Tecnologia modificada");
                    /*nodeData.nombre=$scope.nodoSeleccionado.nombre;
                    if(nodeData.clase!="nodo"){
                        nodeData.tipo=$scope.nodoSeleccionado.tipo;
                        nodeData.producto=$scope.nodoSeleccionado.producto;
                    }*/
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        actualizarArbol(response);
                    });
                    utils.popupInfo('',"Error al editar tecnologia.");
                    console.log("Error al editar tecnologia");
                }); 
            }
            $scope.nodoSeleccionado=null;
        }
        else{
            utils.popupInfo('',"El nombre de la tecnologia ya esta en uso");
        }
    };
    
    $scope.validarElem=function(){
        $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your debt?')
          .textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Please do it!')
          .cancel('Sounds like a scam');

    $mdDialog.show(confirm).then(function() {
      $scope.status = 'You decided to get rid of your debt.';
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };
        //$scope.showConfirm();

        nodeData.clase="hoja";
        $scope.nodoSeleccionado.clase="hoja";

        
    };
}); 
