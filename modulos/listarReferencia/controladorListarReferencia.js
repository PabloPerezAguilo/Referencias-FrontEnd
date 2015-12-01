app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    
    $scope.titulo = 'REFERENCIAS PENDIENTES DE VALIDAR';
    
    $scope.abrirReferenciaPendiente = 
    servicioRest.getReferenciasPendientes().then(
        function (response) {
            
            $scope.referencias = response;
            /*if($scope.referencias){
            
                }*/
              
            
        });
});
