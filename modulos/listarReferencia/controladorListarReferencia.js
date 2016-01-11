app.controller ('controladorListarReferencia', function (servicioRest,utils, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'LISTA DE REFERENCIAS PENDIENTES DE VALIDAR';
    $scope.referencias = [];
    
    // esta funcion permite cargar el menu cuando hemos recargado la pagina
    utils.cargarMenu();
    
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
}); 
