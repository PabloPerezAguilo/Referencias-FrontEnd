app.controller('controladorBienvenida', function(servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.nombre=$rootScope.usuarioLS.name;

    
});
