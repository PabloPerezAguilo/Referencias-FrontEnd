app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    
    $scope.titulo = 'REFERENCIAS PENDIENTES DE VALIDAR';
    
    servicioRest.getReferenciasPendientes().then(
        function (response) {           
            $scope.referencias = response;
            /*if($scope.referencias){
            
                }*/            
        });
    
    $scope.abrirReferenciaPendiente = function (index, referencias) {
        //servicioRest.getReferencia(_id);
        console.log(referencias[index]);
        $rootScope.referenciaCargada = referencias[index];
        $location.path('/nueva');    
    }
});
