app.controller ('controladorGestionTecnologias', function (servicioRest, utils, config, $scope, $http, $rootScope, $mdDialog) {  
    var nodeData;
    var operacion;
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
                
                /*var elemASeleccionar=document.getElementById(elementoSelecionado.id);
                if( elemASeleccionar!=undefined ){
                    //elemeToSelect.class+=" elementoSeleccionado";
                    console.log(elemASeleccionar);
                } */
                
                var padreOrigen = e.source.nodesScope.$parent.$modelValue.nombre;
                var padreDestino = e.dest.nodesScope.$parent.$modelValue.nombre;
                var nodo= e.source.nodeScope.$modelValue;
                
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
            clase: nodeData.clase,
            hijos: nodeData.hijos
            };
        } else {
            $scope.nodoSeleccionado={
            nombre: nodeData.nombre,
            clase: nodeData.clase,
            producto: nodeData.producto,
            tipo: nodeData.tipo,
            hijos: nodeData.hijos
            };
        }
        
       
        if(elem !== elementoSelecionado.elem){
            elem=elem.$element;
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
                nodeData.hijos.push($scope.nodoSeleccionado);
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
                nodeData.nombre=$scope.nodoSeleccionado.nombre;
                if(nodeData.clase!="nodo"){
                    nodeData.tipo=$scope.nodoSeleccionado.tipo;
                    nodeData.producto=$scope.nodoSeleccionado.producto;
                }
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
