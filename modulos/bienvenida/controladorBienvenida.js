app.controller('controladorBienvenida', function(servicioRest, config, $scope, $http, $location, $rootScope) {  
    
    $scope.nombre=$rootScope.usuarioLS.name;

        if( $rootScope.usuarioLS.role === "ROLE_ADMINISTRADOR"){
        $rootScope.menuUsuarios = true;
        $rootScope.menuUsuariosAlta = true;
        $rootScope.menuUsuariosGestion = true;
        $rootScope.menuReferencias = true;
        $rootScope.menuReferenciasGestion = true;
        $rootScope.menuReferenciasNueva = true;
        $rootScope.menuReferenciasListar = true;
    }else if($rootScope.usuarioLS.role === "ROLE_VALIDADOR"){
        $rootScope.menuReferencias = true;
        $rootScope.menuReferenciasGestion = true;
        $rootScope.menuReferenciasListar = true;
    }else if($rootScope.usuarioLS.role === "ROLE_CONSULTOR"){
        $rootScope.menuReferencias = true;
        $rootScope.menuReferenciasListar = true;
    }else if($rootScope.usuarioLS.role === "ROLE_MANTENIMIENTO"){ 
        $rootScope.menuReferencias = true;
        $rootScope.menuReferenciasGestion = true;
        $rootScope.menuReferenciasListar = true;
        $rootScope.menuReferenciasNueva = true;
    }
    
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
        servicioRest.popupError(null,"Rol incorrecto")
        $location.path('/');
        
    }
});
