app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope) {
    $http.defaults.headers.common.Authorization = "Basic "+btoa($rootScope.usuarioP.name+":"+$rootScope.usuarioP.password);
    
    $scope.miUsuarioSeleccionado = null;
    
    servicioRest.getLDAP().then(
            function(response) {
                $scope.usuarios = response;
            },
        function(response){
            //error
        })
    $scope.ordenadoPor = "usuario";
    
    $scope.setValue = function (usuario) {
        $scope.miUsuarioSeleccionado = usuario;
    }
    
    $scope.crear = function () {
        console.log("guardando usuario en nuestra base de datos...");
        $scope.usuario = {"name": $scope.miUsuarioSeleccionado.nick, "role": $scope.role};
        console.log($scope.usuario);
        $http.defaults.headers.common.Authorization = "Basic "+btoa($rootScope.usuarioP.name+":"+$rootScope.usuarioP.password);
        servicioRest.postUsuario($scope.usuario);
	}
});