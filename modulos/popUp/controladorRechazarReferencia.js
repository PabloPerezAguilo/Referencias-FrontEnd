app.controller('controladorRechazarReferencia', function ($scope, $mdDialog) {
    
    $scope.rechazarReferencia = function () {
        if($scope.motivoRechazo==="" || $scope.motivoRechazo===undefined){
            console.log("vacio");
            //$scope.useForm.motivoRechazo.$error;
        }
        else{
            $scope.hide($scope.motivoRechazo);
        }
    };
    
	$scope.hide = function (razonRechazo) {
		$mdDialog.hide(razonRechazo);
	};
  	$scope.cancel = function () {
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});