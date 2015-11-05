app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http) {
    $scope.fechaInicio = new Date();
    $scope.crear = function () {
        $scope.referencia = {"cliente": $scope.cliente, "sociedad": $scope.sociedad, "sectorEmpresarial": $scope.sectorEmpresarial, "tipoProyecto": $scope.tipoProyecto, "fechaInicio": $scope.fechaInicio, "denominacion": $scope.denominacion, "resumenProyecto": $scope.resumenProyecto, "problematicaCliente": $scope.problematicaCliente, "solucionGfi": $scope.solucionGfi, "fteTotales": $scope.fteTotales, "imagenProyecto": $scope.imagenProyecto, "certificado": $scope.certificado, "regPedidoAsociadoReferencia": $scope.regPedidoAsociadoReferencia, "responsableComercial": $scope.responsableComercial, "responsableTecnico": $scope.responsableTecnico, "creadorReferencia": "creatorr", "codigoQR": $scope.codigoQR, "estado": "borrador", "tecnologias": $scope.tecnologias, "duracionMeses": $scope.duracionMeses};
        servicioRest.postReferencia($scope.referencia);
    }
});