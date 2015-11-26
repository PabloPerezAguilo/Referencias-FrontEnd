app.controller('controladorUsuarioLogueado', function(servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.nameUsu=$rootScope.usuarioLS.name;
    $scope.rolUsu=$rootScope.usuarioLS.role;//lo dejo para al menos mostrar el rol
    //$scope.rolUsu='';
    
   /* debería de renombrarlo pero no lo hace */
    switch($rootScope.usuarioLS.role) {
    case "ROLE_ADMINISTRADOR":
         $rootScope.rolUsu = 'Administrador';
        break;
    case "ROLE_MANTENIMIENTO":
        $rootScope.rolUsu = 'Mantenimiento';
        break;
    case "ROLE_VALIDADOR":
        $rootScope.rolUsu = 'Validador';
        break;
    case "ROLE_CONSULTOR":
        $rootScope.rolUsu = 'Consultor';
        break;
    default:
        servicioRest.popupError(null,"Rol incorrecto");
        $location.path('/');
        
    }
    console.log("rolUsu-> "$rootScope.rolUsu);
});