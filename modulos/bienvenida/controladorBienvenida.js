app.controller('controladorBienvenida', function(servicioRest, $scope, $location, $rootScope) {  
    
    // cargamos menu segun role
    servicioRest.cargarMenu(1);
    $scope.nombre=$rootScope.usuarioLS.name;
});
