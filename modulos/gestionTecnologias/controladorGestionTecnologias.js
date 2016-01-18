app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    var operacion;
    /*$scope.data = [
      {
        "nombre": "tecnologias",
        "clase":"nodo",
        "nodosHijos": [
          {
            "nombre": "node1.1",
            "clase":"nodo",
            "nodosHijos": [
              {
                "nombre": "node1.1.1",
                "clase":"hoja",
                "producto": true,
                "tipo": "OpenSource",
                "nodosHijos": []
              }
            ]
          },
          {
            "nombre": "node1.2",
            "clase":"hoja",
            "nodosHijos": []
          }
        ]
      },
      {
        "nombre": "node2",
        "clase":"nodo",
        "nodrop": true,
        "nodosHijos": [
          {
            "nombre": "node2.1",
            "clase":"hoja",
            "nodosHijos": []
          },
          {
            "nombre": "node2.2",
            "clase":"nodo",
            "nodosHijos": []
          }
        ]
      },
      {
        "nombre": "node3",
        "clase":"nodo",
        "nodosHijos": [
          {
            "nombre": "node3.1",
            "clase":"hojaInvalida",
            "nodosHijos": []
          }
        ]
      }
    ];*/
    
    servicioRest.getTecnologias().then(
        function (response) {
            recorrerArbol(response);
            $scope.data = [];
            $scope.data[0] = response;
        });
    
    
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
                        && destino.$nodeScope.$modelValue.clase === 'nodo';
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
            }
            catch(error){
                //Se meterá en el catch en caso de que muevas el elemento raíz o que muevas un elemento fuera del raíz.
                //Como no tiene padre, saltará la excepción de que no existe $modelValue del $parent (NO DEBERÍA PASAR!!!!!)
                console.error(error);
                alert("No metas nada fuera del Raíz ni muevas el raíz, cenutrio!!");
            }
            
        }
    };
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.eliminarElem=function(scope){
        console.log(scope.$modelValue.nombre);
        servicioRest.deleteTecnologia(scope.$modelValue.nombre)
            .then(function(data) {
                //eliminarNodo(scope);
                $scope.data = [];
                $scope.data[0] = data;

            }).catch(function(err) {
                utils.popupInfo('',"Error al eliminar tecnologia.");
                console.log("Error al eliminar tecnologia");
                servicioRest.getTecnologias().then(
                function (response) {
                    $scope.data = [];
                    $scope.data[0] = response;
                });
            });    
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
        
        $scope.a=$scope.nodoSeleccionado.clase==='hoja';
        
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
        
    $scope.guardarElem=function(){
        
        //------------Añadir elemento
        if(operacion=="anadir"){
            console.log($scope.nodoSeleccionado);
            
            servicioRest.postTecnologia(nodeData.nombre, $scope.nodoSeleccionado)
            .then(function(data) {
                $scope.data = [];
                $scope.data[0] = data;
                //nodeData.nodosHijos.push($scope.nodoSeleccionado);
            }).catch(function(err) {
                utils.popupInfo('',"Error al añadir tecnologia.");
                console.log("Error al añadir tecnologia");
            }); 
        }
         //------------Editar elemento
        else if (operacion=="editar"){
            var oldId=nodeData.nombre;
            
            
            servicioRest.putTecnologia(oldId, $scope.nodoSeleccionado)
            .then(function(data) {
                $scope.data = [];
                $scope.data[0] = data;
                /*nodeData.nombre=$scope.nodoSeleccionado.nombre;
                if(nodeData.clase!="nodo"){
                    nodeData.tipo=$scope.nodoSeleccionado.tipo;
                    nodeData.producto=$scope.nodoSeleccionado.producto;
                }*/
            }).catch(function(err) {
                utils.popupInfo('',"Error al editar tecnologia.");
                console.log("Error al editar tecnologia");
            }); 
        }
        $scope.nodoSeleccionado=null;
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
