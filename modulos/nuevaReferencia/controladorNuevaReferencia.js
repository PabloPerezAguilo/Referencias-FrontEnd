app.controller('controladorNuevaReferencia', function(servicioRest, config, $scope, $http, $rootScope,$location,$mdDialog,$interval) {
    if($rootScope.usuarioLS.role !== "ROLE_ADMINISTRADOR" && $rootScope.usuarioLS.role !== "ROLE_MANTENIMIENTO"){
        console.log($rootScope.usuarioLS.role);
         $location.path('/bienvenida');
    }
    $scope.title = "";
    $scope.descripcion = "";
    var self = this, j= 0, counter = 0;
     $scope.activado = self.activated;
    servicioRest.getCatalogos().then(
        function(response) {
            $scope.catalogo = response;
            cadenaClientes();
            cadenaTecnologia();
            console.log($scope.catalogo.clientes);
            
            $scope.arrayDatos = cargarDatosClientes(); 
            $scope.arrayDatos2 = cargarDatosTecnologia();
            console.log($scope.catalogo.tecnologia);
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
    }
            console.log("bien");        
            $scope.title = "ADVERTENCIA";
            $scope.descripcion = "esto va muy bien";
            $scope.mensaje='';
            showAlert();
            }).catch(function(err) {
            //Debemos tratar el error mostrando un mensaje
				console.log("error");        
            $scope.title = "ADVERTENCIA";
            $scope.descripcion = "Catalogos No cargado";
            $scope.mensaje='';
            showAlert();
			});  
        
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
        console.log("Referencia creada");
    }   
    
    /*-------AUTOCOMPLETE--------*/
	$scope.cadena = "";
    $scope.cadenaT = "";
	self.pos = "";
    self.posT = "";
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
    self.querySearchT = querySearchT;
	self.selectedItemChangeT = selectedItemChangeT;
    
  // lista de `state` valor/display objeto
   
    self.cancel = function($event) {
      $mdDialog.cancel();
    };
    self.finish = function($event) {
      $mdDialog.hide();
    };

	// Busca el texto
	function querySearch(text) {
		var results = text ? $scope.arrayDatos.filter(filtrar(text)) : $scope.arrayDatos, deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	};
    function querySearchT(text2) {
		var resultado = text2 ? $scope.arrayDatos2.filter(filtrarT(text2)) : $scope.arrayDatos2, deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(resultado);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return resultado;
		}
	};

	// Filtrar palabras según texto
	function filtrar(texto) {
		var lowercaseQuery = angular.lowercase(texto);
		return function(state) {
			$scope.texto = state.value.substring(state.value.indexOf("*"), 0);
			return ($scope.texto.indexOf(lowercaseQuery) === 0 || $scope.texto.search(lowercaseQuery) > 0);
		};
	};
    function filtrarT(texto2) {
		var lowercaseQuery = angular.lowercase(texto2);
		return function(ro) {
			$scope.texto2 = ro.value.substring(ro.value.indexOf("*"), 0);
			return ($scope.texto2.indexOf(lowercaseQuery) === 0 || $scope.texto2.search(lowercaseQuery) > 0);
		};
	};

	// Elemento seleccionado
	function selectedItemChange(item) {
		if (JSON.stringify(item) !== undefined) {
			var pos = item.value.substring(item.value.length, item.value.indexOf("*") + 1);
			$scope.posicionEnArray = pos;
            console.log(item);
		}
	};
    function selectedItemChangeT(item2) {
		if (JSON.stringify(item2) !== undefined) {
			var posT = item2.value.substring(item2.value.length, item2.value.indexOf("*") + 1);
			$scope.posicionEnArray2 = posT;
            console.log(item2);
		}
	};

   // Carga de datos inicial
	function cargarDatosClientes() {
		// Convertimos los datos a una sola cadena
		var allStates = $scope.cadena;
		return allStates.split(/, +/g).map(function(state) {
			return {
				value: state.toLowerCase(),
				display: state.substring(state.indexOf("*"), 0)
			};
		});
	};
    function cargarDatosTecnologia() {
		// Convertimos los datos a una sola cadena
		var allStatesT = $scope.cadenaT;
		return allStatesT.split(/, +/g).map(function(ro) {
			return {
				value: ro.toLowerCase(),
				display: ro.substring(ro.indexOf("*"), 0)
			};
		});
	};
    // Convertir a una sola cadena
	function cadenaClientes() {
		for (var i = 0; i < $scope.catalogo.clientes.length; i++) {
			$scope.cadena += $scope.catalogo.clientes[i].nombre + ' (' + $scope.catalogo.clientes[i].siglas + ') ' + '*' + i + ', ';
		}
	};
    function cadenaTecnologia() {
		for (var p = 0; p < $scope.catalogo.tecnologia.length; p++) {
			$scope.cadenaT += $scope.catalogo.tecnologia[p].codigo + ' (' + $scope.catalogo.tecnologia[p].descripcion + ') ' + '*' + p + ', ';
		}
	};		

     $scope.status = '  ';

    function showAlert(ev){
        $mdDialog.show(
        $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title($scope.title)
            .content($scope.descripcion)
            .ariaLabel('Alert Dialog Demo')
            .ok('Aceptar')
            .targetEvent(ev)
        );
    }  
});