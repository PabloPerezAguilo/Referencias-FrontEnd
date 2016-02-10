app.controller('controladorErroresReferencia', function ($scope, $mdDialog, listaErrores, errorCliente, errorTecnologias) {
    console.log(listaErrores);
    $scope.errores=listaErrores;
    $scope.errorCliente=errorCliente;
    $scope.errorTecnologias=errorTecnologias;
	$scope.hide = function () {
		$mdDialog.hide();
	};
  	$scope.cancel = function () {
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});