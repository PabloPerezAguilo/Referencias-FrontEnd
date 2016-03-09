app.controller ('controladorListarNoValidadas', function (servicioRest,utils, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'Referencias no validadas';
    $scope.referencias = [];
    $scope.pop=utils.popupInfo;
    
    servicioRest.getReferenciasAsociadasAUsuario().then(
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
        $location.path('/modificarReferenciaNoValidada');
    }
    
    /*   AYUDA     */
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
                element: '.cabeceraPagina',
                intro: 'Esta seccion muestra un listado con las tecnologias asociadas a una persona que no estan validadas aun o han sido rechazadas(aquellas que ha creado o de las que es gerente )'
            },
            {
                element: '#referenciasNoValidadas',
                intro: 'Haciendo click en cualquier fila accederemos a la referencia seleccionada para poder consultarla a modificarla.'
            },
            {
                element: '.pagination-sm',
                intro: 'Esta seccion de aqui permite movernos entre distintas paginas por si el numero de referencias no validadas fuera muy extenso.'
            }
            ];
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda = $scope.lanzarAyuda;
        }, 1000)
}); 
