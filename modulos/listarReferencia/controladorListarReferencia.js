app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.titulo = 'REFERENCIAS PENDIENTES DE VALIDAR';
     servicioRest.getReferenciasPendientes().then(
        function (response) {
            
            $scope.referencias = response;
            /*if($scope.referencias){
            
                }*/
              
            
        });
});
