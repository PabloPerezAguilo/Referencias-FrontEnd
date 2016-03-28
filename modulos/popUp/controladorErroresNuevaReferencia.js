app.controller('controladorErroresNuevaReferencia', function ($scope, $mdDialog, listaErrores) {
    $scope.errores=listaErrores;
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