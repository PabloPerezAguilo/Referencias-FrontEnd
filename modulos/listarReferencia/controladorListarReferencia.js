app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    
    
    servicioRest.getReferenciasPendientes().then(
        function (response) {           
            $scope.referencias = response;
        });
    
    $scope.abrirReferenciaPendiente = function (index, referencias) {        
        console.log(referencias[index]);
        $rootScope.referenciaCargada = referencias[index];
        $location.path('/nueva');
    }
});
