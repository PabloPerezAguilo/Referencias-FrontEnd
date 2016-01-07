app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope) {  
    
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
    
    
    $scope.seleccionarElemento=function(elem, nodo){
        $scope.nodoSeleccionado=nodo;
        console.log(elem.$parent.$parentNodeScope.$modelValue.nombre);
        elem=elem.$element;
        elem.addClass("elementoSeleccionado");
        if(elementoSelecionado!=undefined){
            elementoSelecionado.removeClass("elementoSeleccionado");
        }
        elementoSelecionado=elem;
    };
}); 
