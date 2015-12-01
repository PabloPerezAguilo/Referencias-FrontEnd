app.controller ('controladorListarReferencia', function (servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $rootScope.opcion = 'validar';
    
    $scope.titulo = 'REFERENCIAS PENDIENTES DE VALIDAR';
    
    servicioRest.getReferenciasPendientes().then(
        function (response) {           
            $scope.referencias = response;
        });
    
    $scope.abrirReferenciaPendiente = function (index, referencia) {        
        console.log(referencia[index]);
        $location.path('/nueva');
        rellenarFormulario(index, referencia);
    }
});
