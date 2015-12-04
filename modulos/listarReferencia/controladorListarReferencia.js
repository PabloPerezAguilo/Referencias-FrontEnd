app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    $scope.titulo = 'LISTA DE REFERENCIAS PENDIENTES DE VALIDAR';
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
        console.log(referencias[index]);
        $rootScope.referenciaCargada = referencias[index];
        $location.path('/validarReferencia');
    }
}); 
