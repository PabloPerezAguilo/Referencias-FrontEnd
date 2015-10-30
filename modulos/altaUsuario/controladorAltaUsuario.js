app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http) {
    //$scope.combobox = servicioRest.getLDAP();
    $scope.crear = function () {
        console.log("creando..");
        usuario = new Object();
        usuario.id = $scope.nombre;
        usuario.rol = $scope.rol;
        $http.defaults.headers.common.Authorization = 'Basic dGVzdDp0ZXN0';
        servicioRest.postUsuario(usuario)
	}
});