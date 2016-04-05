app.controller('controladorExportarReferencia', function ($scope, $mdDialog, $document,plantillas) {
    
    //Con $document.on() determinamos que, al presionar la tecla backspace (e.which === 8), y si no estamos en un textarea entonces impedimos que la tecla funcione de forma normal, para evitar navegar hacia atras mientras estemos en el popUp
    //Creamos la variable bloqueoActivo para permitir que la tecla backspace vuelva a funcionar de forma normal una vez haya salido del popUp
    //$scope.tipoDocumentos=["PDF","Word","Pptx","Excel"];
    
    $scope.documentos = {}
    $scope.documentos = new Array(plantillas.length+1);
    $scope.documentos = plantillas;
    $scope.documentos[plantillas.length]={nombre:"Excel",tipoDocumento:"Excel"};
    console.log($scope.documentos);
    var bloqueoActivo=true;
    $document.on('keydown', function(e) {
      if (e.which === 8 && (e.target.nodeName != "TEXTAREA") && bloqueoActivo) { // you can add others here.
        e.preventDefault();
      }
    });
    
    $scope.exportarReferencia = function () {
        if($scope.tipoElegido==="" || $scope.tipoElegido===undefined){
            $scope.hayError=true;
            $scope.useForm.tipoElegido.$error;
        }
        else{
            $scope.hide($scope.tipoElegido);
        }
    };
    
	$scope.hide = function (tipoElegido) {
        
        bloqueoActivo=false;
		$mdDialog.hide(tipoElegido);
        
	};
  	$scope.cancel = function () {
        bloqueoActivo=false;
    	$mdDialog.cancel();
	};
  	$scope.answer = function (answer) {
    	$mdDialog.hide(answer);
	};
});