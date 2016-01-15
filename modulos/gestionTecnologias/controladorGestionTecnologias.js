app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    var operacion;
    $scope.data = [
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
    ]
    
    servicioRest.getTecnologias().then(
        function (response) {
            console.log(response);
            $scope.data = [];
            $scope.data[0] = response;
        });
    
    $scope.nodoSeleccionado;
    var elementoSelecionado={
        elem:undefined,
        id:undefined
    };
    
    $scope.eventosArbol = {
        //Cuando salte el evento (la clave), saltará la función de callback que contiene
        
        //cuando se intenta arrastrar un nodo a otro sitio. Si se retorna true, se podrá soltar ahí. Si no, no 
        accept: function(origen, destino, indiceDestino) {
            // si el origen es el raíz o el destino está fuera del nodo raíz, su $parentNodeScope será null o undefined
            // no se aceptará que se arrastre la raíz o que se arrastre algo fuera de la raíz
            //console.log("ORIGEN: "+origen.$parentNodeScope);
            try{
                return destino.$parent.$modelValue.nombre!=undefined 
                        && origen.$parentNodeScope != undefined 
                        && destino.$nodeScope.$modelValue.clase === 'nodo';
            }
            catch(error){
                return false;
            }
        },
        //Cuando se ha eliminado el nodo
        removed: function(nodo){
            console.log("removed: ");
            try{
                var padre=nodo.$parentNodeScope.$modelValue.nombre;
                nodo=nodo.$modelValue;
                
                // TODO: Hacer la llamada al back
            }
            catch(error){
                //se meterá en caso de que intente eliminar un directorio raíz
                alert("No se puede eliminar un directorio raíz, patán");
            }
            
        },
        //Cuando se ha movido el nodo
        dropped: function(e) {
            console.log("dropped");
            try{
                $scope.nodoSeleccionado=null;
                
                var padreOrigen = e.source.nodesScope.$parent.$modelValue.nombre;
                var padreDestino = e.dest.nodesScope.$parent.$modelValue.nombre;
                var nodo= e.source.nodeScope.$modelValue;
                //console.log (e.source);
                // Hacer la llamada al back
            }
            catch(error){
                //Se meterá en el catch en caso de que muevas el elemento raíz o que muevas un elemento fuera del raíz.
                //Como no tiene padre, saltará la excepción de que no existe $modelValue del $parent
                console.error(error);
                alert("No metas nada fuera del Raíz ni muevas el raíz, cenutrio!!");
            }
            
        }
    };
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.eliminarElem=function(scope, eliminarNodo){
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
        console.log("aqui",elem);
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
        if(elem !== elementoSelecionado.elem){
            
            elem.addClass("elementoSeleccionado");
            if(elementoSelecionado.elem!=undefined){
                elementoSelecionado.elem.removeClass("elementoSeleccionado");
            }
            elementoSelecionado.elem = elem;
            elementoSelecionado.id = elem[0].id;
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
