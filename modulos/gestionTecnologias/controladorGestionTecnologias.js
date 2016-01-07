app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    $scope.data = [
      {
        "id": 1,
        "nombre": "node1",
        "clase":"nodo",
        "hijos": [
          {
            "id": 11,
            "nombre": "node1.1",
            "clase":"nodo",
            "hijos": [
              {
                "id": 111,
                "nombre": "node1.1.1",
                "clase":"hoja",
                "producto": true,
                "tipo": "OpenSource",
                "hijos": []
              }
            ]
          },
          {
            "id": 12,
            "nombre": "node1.2",
            "clase":"hoja",
            "hijos": []
          }
        ]
      },
      {
        "id": 2,
        "nombre": "node2",
        "clase":"nodo",
        "nodrop": true,
        "hijos": [
          {
            "id": 21,
            "nombre": "node2.1",
            "clase":"hoja",
            "hijos": []
          },
          {
            "id": 22,
            "nombre": "node2.2",
            "clase":"nodo",
            "hijos": []
          }
        ]
      },
      {
        "id": 3,
        "nombre": "node3",
        "clase":"nodo",
        "hijos": [
          {
            "id": 31,
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
        removeNode: function(nodo){
            console.log("removed");           
        },
        dropped: function(e) {
            console.log("dropped");
            var padre = e.dest.nodesScope.$parent.$modelValue.nombre;
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
        console.log(elem.$parent.$parentNodeScope.$modelValue.nombre)
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
