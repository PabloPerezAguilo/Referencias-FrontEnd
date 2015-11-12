app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http, $rootScope) {
    $scope.fechaInicio = new Date();
    $scope.certificado = 'no';
    $scope.crear = function () {
        var referencia = {"_id": 11,
                          "cliente": $scope.cliente,
                          "sociedad": $scope.sociedad,
                          "sectorEmpresarial": $scope.sectorEmpresarial,
                          "tipoProyecto": $scope.tipoProyecto,
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