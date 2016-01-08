app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    $scope.data = [
      {
        "nombre": "tecnologias",
        "clase":"nodo",
        "hijos": [
          {
            "nombre": "node1.1",
            "clase":"nodo",
            "hijos": [
              {
                "nombre": "node1.1.1",
                "clase":"hoja",
                "producto": true,
                "tipo": "OpenSource",
                "hijos": []
              }
            ]
          },
          {
            "nombre": "node1.2",
            "clase":"hoja",
            "hijos": []
          }
        ]
      },
      {
        "nombre": "node2",
        "clase":"nodo",
        "nodrop": true,
        "hijos": [
          {
            "nombre": "node2.1",
            "clase":"hoja",
            "hijos": []
          },
          {
            "nombre": "node2.2",
            "clase":"nodo",
            "hijos": []
          }
        ]
      },
      {
        "nombre": "node3",
        "clase":"nodo",
        "hijos": [
          {
            "nombre": "node3.1",
            "clase":"hojaInvalida",
            "hijos": []
          }
        ]
      }
    ]
    $scope.nodoSeleccionado;
    var elementoSelecionado;
    
    $scope.eventosArbol = {
        //Cuando salte el evento (la clave), saltará la función de callback que contiene
        
        //cuando se intenta arrastrar un nodo a otro sitio. Si se retorna true, se podrá soltar ahí. Si no, no 
        accept: function(origen, destino, indiceDestino) {
            // si el origen es el raíz o el destino está fuera del nodo raíz, su $parentNodeScope será null o undefined
            // no se aceptará que se arrastre la raíz o que se arrastre algo fuera de la raíz
            return destino.$parentNodeScope!= undefined && origen.$parentNodeScope!=undefined;
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
                var padreOrigen = e.source.nodesScope.$parent.$modelValue.nombre;
                var padreDestino = e.dest.nodesScope.$parent.$modelValue.nombre;
                var nodo= e.source.nodeScope.$modelValue;
                // Hacer la llamada al back
            }
            catch(error){
                //Se meterá en el catch en caso de que muevas el elemento raíz o que muevas un elemento fuera del raíz.
                //Como no tiene padre, saltará la excepción de que no existe $modelValue del $parent
                alert("No metas nada fuera del Raíz ni muevas el raíz, cenutrio!!");
            }
            
        }
    };
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.aniadirElem=function(ev, scope, tipoElem){
        ev.stopImmediatePropagation();
        nodeData = scope.$modelValue;
        $scope.titulo = "Añadir " + tipoElem;
        
        console.log(nodeData);
        var nuevoElemento = {"clase" : tipoElem};
        $scope.nodoSeleccionado={};
        
        
        nodeData.hijos.push({
          id: nodeData.id * 10 + nodeData.hijos.length,
          nombre: tipoElem + '.' + (nodeData.hijos.length + 1),
          clase: tipoElem,
          hijos: []
        });
        
    };
    
    $scope.seleccionarElemento=function(elem, nodo){

        $scope.titulo = "Editar " + nodo.clase;
        nodeData=nodo;
        
        //console.log(elem.$parent.$parentNodeScope.$modelValue.nombre)
        ////////////////
        $scope.nodoSeleccionado={
            id: nodeData.id,
            nombre: nodeData.nombre,
            clase: nodeData.clase,
            hijos: nodeData.hijos
        };
        //$scope.nodoSeleccionado=nodo;
        ///////////////
        
        elem=elem.$element;
        elem.addClass("elementoSeleccionado");
        if(elementoSelecionado!=undefined){
            elementoSelecionado.removeClass("elementoSeleccionado");
        }
        elementoSelecionado=elem;
    };
    
    $scope.guardarElem=function(scope, tipoElem){
        
        console.log(nodeData);
        elementoSelecionado.$modelValue=$scope.nodoSeleccionado;
        console.log(nodeData);
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
        $scope.nodoSeleccionado.clase="hoja";
        /*nodeData.nodes.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });*/
        
    };
}); 
