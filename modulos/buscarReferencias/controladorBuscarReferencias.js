app.controller ('controladorBuscarReferencias', function (servicioRest,utils, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'BUSCAR REFERENCIAS';
    $scope.referencias = [];
    $scope.pop=utils.popupInfo;
    
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            $scope.clientes.lista= $scope.catalogo.clientes.map( function (cliente) {
            return {
                value: cliente.nombre,
                display: cliente.nombre+' ('+cliente.siglas+')'
            };
        });
    });
    
    $scope.filtrar = function (texto) {
        var resultado;
        var array;
        // Determinamos cual es el array a filtrar y cuanl es el índice del resultado            
        array=$scope.clientes.lista;
        $scope.posicionEnArray=undefined;
        // hacemos la búsqueda en el array
        if(texto!==""){
            //Si hay algo de texto, cogemos los elementos que tengan el texto en el nombre y/o en las siglas
            resultado=array.filter(function (cliente) {
                return (cliente.display.toLowerCase().indexOf(texto.toLowerCase()) !==-1);
            });
        }else{
            //si no hay texto, asignamos el resultado de la búsqueda al array completo para que se recarguen todos los datos
            resultado=array;
        }
        return resultado;
    }
    
    //Cuando seleccionamos un elemento de la lista de resultados del autocomplete
    $scope.selectedItemChange=function (item) {
        //si es el autocomplete del cliente, buscamos el índife en la lista de clientes.
        //lo asignamos a la posición del catálogo de clientes correspondiente al mismo
        $scope.posicionEnArray=$scope.clientes.lista.indexOf(item);     
    }
    
    servicioRest.getReferenciasValidadas().then(
        function (response) {           
            $scope.referencias = response;
            $scope.totalItems = $scope.referencias.length;
        });
    
    $scope.currentPage = 1;
    $scope.numPerPage = 15;

    $scope.paginate = function(value) {
    var begin, end, index;
    begin = ($scope.currentPage - 1) * $scope.numPerPage;
    end = begin + $scope.numPerPage;
    index = $scope.referencias.indexOf(value);
    return (begin <= index && index < end);
    };
    
    
    $scope.abrirReferenciaPendiente = function (index, referencias) {        
        $rootScope.referenciaCargada = referencias[index];
        $location.path('/modificarReferencia');
    }
    
    /*   AYUDA     */
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
                element: '.cabeceraPagina',
                intro: 'Esta seccion muestra un listado con las tecnologias validadas.'
            },
            {
                element: '#referenciasPendientes',
                intro: 'Haciendo click en cualquier fila accederemos a la referencia seleccionada para poder consultarla y, en caso de que no existiera una copia pendiente o en borrador, modificarla.'
            },
            {
                element: '.pagination-sm',
                intro: 'Esta seccion de aqui permite movernos entre distintas paginas por si el numero de referencias validadas fuera muy extenso.'
            }
            ];
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda = $scope.lanzarAyuda;
        }, 1000)
}); 
