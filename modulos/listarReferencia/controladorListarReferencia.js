app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    
    $scope.titulo = 'REFERENCIAS PENDIENTES DE VALIDAR';
    
    servicioRest.getReferenciasPendientes().then(
        function (response) {           
            $scope.referencias = response;
            /*if($scope.referencias){
            
                }*/            
        });
    
    $scope.abrirReferenciaPendiente = function (index, referencia) {
        //servicioRest.getReferencia(_id);
        console.log(referencia[index]);
        
        $location.path('/nueva');    
    }
});
