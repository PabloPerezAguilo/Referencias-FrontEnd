app.controller('controladorRechazarReferencia', function ($scope, $mdDialog, $document) {
    
    /*$document.on('keydown', function(e) {
      if (e.which === 8 && (e.target.nodeName != "TEXTAREA")) { // you can add others here.
        e.preventDefault();
      }
    });*/
    
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