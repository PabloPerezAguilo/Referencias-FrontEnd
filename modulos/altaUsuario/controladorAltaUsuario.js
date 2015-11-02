app.controller('controladorAltaUsuario', function(servicioRest, config, $scope, $http) {
    //$scope.combobox = servicioRest.getLDAP();
    $scope.crear = function () {
        console.log("creando..");
        $scope.usuario = {"user": $scope.user, "role": $scope.role};
        //$http.defaults.headers.common.Authorization = 'Basic dGVzdDp0ZXN0';
        servicioRest.postUsuario($scope.usuario);
	}
});