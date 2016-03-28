app.controller ('controladorListarReferenciasValidar', function (servicioRest,utils, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'Referencias pendientes de validar';
    $scope.referencias = [];
   
    
    servicioRest.getReferenciasPendientes().then(
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
        $location.path('/validarReferencia');
    }
    
    /*   AYUDA     */
    
    $scope.introOptions = config.introOptions;
    
    $scope.introOptions.steps = [
            {
              element: '.cabeceraPagina',
              intro: 'Esta funcionalidad permite realizar una validación del contenido y la calidad de la redacción de las referencias que se han creado o se han modificado sustancialmente. Esta pantalla muestra el listado de las referencias que están en estado pendiente de validar. Una vez elegida una de la lista, mostrará la información de la misma para que se pueda dar por validada o, por el contrario, rechazarla detallando el motivo del rechazo'
            },
            {
                element: '#referenciasPendientes',
                intro: 'Pulsando en cualquiera de las referencias mostradas, se accede a su información detallada y permitirá validarla o rechazarla.'
            },
            {
                element: '.pagination-sm',
                intro: 'Desde las opciones de paginación, se permitirá al usuario navegar por las diferentes páginas de resultados. En el caso de haya varias páginas, se podrá navegar a la primera o última página o ir avanzando o retrocediendo de una en una. Así mismo se podrá acceder a una página concreta de las mostradas en el centro.'
            }
            ];
    
    setTimeout(function(){ 
            //Se necesita un tiem out para dar tiempo a que se cargue el lanzar ayuda
            $rootScope.lanzarAyuda = $scope.lanzarAyuda;
        }, 1000)
}); 
