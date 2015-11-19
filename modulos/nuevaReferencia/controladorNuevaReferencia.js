app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http, $rootScope,$location) {
    if($rootScope.usuarioLS.role !== "ROLE_ADMINISTRADOR" && $rootScope.usuarioLS.role !== "ROLE_MANTENIMIENTO"){
        console.log($rootScope.usuarioLS.role);
         $location.path('/bienvenida');
    }
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            console.log("Catalogos Cargados");
        });
 
    $scope.uploadFile = function (input) {
        console.log("entra en el evento de upload");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                //Sets the Old Image to new New Image
                $('#photo-id').attr('src', e.target.result);

                //Create a canvas and draw image on Client Side to get the byte[] equivalent
                var canvas = document.createElement("canvas");
                var imageElement = document.createElement("img");

                imageElement.setAttribute('src', e.target.result);
                canvas.width = 50;
                canvas.height = 50;
                var context = canvas.getContext("2d");
                context.drawImage(imageElement, 0, 0);
                $scope.base64Image = canvas.toDataURL("image/jpeg");

                //Removes the Data Type Prefix 
                //And set the view model to the new value
                $scope.base64Image = $scope.base64Image.replace(/data:image\/jpeg;base64,/g, '');
            }

            //Renders Image on Page
            reader.readAsDataURL(input.files[0]);
        }
    };

    
    $scope.certificado = 'si';
    $scope.crear = function () {
        var referencia = {"cliente": $scope.cliente,
                          "sociedad": $scope.sociedad,
                          "sectorEmpresarial": $scope.sectorEmpresarial,
                          "tipoActividad": $scope.tipoActividad,
                          "tipoProyecto":$scope.tipoProyecto,
                          "fechaInicio": $scope.fechaInicio,
                          "denominacion": $scope.denominacion,
                          "resumenProyecto": $scope.resumenProyecto,
                          "problematicaCliente": $scope.problematicaCliente,
                          "solucionGfi": $scope.solucionGfi,
                          "fteTotales": $scope.fteTotales,
                          "imagenProyecto": $scope.base64Image,
                          "certificado": $scope.certificado,
                          "regPedidoAsociadoReferencia": [],
                          "responsableComercial": $scope.responsableComercial,
                          "responsableTecnico": $scope.responsableTecnico,
                          "creadorReferencia": $rootScope.usuarioLS.name,
                          "codigoQr": $scope.codigoQr,
                          "estado": "borrador",
                          "duracionMeses": $scope.duracionMeses,
                          "tecnologias": $scope.tecnologias
                          };
        servicioRest.postReferencia(referencia);
        console.log("Referencia creada");
    }
    
    
});