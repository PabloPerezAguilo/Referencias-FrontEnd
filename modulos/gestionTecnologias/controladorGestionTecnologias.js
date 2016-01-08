app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    var operacion;
    $scope.data = [
      {
        "nombre": "node1",
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
    
    $scope.tipos=["OpenSource", "Suscripción", "Licencia"];
    
    $scope.aniadirElem=function(ev, scope, tipoElem){
        ev.stopImmediatePropagation();
        $scope.titulo = "Añadir " + tipoElem;
        $scope.nodoSeleccionado={'clase':tipoElem};
        nodeData=scope.$modelValue;
        operacion="anadir";
    };
    
    $scope.seleccionarElemento=function(elem, nodo){
        $scope.titulo = "Editar " + nodo.clase;
        nodeData=nodo;
        //console.log(elem.$parent.$parentNodeScope.$modelValue.nombre)
        $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            clase: nodeData.clase,
            hijos: nodeData.hijos
        };
        
        elem=elem.$element;
        elem.addClass("elementoSeleccionado");
        if(elementoSelecionado!=undefined){
            elementoSelecionado.removeClass("elementoSeleccionado");
        }
        elementoSelecionado=elem;
        operacion="editar";
    };
    
    $scope.guardarElem=function(){
        if(operacion=="anadir"){
            nodeData.hijos.push($scope.nodoSeleccionado);
        }
        else if (operacion=="editar"){
            nodeData.nombre=$scope.nodoSeleccionado.nombre;
            //MAS
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
