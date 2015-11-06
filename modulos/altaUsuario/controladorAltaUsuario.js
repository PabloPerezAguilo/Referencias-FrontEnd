app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http, $rootScope) {
 
    
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
        servicioRest.postUsuario($scope.usuario);
	}
});