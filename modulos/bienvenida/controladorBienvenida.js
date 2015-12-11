app.controller('controladorBienvenida', function(servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.nombre=$rootScope.usuarioLS.name;

    // cargamos menu segun role
    servicioRest.cargarMenu(1);
    
    $rootScope.descripcion = true;
    $rootScope.usuarioD = $rootScope.usuarioLS.name;
    switch($rootScope.usuarioLS.role) {
    case "ROLE_ADMINISTRADOR":
         $rootScope.roleD = "Administrador";
        break;
    case "ROLE_MANTENIMIENTO":
        $rootScope.roleD = "Mantenimiento";
        break;
    case "ROLE_VALIDADOR":
        $rootScope.roleD = "Validador";
        break;
    case "ROLE_CONSULTOR":
        $rootScope.roleD = "Consultor";
        break;
    default:
        servicioRest.popupInfo(null,"Rol incorrecto")
        $location.path('/');
        
    }
});
