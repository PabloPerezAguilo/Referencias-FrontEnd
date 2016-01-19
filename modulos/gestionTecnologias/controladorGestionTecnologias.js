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
    
    /*servicioRest.getTecnologias().then(
        function (response) {
            recorrerArbol(response);
            $scope.data = [];
            $scope.data[0] = response;
        });*/
    
    function actualizarArbol(){          
        servicioRest.getTecnologias().then(                         
            function (response) {                      
                recorrerArbol(response);                        
                $scope.data = [];                      
                $scope.data[0] = response;                  
            });
    };
    
    actualizarArbol();
    
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
                    recorrerArbol(data);
                    $scope.data = [];
                    $scope.data[0] = data;

                }).catch(function(err) {
                    utils.popupInfo('',"Error al mover tecnologia.");
                    console.log("Error al mover tecnologia");
                    servicioRest.getTecnologias().then(
                    function (response) {
                        recorrerArbol(response);
                        $scope.data = [];
                        $scope.data[0] = response;
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
        if(scope.$modelValue.nodosHijos[0]==null)
        {
            ev.stopImmediatePropagation();
            console.log(scope.$modelValue.nombre);
            servicioRest.deleteTecnologia(scope.$modelValue.nombre)
                .then(function(data) {
                    //eliminarNodo(scope);
                    recorrerArbol(data);
                    $scope.data = [];
                    $scope.data[0] = data;

                }).catch(function(err) {
                    utils.popupInfo('',"Error al eliminar tecnologia.");
                    console.log("Error al eliminar tecnologia");
                    servicioRest.getTecnologias().then(
                    function (response) {
                        recorrerArbol(response);
                        $scope.data = [];
                        $scope.data[0] = response;
                    });
                });   
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
                    recorrerArbol(data);
                    $scope.data = [];
                    $scope.data[0] = data;
                    //nodeData.nodosHijos.push($scope.nodoSeleccionado);
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        recorrerArbol(response);
                        $scope.data = [];
                        $scope.data[0] = response;
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
                    recorrerArbol(data);
                    $scope.data = [];
                    $scope.data[0] = data;
                    /*nodeData.nombre=$scope.nodoSeleccionado.nombre;
                    if(nodeData.clase!="nodo"){
                        nodeData.tipo=$scope.nodoSeleccionado.tipo;
                        nodeData.producto=$scope.nodoSeleccionado.producto;
                    }*/
                }).catch(function(err) {
                    servicioRest.getTecnologias().then(
                    function (response) {
                        recorrerArbol(response);
                        $scope.data = [];
                        $scope.data[0] = response;
                    });
                    utils.popupInfo('',"Error al editar tecnologia.");
                    console.log("Error al editar tecnologia");
                }); 
            }
            $scope.nodoSeleccionado=null;
        }
        else{
            utils.popupInfo('',"El nombre de la tecnologia ya esta en uso, REPORT");
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
    
    /*             AYUDA                 */
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
                element: '.cabeceraPagina',
                intro: 'Esta seccion controla la gestion de tecnologias, permite crear tecnologias intermedias y tecnologias finales pudiendo gestionar su distribucion. Siempre tendra una raiz como base que se llama "Tecnologias" y de el cuelga toda la distribucion, siendo imposible mover o borrar este nodo.<br> Esta seccion se guarda automaticamente por lo que cualquier cambio repercutira en el resultado que ven los demas.<br>El orden para las tecnologias del mismo nivel sera por orden de entrada y no se podra modificar por nadie.'
            },
            {
                element: '.raiz',
                intro: 'Aqui se encuentra la raiz, a partir de aqui puede construir el arbol que desee.'
            },
            {
                element: '.flechaAyuda',
                intro: 'un icono con forma de flecha situado en la parte izquierda de cada tecnologia permite desplegar u ocultar todas las tecnologias que descienden de esta tecnologia intermedia,si ejecutas este tutorial con  una tecnologia que tenga algo que ocultar tutorial te señalara el punto exacto donde esta ese icono.'
            },
            {
                element: '.hojaAyuda',
                intro: 'Este icono de aqui te permitira añadir tecnologias INTERMEDIAS descendientes inmediatas de la tecnologia intermedia a la que pertenece, nunca encontraras este icono en una tecnoilogia final, ya que estas tecnologias no pueden tener otras tecnologias como descendientes.'
            },
            {
                element: '.nodoAyuda',
                intro: 'Este icono de aqui te permitira añadir tecnologias FINALES descendientes inmediatas de la tecnologia intermedia a la que pertenece, nunca encontraras este icono en una tecnoilogia final, ya que estas tecnologias no pueden tener otras tecnologias como descendientes..'
            },
            {
                element: '.borrarAyuda',
                intro: 'Un icono con forma de equis(X) situado en la parte derecha de cada tecnologia permite eliminar esa tecnologia ,si ejecutas este tutorial con  una tecnologia que s epueda eliminar el tutorial te señalara el punto exacto donde esta ese icono.'
            },
            {
                element: '#leyendaAyuda',
                intro: 'Aqui se muestra la leyenda de colores para identificar los distintos tipos de tecnologias.'
            }
            ];
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda = $scope.lanzarAyuda;
        }, 1000)
    
}); 
