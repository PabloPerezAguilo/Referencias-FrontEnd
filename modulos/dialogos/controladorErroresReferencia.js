app.controller('controladorErroresReferencia', function ($scope, $mdDialog,listaErrores) {
    console.log(listaErrores);
    $scope.aa=listaErrores;
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