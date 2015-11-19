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
    /*$scope.catalogo = {"tecnologia": [{"codigo":"","descripcion":"","entidad":""},{"codigo":"","descripcion":"","entidad":""},{"codigo":"","descripcion":"","entidad":""}], "clientes": [{"nombre":"lele","siglas":"","publico":"","alias":"","imagen":""},{"nombre":"lili","siglas":"","publico":"","alias":"","imagen":""},{"nombre":"lolo","siglas":"","publico":"","alias":"","imagen":""}]};*/
    //$scope.fechaInicio = new Date();
    /*$scope.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#img_prev')
                .attr('src', e.target.result)
                .width(150);     // ACA ESPECIFICAN QUE TAMANO DE ANCHO QUIEREN
                .height(150);   //  ACA ESPECIFICAN QUE TAMANO DE ALTO QUIEREN
            };
        reader.readAsDataURL(input.files[0]);
        }
    }*/
    
    $scope.codigoQr='';
    /*if($scope.codigoQr==''){
        $scope.qrCodeVisible="true";
    }*/
    
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
                          "imagenProyecto": $scope.imagenProyecto,
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
    }
   
    
  
});