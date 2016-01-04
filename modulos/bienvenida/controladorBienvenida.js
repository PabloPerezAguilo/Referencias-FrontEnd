app.controller('controladorBienvenida', function(servicioRest, utils, $scope, $location, $rootScope) {  
    
    // cargamos menu segun role
    utils.cargarMenu(1);
    $scope.nombre=$rootScope.usuarioLS.name;
});
